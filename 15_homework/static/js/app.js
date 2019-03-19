
  function buildMetadata(sample) {

    // @TODO: Complete the following function that builds the metadata panel
    // Use `d3.json` to fetch the metadata for a sample 
    var url = `/metadata/${sample}`;
    d3.json(url).then(function(sample) {
  
      // Use d3 to select the panel with id of `#sample-metadata`
      var sample_metadata = d3.select("#sample-metadata");
  
        // Use `.html("") to clear any existing metadata
        sample_metadata.html("");

        // Use `Object.entries` to add each key and value pair to the panel
        Object.entries(sample).forEach(function ([key, value]) {
          var row = sample_metadata.append("p");
          row.text(`${key}: ${value} \n`);
        });
        
      }  );
  }
    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);}

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var url = `/samples/${sample}`;
  d3.json(url).then(function(data) {

    // @TODO: Build a Bubble Chart using the sample data
    var x_val = data.otu_ids;
    var y_val = data.sample_values;
    var m_size = data.sample_values;
    var m_col = data.otu_ids; 
    var t_val = data.otu_labels;

    var trace1 = {
      x: x_val,
      y: y_val,
      text: t_val,
      mode: 'markers',
      marker: {
        color: m_col,
        size: m_size,
        colorscale: "Jet", 
      } 
    };
  
    var data = [trace1];

    var layout = {
      xaxis: { title: "OTU ID"},
      title: "Operational Taxonimical Unit (OTU) Volume and Spread",
    };

    Plotly.newPlot('bubble', data, layout);
   
    // @TODO: Build a Pie Chart
    d3.json(url).then(function(data) {  
    var p_val = data.sample_values.slice(0,10);
      var p_lab = data.otu_ids.slice(0,10);
      var p_hov = data.otu_labels.slice(0,10);

      var data = [{
        values: p_val,
        labels: p_lab,
        hovertext: p_hov,
        type: 'pie',
      }];

      var p_layout= {
        title: "Top Ten OTU Microbiomes",
        colorway : ['#7f4e52','#ff7f50','#ffdb58','#ccfb5d','#4ee2e0', '#2b60de', '#6960ec', '#57e964', '#342d7e', '#ff7f50','#c11b17'] 
      };

    Plotly.newPlot('pie', data, p_layout);

    });
  });   
}

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
