csvFile = "./data/nyts2020_processed.csv";

let barChart;
let vennDiagram;
let scatterChart;

d3.csv(csvFile)
  .then((data) => {
    barChart = new BarChart(
      { parentElement: "#bar-chart-" },
      prepBarChartData(data)
    );
    vennDiagram = new VennDiagram(
      { parentElement: "#venn-diagram" },
      prepVennDiagramData(data)
    );
    scatterChart = new ScatterChart(
      { parentElement: "#scatter-chart" },
      prepScatterChartData(data)
    );
    makeBarChart(data);
    makeVennDiagram(data);
    makeScatterChart(data);
  })
  .catch((error) => console.error(error));
