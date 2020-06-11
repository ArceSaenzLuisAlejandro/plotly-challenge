// INIT by selecting the dropdown, check on the samples, full-fill the dropdown and run all the graphs
function init() {

    // Read each object from the data "samples.json" by using an arrow function
    d3.json('data/samples.json').then((sample) => {
        
        // Select the dropdown from #selDataset
        var dropDown = d3.select("#selDataset");

        // Print each object from the json
        // console.log(sample);
        
        // First value of choideID is the first id of the list
        var dropdownID = sample.names[0];

        // Store every object in the JSON
        var names = sample.names;
        // console.log(names);
        var metadata = sample.metadata;
        // console.log(data);
        var sample = sample.samples;
        // console.log(sample);

        // Get, from the "name" object, each option (ID)
        names.forEach((name) => {

            // Append to the dropdown each "ID"
            dropDown.append('option').text(name).property('value', name);

        });

        // Init all the visualizations, using the default dropdownID
        demoInfo();
        barsPlot();
        bubblesPlot();  

        // Make the changes when the dropdown is selected
        dropDown.on("change", choiceID);
        
        // Read the value property from the dropdown object and make the changes to the visualizations
        function choiceID() {
            dropdownID = dropDown.property("value");
            demoInfo(dropdownID);
            barsPlot(dropdownID);
            bubblesPlot(dropdownID);
        }; 

        //----------------------------------------------------------------------------------
        // Function to extract data and fill the Demographic Info visual object
        function demoInfo() {

            // Filter metadata comparing the ID from the dropdown and The "id" from the object
            var metadataFiltered = metadata.filter(data => data.id == dropdownID);

            // Get into the list
            var data = metadataFiltered[0];
            // console.log(data);

            // Select the panel from #sample-metadata
            // Delete all the data from the panel before writing something
            var demoInfoPanel = d3.select('#sample-metadata');
            demoInfoPanel.html("");

            // For each object from the metadata object, append to the panel the key and the value
            Object.entries(data).forEach(([key, value]) => {
                // Append and format the key and value
                demoInfoPanel.append("p").text(`${key}: ${value}`);
              });
        }

        //----------------------------------------------------------------------------------
        // Function to extract data and fill the bars plot 
        function barsPlot() {

            // Filter metadata comparing the ID from the dropdown and The "id" from the object
            var samples = sample.filter(data => data.id == dropdownID);

            // Get the top 10 sample values from sample_values, reverse to align them
            var sample_values = samples[0].sample_values.slice(0, 10).reverse();
            // console.log(sample_values);

            // Get the top 10 OTU IDs from otu_ids, reverse to align them
            var otu_ids = samples[0].otu_ids.slice(0, 10).reverse();
            // console.log(otu_ids);

            // Get the top 10 OTU labels from otu_labels
            var otu_labels = samples[0].otu_labels.slice(0, 10);
            // console.log(otu_labels);

            var trace1 = {
                x: sample_values,
                // Format the Y labels
                y: otu_ids.map(id => `OTU ${id}`),
                text: otu_labels,
                type: "bar",
                orientation: "h",
                marker: {
                    color: "#1978b5"
                }
            };
            
            var layout = {
                yaxis:{
                    tickmode:"linear",
                },
                margin: {
                    l: 80,
                    r: 80,
                    t: 15,
                    b: 15
                }
            };

            // Assign the trace to data and finally plot the visualization as a bar plot
            var data = [trace1];
            Plotly.newPlot("bar", data, layout);
        }
        
        //----------------------------------------------------------------------------------
        // Function to extract data and fill the bubbles plot 
        function bubblesPlot() {

            // Filter metadata comparing the ID from the dropdown and The "id" from the object
            var samples = sample.filter(data => data.id == dropdownID);

            var trace1 = {
                // From the filtered data, obtain all the parameters
                x: samples[0].otu_ids,
                y: samples[0].sample_values,
                text: samples[0].otu_labels,
                mode: 'markers',
                // From the filtered data, obtain the markers values
                marker: {
                  size: samples[0].sample_values,
                  color: samples[0].otu_ids
                }
            };
              
            var layout = {
                autosize: true,
                xaxis:{
                    title: "OTU ID"
                }
            };
              
            // Assign the trace to data and finally plot the visualization as a bubble plot
            var data = [trace1];
            Plotly.newPlot('bubble', data, layout);
        }

    });

}

init();
