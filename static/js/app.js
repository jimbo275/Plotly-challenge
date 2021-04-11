init()

function init() {
    d3.select("#selDataset").property("value")
        // initialize the dashboard and set the first dropdown entry to be the first name value
    buildDashboard(940)

};

function buildDashboard(name) {

    d3.json("data/samples.json").then(function(data) {
        dropDown(data["names"]);

        var filteredSamples = data.samples.filter(sample => sample.id == name)[0]
        var filteredMetadata = data.metadata.filter(md => md.id == name)[0]

        x = filteredSamples["otu_ids"].slice(0, 10);
        y = filteredSamples["sample_values"].slice(0, 10);
        hoverText = filteredSamples["otu_labels"].slice(0, 10);
        metadata = filteredMetadata;

        // draw the bubblechart and the gas gauge chart
        drawbubbleChart(x, y, hoverText, metadata);
        plotGauge(filteredMetadata.wfreq)

    });
};


function drawbubbleChart(x, y, hoverText, metadata, layout) {

    var metadata_panel = d3.select("#sample-metadata");
    // clear any existing data
    metadata_panel.html("");
    //populate the metadata table
    Object.entries(metadata).forEach(([key, value]) => {
        metadata_panel.append("p").text(`${key}: ${value}`);
    });

    // populate the bar chart
    var trace1 = {

        x: x,
        y: y,
        hoverText: hoverText,
        type: 'bar',
        orientation: 'h'

    };

    var data = [trace1];
    var layout1 = { title: '<b>Top 10 OTUs</b>' };
    Plotly.newPlot('bar', data, layout1);

    // populate the markers
    var trace2 = {
        x: x,
        y: y,
        text: hoverText,
        mode: 'markers',
        marker: {
            size: y,
            color: x

        }

    }

    var data2 = [trace2];
    var layout2 = {

        xaxis: { title: '<b>OTU IDs</b>' },
        yaxis: { title: '<b>Sample Values</b>' }
    }
    Plotly.newPlot('bubble', data2, layout2);

};



ddValues = []

function dropDown(names) {
    var selectDropdown = d3.select("#selDataset")
    ddValues = selectDropdown
        .selectAll("option")
        .data(names)
        .enter()
        .append("option")
        .attr("value", function(d) {
            return d;
        })
        .text(function(d) {
            return d;
        });


};

// build the gauge for washing frequency
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



function optionChanged(sampleName) {
    console.log(sampleName);

    buildDashboard(sampleName);


}
// Write a function that will build the metadata for a single sample. It should do the following:
// - loop over the samples.json file with d3.json().then()
// - extract the metadata from the json
// - filter the metadata for the sample id
// - update the metadata html elements
// - clear any existing metadata in the metadata html elements
// - append new header tags for each key-value pair in the filtered metadata

// Write a function that will build the charts for a single sample. It should do the following:
// - loop over the samples.json file with d3.json().then()
// - extract the samples from the json
// - filter the samples for the sample id
// - extract the ids, labels, and values from the filtered result
// - build a bubble chart and plot with Plotly.newPlot()
// - build a bar chart and plot with Plotly.newPlot()


// // Write a function called init() that will populate the charts/metadata and elements on the page. It should do the following:
// // - select the dropdown element in the page
// // - loop over the samples.json data to append the .name attribute into the value of an option HTML tag (lookup HTML documentation on dropdown menus)
// // - extract the first sample from the data
// // - call your two functions to build the metadata and build the charts on the first sample, so that new visitors see some data/charts before they select something from the dropdown


// function optionChanged()

// // Write a function called optionChanged() that takes a new sample as an argument. It should do the following:
// - call your two functions to build the metadata and build the charts on the new sample
// Look at line 30 of index.html: that is the event listener that will call this function when someone selects something on the dropdown


// Initialize the dashboard by calling your init() function