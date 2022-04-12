class VennDiagram {
  /**
   *  Class constructor for Venn Diagram chart with initial configuration
   *  @param {Object}
   *  @param {Array}
   */
  constructor(_config, _data) {
    this.config = {
      parentElement: _config.parentElement,
      containerWidth: 700,
      containerHeight: 600,
      margin: { top: 10, right: 15, bottom: 10, left: 45 },
      toolTipPadding: 15,
      innerCircle: {
        scaleFactor: 0.05,
        offsetFactor: 0.8,
      },
      parentCircle: {
        radius: 125,
      },
    };
    this.data = _data;

    this.demographicToTextMapping = {
      caucasianMale: "Caucasian male",
      nonCaucasianMale: "non-Caucasian male",
      caucasianFemale: "Caucasian female",
      nonCaucasianFemale: "non-Caucasian female",
    };
    this.reasonToTextMapping = {
      "category-household": "household usage",
      "category-access": "ease of access",
      "category-social-media": "social media influence",
      "category-curiosity": "curiosity",
      "category-peers": "influence/pressure from peers",
    };

    // filter toggles
    this.ageCap = 19;
    this.filterCategories = [
      "household",
      "access",
      "social-media",
      "curiosity",
      "peers",
    ];

    this.initVis();
  }

  initVis() {
    let vis = this;

    vis.width =
      vis.config.containerWidth -
      vis.config.margin.left -
      vis.config.margin.right;
    vis.height =
      vis.config.containerHeight -
      vis.config.margin.top -
      vis.config.margin.bottom;

    vis.xScale = d3.scaleBand().range([0, vis.width]);
    vis.yScale = d3.scaleBand().range([0, vis.height]);
    vis.radiusScale = d3.scaleSqrt().range([20, 100]);

    vis.xAxis = d3.axisBottom(vis.xScale).ticks(2).tickSize(5).tickPadding(5);
    vis.yAxis = d3.axisLeft(vis.yScale).ticks(2).tickSize(5).tickPadding(5);

    vis.svg = d3
      .select(vis.config.parentElement)
      .append("svg")
      .attr("id", "venn-diagram")
      .attr("width", vis.config.containerWidth)
      .attr("height", vis.config.containerHeight);
    vis.chartArea = vis.svg
      .append("g")
      .attr("class", "chart-area")
      .attr("transform", `translate(${vis.config.margin.left}, 0)`);

    vis.container = vis.chartArea
      .append("g")
      .attr("class", "chart-container")
      .attr(
        "transform",
        `translate(${vis.config.margin.left * 2.75}, ${
          vis.config.margin.top * 16
        })`
      );

    vis.xAxisG = vis.chartArea
      .append("g")
      .attr("class", "axis x-axis")
      .attr("transform", `translate(25, ${vis.height})`);
    vis.yAxisG = vis.chartArea
      .append("g")
      .attr("class", "axis y-axis")
      .attr("transform", `translate(${vis.config.margin.left}, 0)`);

    vis.initSlider(vis.data);
    vis.updateVis();
  }

  updateVis(_data) {
    let vis = this;

    // filter data
    vis.copyData = JSON.parse(JSON.stringify(vis.data));
    vis.filteredData = vis.filterData(vis.copyData);

    vis.xScale.domain(["Male", "Female"]);
    vis.yScale.domain(["Caucasian", "Non-Caucasian"]);

    vis.renderVis();
  }

  renderVis() {
    let vis = this;

    vis.renderCircles();

    // render cell dividers
    vis.chartArea
      .append("line")
      .attr("x1", vis.config.margin.left)
      .attr("y1", vis.height / 2 + 15)
      .attr("x2", vis.width)
      .attr("y2", vis.height / 2 + 15)
      .attr("stroke", "black")
      .attr("stroke-width", "0.25px");

    vis.chartArea
      .append("line")
      .attr("y1", vis.config.margin.top + vis.config.margin.bottom)
      .attr("x1", vis.height / 2 + 55)
      .attr("y2", vis.width - vis.config.margin.top)
      .attr("x2", vis.height / 2 + 55)
      .attr("stroke", "black")
      .attr("stroke-width", "0.25px");

    // render the axes without the axes lines
    vis.xAxisG.call(vis.xAxis).call((g) => g.select(".domain").remove());
    vis.yAxisG.call(vis.yAxis).call((g) => g.select(".domain").remove());
  }

  renderCircles() {
    let vis = this;

    const data = [...vis.filteredData];
    const male = data[0];
    const female = data[1];
    const sex = [male[0], female[0]];
    const race = [male[1][0][0], male[1][1][0]];

    const nonCaucasianMale = male[1][0][1];
    const caucasianMale = male[1][1][1];
    const nonCaucasianFemale = female[1][0][1];
    const caucasianFemale = female[1][1][1];

    const dataMap = [
      {
        caucasianMale: caucasianMale,
        nonCaucasianMale: nonCaucasianMale,
        caucasianFemale: caucasianFemale,
        nonCaucasianFemale: nonCaucasianFemale,
      },
    ];

    const scaleFactor = vis.config.innerCircle.scaleFactor;
    const parentRadius = vis.config.parentCircle.radius;
    const xCenter = 0;
    const yCenter = -55;
    const offset = vis.config.innerCircle.offsetFactor;
    const innerCircleConfigs = {
      "category-household": {
        xCenter: xCenter,
        yCenter: yCenter + 5 + offset - 8,
      },
      "category-access": {
        xCenter: xCenter + 55 + offset,
        yCenter: yCenter + 50 + (Math.sqrt(1) * offset) / 2,
      },
      "category-social-media": {
        xCenter: xCenter + 25 + (offset * 1.3) / 2,
        yCenter: yCenter + 105 + (Math.sqrt(2) * offset) / 2,
      },
      "category-curiosity": {
        xCenter: xCenter - 25 - (offset * 1.3) / 2,
        yCenter: yCenter + 105 + (Math.sqrt(2) * offset) / 2,
      },
      "category-peers": {
        xCenter: xCenter - 55 - offset,
        yCenter: yCenter + 50 + (Math.sqrt(1) * offset) / 2,
      },
    };

    const g = vis.container
      .selectAll(".venn-group")
      .data(dataMap)
      .join("g")
      .attr("class", "venn-group")
      .attr(
        "transform",
        `translate(${vis.config.margin.left + vis.config.margin.right}, 0)`
      );

    // render parent circle
    const parentGroup = g
      .selectAll(".parent-group")
      .data((d) => Object.keys(d))
      .join("g")
      .attr("class", "parent-group")
      .attr("transform", (d) => {
        if (d === "caucasianMale") {
          return `translate(${vis.xScale(sex[0])}, ${vis.yScale(race[1])})`;
        }
        if (d === "nonCaucasianMale") {
          return `translate(${vis.xScale(sex[0])}, ${vis.yScale(race[0])})`;
        }
        if (d === "caucasianFemale") {
          return `translate(${vis.xScale(sex[1])}, ${vis.yScale(race[1])})`;
        }
        return `translate(${vis.xScale(sex[1])}, ${vis.yScale(race[0])})`;
      });

    const parentCircle = parentGroup
      .selectAll(".parent-circle")
      .data((d) => [d])
      .join("circle")
      .attr("class", "parent-circle")
      .attr("stroke", "black")
      .style("stroke-dasharray", "10,5")
      .attr("stroke-width", 0.5)
      .attr("fill", "white")
      .attr("r", parentRadius)
      .attr("opacity", 0.8);

    const household = parentGroup
      .selectAll(".mark-household")
      .data((d) => [d])
      .join("circle")
      .attr("class", "mark mark-household")
      .attr("id", "category-household")
      .attr("r", (d) => {
        const data = dataMap[0][d];
        const category = data.filter((i) => i["category-household"]);
        if (category.length === 0) return 0;

        return Math.min(vis.radiusScale(category.length), 1250) * scaleFactor;
      })
      .attr("opacity", 0.8)
      .attr(
        "transform",
        `translate(${innerCircleConfigs["category-household"].xCenter}, ${innerCircleConfigs["category-household"].yCenter})`
      );

    const access = parentGroup
      .selectAll(".mark-access")
      .data((d) => [d])
      .join("circle")
      .attr("class", "mark mark-access")
      .attr("id", "category-access")
      .attr("r", (d) => {
        const data = dataMap[0][d];
        const category = data.filter((i) => i["category-access"]);
        if (category.length === 0) return 0;

        return Math.min(vis.radiusScale(category.length), 1250) * scaleFactor;
      })
      .attr("opacity", 0.8)
      .attr(
        "transform",
        `translate(${innerCircleConfigs["category-access"].xCenter}, ${innerCircleConfigs["category-access"].yCenter})`
      );

    const social = parentGroup
      .selectAll(".mark-social")
      .data((d) => [d])
      .join("circle")
      .attr("class", "mark mark-social")
      .attr("id", "category-social-media")
      .attr("r", (d) => {
        const data = dataMap[0][d];
        const category = data.filter((i) => i["category-social-media"]);
        if (category.length === 0) return 0;

        return Math.min(vis.radiusScale(category.length), 1250) * scaleFactor;
      })
      .attr("opacity", 0.8)
      .attr(
        "transform",
        `translate(${innerCircleConfigs["category-social-media"].xCenter}, ${innerCircleConfigs["category-social-media"].yCenter})`
      );

    const curiosity = parentGroup
      .selectAll(".mark-curiosity")
      .data((d) => [d])
      .join("circle")
      .attr("class", "mark mark-curiosity")
      .attr("id", "category-curiosity")
      .attr("r", (d) => {
        const data = dataMap[0][d];
        const category = data.filter((i) => i["category-curiosity"]);
        if (category.length === 0) return 0;

        return Math.min(vis.radiusScale(category.length), 1250) * scaleFactor;
      })
      .attr("opacity", 0.8)
      .attr(
        "transform",
        `translate(${innerCircleConfigs["category-curiosity"].xCenter}, ${innerCircleConfigs["category-curiosity"].yCenter})`
      );

    const peers = parentGroup
      .selectAll(".mark-peers")
      .data((d) => [d])
      .join("circle")
      .attr("class", "mark mark-peers")
      .attr("id", "category-peers")
      .attr("r", (d) => {
        const data = dataMap[0][d];
        const category = data.filter((i) => i["category-peers"]);
        if (category.length === 0) return 0;
        return Math.min(vis.radiusScale(category.length), 1250) * scaleFactor;
      })
      .attr("opacity", 0.8)
      .attr(
        "transform",
        `translate(${innerCircleConfigs["category-peers"].xCenter}, ${innerCircleConfigs["category-peers"].yCenter})`
      );
    const innerCircles = [household, access, social, curiosity, peers];
    innerCircles.forEach((innerCircle) => {
      innerCircle
        .on("mouseover", (event, d) => {
          const data = dataMap[0][d];
          const category = event.target.id;
          const count = data.filter((d) => d[category]).length;
          const totalCount = data.length;
          const percentageCount = ((count / totalCount) * 100).toFixed(2);
          const demographic = vis.demographicToTextMapping[d];
          const reason = vis.reasonToTextMapping[event.target.id];

          let toolTipTitle =
            vis.ageCap === 19
              ? `
            <div class="tooltip-title">
              <b>${count} out of ${totalCount} ${demographic} youths aged 19 and over
            </div>
            `
              : `
            <div class="tooltip-title">
              <b>${count} out of ${totalCount} ${demographic} youths under age ${vis.ageCap}
            </div>`;

          d3
            .select("#tooltip")
            .style("display", "block")
            .style("left", event.pageX + vis.config.toolTipPadding + "px")
            .style("top", event.pageY + vis.config.toolTipPadding + "px").html(`
              ${toolTipTitle}
              <ul>
                <li>${percentageCount}% of ${demographic}s cited starting tobacco use due to ${reason}</li>
              </ul>
            `);
        })
        .on("mouseleave", () => {
          d3.select("#tooltip").style("display", "none");
        });
    });
  }

  initSlider(_data) {
    let vis = this;

    vis.slider = d3
      .sliderBottom()
      .min([9])
      .max([19])
      .width(300)
      .ticks(10)
      .default(19)
      .on("onchange", (val) => {
        vis.ageCap = Math.round(val);
        vis.updateVis();
      });

    let g = d3
      .select("#slider-simple")
      .append("svg")
      .attr("width", 350)
      .attr("height", 100)
      .append("g")
      .attr("transform", "translate(30,30)");

    g.call(vis.slider);
  }

  filterData(_data) {
    let vis = this;
    let data = _data;

    vis.categories = [];
    vis.filterCategories.forEach((c) => {
      vis.categories.push("category-" + c);
    });

    let males = data[0][1];
    let females = data[1][1];

    let nonCaucasianMales = vis.filterAndDelete(males[0][1]);
    let caucasianMales = vis.filterAndDelete(males[1][1]);
    let nonCaucasianFemales = vis.filterAndDelete(females[0][1]);
    let caucasianFemales = vis.filterAndDelete(females[1][1]);

    males[0][1] = nonCaucasianMales;
    males[1][1] = caucasianMales;
    females[0][1] = nonCaucasianFemales;
    females[1][1] = caucasianFemales;

    return data;
  }

  filterAndDelete(_data) {
    let vis = this;
    let data = _data.filter((d) => d.age <= vis.ageCap);
    data.forEach((r) => {
      let keys = Object.keys(r);
      keys.forEach((k) => {
        if (k === "race" || k === "sex" || k === "age") {
          // do nothing
        } else {
          if (!vis.categories.includes(k)) {
            delete r[k];
          }
        }
      });
    });
    return data;
  }
}
