class Chart3 {
  constructor(_config, _data) {
    this.selectionToKeyMapping = {
      addictiveness: "harm_addictiveness_e-cigarette",
      occasional: "harm_occasional_cigarettes",
      nicotine: "harm_low_nicotine",
    };
    this.tooltipMessageMapping = {
      addictiveness:
        "e-cigarettes to be <b>PLACEHOLDER</b> compared to cigarettes",
      occasional: "occasional smoking causes <b>PLACEHOLDER</b>",
      nicotine:
        "low-nicotine cigarettes to be <b>PLACEHOLDER</b> compared to regular cigaretes",
    };
    this.config = {
      selection:
        _config.selection || Object.keys(this.selectionToKeyMapping)[0],
      parentElement: _config.parentElement,
      containerWidth: _config.containerWidth || 900,
      containerHeight: _config.containerHeight || 600,
      margin: _config.margin || { top: 30, right: 5, bottom: 30, left: 130 },
    };
    this.data = _data;
    this.groupedCountsByGender = {};

    this.initVis();
  }

  initVis() {
    // Create SVG area, initialize scales and axes
    let vis = this;

    // Calculate inner chart size
    vis.width =
      vis.config.containerWidth -
      vis.config.margin.left -
      vis.config.margin.right;
    vis.height =
      vis.config.containerHeight -
      vis.config.margin.top -
      vis.config.margin.bottom;

    vis.xScale = d3
      .scaleBand()
      .domain([
        "Did not try to quit",
        "1 time",
        "2 times",
        "3 to 5 times",
        "6 to 9 times",
        "10 or more times",
      ])
      .range([0, vis.width]);

    vis.yScale = d3.scaleBand().range([vis.height, 0]);

    // Initialize axes
    vis.xAxis = d3.axisBottom(vis.xScale).tickSizeOuter(0).tickPadding(10);

    vis.yAxis = d3
      .axisLeft(vis.yScale)
      .tickSizeInner(0)
      .tickSizeOuter(0)
      .tickPadding(10);

    // Define size of SVG drawing area
    vis.svg = d3
      .select(vis.config.parentElement)
      .attr("width", vis.config.containerWidth)
      .attr("height", vis.config.containerHeight);

    // Append group element that will contain our actual chart
    // and position it according to the given margin config
    vis.chart = vis.svg
      .append("g")
      .attr(
        "transform",
        `translate(${vis.config.margin.left},${vis.config.margin.top})`
      );

    vis.chart
      .append("rect")
      .attr("width", vis.width)
      .attr("height", vis.height - vis.config.margin.bottom)
      .attr("fill", "#E6E6E6")
      .attr("fill-opacity", ".2");

    // Append axis groups
    // Append empty x-axis group and move it to the bottom of the chart
    vis.xAxisGroup = vis.chart
      .append("g")
      .attr("class", "x-axis axis")
      .attr("transform", `translate(0, ${vis.height - 30})`);

    // Append y-axis group
    vis.yAxisGroup = vis.chart.append("g").attr("class", "y-axis axis");

    // Append x-axis title
    vis.svg
      .append("text")
      .attr("class", "axis-title")
      .attr("x", vis.config.margin.left - 10)
      .attr("y", vis.config.margin.top - 10)
      .attr("text-anchor", "end")
      .attr("dy", "1em")
      .attr("font-weight", "bold")
      .text("Perception");

    vis.svg
      .append("text")
      .attr("class", "axis-title")
      .attr("x", vis.width - vis.config.margin.right - 20)
      .attr("y", vis.height + vis.config.margin.bottom)
      .attr("text-anchor", "start")
      .attr("dy", "1em")
      .attr("font-weight", "bold")
      .text("# attempts at quitting");

    vis.updateVis();
  }

  updateVis() {
    let vis = this;
    vis.xValue = (d) => d.quit_for_good;
    vis.yValue = (d) => d[0];

    if (vis.config.selection === "occasional") {
      vis.yScale.domain([
        "No harm",
        "Little harm",
        "Some harm",
        "A lot of harm",
      ]);
    } else if (vis.config.selection === "nicotine") {
      vis.yScale.domain([
        "Much less harmful",
        "Slightly less harmful",
        "Equally harmful",
        "Slightly more harmful",
        "Much more harmful",
      ]);
    } else {
      vis.yScale.domain([
        "Less addictive",
        "Equally addictive",
        "More addictive",
      ]);
    }
    vis.groupedData = d3.groups(
      this.data,
      (d) => d[this.selectionToKeyMapping[this.config.selection]]
    );
    vis.groupedCountsByGender = {};
    vis.groupedData.forEach(
      (g) =>
        (vis.groupedCountsByGender[g[0]] = d3.rollup(
          g[1],
          (v) => v.length,
          (d) => vis.xValue(d),
          (d) => d.sex
        ))
    );
    vis.renderVis();
  }

  renderVis() {
    let vis = this;

    vis.bandWidthHalved = vis.width / 12;
    vis.bandHeightHalved = vis.height / (vis.yScale.domain().length * 2);

    // 1. Level: rows
    const rows = vis.chart
      .selectAll(".row")
      .data(this.groupedData, (d) => d[0])
      .join("g")
      .attr("class", "row")
      .attr(
        "transform",
        (d) =>
          `translate(0,${vis.yScale(vis.yValue(d)) + vis.bandHeightHalved / 2})`
      );

    // 2. Level: columns
    const columns = rows
      .selectAll(".column")
      .data((d) => d[1].sort((a, b) => (a.sex === "Male" ? 1 : -1)))
      .join("g")
      .attr("class", "column")
      .attr(
        "transform",
        (d) =>
          `translate(${vis.xScale(vis.xValue(d)) + vis.bandWidthHalved / 4},0)`
      );

    const countsX = {};
    const countsY = {};
    // 3. Level: point (point)
    const points = columns
      .selectAll(".point")
      .data((d) => [d])
      .join("circle")
      .attr("class", "point")
      .attr("cx", (d) => {
        const countsKey = `${d.quit_for_good},${
          d[this.selectionToKeyMapping[this.config.selection]]
        }`;
        if (countsX[countsKey] === undefined) countsX[countsKey] = 0;
        else countsX[countsKey] = countsX[countsKey] + 1;
        return (countsX[countsKey] % 15) * 6;
      })
      .attr("cy", (d) => {
        const countsKey = `${d.quit_for_good},${
          d[this.selectionToKeyMapping[this.config.selection]]
        }`;
        if (countsY[countsKey] === undefined) countsY[countsKey] = 0;
        else countsY[countsKey] = countsY[countsKey] + 1;
        return Math.floor(countsY[countsKey] / 15) * 6;
      })
      .attr("r", 3)
      .attr("fill-opacity", "1")
      .style("fill", (d) => (d.sex === "Male" ? "#7137BE" : "#3FDD58"));

    columns
      .on("mouseover", (event, d) => {
        const xValue = vis.xValue(d);
        const yValue = d[vis.selectionToKeyMapping[vis.config.selection]];

        const totalCountInGroup = this.groupedData.find(
          (g) => g[0] === yValue
        )[1].length;

        // tooltip text
        const tooltipTitleText = vis.tooltipMessageMapping[
          vis.config.selection
        ].replace("PLACEHOLDER", yValue.toLowerCase());
        const quitInfo =
          xValue !== vis.xScale.domain()[0]
            ? `tried to quit ${xValue.toLowerCase()}`
            : xValue.toLowerCase();

        // calculate tooltip counts
        const groupedCountsByGender =
          vis.groupedCountsByGender[yValue].get(xValue);
        const maleCount = groupedCountsByGender.get("Male");
        const femaleCount = groupedCountsByGender.get("Female");
        const count = maleCount + femaleCount;

        const malePercentage = chart3Filters.sex_Female
          ? `(${vis.convertToPercent(maleCount, count)}%)`
          : "";
        const femalePercentage = chart3Filters.sex_Male
          ? `(${vis.convertToPercent(femaleCount, count)}%)`
          : "";
        const percentageCount = vis.convertToPercent(count, totalCountInGroup);
        d3
          .select("#tooltip")
          .style("display", "block")
          .style(event.pageX > vis.width ? "right" : "left", event.pageX + "px")
          .style("top", event.pageY + "px").html(`
          <div class="tooltip-title">
            <b>${count} out of ${totalCountInGroup} (${percentageCount}%)</b> who perceive ${tooltipTitleText}
            <i>${quitInfo}</i>
          </div>
          <ul>
            ${
              chart3Filters.sex_Male
                ? `<li>Male: ${maleCount} ${malePercentage}</li>`
                : ""
            }
            ${
              chart3Filters.sex_Female
                ? `<li>Female: ${femaleCount} ${femalePercentage}</li>`
                : ""
            }
          </ul>
        `);
      })
      .on("mouseleave", () => {
        d3.select("#tooltip").style("display", "none");
      });

    vis.xAxisGroup.call(vis.xAxis);
    vis.yAxisGroup.call(vis.yAxis);
  }

  /**
   * converts value to percentage with 2 decimal points
   * @param {Number} value
   * @param {Number} total
   */
  convertToPercent(value, total) {
    return ((value / total) * 100).toFixed(2);
  }
}
