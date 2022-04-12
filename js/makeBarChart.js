const barChartFilters = {
  sex_Female: true,
  sex_Male: true,
  cig_Type: "start_age",
  household: true,
};

function makeBarChart(_data) {
  d3.selectAll("#bar-chart-gender-female").on("click", function () {
    barChartFilters.sex_Female = this.checked;
    barChart.data = prepBarChartData(_data);
    barChart.updateVisBarChart();
  });

  d3.selectAll("#bar-chart-gender-male").on("click", function () {
    barChartFilters.sex_Male = this.checked;
    barChart.data = prepBarChartData(_data);
    barChart.updateVisBarChart();
  });

  d3.selectAll(".tobacco-selection-button").on("click", function (d) {
    d3.select(`${this.id}`).classed("mdc-button--raised", true);
    if (this.id === "bar-chart-start_age") {
      d3.select("#bar-chart-start_age_cigarette").classed(
        "mdc-button--raised",
        false
      );
      d3.select("#bar-chart-start_age_e-cigarette").classed(
        "mdc-button--raised",
        false
      );
      d3.select("#bar-chart-start_age_other").classed(
        "mdc-button--raised",
        false
      );
      barChartFilters.cig_Type = "start_age";
    } else {
      if (this.id === "bar-chart-start_age_cigarette") {
        d3.select("#bar-chart-start_age_e-cigarette").classed(
          "mdc-button--raised",
          false
        );
        d3.select("bar-chart-start_age_other").classed(
          "mdc-button--raised",
          false
        );
      } else if (this.id === "bar-chart-start_age_e-cigarette") {
        d3.select("#bar-chart-start_age_cigarette").classed(
          "mdc-button--raised",
          false
        );
        d3.select("#bar-chart-start_age_other").classed(
          "mdc-button--raised",
          false
        );
      } else if (this.id === "bar-chart-start_age_other") {
        d3.select("#bar-chart-start_age_cigarette").classed(
          "mdc-button--raised",
          false
        );
        d3.select("#bar-chart-start_age_e-cigarette").classed(
          "mdc-button--raised",
          false
        );
      }
      d3.select("#bar-chart-start_age").classed("mdc-button--raised", false);
      barChartFilters.cig_Type = this.id.replace("#bar-chart-", "");
    }

    barChart.data = prepBarChartData(_data);
    barChart.config.selection = this.id.replace("#bar-chart-", "");
    barChart.updateVisBarChart();
  });

  barChart.data = prepBarChartData(_data);
}

function prepBarChartData(_data) {
  let data = _data;
  if (!barChartFilters.sex_Female)
    data = data.filter((d) => d.sex !== "Female");
  if (!barChartFilters.sex_Male) data = data.filter((d) => d.sex !== "Male");
  if (!barChartFilters.household)
    data = data.filter((d) => d.household !== "False");

  // filter out if doesn't smoke
  data = data.filter((f) => {
    const ecig = f["start_age_e-cigarette"];
    const cig = f["start_age_cigarette"];
    const other = f["start_age_other"];
    return cig !== "N/A" && cig !== null && ecig !== null && other !== null;
  });

  // only return the lowest start age value per datum
  data.forEach((d) => {
    const ecig = +d["start_age_e-cigarette"];
    const cig = +d["start_age_cigarette"];
    const other = +d["start_age_other"];
    let minArray = [ecig, cig, other];
    d.start_age = Math.min.apply(null, minArray.filter(Boolean));
  });

  // clean data for linear scaling
  data = data.map((d) => {
    const newD = {};
    newD["start_age"] = +d["start_age"];
    newD["start_age_cigarette"] = +d["start_age_cigarette"];
    newD["start_age_e-cigarette"] = +d["start_age_e-cigarette"];
    newD["start_age_other"] = +d["start_age_other"];
    newD["household_exposure_None"] = d["household_exposure_None"];
    newD["sex"] = d.sex;
    newD["cig_Type"] = barChartFilters.cig_Type;
    return newD;
  });

  return data;
}
