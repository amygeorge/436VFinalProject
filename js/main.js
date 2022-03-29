const chart3Filters = {
    race: null,
    sex_Female: true,
    sex_Male: true
};

let chart3;

d3.csv('data/nyts2020_processed.csv').then(data => {
    chart3 = new Chart3({ parentElement: '#chart3' }, prepChart3Data(data));

    d3.selectAll('.race-selection-button').on('click', function () {
        d3.select(`#${this.id}`).classed('mdc-button--raised', true);
        if (this.id === 'chart3-race-All') {
            d3.select('#chart3-race-Caucasian').classed('mdc-button--raised', false);
            d3.select('#chart3-race-Non-Caucasian').classed('mdc-button--raised', false);
            chart3Filters.race = null;
        }
        else {
            if (this.id === 'chart3-race-Caucasian') {
                d3.select('#chart3-race-Non-Caucasian').classed('mdc-button--raised', false);
            } else {
                d3.select('#chart3-race-Caucasian').classed('mdc-button--raised', false);
            }
            d3.select('#chart3-race-All').classed('mdc-button--raised', false);
            chart3Filters.race = this.id.replace('chart3-race-', '');
        }

        chart3.data = prepChart3Data(data);
        chart3.updateVis();
    });

    d3.selectAll('#chart3-gender-female').on('click', function ()  {
        chart3Filters.sex_Female = this.checked;
        chart3.data = prepChart3Data(data);
        chart3.updateVis();
    });

    d3.selectAll('#chart3-gender-male').on('click', function ()  {
        chart3Filters.sex_Male = this.checked;
        chart3.data = prepChart3Data(data);
        chart3.updateVis();
    });

    d3.selectAll('.chart3-selection').on('click', function () {
        d3.select(`#chart3-selection-${chart3.config.selection}`).classed('mdc-button--raised', false)        
        d3.select(`#${this.id}`).classed('mdc-button--raised', true)

        chart3.config.selection = this.id.replace('chart3-selection-', '');
        chart3.updateVis();
    });
});

function prepChart3Data(_data) {
    let data = chart3Filters.race ? _data.filter(f => f.race === chart3Filters.race) : _data;
    if (!chart3Filters.sex_Female) data = data.filter(d => d.sex !== 'Female');
    if (!chart3Filters.sex_Male) data = data.filter(d => d.sex !== 'Male');

    // filter out undefined quit_for good and harm_addictiveness_e-cigarette values
    data = data.filter(d => {
        const quit_for_good = d.quit_for_good;
        const addictiveness_ecig = d['harm_addictiveness_e-cigarette'];
        return (quit_for_good !== 'N/A') && (quit_for_good !== 'Not Answered') &&
            (addictiveness_ecig !== 'Not Answered') && (addictiveness_ecig !== 'Not enough info on product') &&
            (addictiveness_ecig !== 'Never heard of product') && !!d.sex;
    });

    data = data.filter(d => {
        const occasional_smoking = d['harm_occasional_cigarettes'];
        return (occasional_smoking !== 'N/A') && (occasional_smoking !== 'Not Answered')
    });

    return data.filter(d => {
        const low_nicotine = d['harm_low_nicotine'];
        return (low_nicotine !== 'N/A') && (low_nicotine !== 'Not Answered')
    });
}