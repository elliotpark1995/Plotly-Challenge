function buildMetadata(sample) {
  // Use `d3.json` to fetch the metadata for a sample
    d3.json(`/metadata/${sample}`).then((data) => {
        // Use d3 to select the panel with id of `#sample-metadata`
        var PANEL = d3.select('#sample-metadata');
        PANEL.html("");
        Object.entries(data).forEach(([key, value]) => {
          PANEL.append("h6").text(`${key}:${value}`);
        })
        // Bonus: Build the Gauge Chart
         buildGauge(data.WFREQ);

    })
}

function buildCharts(sample) {

  //`d3.json` to fetch the sample data for the plots
  d3.json(`/samples/${sample}`).then((data) => {
    const otu_ids  = data.otu_ids;
    const otu_labels = data.otu_labels;
    const sample_values = data.sample_values;
    //Pie Chart
    let bubbleLayout = {
      margin: { t: 0 },
      hovermode: "closests",
      xaxis: { title: "OTU ID"}
    }

    let bubbleData = [
      {
        x: otu_ids,
        y: sample_values,
        text: otu_labels,
        mode: "markers",
        marker: {
          size: sample_values,
          color: otu_ids,
          colorscale: "Earth"
        }
      }
    ]

    Plotly.plot("bubble", bubbleData, bubbleLayout);

    let pieData = [
      {
        values: sample_values.slice(0,10),
        labels: otu_ids.slice(0,10),
        hovertext: otu_labels.slice(0,10),
        hoverinfo: "hovertext",
        type: "pie"
      }
    ];

    let pieLayout = {
      margin: {t: 0, l: 0}
    };

    Plotly.plot("pie", pieData, pieLayout);

  })
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");
  
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();