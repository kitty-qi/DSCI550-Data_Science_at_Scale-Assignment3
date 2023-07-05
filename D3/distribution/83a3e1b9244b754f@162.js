async function _data(d3,FileAttachment){return(
d3.csvParse(await FileAttachment("geo_age@2.csv").text(), (d, _, columns) => {
  let total = 0;
  for (let i = 1; i < columns.length; ++i) total += d[columns[i]] = +d[columns[i]];
  d.total = total;
  return d;
}).sort((a, b) => b.total - a.total)
)}

function _width(){return(
975
)}

function _height(){return(
1100
)}

function _innerRadius(){return(
200
)}

function _outerRadius(width,height){return(
Math.min(width, height) * 0.67
)}

function _x(d3,data){return(
d3.scaleBand()
    .domain(data.map(d => d.name))
    .range([0, 2 * Math.PI])
    .align(0)
)}

function _y(d3,data,innerRadius,outerRadius){return(
d3.scaleRadial()
    .domain([0, d3.max(data, d => d.total)])
    .range([innerRadius, outerRadius])
)}

function _z(d3,data){return(
d3.scaleOrdinal()
    .domain(data.columns.slice(1))
    .range(["#0e606b", "#1597a5","#ffc24b", "#ff8c00"])
)}

function _xAxis(data,x,innerRadius){return(
g => g
    .attr("text-anchor", "middle")
    .call(g => g.selectAll("g")
      .data(data)
      .enter().append("g")
        .attr("transform", d => `
          rotate(${((x(d.name) + x.bandwidth() / 2) * 180 / Math.PI - 90)})
          translate(${innerRadius},0)
        `)
        .call(g => g.append("line")
            .attr("x2", -5)
            .attr("stroke", "#000"))
        .call(g => g.append("text")
            .attr("transform", d => (x(d.name) + x.bandwidth() / 2 + Math.PI / 2) % (2 * Math.PI) < Math.PI
                ? "rotate(90) translate(0,16)"
                : "rotate(-90) translate(0,-9)") 
            .text(d => d.name)))
)}

function _yAxis(y){return(
g => g
    .attr("text-anchor", "end")
    .call(g => g.append("text")
        .attr("x", -6)
        .attr("y", d => -y(y.ticks(10).pop()))
        .attr("dy", "-1em")
        .text("Population"))
    .call(g => g.selectAll("g")
      .data(y.ticks(10).slice(1))
      .join("g")
        .attr("fill", "none")
        .call(g => g.append("circle")
            .attr("stroke", "#000")
            .attr("stroke-opacity", 0.5)
            .attr("r", y))
        .call(g => g.append("text")
            .attr("x", -6)
            .attr("y", d => -y(d))
            .attr("dy", "0.35em")
            .attr("stroke", "#fff")
            .attr("stroke-width", 5)
            .text(y.tickFormat(10, "s"))
         .clone(true)
            .attr("fill", "#000")
            .attr("stroke", "none")))
)}

function _legend(data,z){return(
g => g.append("g")
  .selectAll("g")
  .data(data.columns.slice(1).reverse())
  .join("g")
    .attr("transform", (d, i) => `translate(-40,${(i - (data.columns.length - 1) / 2) * 20})`)
    .call(g => g.append("rect")
        .attr("width", 18)
        .attr("height", 18)
        .attr("fill", z))
    .call(g => g.append("text")
        .attr("x", 24)
        .attr("y", 9)
        .attr("dy", "0.35em")
        .text(d => d))
)}

function _arc(d3,y,x,innerRadius){return(
d3.arc()
    .innerRadius(d => y(d[0]))
    .outerRadius(d => y(d[1]))
    .startAngle(d => x(d.data.name))
    .endAngle(d => x(d.data.name) + x.bandwidth())
    .padAngle(0.01)
    .padRadius(innerRadius)
)}

function _chart1(d3,DOM,width,height,data,z,arc,xAxis,yAxis,legend)
{
  const svg = d3.select(DOM.svg(width, height))
      .attr("viewBox", `${-width / 2} ${-height * 0.69} ${width} ${height}`)
      .style("width", "100%")
      .style("height", "auto")
      .style("font", "10px sans-serif");

  svg.append("text")
    .attr("x", 0)
    .attr("y", -70)
    .attr("text-anchor", "middle")
    .attr("font-size", "14px")
    .text("Geolocations in Narratives vs Users' Ages")
    .style("font-size", "12px");
  
  svg.append("g")
    .selectAll("g")
    .data(d3.stack().keys(data.columns.slice(1))(data))
    .join("g")
      .attr("fill", d => z(d.key))
    .selectAll("path")
    .data(d => d)
    .join("path")
      .attr("d", arc);

  svg.append("g")
      .call(xAxis)
      .style("font-size", "6px");

  svg.append("g")
      .call(yAxis);

  svg.append("g")
      .call(legend)
      .style("font-size", "12px");

  return svg.node();
}


export default function define(runtime, observer) {
  const main = runtime.module();
  function toString() { return this.url; }
  const fileAttachments = new Map([
    ["geo_age@2.csv", {url: new URL("./files/415442adf0bd2c57d9bbabc86b94d58fe2e683b931f788736de482b58cd099bc168769d2bf6869c39d6e229ee2d2dee592fcdd32309956e9ece6b040d898b280.csv", import.meta.url), mimeType: "text/csv", toString}]
  ]);
  main.builtin("FileAttachment", runtime.fileAttachments(name => fileAttachments.get(name)));
  main.variable(observer("data")).define("data", ["d3","FileAttachment"], _data);
  main.variable(observer("width")).define("width", _width);
  main.variable(observer("height")).define("height", _height);
  main.variable(observer("innerRadius")).define("innerRadius", _innerRadius);
  main.variable(observer("outerRadius")).define("outerRadius", ["width","height"], _outerRadius);
  main.variable(observer("x")).define("x", ["d3","data"], _x);
  main.variable(observer("y")).define("y", ["d3","data","innerRadius","outerRadius"], _y);
  main.variable(observer("z")).define("z", ["d3","data"], _z);
  main.variable(observer("xAxis")).define("xAxis", ["data","x","innerRadius"], _xAxis);
  main.variable(observer("yAxis")).define("yAxis", ["y"], _yAxis);
  main.variable(observer("legend")).define("legend", ["data","z"], _legend);
  main.variable(observer("arc")).define("arc", ["d3","y","x","innerRadius"], _arc);
  main.variable(observer("chart1")).define("chart1", ["d3","DOM","width","height","data","z","arc","xAxis","yAxis","legend"], _chart1);
  return main;
}
