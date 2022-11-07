import * as d3 from "https://cdn.skypack.dev/d3@7";
import axios from 'https://cdn.skypack.dev/axios';

// adatok lekerese a szervertol
const dataSet = async function getData() {
    return await axios.get('/api/data');
}

// drawPie: egymasba agyazott kordiagramok
// pData: adat n-esek
// pLabel: pLabel[i] a pData[j][i] -hez tartozo label minden pData[j]-hez
function drawPie(pData, pLabel, pGroups, pTitle) {  
  // vis1 stacked pie chart
  // height width meghatarozasa a parent objektumbol
  const svgWidth = Math.floor(d3.select("#vis1").node().getBoundingClientRect().width);
  const svgHeight = Math.floor(d3.select("#vis1").node().getBoundingClientRect().height);
  // svg letrehozasa, width height attributumok beallitasa
  let svg = d3.select("#vis1").append('svg')
  svg.attr("width", svgWidth)
      .attr("height", svgHeight);
  const offset = svg.attr("height") / 10;
  const width = svg.attr("width");
  const height = svg.attr("height") * 4 / 5 - offset; // mivel az also 1/5 a labelek helye lesz
  const radius = Math.min(width, height) / 2;
  const color = d3.scaleOrdinal(['#37E2D5', '#590696', '#C70A80'])

  var gTitle = svg.append('g')
  gTitle.append("text")
    .attr("x", width / 4)
    .attr("y",  20)
    .text(pTitle)
    .attr("font-family", "Verdana, sans-serif")
    .attr("font-size", "1.3em");
  const n = pLabel.length;

  for (let i = 0; i < n; i++) {
    const r = radius * (n-i) / n;
    const ri = radius * (n-i-1) / n;
    const opacity = 0.2 + 0.8 / n * (i+1);
    // egy pie chart letrehozasa
    var g = svg.append("g")
        .attr("transform", "translate(" + width / 2 + "," + (height / 2 + offset)  + ")");
    var data = pData[i];
    // Generate the pie
    var pie = d3.pie();

    // Generate the arcs
    var arc = d3.arc()
              .innerRadius(ri)
              .outerRadius(r);

    //Generate groups
    var arcs = g.selectAll("arc")
              .data(pie(data))
              .enter()
              .append("g")
              .attr("class", "arc")
              .attr("opacity", opacity)

    //Draw arc paths
    arcs.append("path")
      .attr("fill", function(d, i) {
          return color(i);
      })
      .attr("d", arc);

  }
 
  var gLabel = svg.append("g")
        .attr("transform", "translate(" + 0 + "," + (height + offset) + ")");
  const leftMargin = 20, topMargin = 0;
  for(let i = 0; i < pGroups.length; i++){
    gLabel.append("circle")
      .attr("cx", leftMargin)
      .attr("cy", topMargin + 10 + i*25)
      .attr("r", 10)
      .attr("fill", color(i));
      
    gLabel.append("text")
      .attr("x", leftMargin + 15)
      .attr("y", topMargin + 15 + i*25)
      .text(pGroups[i]);
  }




}

function drawBar(pData, pLabel, pGroups, pTitle){
  // vis2 vsBar chart
  // height width meghatarozasa a parent objektumbol
  const svgWidth = Math.floor(d3.select("#vis2").node().getBoundingClientRect().width);
  const svgHeight = Math.floor(d3.select("#vis2").node().getBoundingClientRect().height);
  // svg letrehozasa, width height attributumok beallitasa
  let svg = d3.select("#vis2").append('svg')
  svg.attr("width", svgWidth)
      .attr("height", svgHeight);
  const offset = svg.attr("height") / 5;
  const width = svg.attr("width");
  const height = svg.attr("height") - offset; // mivel az also 1/5 a labelek helye lesz
  const radius = Math.min(width, height) / 2;
  const color = d3.scaleOrdinal(['#37E2D5', '#590696', '#C70A80'])

  var gTitle = svg.append('g')
  gTitle.append("text")
    .attr("x", width / 10)
    .attr("y",  20)
    .text(pTitle)
    .attr("font-family", "Verdana, sans-serif")
    .attr("font-size", "1.1em");

  var gGroups = svg.append('g')
    .attr("transform", "translate(" + (width / 4) + "," + (offset / 2) + ")");
  const groupOffset = 20;
  gGroups.append("text")
    .attr("x", 0)
    .attr("y",  (groupOffset))
    .text(pGroups[0])
    .attr("font-family", "Verdana, sans-serif")
    .attr("font-size", "0.9em");
  gGroups.append("text")
    .attr("x", width - width / 4 - 160)
    .attr("y",  groupOffset)
    .text(pGroups[1])
    .attr("font-family", "Verdana, sans-serif")
    .attr("font-size", "0.9em");

  var gLabels = svg.append('g')
  .attr("transform", "translate(" + 0 + "," + offset + ")");
  var gBars = svg.append('g')
  .attr("transform", "translate(" + (width / 4) + "," + (offset + 30) + ")");
  
  const n = pLabel.length;
  const padding = 55;
  const barHeight = (height - n * padding) / n;
  const startPadding = 40;
  const barWidth = width - width / 4;
  for (let i = 0; i < n; i++) {
    gLabels.append("text")
      .attr("x", 30)
      .attr("y",  startPadding + 10 + (startPadding + i * barHeight + (i-1) * padding))
      .text(pLabel[i])
      .attr("font-family", "Verdana, sans-serif")
      .attr("font-size", "1em");
    const group1_percentage = pData[i][0] / (pData[i][0] + pData[i][1]);
    const group2_percentage = pData[i][1] / (pData[i][0] + pData[i][1]);
    const width1 = group1_percentage * barWidth;
    const width2 = group2_percentage * barWidth
    gBars.append('rect')
      .attr("x", 0)
      .attr("y", (startPadding + i * barHeight + (i-1) * padding))
      .attr("width", width1)
      .attr("height", barHeight)
      .attr("fill", color(0));
    gBars.append('rect')
      .attr("x", width1)
      .attr("y", (startPadding + i * barHeight + (i-1) * padding))
      .attr("width", width2)
      .attr("height", barHeight)
      .attr("fill", color(1));
    gBars.append('line')
    .attr("x1", width1)
    .attr("x2", width1)
    .attr("y1", (startPadding + i * barHeight + (i-1) * padding) - barHeight / 3)
    .attr("y2", (startPadding + i * barHeight + (i-1) * padding) + barHeight / 3 + barHeight)
    .attr("stroke", "black")
    .attr("stroke-width", 3)

    gBars.append('text')
    .attr("x", 10)
    .attr("y",  barHeight/2 + 5 + (startPadding + i * barHeight + (i-1) * padding))
    .text(Math.round(pData[i][0]) +'M')
    .attr("font-family", "Verdana, sans-serif")
    .attr("font-size", "0.9em");

    const textOffset = (Math.round(pData[i][1]) + 'M').length * 12
    console.log(textOffset)
    gBars.append('text')
    .attr("x", barWidth - textOffset)
    .attr("y",  barHeight/2 + 5 + (startPadding + i * barHeight + (i-1) * padding))
    .text(Math.round(pData[i][1]) +'M')
    .attr("font-family", "Verdana, sans-serif")
    .attr("font-size", "0.9em")
    .attr("fill", "white");
  }

}








async function drawChart() {
    const test = true;
    var ratingActors = [];
    var filmActors = [];
    var viewActors = [];
    if ( !test) {
        const actors = await dataSet();

        //rendezes rating szerint
        actors.data.sort((a, b) => (a.rating < b.rating) ? 1 : (a.rating === b.rating) ? ((a.views < b.views) ? 1 : -1) : -1 )
        ratingActors = [{"category": "Top 10", "views": 0},
                            {"category": "Top 25", "views": 0},
                            {"category": "Top 50", "views": 0},  
                            {"category": "Top 100", "views": 0}]
        for (let i = 0; i < 100; i++) {
            ratingActors[3].views += actors.data[i].views / 1000000;
            if ( i < 50 ) {
                ratingActors[2].views += actors.data[i].views / 1000000;
            }
            if ( i < 25 ) {
                ratingActors[1].views += actors.data[i].views / 1000000;
            }
            if ( i < 10 ) {
                ratingActors[0].views += actors.data[i].views / 1000000;
            }
        }

        //rendezes filmek szerint
        actors.data.sort((a, b) => (a.films < b.films) ? 1 : (a.films === b.films) ? ((a.views < b.views) ? 1 : -1) : -1 )
        filmActors = [{"category": "Top 10", "views": 0},
                            {"category": "Top 25", "views": 0},
                            {"category": "Top 50", "views": 0},  
                            {"category": "Top 100", "views": 0}]
        for (let i = 0; i < 100; i++) {
            filmActors[3].views += actors.data[i].views / 1000000;
            if ( i < 50 ) {
                filmActors[2].views += actors.data[i].views / 1000000;
            }
            if ( i < 25 ) {
                filmActors[1].views += actors.data[i].views / 1000000;
            }
            if ( i < 10 ) {
                filmActors[0].views += actors.data[i].views / 1000000;
            }
        }

        //rendezes nezettseg szerint
        actors.data.sort((a, b) => (a.views < b.views) ? 1 : -1 )
        viewActors = [{"category": "Top 10", "views": 0},
                            {"category": "Top 25", "views": 0},
                            {"category": "Top 50", "views": 0},  
                            {"category": "Top 100", "views": 0}]
        for (let i = 0; i < 100; i++) {
            viewActors[3].views += actors.data[i].views / 1000000;
            if ( i < 50 ) {
                viewActors[2].views += actors.data[i].views / 1000000;
            }
            if ( i < 25 ) {
                viewActors[1].views += actors.data[i].views / 1000000;
            }
            if ( i < 10 ) {
                viewActors[0].views += actors.data[i].views / 1000000;
            }
        }
    } else {
        viewActors = [
            {
              "category": "Top 10",
              "views": 186305.99619300003
            },
            {
              "category": "Top 25",
              "views": 372806.79438199993
            },
            {
              "category": "Top 50",
              "views": 634298.3219659998
            },
            {
              "category": "Top 100",
              "views": 1063524.911564
            }
          ]
    
        ratingActors = [
            {
              "category": "Top 10",
              "views": 70469.180058
            },
            {
              "category": "Top 25",
              "views": 136102.05294999998
            },
            {
              "category": "Top 50",
              "views": 256465.40880599996
            },
            {
              "category": "Top 100",
              "views": 459487.006636
            }
          ]
        filmActors = [
            {
              "category": "Top 10",
              "views": 119645.94846300001
            },
            {
              "category": "Top 25",
              "views": 237251.4977000001
            },
            {
              "category": "Top 50",
              "views": 380625.13186900015
            },
            {
              "category": "Top 100",
              "views": 645169.4473750001
            }
          ]
    }
    if ( test ){
        console.log(viewActors)
        console.log(ratingActors)
        console.log(filmActors)
    }
    var mergedData = [[3,1,2], [9,2,1], [3,9,2], [5,3,2]]
    var labels = ['egyescsop', 'kettescsop', 'harmascsop', 'negyescsop']
    var groups = ['fenegyerekek', 'gyilkosarcok', 'bulizobanditak']
    var title = "Halmozott hatranyok"
    drawPie(mergedData, labels, groups, title)

    var data2 = [[142,221], [178,322], [211,512], [1202,5243]]
    var labels2 = ['Top 10', 'Top 20', 'Top 50', 'Top 100']
    var groups2 = ['Jó értékelés', 'Sok filmben szerepés']
    var title2 = "Színészek nézettsége (kategóriákra bontva)"
    drawBar(data2, labels2, groups2, title2)


    
}

drawChart();