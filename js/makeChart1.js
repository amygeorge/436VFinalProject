const chart1Filters = {
  sex_Female: true,
  sex_Male: true,
  cig_Type: null,
  household: true,
};

function makeChart1() {
  console.log("in chart one");

  d3.selectAll("#chart1-gender-female").on("click", function () {
    chart1Filters.sex_Female = this.checked;
    chart1.data = prepChart1Data(data);
    chart1.updateVis();
  });

  d3.selectAll("#chart1-gender-male").on("click", function () {
    chart1Filters.sex_Male = this.checked;
    chart1.data = prepChart1Data(data);
    chart1.updateVis();
  });

  d3.selectAll(".chart1-selection").on("click", function () {
    d3.select(`#chart1-selection-${chart1.config.selection}`).classed(
      "mdc-button--raised",
      false
    );
    d3.select(`#${this.id}`).classed("mdc-button--raised", true);

    chart1.config.selection = this.id.replace("chart1-selection-", "");
    chart1.updateVis();
  });

  d3.selectAll(".cig-selection-button").on("click", function () {
    d3.select(`#${this.id}`).classed("mdc-button--raised", true);
    if (this.id === "chart1-cig-All") {
      d3.select("#chart1-cig-cigarettes").classed("mdc-button--raised", false);
      d3.select("#chart1-cig-ecigs").classed("mdc-button--raised", false);
      d3.select("#chart1-cig-othercigs").classed("mdc-button--raised", false);
      chart1Filters.cig_Type = null;
    } else {
      if (this.id === "chart1-cig-cigarettes") {
        d3.select("#chart1-cig-cigarettes").classed(
          "mdc-button--raised",
          false
        );
      }
      if (this.id === "chart1-cig-othercigs") {
        d3.select("#chart1-cig-othercigs").classed("mdc-button--raised", false);
      }
      if (this.id === "chart1-cig-ecigs") {
        d3.select("#chart1-cig-ecigs").classed("mdc-button--raised", false);
      }
      d3.select("#chart1-cig-All").classed("mdc-button--raised", false);
      chart1Filters.cig_Type = this.id.replace("chart1-cig-", "");
    }

    chart1.data = prepChart1Data(data);
    chart1.updateVis();
  });
}

function prepChart1Data(_data) {
  let data = chart1Filters.cig_Type
    ? _data.filter((f) => f.cig_Type === chart1Filters.cig_Type)
    : _data;
  if (!chart1Filters.sex_Female) data = data.filter((d) => d.sex !== "Female");
  if (!chart1Filters.sex_Male) data = data.filter((d) => d.sex !== "Male");
  if (!chart1Filters.household)
    data = data.filter((d) => d.household !== "False");

  // filter out if doesn't smoke
  data = data.filter((d) => {
    const ecig = d["start_age_e-cigarette"];
    const cig = d["start_age_cigarette"];
    const other = d["start_age_other"];
    return cig !== "N/A" && cig !== null && ecig !== null && other !== null;
  });

  // only return the lowest start age value per datum
  data.forEach((d) => {
    const ecig = +d["start_age_e-cigarette"];
    const cig = +d["start_age_cigarette"];
    const other = +d["start_age_other"];

    if (cig <= ecig && cig <= other) {
      d.start_age = cig;
    } else if (ecig < cig && ecig < other) {
      d.start_age = ecig;
    } else d.start_age = other;
  });

  data = data.map((d) => {
    const newD = {};
    newD["start_age"] = +d["start_age"];
    newD["start_age_cigarette"] = +d["start_age_cigarette"];
    newD["start_age_e-cigarette"] = +d["start_age_e-cigarette"];
    newD["start_age_other"] = +d["start_age_other"];
    newD["household_exposure_None"] = d["household_exposure_None"];
    return newD;
  });

  data = data.filter((d) => d.start_age);
  console.log("DATA", data);

  return data;
}
