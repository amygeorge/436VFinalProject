class BarChart {
  constructor(_config, _data) {
    this.selectionToKeyMapping = {
      exposure: "household_exposure_None",
      ecig: "start_age_e-cigarette",
      cig: "start_age_cigarette",
      other: "start_age_other",
      start_age: "start_age",
      sex: "sex",
    };
    this.config = {
      selection:
        _config.selection || Object.keys(this.selectionToKeyMapping)[0],
      parentElement: _config.parentElement,
      containerWidth: _config.containerWidth || 1000,
      containerHeight: _config.containerHeight || 700,
      margin: _config.margin || { top: 30, right: 5, bottom: 30, left: 130 },
    };
    this.data = _data;

    this.initVisBarChart();
  }

  initVisBarChart() {
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

    vis.xScale = d3.scaleLinear().range([0, vis.width / 2]);
    vis.xScaleLeft = d3.scaleLinear().range([vis.width / 2, 0]);

    vis.yScale = d3.scaleLinear().range([vis.height - 60, 0]);

    // Initialize axes
    vis.xAxis = d3.axisBottom(vis.xScale).tickSizeOuter(0).tickPadding(10);

    vis.xAxisLeft = d3.axisBottom(vis.xScaleLeft).tickPadding(10);

    vis.yAxis = d3.axisLeft(vis.yScale).tickPadding(10);

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
      .attr("class", "chart-inner")
      .attr("width", vis.width + 20)
      .attr("height", vis.height - vis.config.margin.bottom)
      .attr("fill", "#E6E6E6")
      .attr("fill-opacity", ".2");

    // Append axis groups
    // Append empty x-axis group and move it to the bottom of the chart
    vis.xAxisGroup = vis.chart
      .append("g")
      .attr("class", "x-axis axis")
      .attr("transform", `translate(${vis.width / 2}, ${vis.height - 35})`);

    vis.xAxisGroupLeft = vis.chart
      .append("g")
      .attr("class", "x-axis axis")
      .attr("transform", `translate(0, ${vis.height - 35})`);

    // Append y-axis group
    vis.yAxisGroup = vis.chart
      .append("g")
      .attr("class", "y-axis axis")
      .attr(
        "transform",
        `translate(0, 
            ${vis.config.margin.bottom - 15})`
      );

    // Colours based on the disaster categories
    vis.prettyColours = d3
      .scaleOrdinal()
      .domain([
        "bar-chart-start_age",
        "start_age_cigarette",
        "start_age_e-cigarette",
        "start_age_other",
      ])
      .range(["#7137BE", "#FFAC33", "#FF4747", "#3FDD58"]);

    // Append y-axis title
    vis.svg
      .append("text")
      .attr("class", "axis-title")
      .attr("x", vis.config.margin.left - 200)
      .attr("y", vis.config.margin.top)
      .attr("text-anchor", "end")
      .attr("dy", "1em")
      .attr("font-weight", "bold")
      .text("Age Youth Began Smoking")
      .attr("transform", "rotate(-90)");

    // Append x axis title
    vis.svg
      .append("text")
      .attr("class", "axis-title")
      .attr("x", vis.width - vis.config.margin.right - 100)
      .attr("y", vis.height + vis.config.margin.bottom)
      .attr("text-anchor", "start")
      .attr("dy", "1em")
      .attr("font-weight", "bold")
      .text("Number of Participants");

    // Append Smoker at home
    vis.svg
      .append("text")
      .attr("class", "axis-title")
      .attr("x", vis.width - vis.config.margin.right - 100)
      .attr("y", 100)
      .attr("text-anchor", "start")
      .attr("dy", "1em")
      .attr("font-weight", "bold")
      .text("Smoker at Home");

    // Append No Smoker at home
    vis.svg
      .append("text")
      .attr("class", "axis-title")
      .attr("x", 200)
      .attr("y", 100)
      .attr("text-anchor", "start")
      .attr("dy", "1em")
      .attr("font-weight", "bold")
      .text("No Smoker at Home");

    vis.updateVisBarChart();
  }

  updateVisBarChart() {
    let vis = this;
    let length = this.data.length / 8;
    vis.xScale.domain([0, 200]);

    vis.xScaleLeft.domain([0, 200]);

    vis.yScale.domain([8, 19]);

    // filter data
    vis.copyData = JSON.parse(JSON.stringify(this.data));
    vis.filterData(this.copyData);
    vis.renderVisBarChart();
  }

  renderVisBarChart() {
    let vis = this;

    const exposed = vis.chart
      .selectAll(".exposed")
      .data(vis.groupedByExposed)
      .join("g")
      .attr("class", "exposed")
      .attr("transform", (d) => {
        return `translate(0, ${vis.yScale(d[0])})`;
      });

    const e = exposed
      .selectAll(".exposed_rect")
      .data((d) => d)
      .join("rect")
      .attr("class", "exposed_rect")
      .attr("width", (d) => {
        // makes the bars the right length
        return vis.xScale(d.length);
      })
      .attr("x", vis.width / 2)
      .attr("y", (d) => {
        // puts bars at age ticks
        return vis.yScale(d);
      })
      .attr("height", 20)
      .attr("fill", vis.prettyColours(this.config.selection));

    const unexposed = vis.chart
      .selectAll(".unexposed")
      // cannot get split by t/f to pass down
      .data(vis.groupedByUnexposed)
      .join("g")
      .attr("class", "unexposed")
      .attr("transform", (d) => {
        return `translate(0, ${vis.yScale(d[0])})`;
      });

    // use translate to flip the exposure to other side of the chart

    const u = unexposed
      .selectAll(".unexposed_rect")
      .data((d) => d)
      .join("rect")
      .attr("class", "unexposed_rect")
      .attr("width", (d) => {
        if (!isNaN(d.length)) {
          return vis.width / 2 - vis.xScaleLeft(d.length);
        }
      })
      .attr("x", (d) => {
        return vis.xScaleLeft(d.length);
      })
      .attr("y", (d) => {
        return vis.yScale(d);
      })
      .attr("height", 20)
      .attr("fill", (d) => {
        return vis.prettyColours(this.config.selection);
      })
      .style("opacity", 0.5);

    vis.xAxisGroup.call(vis.xAxis);

    vis.xAxisGroupLeft.call(vis.xAxisLeft);
    vis.yAxisGroup
      .call(vis.yAxis)
      .style("text-anchor", "end")
      .style("font-size", 16);
  }

  filterData(_data) {
    let vis = this;

    // filter data to show age at which started smoking by tobacco type
    const cig = _data.filter((d) => {
      return (
        d.cig_Type === "start_age_cigarette" &&
        d["start_age_cigarette"] !== null
      );
    });
    const ecig = _data.filter(
      (d) =>
        d.cig_Type === "start_age_e-cigarette" &&
        d["start_age_e-cigarette"] !== 0
    );
    const start = _data.filter(
      (d) =>
        d.cig_Type === "start_age" &&
        d["start_age"] !== 0 &&
        d["start_age"] !== null
    );
    const other = _data.filter((d) => {
      return d.cig_Type === "start_age_other" && d["start_age_other"] !== 0;
    });

    const cigType = this.config.selection;
    switch (cigType) {
      case "start_age_cigarette":
        vis.filteredData = cig;
        break;
      case "start_age_e-cigarette":
        vis.filteredData = ecig;
        break;
      case "start_age_other":
        vis.filteredData = other;
        break;
      case "start_age":
        vis.filteredData = start;
        break;
      default:
        vis.filteredData = start;
    }

    vis.exposed = vis.filteredData.filter((d) => {
      return d.household_exposure_None === "False";
    });
    vis.unexposed = vis.filteredData.filter((d) => {
      return d.household_exposure_None !== "False";
    });

    vis.groupedByExposed = d3.group(vis.exposed, (d) => d.start_age);
    vis.groupedByUnexposed = d3.group(vis.unexposed, (d) => d.start_age);

    return vis;
  }
}
