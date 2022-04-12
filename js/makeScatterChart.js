const scatterChartFilters = {
  race: null,
  sex_Female: true,
  sex_Male: true,
};
function makeScatterChart(_data) {
  d3.selectAll(".race-selection-button").on("click", function () {
    d3.select(`#${this.id}`).classed("mdc-button--raised", true);
    if (this.id === "scatter-chart-race-All") {
      d3.select("#scatter-chart-race-Caucasian").classed(
        "mdc-button--raised",
        false
      );
      d3.select("#scatter-chart-race-Non-Caucasian").classed(
        "mdc-button--raised",
        false
      );
      scatterChartFilters.race = null;
    } else {
      if (this.id === "scatter-chart-race-Caucasian") {
        d3.select("#scatter-chart-race-Non-Caucasian").classed(
          "mdc-button--raised",
          false
        );
      } else {
        d3.select("#scatter-chart-race-Caucasian").classed(
          "mdc-button--raised",
          false
        );
      }
      d3.select("#scatter-chart-race-All").classed("mdc-button--raised", false);
      scatterChartFilters.race = this.id.replace("scatter-chart-race-", "");
    }

    scatterChart.data = prepScatterChartData(_data);
    scatterChart.updateVis();
  });

  d3.selectAll("#scatter-chart-gender-female").on("click", function () {
    scatterChartFilters.sex_Female = this.checked;
    scatterChart.data = prepScatterChartData(_data);
    scatterChart.updateVis();
  });

  d3.selectAll("#scatter-chart-gender-male").on("click", function () {
    scatterChartFilters.sex_Male = this.checked;
    scatterChart.data = prepScatterChartData(_data);
    scatterChart.updateVis();
  });

  d3.selectAll(".scatter-chart-selection").on("click", function () {
    d3.select(
      `#scatter-chart-selection-${scatterChart.config.selection}`
    ).classed("mdc-button--raised", false);
    d3.select(`#${this.id}`).classed("mdc-button--raised", true);

    scatterChart.config.selection = this.id.replace(
      "scatter-chart-selection-",
      ""
    );
    scatterChart.updateVis();
  });
}

function prepScatterChartData(_data) {
  let data = scatterChartFilters.race
    ? _data.filter((f) => f.race === scatterChartFilters.race)
    : _data;
  if (!scatterChartFilters.sex_Female)
    data = data.filter((d) => d.sex !== "Female");
  if (!scatterChartFilters.sex_Male)
    data = data.filter((d) => d.sex !== "Male");

  // filter out undefined quit_for good and harm_addictiveness_e-cigarette values
  data = data.filter((d) => {
    const quit_for_good = d.quit_for_good;
    const addictiveness_ecig = d["harm_addictiveness_e-cigarette"];
    return (
      quit_for_good !== "N/A" &&
      quit_for_good !== "Not Answered" &&
      addictiveness_ecig !== "Not Answered" &&
      addictiveness_ecig !== "Not enough info on product" &&
      addictiveness_ecig !== "Never heard of product" &&
      !!d.sex
    );
  });

  data = data.filter((d) => {
    const occasional_smoking = d["harm_occasional_cigarettes"];
    return (
      occasional_smoking !== "N/A" && occasional_smoking !== "Not Answered"
    );
  });

  return data.filter((d) => {
    const low_nicotine = d["harm_low_nicotine"];
    return low_nicotine !== "N/A" && low_nicotine !== "Not Answered";
  });
}
