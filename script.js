import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";

const apiURL = 'https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/GDP-data.json'

const width = 960;
const height = 540;
const aspectRatio = width/height;
const padding = 25;
const marginBottom = 50;
const marginRight = 20;
const marginTop = 20;
const marginLeft = 45;

const json = await d3.json(apiURL);

const moreInfoUrl = json.description.match(/http:\/\/.+.pdf/g)

console.log(moreInfoUrl);

const dataset = json.data;

const parseDate = d3.utcParse("%Y-%m-%d");

const minX = parseDate(json.from_date);
const maxX = parseDate(json.to_date);

const minY = d3.min(json.data, d => d[1]);
const maxY = d3.max(json.data, d => d[1]);

const xScale = d3.scaleTime()
            .domain([minX, maxX])
            .range([marginLeft, width - marginRight])

const yScale = d3.scaleLinear()
            .domain([minY, maxY])
            .range([height - marginBottom, marginTop])
            .nice()

const svg = d3.create("svg")
            //   .attr("width", width)
            //   .attr("height", height)
              .attr("viewBox", `0 0 ${width} ${height}`)
              .attr("preserveAspectRatio", "xMinYMin meet")

const xAxis = d3.axisBottom(xScale)
                .ticks(20)

const yAxis = d3.axisLeft(yScale)
                .ticks(20)

d3.select("#graph")
   .append("h1")
   .attr("id", "title")
   .text("United States GPD")

svg.append("g")
   .attr("transform", `translate(0, ${height - marginBottom})`)
   .attr("id", "x-axis")
   .call(xAxis)

svg.append("text")
   .attr("x", width - 20)
   .attr("y", height - 5)
   .attr("text-anchor", "end")
   .text(`More information: ${moreInfoUrl}`)

svg.append("g")
   .attr("transform", `translate(${marginLeft}, 0)`)
   .attr("id", "y-axis")
   .call(yAxis)

svg.append("text")
   .attr("transform", "rotate(270)")
   .attr("x", -height/2)
   .attr("y", marginLeft + 20)
   .attr("text-anchor", "middle")
   .text("Gross Domestic Product")

const barWidth = (width - marginLeft - marginRight)/dataset.length
// const barWidth = 2.5;

const tooltip = d3.select("#graph")
                  .append("div")
                  .attr("id", "tooltip")
                  .style("opacity", 0)

svg.selectAll("rect")
   .data(dataset)
   .enter()
   .append("rect")
   .attr("x", d => xScale(parseDate(d[0])) + barWidth/5)
   .attr("y", height - marginBottom)
   // .attr("y", d => yScale(d[1]))
   .attr("width", barWidth)
   .attr("height", 0)
   // .attr("height", d => yScale(0) - yScale(d[1]))
   .classed("bar", true)
   .attr("data-date", d => d[0])
   .attr("data-gdp", d => d[1])

function wichPeriod(date) {
   const d = date.split("-")
   return d[1] === "01" ? `<b>${d[0]}</b> Q1`
         : d[1] === "04" ? `<b>${d[0]}</b> Q2`
         : d[1] === "07" ? `<b>${d[0]}</b> Q3`
         : `<b>${d[0]}</b> Q4`
}

svg.selectAll("rect")   
   .on("mouseover", (event, datum) => {
      tooltip
        .html(() => {
            const money = `<b>$${datum[1]}</b> Billions`
            const date = wichPeriod(datum[0])
            return `<p>${money}</p>
                    <p>${date}</p>`
        })
        .style("top", `${event.pageY - 80}px`)
        .style("left", `${event.pageX - 100}px`)
        .attr("data-date", datum[0])
        .style("opacity", 0.8)
   })
   .on("mouseout", (event, datum) => {
      tooltip
         .style("opacity", 0)
   })
   .on("mousemove", (event, datum) => {
      tooltip
         .style("top", `${event.pageY - 80}px`)
         .style("left", `${event.pageX - 100}px`)
   })

svg.selectAll("rect")
   .transition()
   .duration(1500)
   .delay((d, i) => i * 5)
   .attr("y", d => yScale(d[1]) - 1/5)
   .attr("height", d => yScale(0) - yScale(d[1]))
   
svg.selectAll("ticks")
   .classed("tick", true)

graph.append(svg.node());
