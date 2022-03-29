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
      margin: { top: 15, right: 15, bottom: 20, left: 45 },
      toolTipPadding: 15,
    };
    this.data = _data;
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
    vis.radiusScale = d3.scaleSqrt().range([10, 65]);
    // vis.colourScale = d3
    //   .scaleOrdinal()
    //   .range([red, orange, purple, green, blue]);

    vis.xAxis = d3.axisBottom(vis.xScale).ticks(2).tickSize(0).tickPadding(5);
    vis.yAxis = d3.axisLeft(vis.yScale).ticks(2).tickSize(0).tickPadding(5);

    vis.svg = d3
      .select(vis.config.parentElement)
      .append("svg")
      .attr("id", "venn-diagram")
      .attr("width", vis.config.containerWidth)
      .attr("height", vis.config.containerHeight);
    vis.chartArea = vis.svg
      .append("g")
      .attr(
        "transform",
        `translate(${vis.config.margin.left}, ${vis.config.margin.top})`
      );

    vis.xAxisG = vis.chartArea
      .append("g")
      .attr("class", "axis x-axis")
      .attr("transform", `translate(0, ${vis.height})`);
    vis.yAxisG = vis.chartArea
      .append("g")
      .attr("class", "axis y-axis")
      .attr("transform", `translate(${vis.config.margin.left}, 0)`);

    vis.updateVis();
  }

  updateVis() {
    let vis = this;
    //TODO: initalize filters, accessor functions, scale domains

    // filter data
    vis.filteredData = vis.filterData(vis.data);

    // TODO: Accessor functions

    vis.xScale.domain(["Male", "Female"]);
    vis.yScale.domain(["Caucasian", "Non-Caucasian"]);

    vis.renderVis();
  }

  renderVis() {
    let vis = this;

    //TODO: render the graph

    // CELL: Caucasian male
    vis.renderCircles(200, 200, vis.data);

    // CELL: Caucasian female
    vis.renderCircles(480, 200, vis.data);

    // CELL: Non-Caucasian male
    vis.renderCircles(200, 450, vis.data);

    // CELL: Non-Caucasian female
    vis.renderCircles(480, 450, vis.data);

    // render the axes without the axes lines
    vis.xAxisG.call(vis.xAxis).call((g) => g.select(".domain").remove());
    vis.yAxisG.call(vis.yAxis).call((g) => g.select(".domain").remove());
  }

  renderCircles(_xCenter, _yCenter, _data) {
    let vis = this;
    // TODO: pass in the appropriate cell-related dataset
    const data = _data;

    // TODO: circleRad should be dynamic via # data rows
    const radius = 65;
    const xCenter = _xCenter;
    const yCenter = _yCenter;
    const offsetFactor = 0.8;
    const offset = offsetFactor * radius;

    const g = vis.chartArea
      .append("g")
      .attr(
        "transform",
        `translate(${vis.config.margin.left}, ${vis.config.margin.top})`
      );

    // render parent circle
    g.append("circle")
      .attr("class", "parent-circle")
      .attr("stroke", "black")
      .attr("stroke-width", 0.5)
      .attr("fill", "white")
      .attr("r", radius * 1.9)
      .attr("opacity", 0.8)
      .attr("transform", `translate(${xCenter},${yCenter - 5})`);

    // render household circle
    g.append("circle")
      .attr("class", "category-household")
      .attr("r", radius)
      .attr("opacity", 0.8)
      .attr("transform", `translate(${xCenter}, ${yCenter - offset - 8})`);

    // render access circle
    const xCenter_2 = xCenter + offset;
    const yCenter_2 = yCenter - (Math.sqrt(1) * offset) / 2;
    g.append("circle")
      .attr("class", "category-access")
      .attr("r", radius)
      .attr("opacity", 0.8)
      .attr("transform", `translate(${xCenter_2}, ${yCenter_2})`);

    // render social-media circle
    const xCenter_3 = xCenter + (offset * 1.3) / 2;
    const yCenter_3 = yCenter + (Math.sqrt(2) * offset) / 2;
    g.append("circle")
      .attr("class", "category-social-media")
      .attr("r", radius)
      .attr("opacity", 0.8)
      .attr("transform", `translate(${xCenter_3}, ${yCenter_3})`);

    // render advertisement circle
    const xCenter_4 = xCenter - (offset * 1.3) / 2;
    const yCenter_4 = yCenter + (Math.sqrt(2) * offset) / 2;
    g.append("circle")
      .attr("class", "category-advertisement")
      .attr("r", radius)
      .attr("opacity", 0.8)
      .attr("transform", `translate(${xCenter_4}, ${yCenter_4})`);

    // render advertisement circle
    const xCenter_5 = xCenter - offset;
    const yCenter_5 = yCenter - (Math.sqrt(1) * offset) / 2;
    g.append("circle")
      .attr("class", "category-peers")
      .attr("r", radius)
      .attr("opacity", 0.8)
      .attr("transform", `translate(${xCenter_5}, ${yCenter_5})`);
  }

  filterData(_data) {
    let vis = this;
    //TODO: filter data

    return _data;
  }
}
