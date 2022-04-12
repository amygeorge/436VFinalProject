const vennDiagramFilters = {
  age: [9, 19],
  categories: ["household", "access", "social-media", "curiosity", "friend"],
};

function makeVennDiagram(_data) {
  vennDiagram.data = prepVennDiagramData(_data);

  d3.selectAll(".venn-diagram-category").on("click", function (e) {
    d3.select(this).classed("inactive", !d3.select(this).classed("inactive"));

    const category = e.target.attributes.category?.value;
    if (vennDiagram.filterCategories.includes(category)) {
      vennDiagram.filterCategories = vennDiagram.filterCategories.filter(
        (c) => c !== category
      );
    } else {
      vennDiagram.filterCategories.push(category);
    }

    vennDiagram.updateVis();
  });
}

function prepVennDiagramData(_data) {
  let data = _data.filter((d) => d.sex);
  data = data.map((_d) => {
    let d = {};
    d["category-household"] = _d["motivation_family-member"] === "True";
    d["category-access"] = _d["motivation_ease-of-access"] === "True";
    d["category-social-media"] = _d["motivation_media-influence"] === "True";
    d["category-curiosity"] = _d["motivation_curiosity"] === "True";
    d["category-peers"] = _d["motivation_friend"] === "True";
    d["race"] = _d["race"];
    d["sex"] = _d["sex"];
    d["age"] = +_d["age"];
    return d;
  });

  const nestedData = d3.groups(
    data,
    (d) => d.sex,
    (d) => d.race
  );

  return nestedData;
}
