// main.js
// main.js

// Define margins, dimensions, and other constants
const margin = { top: 50, right: 50, bottom: 50, left: 50 };
const width = 800 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

// Create the SVG container
const svg = d3.select("#chart-container")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

// Define an array of slides with corresponding steps and data filters
const slides = [
    {
        step: 1,
        title: "Used Car Prices",
        draw: drawScatterPlot // Function to draw the scatter plot for this slide
    },
    {
        step: 2,
        title: "Car Price Ratio By Kms Driven",
        draw: drawSecondChart // Function to draw the line chart for this slide
    },
    {
        step: 3,
        title: "Car Price Ratio By Year",
        draw: drawThirdScatterPlot // Function to draw the third scatter plot for this slide
    }
];

// Function to draw the scatter plot
function drawScatterPlot(max_price) {
    d3.csv("car_data.csv").then(data => {
        // Convert the numerical columns from strings to numbers
        data.forEach(d => {
            d.Selling_Price = +d.Selling_Price;
            d.Present_Price = +d.Present_Price;
        });

        const filteredData = data.filter(d => d.Present_Price <= max_price);
        // Define x and y scales
        const xScale = d3.scaleLinear()
            .domain(d3.extent(filteredData, d => d.Present_Price))
            .range([0, width]);

        const yScale = d3.scaleLinear()
            .domain(d3.extent(filteredData, d => d.Selling_Price))
            .range([height, 0]);

        // Add x and y axes
        const xAxis = d3.axisBottom(xScale);
        const yAxis = d3.axisLeft(yScale);

        svg.append("g")
            .attr("class", "x-axis")
            .attr("transform", `translate(0, ${height})`)
            .call(xAxis);

        svg.append("g")
            .attr("class", "y-axis")
            .call(yAxis);

        // Add the scatter plot points
        const circleRadius = 5;

        var div = d3.select("body").append("div")
            .attr("class", "tooltip-donut")
            .style("opacity", 0)
            .style("position", "absolute")
            .style("z-index", "10")
            .style("background", "#FFFFFF")
            .style("border", "1px solid #313639")
            .style("border-radius", "8px")
            .style("text-align", "center")
            .style("padding", ".5rem");

        svg.selectAll("circle")
            .data(filteredData)
            .enter()
            .append("circle")
            .attr("cx", d => xScale(d.Present_Price))
            .attr("cy", d => yScale(d.Selling_Price))
            .attr("r", circleRadius)
            .style("fill", "steelblue")
            .on("mouseover", function (d, i) {
                // Show tooltip on mouseover
                d3.select(this).transition()
                    .duration(50)
                    .attr('opacity', '.70');
                div.transition().duration(50).style("opacity", 1);
                div.html(`${d.Car_Name}<br>Year: ${d.Year}<br>Kms Driven: ${d.Driven_kms}<br>Selling Price: ${d.Selling_Price}<br>Present Price: ${d.Present_Price}`)
                    .style("left", (d3.event.pageX + 10) + "px")
                    .style("top", (d3.event.pageY - 15) + "px");
            })
            .on("mouseout", function () {
                // Hide tooltip on mouseout
                d3.select(this).transition()
                    .duration('50')
                    .attr('opacity', '1');
                div.transition().duration(50).style("opacity", 0);
            });

        // Add labels to the axes
        svg.append("text")
            .attr("class", "x-axis-label")
            .attr("x", width / 2)
            .attr("y", height + margin.bottom)
            .attr("text-anchor", "middle")
            .text("Present Price (1000$)");

        svg.append("text")
            .attr("class", "y-axis-label")
            .attr("x", -margin.left)
            .attr("y", height / 2)
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90, -40, " + height / 2 + ")")
            .text("Selling Price (1000$)");
    });
}

// Function to draw the second chart
function drawSecondChart(max_price) {
    d3.csv("car_data.csv").then(data => {
        // Convert the numerical columns from strings to numbers
        data.forEach(d => {
            d.Selling_Price = +d.Selling_Price;
            d.Present_Price = +d.Present_Price;
            d.Driven_kms = +d.Driven_kms;
        });

        const filteredData = data.filter(d => d.Present_Price <= max_price);
        // Define x and y scales
        const xScale = d3.scaleLinear()
            .domain(d3.extent(filteredData, d => d.Driven_kms))
            .range([0, width]);

        const yScale = d3.scaleLinear()
            .domain(d3.extent(filteredData, d => d.Selling_Price / d.Present_Price))
            .range([height, 0]);

        // Add x and y axes
        const xAxis = d3.axisBottom(xScale);
        const yAxis = d3.axisLeft(yScale);

        svg.append("g")
            .attr("class", "x-axis")
            .attr("transform", `translate(0, ${height})`)
            .call(xAxis);

        svg.append("g")
            .attr("class", "y-axis")
            .call(yAxis);

        // Add the scatter plot points with tooltips
        const circleRadius = 5;

        var div = d3.select("body").append("div")
            .attr("class", "tooltip-donut")
            .style("opacity", 0)
            .style("position", "absolute")
            .style("z-index", "10")
            .style("background", "#FFFFFF")
            .style("border", "1px solid #313639")
            .style("border-radius", "8px")
            .style("text-align", "center")
            .style("padding", ".5rem");

        svg.selectAll("circle")
            .data(filteredData)
            .enter()
            .append("circle")
            .attr("cx", d => xScale(d.Driven_kms))
            .attr("cy", d => yScale(d.Selling_Price / d.Present_Price))
            .attr("r", circleRadius)
            .style("fill", "steelblue")
            .on("mouseover", function (d, i) {
                // Show tooltip on mouseover
                d3.select(this).transition()
                    .duration(50)
                    .attr('opacity', '.70');
                div.transition().duration(50).style("opacity", 1);
                div.html(`${d.Car_Name}<br>Year: ${d.Year}<br>Kms Driven: ${d.Driven_kms}<br>Selling Price: ${d.Selling_Price}<br>Present Price: ${d.Present_Price}<br>Price Ratio: ${d.Selling_Price / d.Present_Price}`)
                    .style("left", (d3.event.pageX + 10) + "px")
                    .style("top", (d3.event.pageY - 15) + "px");
            })
            .on("mouseout", function () {
                // Hide tooltip on mouseout
                d3.select(this).transition()
                    .duration('50')
                    .attr('opacity', '1');
                div.transition().duration(50).style("opacity", 0);
            });

        // Add labels to the axes
        svg.append("text")
            .attr("class", "x-axis-label")
            .attr("x", width / 2)
            .attr("y", height + margin.bottom)
            .attr("text-anchor", "middle")
            .text("Kms Driven");

        svg.append("text")
            .attr("class", "y-axis-label")
            .attr("x", -margin.left)
            .attr("y", height / 2)
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90, -40, " + height / 2 + ")")
            .text("Selling Price / Present Price");

        // Add d3-annotation for the insight
        const annotation = d3.annotation()
            .type(d3.annotationLabel)
            .annotations([{
                note: {
                    label: "Selling price / Present price drops when kilometers driven is large",
                    title: "Insight:",
                    wrap: 150 // Adjust the text wrap width as needed
                },
                x: xScale(50000), // x-coordinate of the annotation
                y: yScale(0.6),    // y-coordinate of the annotation
                dx: 116,            // Adjustment to the x-coordinate (horizontal position)
                dy: -30,           // Adjustment to the y-coordinate (vertical position)
            }]);

        svg.append("g")
            .attr("class", "annotation-group")
            .call(annotation);
    });
}


// Function to draw the third scatter plot 
function drawThirdScatterPlot(max_price) {
    d3.csv("car_data.csv").then(data => {
        // Convert the numerical columns from strings to numbers
        data.forEach(d => {
            d.Selling_Price = +d.Selling_Price;
            d.Present_Price = +d.Present_Price;
            d.Year = +d.Year; // Convert Year to a number
        });

        const filteredData = data.filter(d => d.Present_Price <= max_price);
        // Define x and y scales
        const xScale = d3.scaleLinear()
            .domain(d3.extent(filteredData, d => d.Year))
            .range([0, width]);

        const yScale = d3.scaleLinear()
            .domain(d3.extent(filteredData, d => d.Selling_Price / d.Present_Price))
            .range([height, 0]);

        // Add x and y axes
        const xAxis = d3.axisBottom(xScale).tickFormat(d3.format("d")); // Use integer format for years
        const yAxis = d3.axisLeft(yScale);

        svg.append("g")
            .attr("class", "x-axis")
            .attr("transform", `translate(0, ${height})`)
            .call(xAxis);

        svg.append("g")
            .attr("class", "y-axis")
            .call(yAxis);

        // Add the scatter plot points with tooltips
        const circleRadius = 5;
        var div = d3.select("body").append("div")
            .attr("class", "tooltip-donut")
            .style("opacity", 0)
            .style("position", "absolute")
            .style("z-index", "10")
            .style("background", "#FFFFFF")
            .style("border", "1px solid #313639")
            .style("border-radius", "8px")
            .style("text-align", "center")
            .style("padding", ".5rem");

        svg.selectAll("circle")
            .data(filteredData)
            .enter()
            .append("circle")
            .attr("cx", d => xScale(d.Year))
            .attr("cy", d => yScale(d.Selling_Price / d.Present_Price))
            .attr("r", circleRadius)
            .style("fill", "steelblue")
            .on("mouseover", function (d, i) {
                // Show tooltip on mouseover
                d3.select(this).transition()
                    .duration(50)
                    .attr('opacity', '.70');
                div.transition().duration(50).style("opacity", 1);
                div.html(`${d.Car_Name}<br>Year: ${d.Year}<br>Kms Driven: ${d.Driven_kms}<br>Selling Price: ${d.Selling_Price}<br>Present Price: ${d.Present_Price}<br>Price Ratio: ${d.Selling_Price / d.Present_Price}`)
                    .style("left", (d3.event.pageX + 10) + "px")
                    .style("top", (d3.event.pageY - 15) + "px");
            })
            .on("mouseout", function () {
                // Hide tooltip on mouseout
                d3.select(this).transition()
                    .duration('50')
                    .attr('opacity', '1');
                div.transition().duration(50).style("opacity", 0);
            });

        // Add labels to the axes
        svg.append("text")
            .attr("class", "x-axis-label")
            .attr("x", width / 2)
            .attr("y", height + margin.bottom)
            .attr("text-anchor", "middle")
            .text("Year");

        svg.append("text")
            .attr("class", "y-axis-label")
            .attr("x", -margin.left)
            .attr("y", height / 2)
            .attr("text-anchor", "middle")
            .attr("transform", "rotate(-90, -40, " + height / 2 + ")")
            .text("Selling Price / Present Price");

        // Add d3-annotation for the insight
        const annotation = d3.annotation()
            .type(d3.annotationLabel)
            .annotations([{
                note: {
                    label: "Selling price / Present price drops when car is old",
                    title: "Insight:",
                    wrap: 150 // Adjust the text wrap width as needed
                },
                x: xScale(2013), // x-coordinate of the annotation
                y: yScale(0.6),    // y-coordinate of the annotation
                dx: 110,            // Adjustment to the x-coordinate (horizontal position)
                dy: 98,           // Adjustment to the y-coordinate (vertical position)
            }]);

        svg.append("g")
            .attr("class", "annotation-group")
            .call(annotation);
    });
}

let slide_val = 95
// Function to update the visualization for each slide
function updateVisualization(step) {
    const currentSlide = slides[step - 1];

    // Clear the existing visualization
    svg.selectAll("*").remove();

    // Add the title for the current slide
    svg.append("text")
        .attr("class", "slide-title")
        .attr("x", width / 2)
        .attr("y", margin.top)
        .attr("text-anchor", "middle")
        .text(currentSlide.title);

    // Call the draw function for the current slide
    d3.select("#sliderValue").text(slide_val + ",000$");
    currentSlide.draw(slide_val);
}

// Initialize the visualization with the first slide
updateVisualization(1);

// Add interactive controls (e.g., buttons) to navigate through slides
let currentStep = 1;
const totalSlides = slides.length;

d3.select("#next-button").on("click", () => {
    currentStep = Math.min(currentStep + 1, totalSlides);
    updateVisualization(currentStep);
});

d3.select("#prev-button").on("click", () => {
    currentStep = Math.max(currentStep - 1, 1);
    updateVisualization(currentStep);
});

d3.select("#mySlider").on("change", function () {
    slide_val = +this.value;
    updateVisualization(currentStep);
});
