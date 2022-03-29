csvFile = "./data/nyts2020_processed.csv";

let chart1;
let chart2;
let chart3;

d3.csv(csvFile)
  .then((data) => {
    chart1 = new Chart1({ parentElement: "#chart1" }, prepChart1Data(data));
    chart2 = new VennDiagram(
      { parentElement: "#chart2" },
      prepChart2Data(data)
    );
    chart3 = new Chart3({ parentElement: "#chart3" }, prepChart3Data(data));
    makeChart1();
    makeChart2();
    makeChart3(data);
  })
  .catch((error) => console.error(error));
