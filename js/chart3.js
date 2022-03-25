class Chart3 {

    constructor(_config, _data) {
        this.config = {
            parentElement: _config.parentElement,
            containerWidth: _config.containerWidth || 800,
            containerHeight: _config.containerHeight || 500,
            margin: _config.margin || { top: 30, right: 5, bottom: 25, left: 100 },
        }
        this.data = _data;
        // filter out undefined quit_for good and harm_addictiveness_e-cigarett values
        this.data = this.data.filter(d => {
            const quit_for_good = d.quit_for_good;
            const harm_cigarette = d['harm_addictiveness_e-cigarette'];
            return (quit_for_good !== 'N/A') && (quit_for_good !== 'Not Answered') &&
                (harm_cigarette !== 'Not Answered') && (harm_cigarette !== 'Not enough info on product') &&
                (harm_cigarette !== 'Never heard of product');
        });
        this.dataByAdditiveness = d3.groups(this.data, d => d['harm_addictiveness_e-cigarette']);
        this.initVis();
    }

    initVis() {
        // Create SVG area, initialize scales and axes
        let vis = this;

        // Calculate inner chart size
        vis.width = vis.config.containerWidth - vis.config.margin.left - vis.config.margin.right;
        vis.height = vis.config.containerHeight - vis.config.margin.top - vis.config.margin.bottom;

        vis.xScale = d3.scaleBand()
            .range([0, vis.width]);

        vis.yScale = d3.scaleBand()
            .range([vis.height, 0]);

        // Initialize axes
        vis.xAxis = d3.axisBottom(vis.xScale)
            // .ticks(6)
            // .tickSize(-vis.height - 10)
            .tickSizeOuter(0)
            .tickPadding(10);

        vis.yAxis = d3.axisLeft(vis.yScale)
            // .ticks(7)
            // .tickSize(-vis.width - 10)
            .tickSizeOuter(0)
            .tickPadding(10);

        // Define size of SVG drawing area
        vis.svg = d3.select(vis.config.parentElement)
            .attr('width', vis.config.containerWidth)
            .attr('height', vis.config.containerHeight);

        // Append group element that will contain our actual chart 
        // and position it according to the given margin config
        vis.chart = vis.svg.append('g')
            .attr('transform', `translate(${vis.config.margin.left},${vis.config.margin.top})`);

        // Append axis groups
        // Append empty x-axis group and move it to the bottom of the chart
        vis.xAxisGroup = vis.chart.append('g')
            .attr('class', 'x-axis axis')
            .attr('transform', `translate(0, ${vis.height})`);

        // Append y-axis group
        vis.yAxisGroup = vis.chart.append('g')
            .attr('class', 'y-axis axis');

        vis.updateVis();

    }

    updateVis() {
        let vis = this;
        vis.xValue = d => d.quit_for_good;
        vis.yValue = d => d[0];

        vis.xScale.domain(['Did not try to quit', '1 time', '2 times', '3 to 5 times', '6 to 9 times', '10 or more times']);
        vis.yScale.domain(['Less addictive', 'Equally addictive', 'More addictive']);
        // vis.xScale.domain([''])
        // vis.xScale.domain([...new Set(this.data.map(d => d.quit_for_good))])

        vis.renderVis();

    }

    renderVis() {
        let vis = this;

        vis.bandWidthHalved = vis.width / 12;
        vis.bandHeightHalved = vis.height / 6;

        // 1. Level: rows
        const rows = vis.chart.selectAll('.row')
            .data(this.dataByAdditiveness, d => d[0])
            .join('g')
            .attr('class', 'row')
            .attr('transform', d => `translate(0,${vis.yScale(vis.yValue(d)) + (vis.bandHeightHalved/2)})`);

        // 2. Level: columns
        const columns = rows.selectAll('.column')
            .data(d => d[1].sort((a, b) => a.sex === 'Male' ? 1 : -1))
            .join('g')
            .attr('class', 'column')
            .attr('transform', d => `translate(${vis.xScale(vis.xValue(d)) + (vis.bandWidthHalved/4)},0)`);

        const countsX = {};
        const countsY = {};
        // 3. Level: point (point)
        const points = columns.selectAll('.point')
            .data(d => [d])
            .join('circle')
            .attr('class', 'point')
            .attr('cx', d => {
                const countsKey = `${d.quit_for_good},${d['harm_addictiveness_e-cigarette']}`;
                if (countsX[countsKey] === undefined) countsX[countsKey] = 0;
                else countsX[countsKey] = countsX[countsKey] + 1;
                return (countsX[countsKey] % 15) * 6;
            })
            .attr('cy', d => {
                const countsKey = `${d.quit_for_good},${d['harm_addictiveness_e-cigarette']}`;
                if (countsY[countsKey] === undefined) countsY[countsKey] = 0;
                else countsY[countsKey] = countsY[countsKey] + 1;
                return (Math.floor(countsY[countsKey] / 15)) * 6;
            })
            .attr('r', 2)
            .attr('fill-opacity', '1')
            .style('stroke-width', '0.3')
            .style('stroke', '#FFF')
            .style('fill', d => d.sex === 'Male' ? '#7137BE' : '#3FDD58');

        vis.xAxisGroup.call(vis.xAxis);
        vis.yAxisGroup.call(vis.yAxis);
    }
}
