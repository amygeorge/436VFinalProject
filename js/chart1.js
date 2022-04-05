class Chart1 {
    constructor(_config, _data) {
        this.selectionToKeyMapping = {
            exposure: "household_exposure_None",
            ecig: "start_age_e-cigarette",
            cig: "start_age_cigarette",
            other: "start_age_other",
            start_age: "start_age",
        };
        this.config = {
            selection:
                _config.selection || Object.keys(this.selectionToKeyMapping)[0],
            parentElement: _config.parentElement,
            containerWidth: _config.containerWidth || 900,
            containerHeight: _config.containerHeight || 600,
            margin: _config.margin || {top: 30, right: 5, bottom: 30, left: 130},
        };
        this.data = _data;

        this.initVisChart1();
    }

    initVisChart1() {
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

        vis.xScale = d3.scaleLinear().range([0, vis.width]);

        vis.yScale = d3
            .scaleLinear()
            .range([vis.height - 70, 0]);

        // Initialize axes
        vis.xAxis = d3
            .axisBottom(vis.xScale)
            .tickSizeOuter(0)
            .tickPadding(10);

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
            .attr("class", "chart1")
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
        vis.yAxisGroup = vis.chart
            .append("g")
            .attr("class", "y-axis axis")
            .attr("transform", `translate(0, 
            ${vis.config.margin.bottom - 10})`);

        // Colours based on the disaster categories
        vis.prettyColours = d3.scaleOrdinal()
            .domain(["start_age_cigarette", "start_age_e-cigarette", "start_age_other"])
            .range(["#FF4747", "#FFAC33", "#3FDD58"])


        // Append x-axis title
        vis.svg
            .append("text")
            .attr("class", "axis-title")
            .attr("x", vis.config.margin.left - 10)
            .attr("y", vis.config.margin.top - 10)
            .attr("text-anchor", "end")
            .attr("dy", "1em")
            .attr("font-weight", "bold")
            .text("age started smoking");

        vis.svg
            .append("text")
            .attr("class", "axis-title")
            .attr("x", vis.width - vis.config.margin.right - 20)
            .attr("y", vis.height + vis.config.margin.bottom)
            .attr("text-anchor", "start")
            .attr("dy", "1em")
            .attr("font-weight", "bold")
            .text("# of participants");


        vis.updateVisChart1();
    }

    updateVisChart1() {
        let vis = this;
        // Specificy x- and y-accessor functions
        // TODO:
        //X domain needs to be changed to number of participants
        vis.xScale.domain([0, 1000]);
        vis.yScale.domain([9, 19]);

        const dataForStacking = [];
        this.data.map((d) => {
            const newD = {};
            if (d[this.selectionToKeyMapping.exposure] === "True") {
                newD["start_age_cigarette"] = d["start_age_cigarette"]
                    ? -Math.abs(d["start_age_cigarette"])
                    : 0;
                newD["start_age_e-cigarette"] = d["start_age_e-cigarette"]
                    ? -Math.abs(d["start_age_e-cigarette"])
                    : 0;
                newD["start_age_other"] = d["other"] ? -Math.abs(d["other"]) : 0;
                newD["start_age"] = d["start_age"];
                dataForStacking.push(newD);
            } else {
                newD["start_age_cigarette"] = d["start_age_cigarette"] || 0;
                newD["start_age_e-cigarette"] = d["start_age_e-cigarette"] || 0;
                newD["start_age_other"] = d["other"] || 0;
                newD["start_age"] = d["start_age"];
                dataForStacking.push(newD);
            }
        });

        const groupedDataForStacking = d3.groups(
            dataForStacking,
            (d) => d.start_age
        );

        vis.stackedData = d3
            .stack()
            .keys(["start_age_e-cigarette", "start_age_cigarette", "start_age_other"])
            .value((gd, key) => {
                return [gd[0], gd[1].filter((d) => d[key])];
            })(groupedDataForStacking);

        vis.renderVisChart1();
    }

    renderVisChart1() {
        let vis = this;
        vis.chart
            .selectAll("household")
            .data(vis.stackedData)
            .join("g")
            .attr("class", (d) => `household`)
            .attr("transform", `translate(0,${vis.config.margin.bottom - 70})`)


            .selectAll("rect")
            .data(d => {
                console.log(d)
                return d
                // why doesn't this filter out the data at all?
                // if (d.household_exposure_None === 'False') {
                //     return d
                // }
            })
            .join("rect")
            .attr("width", (d) => d.data[1].length)
            .attr("x", 5)
            .attr("y", (d) => vis.yScale(d.data[0]))
            .attr("height", 30)


            // todo:
            // each datum has multiple possible smoking types
            // which are we supposed to plot?
            .attr("fill", d => vis.prettyColours(d))
        ;

        vis.xAxisGroup.call(vis.xAxis);
        vis.yAxisGroup.call(vis.yAxis);
    }
}
