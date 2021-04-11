function plotGauge(wfreq) {

    // pie chart converted to gauge chart
    let traceGauge = {
        type: 'pie',
        showlegend: false,
        hole: 0.4,
        rotation: 90,
        values: [180 / 9, 180 / 9, 180 / 9, 180 / 9, 180 / 9, 180 / 9, 180 / 9, 180 / 9, 180 / 9, 180],
        text: ['0-1', '1-2', '2-3', '3-4', '4-5', '5-6', '6-7', '7-8', '8-9'],
        direction: 'clockwise',
        textinfo: 'text',
        textposition: 'inside',
        marker: {
            colors: ['#F8F3EC', '#F4F1E5', '#E9E6CA', '#E2E4B1', '#D5E49D', '#B7CC92', '#8CBF88', '#8ABB8F', '#85B48A', 'white'],
            labels: ['0-1', '1-2', '2-3', '3-4', '4-5', '5-6', '6-7', '7-8', '8-9', ''],
            hoverinfo: "label"
        },
        hoverinfo: "skip"
    }

    // the dot where the needle "originates"
    let dot = {
        type: 'scatter',
        x: [0],
        y: [0],
        marker: {
            size: 14,
            color: '#850000'
        },
        showlegend: false,
        hoverinfo: "skip"
    }

    // the needle (triangular version)

    // add weights to the degrees to correct needle
    let weight = 0;
    if (wfreq == 2 || wfreq == 3) {
        weight = 3;
    } else if (wfreq == 4) {
        weight = 1;
    } else if (wfreq == 5) {
        weight = -.5;
    } else if (wfreq == 6) {
        weight = -2;
    } else if (wfreq == 7) {
        weight = -3;
    }

    let degrees = 180 - (20 * wfreq + weight); // 20 degrees for each of the 9 gauge sections
    let radius = .5;
    let radians = degrees * Math.PI / 180;
    let aX = 0.025 * Math.cos((radians) * Math.PI / 180);
    let aY = 0.025 * Math.sin((radians) * Math.PI / 180);
    let bX = -0.025 * Math.cos((radians) * Math.PI / 180);
    let bY = -0.025 * Math.sin((radians) * Math.PI / 180);
    let cX = radius * Math.cos(radians);
    let cY = radius * Math.sin(radians);

    // draw the triangle
    let path = 'M ' + aX + ' ' + aY +
        ' L ' + bX + ' ' + bY +
        ' L ' + cX + ' ' + cY +
        ' Z';

    let gaugeLayout = {
        title: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week",
        shapes: [{
            type: 'path',
            path: path,
            fillcolor: '#850000',
            line: {
                color: '#850000'
            }
        }],
        xaxis: {
            zeroline: false,
            showticklabels: false,
            showgrid: false,
            range: [-1, 1],
            fixedrange: true
        },
        yaxis: {
            zeroline: false,
            showticklabels: false,
            showgrid: false,
            range: [-1, 1],
            fixedrange: true
        }
    };

    Plotly.newPlot("gauge", [traceGauge, dot], gaugeLayout);
}