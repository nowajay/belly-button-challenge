//set URL to pull data
let url = 'https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json';


// Pull data and console log it:
d3.json(url).then(function(data){console.log(data)});

// Initializes the page with a default plots
function init() {
// Use D3 to select the dropdown menu
    let dropdownMenu = d3.select("#selDataset");
    // Use D3 to get sample names and populate the drop-down selector
    d3.json(url).then((data) => {
        
        // Set a variable for the sample names and add samples to dropdown menu
        let names = data.names;
        names.forEach((id) => {

            // Log the value of id for each iteration of the loop
            console.log(id);
            dropdownMenu.append("option")
            .text(id).property("value",id)});

        // Set the first sample from the list
        let sample_one = names[0];

        // Log the value of sample_one
        console.log(sample_one);

        // Build the initial plots
        buildBarChart(sample_one);
        buildBubbleChart(sample_one);
        Metadata(sample_one)});
};

// 2.	Create a horizontal bar chart with a dropdown menu to display the top 10 OTUs found in that individual.
function buildBarChart(sample) {

    // Use D3 to retrieve all of the data
    d3.json(url).then((data) => {

        // Retrieve all sample data and filter based on the value of the sample
        let sampleInfo = data.samples;
        let value = sampleInfo.filter(result => result.id == sample);

        // Get the first index from the array
        let Data = value[0];

        // Get the otu_ids, lables, and sample values
        let sample_values = Data.sample_values;
        let otu_ids = Data.otu_ids;
        let otu_labels = Data.otu_labels;

        // Log the data to the console
        console.log(otu_ids,otu_labels,sample_values);

        // Set top ten items to display in descending order
        let yticks = otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse();
        let xticks = sample_values.slice(0,10).reverse();
        let labels = otu_labels.slice(0,10).reverse();
        
        // Set up the trace for the bar chart
        let trace = {
            x: xticks,
            y: yticks,
            text: labels,
            type: "bar",
            orientation: "h"};

        // Setup the layout
        let layout = {
            title: "Top 10 OTUs Present"};

        // Call Plotly to plot the bar chart
        Plotly.newPlot("bar", [trace], layout)});
};

// 3.	Create a bubble chart that displays each sample.
function buildBubbleChart(sample) {

    // Use D3 to retrieve all of the data
    d3.json(url).then((data) => {

        // Retrieve all sample data and filter based on the value of the sample
        let sampleInfo = data.samples;
        let value = sampleInfo.filter(result => result.id == sample);

        // Get the first index from the array
        let Data = value[0];

        // Get the otu_ids, lables, and sample values
        let sample_values = Data.sample_values;
        let otu_ids = Data.otu_ids;
        let otu_labels = Data.otu_labels;

        // Log the data to the console
        console.log(otu_ids,otu_labels,sample_values);
        
        // Set up the trace for the bar chart
        let trace = {
            x: otu_ids ,
            y: sample_values,
            mode: 'markers+text',
            //text: otu_labels,
            //textposition: 'top center',
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: 'BrBG'}};

        // Setup the layout
        let layout = {
            title: "Bubble ChartL OTUs/sample"};

        // Call Plotly to plot the bar chart
        Plotly.newPlot("bubble", [trace], layout)});
};

// Display the sample metadata, i.e., an individual's demographic information
function Metadata(sample) {

    // Use D3 to retrieve all of the data
    d3.json(url).then((data) => {

        // Retrieve all metadata and filter based on the value of the sample
        let metadata = data.metadata;
        let value = metadata.filter(result => result.id == sample);

        // Log the array of metadata objects after the have been filtered
        console.log(value)

        // Get the first index from the array
        let valueData = value[0];

        // Clear out metadata
        d3.select("#sample-metadata").html("");

        // Use Object.entries to add each key/value pair to the panel
        Object.entries(valueData).forEach(([key,value]) => {

            // Log the individual key/value pairs as they are being appended to the metadata panel
            console.log(key,value);

            d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`)})});
};

// 6.	Update all the plots when a new sample is selected, log the new value and call the functions
function optionChanged(value) {console.log(value); 

    Metadata(value);
    buildBarChart(value);
    buildBubbleChart(value);
};

// Call the initialize function
init();