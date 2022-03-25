d3.csv('data/nyts2020_processed.csv').then(data => {
    console.log('data', data)
    const chart3 = new Chart3({ parentElement: '#chart3' }, data);
});