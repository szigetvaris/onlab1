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
    gBars.append('text')
    .attr("x", barWidth - textOffset)
    .attr("y",  barHeight/2 + 5 + (startPadding + i * barHeight + (i-1) * padding))
    .text(Math.round(pData[i][1]) +'M')
    .attr("font-family", "Verdana, sans-serif")
    .attr("font-size", "0.9em")
    .attr("fill", "white");
  }

}

function drawNetwork() {
   // height width meghatarozasa a parent objektumbol
   const svgWidth = Math.floor(d3.select("#vis3").node().getBoundingClientRect().width);
   const svgHeight = Math.floor(d3.select("#vis3").node().getBoundingClientRect().height);
   // svg letrehozasa, width height attributumok beallitasa
   let svg = d3.select("#vis3").append('svg')
   svg.attr("width", svgWidth)
       .attr("height", svgHeight)
  .append("g")
  .attr("transform",
        "translate(" + 0 + "," + 0 + ")");
  
  var data = {
    "nodes": [
      {
        "id": 1,
        "name": "3",
        "views": 45
      },
      {
        "id": 2,
        "name": "2",
        "views": 100
      },
      {
        "id": 3,
        "name": "23",
        "views": 83
      },
      {
        "id": 4,
        "name": "1",
        "views": 21
      },
      {
        "id": 5,
        "name": "13",
        "views": 232
      },
      {
        "id": 6,
        "name": "12",
        "views": 123
      },
      {
        "id": 7,
        "name": "123",
        "views": 452
      }
    ],
    "links": [
  
      {
        "source": 1,
        "target": 3
      },
      {
        "source": 1,
        "target": 5
      },
      {
        "source": 1,
        "target": 7
      },
  
      {
        "source": 2,
        "target": 3
      },
              {
        "source": 2,
        "target": 7
      }
      ,
  
      {
        "source": 2,
        "target": 6
      },
       {
        "source": 4,
        "target": 5
      }
      ,
      {
        "source": 4,
        "target": 6
      }
      ,
  
      {
        "source": 4,
        "target": 7
      }
    ]
  }
  const naturalColor = '#69b3a2';
  const color = ['#37E2D5', '#590696', '#4874b6', '#C70A80', '#7f76ab', '#90088b', '#7251a4']

  var radiuses = []
  for (let i = 0; i < data.nodes.length; i++){
    radiuses.push(data.nodes[i].views)
  }
  const scale = d3.scaleLinear()
                  .domain([d3.min(radiuses), d3.max(radiuses)])
                  .range([d3.min([svgWidth, svgHeight]) / 20, d3.min([svgWidth, svgHeight]) / 7]);
//d3.json("https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/data_network.json").then(function( data) {
  // Initialize the links
  var link = svg
    .selectAll("line")
    .data(data.links)
    .enter()
    .append("line")
      .style("stroke", d => color[d.source-1])
      .attr("stroke-width", 2)
  // Initialize the nodes
  var node = svg
    .selectAll("circle")
    .data(data.nodes)
    .enter()
    .append("circle")
      .attr("r", d => scale(d.views))
      .style("fill", d => color[d.id-1])

  // Let's list the force we wanna apply on the network
  var simulation = d3.forceSimulation(data.nodes)                 // Force algorithm is applied to data.nodes
      .force("link", d3.forceLink()                               // This force provides links between nodes
            .id(function(d) { return d.id; })                     // This provide  the id of a node
            .links(data.links)                                    // and this the list of links
      )
      .force("charge", d3.forceManyBody().strength(-1200))         // This adds repulsion between nodes. Play with the -400 for the repulsion strength
      .force("center", d3.forceCenter(svgWidth / 2, svgHeight / 2))     // This force attracts nodes to the center of the svg area
      .on("end", ticked);

  // This function is run at each iteration of the force algorithm, updating the nodes position.
  function ticked() {
    link
        .attr("x1", function(d) { return d.source.x; })
        .attr("y1", function(d) { return d.source.y; })
        .attr("x2", function(d) { return d.target.x; })
        .attr("y2", function(d) { return d.target.y; });

    node
         .attr("cx", function (d) { return d.x+6; })
         .attr("cy", function(d) { return d.y-6; })
         .attr("x", function (d) { return d.x+6; })
         .attr("y", function(d) { return d.y-6; });
         
  }
//});
}


function drawNums(pActor) {
  // height width meghatarozasa a parent objektumbol
  d3.select("#vis4").selectAll("*").remove();
  const svgWidth = Math.floor(d3.select("#vis4").node().getBoundingClientRect().width);
  const svgHeight = Math.floor(d3.select("#vis4").node().getBoundingClientRect().height);
  //svg letrehozasa, width height attributumok beallitasa
  let svg = d3.select("#vis4").append('svg')
  svg.attr("width", svgWidth)
     .attr("height", svgHeight)

  const size1 = "2em", size2 = "3em", size3 = "1.2em";
  const offset = 30;
  svg.append('text')
    .attr("x", svgWidth / 12 )
    .attr("y", svgHeight / 2 )
    .text(pActor.actor)
    .attr("fill", "#590696")
    .attr("font-family", "Verdana, monospace")
    .attr("font-weight", "bold")
    .attr("font-size", size1);

  svg.append('text')
    .attr("x", svgWidth * 4 / 10 )
    .attr("y", svgHeight / 2 )
    .text(Math.round(pActor.rating * 100) / 100)
    .attr("fill", "#C70A80")
    .attr("font-family", "Verdana, monospace")
    .attr("font-weight", "bold")
    .attr("font-size", size2);
  svg.append('text')
    .attr("x", svgWidth * 4 / 10 + 5 )
    .attr("y", svgHeight / 2 + offset)
    .text("Értékelés")
    .attr("fill", "#590696")
    .attr("font-family", "Verdana, monospace")
    .attr("font-weight", "bold")
    .attr("font-size", size3);

  svg.append('text')
    .attr("x", svgWidth * 6 / 10 )
    .attr("y", svgHeight / 2 )
    .text(pActor.films)
    .attr("fill", "#C70A80")
    .attr("font-family", "Verdana, monospace")
    .attr("font-weight", "bold")
    .attr("font-size", size2);
  svg.append('text')
    .attr("x", svgWidth * 6 / 10 + 5 )
    .attr("y", svgHeight / 2 + offset)
    .text("Film")
    .attr("fill", "#590696")
    .attr("font-family", "Verdana, monospace")
    .attr("font-weight", "bold")
    .attr("font-size", size3);

  // nezettseg kiszamolasa
  const views = pActor.views;
  var formattedViews = "";
  if (views / 1000000 < 1000) {
    formattedViews = Math.round(views * 10 / 1000000) / 10 + "M";
  }
  else {
    formattedViews = Math.round(views * 10 / 1000000000) / 10 + "Md";
  }
  svg.append('text')
    .attr("x", svgWidth * 8 / 10 )
    .attr("y", svgHeight / 2 )
    .text(formattedViews)
    .attr("fill", "#C70A80")
    .attr("font-family", "Verdana, monospace")
    .attr("font-weight", "bold")
    .attr("font-size", size2);
  svg.append('text')
    .attr("x", svgWidth * 8 / 10 )
    .attr("y", svgHeight / 2 + offset)
    .text("Nézettség")
    .attr("fill", "#590696")
    .attr("font-family", "Verdana, monospace")
    .attr("font-weight", "bold")
    .attr("font-size", size3);

}

function initNums (pActors) {
  var options = [];
  for ( let i = 0; i < pActors.length; i++) {
    options.push(pActors[i].actor)
  }
  
  var select = d3.select("#div5")
    .append("select");
    
  select
    .on("change", function(d) {
      var value = d3.select(this).property("value");
      var sActor = {};
      for ( let i = 0; i < pActors.length; i++) {
        if ( value == pActors[i].actor) {
          sActor = pActors[i]
        }
      }
      drawNums(sActor)
    });
  
  select.selectAll("option")
    .data(options)
    .enter()
    .append("option")
    .attr("value", function(d) {
      return d;
    })
    .text(function(d) {
      return d;
    });


  // height width meghatarozasa a parent objektumbol
  // const svgWidth = Math.floor(d3.select("#vis2").node().getBoundingClientRect().width);
  // const svgHeight = Math.floor(d3.select("#vis2").node().getBoundingClientRect().height);
  // // svg letrehozasa, width height attributumok beallitasa
  // let svg = d3.select("#vis4").append('svg')
  // svg.attr("width", svgWidth)
  //     .attr("height", svgHeight);
}






async function drawChart() {
    const test = true;
    var ratingActors = [];
    var filmActors = [];
    var viewActors = [];
    var actors_list = [];
    if ( !test) {
        const actors = await dataSet();
        actors_list = actors.data;
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
        actors_list = [
          {
            "actor": "Stan Lee",
            "actorID": "nm0498278",
            "films": 38,
            "rating": 7.144736842105263,
            "views": 29771041808
          },
          {
            "actor": "Samuel L. Jackson",
            "actorID": "nm0000168",
            "films": 95,
            "rating": 6.75684210526316,
            "views": 27214520458
          },
          {
            "actor": "Frank Welker",
            "actorID": "nm0919798",
            "films": 103,
            "rating": 6.200000000000003,
            "views": 22142529114
          },
          {
            "actor": "Jess Harnell",
            "actorID": "nm0363641",
            "films": 41,
            "rating": 6.421951219512195,
            "views": 18162090895
          },
          {
            "actor": "Scarlett Johansson",
            "actorID": "nm0424060",
            "films": 50,
            "rating": 6.797999999999998,
            "views": 15821422374
          },
          {
            "actor": "John Ratzenberger",
            "actorID": "nm0001652",
            "films": 38,
            "rating": 7.144736842105265,
            "views": 15656146588
          },
          {
            "actor": "Robert Downey Jr.",
            "actorID": "nm0000375",
            "films": 59,
            "rating": 6.693220338983053,
            "views": 15442236518
          },
          {
            "actor": "Chris Evans",
            "actorID": "nm0262635",
            "films": 30,
            "rating": 6.889999999999997,
            "views": 14427641822
          },
          {
            "actor": "Vin Diesel",
            "actorID": "nm0004874",
            "films": 28,
            "rating": 6.860714285714286,
            "views": 13890900097
          },
          {
            "actor": "Laraine Newman",
            "actorID": "nm0628170",
            "films": 35,
            "rating": 6.494285714285714,
            "views": 13777466519
          },
          {
            "actor": "Alan Tudyk",
            "actorID": "nm0876138",
            "films": 31,
            "rating": 7.025806451612905,
            "views": 13606534026
          },
          {
            "actor": "Don Cheadle",
            "actorID": "nm0000332",
            "films": 37,
            "rating": 6.937837837837837,
            "views": 13403003160
          },
          {
            "actor": "Mark Ruffalo",
            "actorID": "nm0749263",
            "films": 38,
            "rating": 6.881578947368421,
            "views": 13311509677
          },
          {
            "actor": "Warwick Davis",
            "actorID": "nm0001116",
            "films": 22,
            "rating": 7.059090909090911,
            "views": 13225542387
          },
          {
            "actor": "Terry Notary",
            "actorID": "nm1024953",
            "films": 13,
            "rating": 7.515384615384615,
            "views": 13071654133
          },
          {
            "actor": "Chris Hemsworth",
            "actorID": "nm1165110",
            "films": 22,
            "rating": 6.945454545454544,
            "views": 12384635729
          },
          {
            "actor": "Jon Favreau",
            "actorID": "nm0269463",
            "films": 37,
            "rating": 6.591891891891891,
            "views": 12382496991
          },
          {
            "actor": "Scott Menville",
            "actorID": "nm0579914",
            "films": 35,
            "rating": 6.645714285714287,
            "views": 12266073762
          },
          {
            "actor": "Cate Blanchett",
            "actorID": "nm0000949",
            "films": 45,
            "rating": 7.0666666666666655,
            "views": 12126664496
          },
          {
            "actor": "Dwayne Johnson",
            "actorID": "nm0425005",
            "films": 37,
            "rating": 6.1567567567567565,
            "views": 12037736612
          },
          {
            "actor": "Gwyneth Paltrow",
            "actorID": "nm0000569",
            "films": 42,
            "rating": 6.659523809523809,
            "views": 11997399596
          },
          {
            "actor": "Tom Hanks",
            "actorID": "nm0000158",
            "films": 51,
            "rating": 6.962745098039214,
            "views": 11789503950
          },
          {
            "actor": "Benedict Cumberbatch",
            "actorID": "nm1212722",
            "films": 23,
            "rating": 7.282608695652174,
            "views": 11725590353
          },
          {
            "actor": "Chris Pratt",
            "actorID": "nm0695435",
            "films": 25,
            "rating": 6.688000000000001,
            "views": 11694602304
          },
          {
            "actor": "Bradley Cooper",
            "actorID": "nm0177896",
            "films": 35,
            "rating": 6.674285714285714,
            "views": 11477851013
          },
          {
            "actor": "Liam Neeson",
            "actorID": "nm0000553",
            "films": 70,
            "rating": 6.591428571428571,
            "views": 11264626775
          },
          {
            "actor": "Idris Elba",
            "actorID": "nm0252961",
            "films": 31,
            "rating": 6.496774193548389,
            "views": 11229096331
          },
          {
            "actor": "Paul Bettany",
            "actorID": "nm0079273",
            "films": 28,
            "rating": 6.875,
            "views": 11047685244
          },
          {
            "actor": "Andy Serkis",
            "actorID": "nm0785227",
            "films": 19,
            "rating": 7.431578947368422,
            "views": 10966482847
          },
          {
            "actor": "Fred Tatasciore",
            "actorID": "nm0851317",
            "films": 35,
            "rating": 6.445714285714285,
            "views": 10943610813
          },
          {
            "actor": "Morgan Freeman",
            "actorID": "nm0000151",
            "films": 66,
            "rating": 6.772727272727271,
            "views": 10874410858
          },
          {
            "actor": "Zoe Saldana",
            "actorID": "nm0757855",
            "films": 24,
            "rating": 6.720833333333332,
            "views": 10828870352
          },
          {
            "actor": "Gary Oldman",
            "actorID": "nm0000198",
            "films": 44,
            "rating": 6.8977272727272725,
            "views": 10787229477
          },
          {
            "actor": "Anthony Mackie",
            "actorID": "nm1107001",
            "films": 36,
            "rating": 6.747222222222221,
            "views": 10687033298
          },
          {
            "actor": "Tom Cruise",
            "actorID": "nm0000129",
            "films": 42,
            "rating": 6.804761904761904,
            "views": 10655778727
          },
          {
            "actor": "Alan Rickman",
            "actorID": "nm0000614",
            "films": 32,
            "rating": 7.10625,
            "views": 10648672607
          },
          {
            "actor": "Cobie Smulders",
            "actorID": "nm1130627",
            "films": 12,
            "rating": 7.258333333333334,
            "views": 10644287288
          },
          {
            "actor": "Josh Brolin",
            "actorID": "nm0000982",
            "films": 34,
            "rating": 6.852941176470589,
            "views": 10443990970
          },
          {
            "actor": "Ian McKellen",
            "actorID": "nm0005212",
            "films": 28,
            "rating": 7.067857142857142,
            "views": 10364958164
          },
          {
            "actor": "Jeremy Renner",
            "actorID": "nm0719637",
            "films": 26,
            "rating": 6.999999999999999,
            "views": 10358476383
          },
          {
            "actor": "Matt Damon",
            "actorID": "nm0000354",
            "films": 59,
            "rating": 6.937288135593221,
            "views": 10287876226
          },
          {
            "actor": "Hugo Weaving",
            "actorID": "nm0915989",
            "films": 21,
            "rating": 7.290476190476191,
            "views": 10279443615
          },
          {
            "actor": "Bill Hader",
            "actorID": "nm0352778",
            "films": 36,
            "rating": 6.650000000000001,
            "views": 10272654252
          },
          {
            "actor": "Robbie Coltrane",
            "actorID": "nm0001059",
            "films": 31,
            "rating": 6.748387096774193,
            "views": 10110786945
          },
          {
            "actor": "Emma Watson",
            "actorID": "nm0914612",
            "films": 18,
            "rating": 7.011111111111111,
            "views": 9976651320
          },
          {
            "actor": "Sebastian Stan",
            "actorID": "nm1659221",
            "films": 20,
            "rating": 6.7700000000000005,
            "views": 9852539076
          },
          {
            "actor": "J.K. Simmons",
            "actorID": "nm0799777",
            "films": 52,
            "rating": 6.628846153846154,
            "views": 9847587583
          },
          {
            "actor": "Julie Walters",
            "actorID": "nm0910278",
            "films": 28,
            "rating": 7.042857142857144,
            "views": 9821176859
          },
          {
            "actor": "Stanley Tucci",
            "actorID": "nm0001804",
            "films": 58,
            "rating": 6.412068965517242,
            "views": 9664001668
          },
          {
            "actor": "Robin Atkin Downes",
            "actorID": "nm0235960",
            "films": 25,
            "rating": 6.531999999999999,
            "views": 9633599906
          },
          {
            "actor": "Ken Jeong",
            "actorID": "nm0421822",
            "films": 27,
            "rating": 6.192592592592596,
            "views": 9520558362
          },
          {
            "actor": "Jim Cummings",
            "actorID": "nm0191906",
            "films": 36,
            "rating": 6.655555555555555,
            "views": 9502450459
          },
          {
            "actor": "Tom Hiddleston",
            "actorID": "nm1089991",
            "films": 16,
            "rating": 6.99375,
            "views": 9435157194
          },
          {
            "actor": "Willem Dafoe",
            "actorID": "nm0000353",
            "films": 63,
            "rating": 6.807936507936509,
            "views": 9424675113
          },
          {
            "actor": "Ralph Fiennes",
            "actorID": "nm0000146",
            "films": 38,
            "rating": 6.8657894736842096,
            "views": 9391667280
          },
          {
            "actor": "Will Smith",
            "actorID": "nm0000226",
            "films": 30,
            "rating": 6.423333333333334,
            "views": 9363186028
          },
          {
            "actor": "Christopher Lee",
            "actorID": "nm0000489",
            "films": 21,
            "rating": 6.780952380952381,
            "views": 9341041254
          },
          {
            "actor": "Helena Bonham Carter",
            "actorID": "nm0000307",
            "films": 32,
            "rating": 6.946875,
            "views": 9305466371
          },
          {
            "actor": "Bruce Willis",
            "actorID": "nm0000246",
            "films": 71,
            "rating": 6.429577464788729,
            "views": 9276128981
          },
          {
            "actor": "Timothy Spall",
            "actorID": "nm0001758",
            "films": 36,
            "rating": 6.922222222222222,
            "views": 9275502423
          },
          {
            "actor": "John DiMaggio",
            "actorID": "nm0224007",
            "films": 23,
            "rating": 6.443478260869565,
            "views": 9270711737
          },
          {
            "actor": "Johnny Depp",
            "actorID": "nm0000136",
            "films": 51,
            "rating": 6.629411764705882,
            "views": 9224466586
          },
          {
            "actor": "James Earl Jones",
            "actorID": "nm0000469",
            "films": 33,
            "rating": 6.681818181818182,
            "views": 9149745751
          },
          {
            "actor": "Tara Strong",
            "actorID": "nm0152839",
            "films": 24,
            "rating": 6.55,
            "views": 8867396505
          },
          {
            "actor": "Tom Holland",
            "actorID": "nm4043618",
            "films": 13,
            "rating": 7.292307692307691,
            "views": 8865431687
          },
          {
            "actor": "Michelle Rodriguez",
            "actorID": "nm0735442",
            "films": 20,
            "rating": 6.249999999999999,
            "views": 8800193090
          },
          {
            "actor": "Maggie Smith",
            "actorID": "nm0001749",
            "films": 32,
            "rating": 6.931250000000001,
            "views": 8783993397
          },
          {
            "actor": "Jason Isaacs",
            "actorID": "nm0005042",
            "films": 32,
            "rating": 6.703124999999998,
            "views": 8758442454
          },
          {
            "actor": "John Goodman",
            "actorID": "nm0000422",
            "films": 73,
            "rating": 6.3972602739726,
            "views": 8751494905
          },
          {
            "actor": "Michael Caine",
            "actorID": "nm0000323",
            "films": 54,
            "rating": 6.781481481481482,
            "views": 8738660964
          },
          {
            "actor": "Elizabeth Olsen",
            "actorID": "nm0647634",
            "films": 15,
            "rating": 6.92,
            "views": 8729395637
          },
          {
            "actor": "Michael Gambon",
            "actorID": "nm0002091",
            "films": 40,
            "rating": 6.910000000000002,
            "views": 8651274063
          },
          {
            "actor": "Elizabeth Banks",
            "actorID": "nm0006969",
            "films": 40,
            "rating": 6.455000000000001,
            "views": 8628189898
          },
          {
            "actor": "Karen Gillan",
            "actorID": "nm2394794",
            "films": 12,
            "rating": 7.041666666666667,
            "views": 8607685391
          },
          {
            "actor": "Tom Felton",
            "actorID": "nm0271657",
            "films": 19,
            "rating": 6.963157894736843,
            "views": 8591333658
          },
          {
            "actor": "Kerry Condon",
            "actorID": "nm0174403",
            "films": 12,
            "rating": 7.349999999999999,
            "views": 8534594010
          },
          {
            "actor": "Emma Thompson",
            "actorID": "nm0000668",
            "films": 42,
            "rating": 6.821428571428568,
            "views": 8525971180
          },
          {
            "actor": "William Hurt",
            "actorID": "nm0000458",
            "films": 39,
            "rating": 6.912820512820512,
            "views": 8492736179
          },
          {
            "actor": "Daniel Radcliffe",
            "actorID": "nm0705356",
            "films": 17,
            "rating": 7.03529411764706,
            "views": 8462702248
          },
          {
            "actor": "Luke Evans",
            "actorID": "nm1812656",
            "films": 18,
            "rating": 6.461111111111111,
            "views": 8429833580
          },
          {
            "actor": "Stellan Skarsgard",
            "actorID": "nm0001745",
            "films": 32,
            "rating": 6.9687500000000036,
            "views": 8386667696
          },
          {
            "actor": "Woody Harrelson",
            "actorID": "nm0000437",
            "films": 48,
            "rating": 6.674999999999998,
            "views": 8371130191
          },
          {
            "actor": "Bonnie Hunt",
            "actorID": "nm0001372",
            "films": 23,
            "rating": 6.8260869565217375,
            "views": 8257186070
          },
          {
            "actor": "Natalie Portman",
            "actorID": "nm0000204",
            "films": 35,
            "rating": 6.779999999999998,
            "views": 8200834318
          },
          {
            "actor": "Djimon Hounsou",
            "actorID": "nm0005023",
            "films": 30,
            "rating": 6.576666666666666,
            "views": 8154937265
          },
          {
            "actor": "Brad Pitt",
            "actorID": "nm0000093",
            "films": 48,
            "rating": 7.012499999999997,
            "views": 8108825299
          },
          {
            "actor": "Marisa Tomei",
            "actorID": "nm0000673",
            "films": 33,
            "rating": 6.709090909090909,
            "views": 8098707486
          },
          {
            "actor": "Toby Jones",
            "actorID": "nm0429363",
            "films": 38,
            "rating": 6.744736842105263,
            "views": 8094790090
          },
          {
            "actor": "Bryce Dallas Howard",
            "actorID": "nm0397171",
            "films": 20,
            "rating": 6.705000000000001,
            "views": 8066796931
          },
          {
            "actor": "Jack Black",
            "actorID": "nm0085312",
            "films": 46,
            "rating": 6.3673913043478265,
            "views": 8007268612
          },
          {
            "actor": "David Thewlis",
            "actorID": "nm0000667",
            "films": 38,
            "rating": 6.802631578947368,
            "views": 7945726563
          },
          {
            "actor": "Steve Buscemi",
            "actorID": "nm0000114",
            "films": 68,
            "rating": 6.617647058823529,
            "views": 7936288176
          },
          {
            "actor": "Ewan McGregor",
            "actorID": "nm0000191",
            "films": 48,
            "rating": 6.664583333333332,
            "views": 7935614427
          },
          {
            "actor": "Paul Rudd",
            "actorID": "nm0748620",
            "films": 32,
            "rating": 6.60625,
            "views": 7924429047
          },
          {
            "actor": "Geraldine Somerville",
            "actorID": "nm0813893",
            "films": 13,
            "rating": 7.361538461538462,
            "views": 7908881751
          },
          {
            "actor": "Seth Rogen",
            "actorID": "nm0736622",
            "films": 36,
            "rating": 6.686111111111111,
            "views": 7889610655
          },
          {
            "actor": "Orlando Bloom",
            "actorID": "nm0089217",
            "films": 15,
            "rating": 7.280000000000001,
            "views": 7869775744
          },
          {
            "actor": "Jason Statham",
            "actorID": "nm0005458",
            "films": 38,
            "rating": 6.413157894736844,
            "views": 7800208810
          },
          {
            "actor": "Dave Bautista",
            "actorID": "nm1176985",
            "films": 10,
            "rating": 7.130000000000001,
            "views": 7787571686
          },
          {
            "actor": "Rupert Grint",
            "actorID": "nm0342488",
            "films": 11,
            "rating": 7.445454545454546,
            "views": 7781252396
          },
          {
            "actor": "Harrison Ford",
            "actorID": "nm0000148",
            "films": 38,
            "rating": 6.736842105263159,
            "views": 7780498852
          },
          {
            "actor": "Angela Bassett",
            "actorID": "nm0000291",
            "films": 33,
            "rating": 6.593939393939394,
            "views": 7769381395
          },
          {
            "actor": "Chadwick Boseman",
            "actorID": "nm1569276",
            "films": 10,
            "rating": 7.31,
            "views": 7678146226
          },
          {
            "actor": "Kristen Wiig",
            "actorID": "nm1325419",
            "films": 33,
            "rating": 6.633333333333335,
            "views": 7672031798
          },
          {
            "actor": "Brendan Gleeson",
            "actorID": "nm0322407",
            "films": 43,
            "rating": 6.937209302325578,
            "views": 7662565104
          },
          {
            "actor": "John Cleese",
            "actorID": "nm0000092",
            "films": 40,
            "rating": 6.254999999999999,
            "views": 7610014327
          },
          {
            "actor": "Mark Williams",
            "actorID": "nm0931247",
            "films": 12,
            "rating": 7.191666666666667,
            "views": 7594398496
          },
          {
            "actor": "Owen Wilson",
            "actorID": "nm0005562",
            "films": 46,
            "rating": 6.308695652173914,
            "views": 7501399644
          },
          {
            "actor": "Tyrese Gibson",
            "actorID": "nm0879085",
            "films": 14,
            "rating": 6.421428571428571,
            "views": 7497642624
          },
          {
            "actor": "Alec Baldwin",
            "actorID": "nm0000285",
            "films": 57,
            "rating": 6.46140350877193,
            "views": 7492274456
          },
          {
            "actor": "Leonardo DiCaprio",
            "actorID": "nm0000138",
            "films": 27,
            "rating": 7.340740740740741,
            "views": 7441928054
          },
          {
            "actor": "Brad Garrett",
            "actorID": "nm0004951",
            "films": 27,
            "rating": 6.292592592592592,
            "views": 7439704616
          },
          {
            "actor": "Phil LaMarr",
            "actorID": "nm0482851",
            "films": 14,
            "rating": 6.528571428571429,
            "views": 7412853286
          },
          {
            "actor": "Cameron Diaz",
            "actorID": "nm0000139",
            "films": 36,
            "rating": 6.358333333333334,
            "views": 7410434797
          },
          {
            "actor": "Ciaran Hinds",
            "actorID": "nm0001354",
            "films": 36,
            "rating": 6.68611111111111,
            "views": 7373758445
          },
          {
            "actor": "Jim Broadbent",
            "actorID": "nm0000980",
            "films": 50,
            "rating": 6.713999999999999,
            "views": 7330807361
          },
          {
            "actor": "Benedict Wong",
            "actorID": "nm0938950",
            "films": 15,
            "rating": 7.093333333333333,
            "views": 7209667449
          },
          {
            "actor": "Jeff Goldblum",
            "actorID": "nm0000156",
            "films": 36,
            "rating": 6.488888888888888,
            "views": 7194642086
          },
          {
            "actor": "Michelle Pfeiffer",
            "actorID": "nm0000201",
            "films": 41,
            "rating": 6.621951219512193,
            "views": 7116286000
          },
          {
            "actor": "Ben Stiller",
            "actorID": "nm0001774",
            "films": 47,
            "rating": 6.329787234042553,
            "views": 7109204912
          },
          {
            "actor": "Steve Carell",
            "actorID": "nm0136797",
            "films": 34,
            "rating": 6.597058823529413,
            "views": 7083557790
          },
          {
            "actor": "Robert De Niro",
            "actorID": "nm0000134",
            "films": 72,
            "rating": 6.761111111111109,
            "views": 7057514240
          },
          {
            "actor": "Frank Oz",
            "actorID": "nm0000568",
            "films": 25,
            "rating": 7.008000000000001,
            "views": 7044675353
          },
          {
            "actor": "Debra Wilson",
            "actorID": "nm0933281",
            "films": 14,
            "rating": 6.221428571428572,
            "views": 7035425467
          },
          {
            "actor": "Monique Ganderton",
            "actorID": "nm1244650",
            "films": 10,
            "rating": 6.42,
            "views": 6986308939
          },
          {
            "actor": "Eddie Murphy",
            "actorID": "nm0000552",
            "films": 36,
            "rating": 5.941666666666667,
            "views": 6977438826
          },
          {
            "actor": "Ty Simpkins",
            "actorID": "nm1339223",
            "films": 12,
            "rating": 7.016666666666666,
            "views": 6968304345
          },
          {
            "actor": "Judi Dench",
            "actorID": "nm0001132",
            "films": 38,
            "rating": 6.894736842105262,
            "views": 6950187908
          },
          {
            "actor": "David Bradley",
            "actorID": "nm0103195",
            "films": 13,
            "rating": 7.423076923076922,
            "views": 6942919313
          },
          {
            "actor": "Sigourney Weaver",
            "actorID": "nm0000244",
            "films": 40,
            "rating": 6.57,
            "views": 6923470823
          },
          {
            "actor": "Imelda Staunton",
            "actorID": "nm0001767",
            "films": 19,
            "rating": 7.178947368421052,
            "views": 6858438864
          },
          {
            "actor": "Gal Gadot",
            "actorID": "nm2933757",
            "films": 14,
            "rating": 6.528571428571427,
            "views": 6846928273
          },
          {
            "actor": "Michael Douglas",
            "actorID": "nm0000140",
            "films": 32,
            "rating": 6.612499999999999,
            "views": 6844794121
          },
          {
            "actor": "Kevin Hart",
            "actorID": "nm0366389",
            "films": 31,
            "rating": 5.9161290322580635,
            "views": 6787081714
          },
          {
            "actor": "Allison Janney",
            "actorID": "nm0005049",
            "films": 40,
            "rating": 6.695,
            "views": 6785259929
          },
          {
            "actor": "Josh Gad",
            "actorID": "nm1265802",
            "films": 20,
            "rating": 6.6450000000000005,
            "views": 6761608715
          },
          {
            "actor": "Keegan-Michael Key",
            "actorID": "nm1221047",
            "films": 23,
            "rating": 6.395652173913044,
            "views": 6731168561
          },
          {
            "actor": "Hugh Jackman",
            "actorID": "nm0413168",
            "films": 29,
            "rating": 6.872413793103448,
            "views": 6702220189
          },
          {
            "actor": "Peter Jackson",
            "actorID": "nm0001392",
            "films": 12,
            "rating": 7.749999999999999,
            "views": 6698789151
          },
          {
            "actor": "Jonah Hill",
            "actorID": "nm1706767",
            "films": 36,
            "rating": 6.761111111111113,
            "views": 6698394940
          },
          {
            "actor": "John Slattery",
            "actorID": "nm0805476",
            "films": 19,
            "rating": 6.826315789473682,
            "views": 6609460773
          },
          {
            "actor": "Robin Williams",
            "actorID": "nm0000245",
            "films": 53,
            "rating": 6.488679245283022,
            "views": 6592677464
          },
          {
            "actor": "Sean Bean",
            "actorID": "nm0000293",
            "films": 29,
            "rating": 6.7793103448275875,
            "views": 6590051124
          },
          {
            "actor": "Laurence Fishburne",
            "actorID": "nm0000401",
            "films": 51,
            "rating": 6.6647058823529415,
            "views": 6585899150
          },
          {
            "actor": "Tilda Swinton",
            "actorID": "nm0842770",
            "films": 36,
            "rating": 6.894444444444444,
            "views": 6573920250
          },
          {
            "actor": "Kurt Russell",
            "actorID": "nm0000621",
            "films": 36,
            "rating": 6.769444444444445,
            "views": 6542958822
          },
          {
            "actor": "Ving Rhames",
            "actorID": "nm0000609",
            "films": 38,
            "rating": 6.547368421052633,
            "views": 6520372419
          },
          {
            "actor": "Evangeline Lilly",
            "actorID": "nm1431940",
            "films": 10,
            "rating": 6.92,
            "views": 6494474040
          },
          {
            "actor": "Steve Coogan",
            "actorID": "nm0176869",
            "films": 25,
            "rating": 6.568000000000001,
            "views": 6486110830
          },
          {
            "actor": "Mark Wahlberg",
            "actorID": "nm0000242",
            "films": 42,
            "rating": 6.576190476190476,
            "views": 6455872126
          },
          {
            "actor": "Simon Pegg",
            "actorID": "nm0670408",
            "films": 22,
            "rating": 6.909090909090909,
            "views": 6444898159
          },
          {
            "actor": "Anthony Hopkins",
            "actorID": "nm0000164",
            "films": 46,
            "rating": 6.6739130434782625,
            "views": 6422201668
          },
          {
            "actor": "T.J. Miller",
            "actorID": "nm2554352",
            "films": 20,
            "rating": 6.425,
            "views": 6408465876
          },
          {
            "actor": "Anne Hathaway",
            "actorID": "nm0004266",
            "films": 27,
            "rating": 6.566666666666669,
            "views": 6362074088
          },
          {
            "actor": "Michael Keaton",
            "actorID": "nm0000474",
            "films": 37,
            "rating": 6.529729729729729,
            "views": 6357504077
          },
          {
            "actor": "Ben Mendelsohn",
            "actorID": "nm0578853",
            "films": 28,
            "rating": 6.678571428571429,
            "views": 6349230963
          },
          {
            "actor": "Dee Bradley Baker",
            "actorID": "nm0048389",
            "films": 28,
            "rating": 6.360714285714286,
            "views": 6342310295
          },
          {
            "actor": "Lee Pace",
            "actorID": "nm1195855",
            "films": 15,
            "rating": 7.106666666666666,
            "views": 6334471669
          },
          {
            "actor": "Glenn Morshower",
            "actorID": "nm0607703",
            "films": 26,
            "rating": 6.353846153846154,
            "views": 6302606351
          },
          {
            "actor": "Julia Roberts",
            "actorID": "nm0000210",
            "films": 44,
            "rating": 6.381818181818182,
            "views": 6298014007
          },
          {
            "actor": "Hayley Atwell",
            "actorID": "nm2017943",
            "films": 12,
            "rating": 7.125000000000001,
            "views": 6285309139
          },
          {
            "actor": "Angelina Jolie",
            "actorID": "nm0001401",
            "films": 31,
            "rating": 6.3032258064516125,
            "views": 6273442530
          },
          {
            "actor": "Paul Giamatti",
            "actorID": "nm0316079",
            "films": 52,
            "rating": 6.661538461538462,
            "views": 6270221840
          },
          {
            "actor": "Judy Greer",
            "actorID": "nm0339460",
            "films": 31,
            "rating": 6.374193548387097,
            "views": 6267237920
          },
          {
            "actor": "James Cromwell",
            "actorID": "nm0000342",
            "films": 37,
            "rating": 6.505405405405406,
            "views": 6258606091
          },
          {
            "actor": "Ian Holm",
            "actorID": "nm0000453",
            "films": 31,
            "rating": 7.154838709677419,
            "views": 6258291911
          },
          {
            "actor": "Ben Affleck",
            "actorID": "nm0000255",
            "films": 42,
            "rating": 6.4833333333333325,
            "views": 6234259488
          },
          {
            "actor": "Elijah Wood",
            "actorID": "nm0000704",
            "films": 33,
            "rating": 6.872727272727274,
            "views": 6228278558
          },
          {
            "actor": "Marton Csokas",
            "actorID": "nm0190744",
            "films": 20,
            "rating": 6.55,
            "views": 6135747409
          },
          {
            "actor": "Martin Freeman",
            "actorID": "nm0293509",
            "films": 16,
            "rating": 7.13125,
            "views": 6131843106
          },
          {
            "actor": "Patrick Stewart",
            "actorID": "nm0001772",
            "films": 33,
            "rating": 6.4878787878787865,
            "views": 6101807164
          },
          {
            "actor": "Chris Ellis",
            "actorID": "nm0254760",
            "films": 30,
            "rating": 6.633333333333332,
            "views": 6090042460
          },
          {
            "actor": "Rene Russo",
            "actorID": "nm0000623",
            "films": 23,
            "rating": 6.504347826086956,
            "views": 6059273949
          },
          {
            "actor": "Julie Andrews",
            "actorID": "nm0000267",
            "films": 17,
            "rating": 6.352941176470587,
            "views": 6047675965
          },
          {
            "actor": "Jennifer Lawrence",
            "actorID": "nm2225369",
            "films": 20,
            "rating": 6.8050000000000015,
            "views": 6036064672
          },
          {
            "actor": "Teresa Ganzel",
            "actorID": "nm0304679",
            "films": 14,
            "rating": 6.857142857142857,
            "views": 6032962793
          },
          {
            "actor": "Jude Law",
            "actorID": "nm0000179",
            "films": 38,
            "rating": 6.905263157894736,
            "views": 6017548600
          },
          {
            "actor": "James Franco",
            "actorID": "nm0290556",
            "films": 45,
            "rating": 6.348888888888891,
            "views": 6012597502
          },
          {
            "actor": "Ralph Ineson",
            "actorID": "nm0408591",
            "films": 14,
            "rating": 7.028571428571428,
            "views": 6009438192
          },
          {
            "actor": "Ryan Reynolds",
            "actorID": "nm0005351",
            "films": 33,
            "rating": 6.530303030303029,
            "views": 6006305933
          },
          {
            "actor": "John Hurt",
            "actorID": "nm0000457",
            "films": 51,
            "rating": 6.586274509803922,
            "views": 5993973239
          },
          {
            "actor": "Linda Cardellini",
            "actorID": "nm0004802",
            "films": 18,
            "rating": 6.583333333333332,
            "views": 5923278716
          },
          {
            "actor": "Alfred Molina",
            "actorID": "nm0000547",
            "films": 40,
            "rating": 6.580000000000001,
            "views": 5907539285
          },
          {
            "actor": "Frank Grillo",
            "actorID": "nm0342029",
            "films": 18,
            "rating": 6.805555555555554,
            "views": 5906941627
          },
          {
            "actor": "Geoffrey Rush",
            "actorID": "nm0001691",
            "films": 28,
            "rating": 6.814285714285714,
            "views": 5851060849
          },
          {
            "actor": "Kathy Bates",
            "actorID": "nm0000870",
            "films": 44,
            "rating": 6.338636363636363,
            "views": 5835570605
          },
          {
            "actor": "Richard Griffiths",
            "actorID": "nm0341743",
            "films": 23,
            "rating": 6.830434782608696,
            "views": 5812346993
          },
          {
            "actor": "Chiwetel Ejiofor",
            "actorID": "nm0252230",
            "films": 23,
            "rating": 6.930434782608696,
            "views": 5809787625
          },
          {
            "actor": "Michael Sheen",
            "actorID": "nm0790688",
            "films": 30,
            "rating": 6.540000000000001,
            "views": 5754423463
          },
          {
            "actor": "John Turturro",
            "actorID": "nm0001806",
            "films": 50,
            "rating": 6.485999999999998,
            "views": 5715360197
          },
          {
            "actor": "William Fichtner",
            "actorID": "nm0001209",
            "films": 31,
            "rating": 6.616129032258064,
            "views": 5709461613
          },
          {
            "actor": "Nicolas Cage",
            "actorID": "nm0000115",
            "films": 63,
            "rating": 6.304761904761903,
            "views": 5703759843
          },
          {
            "actor": "Harry Shearer",
            "actorID": "nm0733427",
            "films": 31,
            "rating": 6.641935483870969,
            "views": 5691707981
          },
          {
            "actor": "Adam Sandler",
            "actorID": "nm0001191",
            "films": 42,
            "rating": 6.000000000000003,
            "views": 5687466609
          },
          {
            "actor": "John C. Reilly",
            "actorID": "nm0000604",
            "films": 47,
            "rating": 6.768085106382979,
            "views": 5647682666
          },
          {
            "actor": "Donald Sutherland",
            "actorID": "nm0000661",
            "films": 47,
            "rating": 6.591489361702127,
            "views": 5639636087
          },
          {
            "actor": "Daniel Craig",
            "actorID": "nm0185819",
            "films": 25,
            "rating": 6.864,
            "views": 5586867338
          },
          {
            "actor": "Eddie Marsan",
            "actorID": "nm0550371",
            "films": 35,
            "rating": 6.897142857142855,
            "views": 5575970064
          },
          {
            "actor": "Sandra Bullock",
            "actorID": "nm0000113",
            "films": 34,
            "rating": 6.335294117647058,
            "views": 5559842091
          },
          {
            "actor": "Nicole Kidman",
            "actorID": "nm0000173",
            "films": 49,
            "rating": 6.502040816326531,
            "views": 5559692685
          },
          {
            "actor": "Clark Gregg",
            "actorID": "nm0163988",
            "films": 31,
            "rating": 6.741935483870969,
            "views": 5548543210
          },
          {
            "actor": "Karl Urban",
            "actorID": "nm0881631",
            "films": 16,
            "rating": 6.850000000000001,
            "views": 5546972011
          },
          {
            "actor": "Kristen Bell",
            "actorID": "nm0068338",
            "films": 27,
            "rating": 6.251851851851852,
            "views": 5514342651
          },
          {
            "actor": "James McAvoy",
            "actorID": "nm0564215",
            "films": 24,
            "rating": 6.858333333333333,
            "views": 5508952309
          },
          {
            "actor": "Stephen Root",
            "actorID": "nm0740535",
            "films": 47,
            "rating": 6.480851063829786,
            "views": 5503888631
          },
          {
            "actor": "Hiroyuki Sanada",
            "actorID": "nm0760796",
            "films": 11,
            "rating": 6.781818181818182,
            "views": 5495886000
          },
          {
            "actor": "Shia LaBeouf",
            "actorID": "nm0479471",
            "films": 25,
            "rating": 6.58,
            "views": 5492247340
          },
          {
            "actor": "Sylvester Stallone",
            "actorID": "nm0000230",
            "films": 43,
            "rating": 6.146511627906977,
            "views": 5475493095
          },
          {
            "actor": "Antonio Banderas",
            "actorID": "nm0000104",
            "films": 40,
            "rating": 6.319999999999999,
            "views": 5473474070
          },
          {
            "actor": "Dustin Hoffman",
            "actorID": "nm0000163",
            "films": 34,
            "rating": 6.679411764705882,
            "views": 5433542602
          },
          {
            "actor": "Christian Bale",
            "actorID": "nm0000288",
            "films": 36,
            "rating": 7.163888888888888,
            "views": 5422514952
          },
          {
            "actor": "Peter Dinklage",
            "actorID": "nm0227759",
            "films": 19,
            "rating": 6.7368421052631575,
            "views": 5419513647
          },
          {
            "actor": "Danny DeVito",
            "actorID": "nm0000362",
            "films": 44,
            "rating": 6.431818181818182,
            "views": 5401209263
          },
          {
            "actor": "Giovanni Ribisi",
            "actorID": "nm0000610",
            "films": 29,
            "rating": 6.63103448275862,
            "views": 5382654597
          },
          {
            "actor": "Mindy Sterling",
            "actorID": "nm0827565",
            "films": 14,
            "rating": 6.257142857142858,
            "views": 5378219049
          },
          {
            "actor": "Anna Kendrick",
            "actorID": "nm0447695",
            "films": 25,
            "rating": 6.307999999999998,
            "views": 5372840368
          },
          {
            "actor": "Channing Tatum",
            "actorID": "nm1475594",
            "films": 35,
            "rating": 6.44857142857143,
            "views": 5356736185
          },
          {
            "actor": "Colin Firth",
            "actorID": "nm0000147",
            "films": 31,
            "rating": 6.796774193548386,
            "views": 5333194737
          },
          {
            "actor": "Peter Cullen",
            "actorID": "nm0191520",
            "films": 14,
            "rating": 6.442857142857143,
            "views": 5324651390
          },
          {
            "actor": "John Leguizamo",
            "actorID": "nm0000491",
            "films": 47,
            "rating": 6.285106382978723,
            "views": 5314029912
          },
          {
            "actor": "Wallace Shawn",
            "actorID": "nm0001728",
            "films": 48,
            "rating": 6.264583333333334,
            "views": 5306351716
          },
          {
            "actor": "Bill Paxton",
            "actorID": "nm0000200",
            "films": 41,
            "rating": 6.495121951219512,
            "views": 5301227326
          },
          {
            "actor": "Keanu Reeves",
            "actorID": "nm0000206",
            "films": 48,
            "rating": 6.5229166666666645,
            "views": 5271599498
          },
          {
            "actor": "Robert Redford",
            "actorID": "nm0000602",
            "films": 22,
            "rating": 6.813636363636363,
            "views": 5265912187
          },
          {
            "actor": "Bernard Hill",
            "actorID": "nm0384060",
            "films": 18,
            "rating": 6.938888888888889,
            "views": 5238743104
          },
          {
            "actor": "Julianne Moore",
            "actorID": "nm0000194",
            "films": 52,
            "rating": 6.56346153846154,
            "views": 5234429375
          },
          {
            "actor": "Jeffrey Tambor",
            "actorID": "nm0001787",
            "films": 38,
            "rating": 6.339473684210527,
            "views": 5229718441
          },
          {
            "actor": "Domhnall Gleeson",
            "actorID": "nm1727304",
            "films": 19,
            "rating": 7.173684210526315,
            "views": 5223588210
          },
          {
            "actor": "Tommy Lee Jones",
            "actorID": "nm0000169",
            "films": 42,
            "rating": 6.459523809523811,
            "views": 5203162764
          },
          {
            "actor": "Octavia Spencer",
            "actorID": "nm0818055",
            "films": 37,
            "rating": 6.559459459459459,
            "views": 5202707946
          },
          {
            "actor": "Kristen Schaal",
            "actorID": "nm1102891",
            "films": 17,
            "rating": 6.347058823529411,
            "views": 5197615681
          },
          {
            "actor": "Philip Seymour Hoffman",
            "actorID": "nm0000450",
            "films": 40,
            "rating": 7.05,
            "views": 5177808728
          },
          {
            "actor": "David Wenham",
            "actorID": "nm0920992",
            "films": 16,
            "rating": 7.04375,
            "views": 5166711585
          },
          {
            "actor": "Kevin Costner",
            "actorID": "nm0000126",
            "films": 45,
            "rating": 6.8,
            "views": 5166517802
          },
          {
            "actor": "Jim Carrey",
            "actorID": "nm0000120",
            "films": 33,
            "rating": 6.484848484848486,
            "views": 5163316464
          },
          {
            "actor": "Helen Mirren",
            "actorID": "nm0000545",
            "films": 39,
            "rating": 6.63846153846154,
            "views": 5162097623
          },
          {
            "actor": "Kenneth Branagh",
            "actorID": "nm0000110",
            "films": 24,
            "rating": 6.916666666666669,
            "views": 5161037002
          },
          {
            "actor": "David Cross",
            "actorID": "nm0189144",
            "films": 25,
            "rating": 6.332000000000001,
            "views": 5160711328
          },
          {
            "actor": "Fiona Shaw",
            "actorID": "nm0789716",
            "films": 18,
            "rating": 6.561111111111111,
            "views": 5159651358
          },
          {
            "actor": "Brie Larson",
            "actorID": "nm0488953",
            "films": 18,
            "rating": 6.722222222222222,
            "views": 5153582885
          },
          {
            "actor": "Meryl Streep",
            "actorID": "nm0000658",
            "films": 50,
            "rating": 6.728,
            "views": 5151707839
          },
          {
            "actor": "Bill Nighy",
            "actorID": "nm0631490",
            "films": 37,
            "rating": 6.672972972972973,
            "views": 5146441049
          },
          {
            "actor": "Richard Jenkins",
            "actorID": "nm0420955",
            "films": 60,
            "rating": 6.394999999999999,
            "views": 5128120946
          },
          {
            "actor": "Jenny Slate",
            "actorID": "nm2809577",
            "films": 10,
            "rating": 6.469999999999999,
            "views": 5124926175
          },
          {
            "actor": "Thomas Lennon",
            "actorID": "nm0502073",
            "films": 26,
            "rating": 6.1192307692307715,
            "views": 5111914621
          },
          {
            "actor": "John Rhys-Davies",
            "actorID": "nm0722636",
            "films": 19,
            "rating": 6.38421052631579,
            "views": 5107682902
          },
          {
            "actor": "Whoopi Goldberg",
            "actorID": "nm0000155",
            "films": 45,
            "rating": 6.051111111111111,
            "views": 5104219721
          },
          {
            "actor": "Arnold Schwarzenegger",
            "actorID": "nm0000216",
            "films": 34,
            "rating": 6.211764705882352,
            "views": 5096703121
          },
          {
            "actor": "BD Wong",
            "actorID": "nm0000703",
            "films": 18,
            "rating": 6.588888888888889,
            "views": 5093963816
          },
          {
            "actor": "Jeffrey Wright",
            "actorID": "nm0942482",
            "films": 29,
            "rating": 6.689655172413793,
            "views": 5089342982
          },
          {
            "actor": "Cillian Murphy",
            "actorID": "nm0614165",
            "films": 21,
            "rating": 7.180952380952381,
            "views": 5086363036
          },
          {
            "actor": "Blake Clark",
            "actorID": "nm0163703",
            "films": 31,
            "rating": 5.999999999999999,
            "views": 5080505887
          },
          {
            "actor": "Ludacris",
            "actorID": "nm0524839",
            "films": 14,
            "rating": 6.4,
            "views": 5077466337
          },
          {
            "actor": "Forest Whitaker",
            "actorID": "nm0001845",
            "films": 44,
            "rating": 6.625000000000001,
            "views": 5067989343
          },
          {
            "actor": "Wayne Knight",
            "actorID": "nm0001431",
            "films": 22,
            "rating": 6.759090909090907,
            "views": 5057272110
          },
          {
            "actor": "Ty Olsson",
            "actorID": "nm0648153",
            "films": 22,
            "rating": 5.927272727272726,
            "views": 5049358079
          },
          {
            "actor": "Jamie Foxx",
            "actorID": "nm0004937",
            "films": 33,
            "rating": 6.3878787878787895,
            "views": 5046359067
          },
          {
            "actor": "Mike Myers",
            "actorID": "nm0000196",
            "films": 16,
            "rating": 6.3875,
            "views": 5043459245
          },
          {
            "actor": "Jon Voight",
            "actorID": "nm0000685",
            "films": 32,
            "rating": 6.312499999999997,
            "views": 5035616095
          },
          {
            "actor": "Ben Kingsley",
            "actorID": "nm0001426",
            "films": 40,
            "rating": 6.607500000000002,
            "views": 5027016903
          },
          {
            "actor": "Tony Shalhoub",
            "actorID": "nm0001724",
            "films": 34,
            "rating": 6.473529411764707,
            "views": 5018000095
          },
          {
            "actor": "Jada Pinkett Smith",
            "actorID": "nm0000586",
            "films": 24,
            "rating": 6.633333333333334,
            "views": 5004657751
          },
          {
            "actor": "Chris Rock",
            "actorID": "nm0001674",
            "films": 32,
            "rating": 6.11875,
            "views": 4994587163
          },
          {
            "actor": "George Clooney",
            "actorID": "nm0000123",
            "films": 34,
            "rating": 6.6764705882352935,
            "views": 4993821313
          },
          {
            "actor": "Thomas Kretschmann",
            "actorID": "nm0470981",
            "films": 23,
            "rating": 6.730434782608698,
            "views": 4989442205
          },
          {
            "actor": "Patrick Wilson",
            "actorID": "nm0933940",
            "films": 24,
            "rating": 6.5666666666666655,
            "views": 4987011302
          },
          {
            "actor": "Kari Wahlgren",
            "actorID": "nm1312566",
            "films": 14,
            "rating": 6.514285714285715,
            "views": 4967450048
          },
          {
            "actor": "Temuera Morrison",
            "actorID": "nm0607325",
            "films": 14,
            "rating": 6.121428571428572,
            "views": 4964863162
          },
          {
            "actor": "Cheech Marin",
            "actorID": "nm0001507",
            "films": 35,
            "rating": 6.225714285714286,
            "views": 4953390647
          },
          {
            "actor": "Ian McDiarmid",
            "actorID": "nm0001519",
            "films": 13,
            "rating": 6.930769230769231,
            "views": 4950728689
          },
          {
            "actor": "Tom Hardy",
            "actorID": "nm0362766",
            "films": 20,
            "rating": 7.324999999999998,
            "views": 4947191692
          },
          {
            "actor": "Mel Gibson",
            "actorID": "nm0000154",
            "films": 37,
            "rating": 6.570270270270269,
            "views": 4939454328
          },
          {
            "actor": "Helen McCrory",
            "actorID": "nm0567031",
            "films": 14,
            "rating": 7.321428571428572,
            "views": 4938704525
          },
          {
            "actor": "Jane Lynch",
            "actorID": "nm0528331",
            "films": 27,
            "rating": 6.340740740740743,
            "views": 4929165054
          },
          {
            "actor": "Graham McTavish",
            "actorID": "nm0574615",
            "films": 13,
            "rating": 6.907692307692306,
            "views": 4923775116
          },
          {
            "actor": "Jason Bateman",
            "actorID": "nm0000867",
            "films": 35,
            "rating": 6.417142857142856,
            "views": 4922514695
          },
          {
            "actor": "Gerard Butler",
            "actorID": "nm0124930",
            "films": 31,
            "rating": 6.406451612903224,
            "views": 4915937949
          },
          {
            "actor": "Robert Pattinson",
            "actorID": "nm1500155",
            "films": 18,
            "rating": 6.166666666666668,
            "views": 4879055141
          },
          {
            "actor": "Denis Leary",
            "actorID": "nm0001459",
            "films": 25,
            "rating": 6.524,
            "views": 4869995100
          },
          {
            "actor": "Will Arnett",
            "actorID": "nm0004715",
            "films": 25,
            "rating": 6.316,
            "views": 4868754789
          },
          {
            "actor": "Queen Latifah",
            "actorID": "nm0001451",
            "films": 31,
            "rating": 6.203225806451612,
            "views": 4864155212
          },
          {
            "actor": "Josh Hutcherson",
            "actorID": "nm1242688",
            "films": 18,
            "rating": 6.672222222222222,
            "views": 4842491555
          },
          {
            "actor": "Amy Adams",
            "actorID": "nm0010736",
            "films": 30,
            "rating": 6.813333333333333,
            "views": 4839023735
          },
          {
            "actor": "Keira Knightley",
            "actorID": "nm0461136",
            "films": 28,
            "rating": 6.782142857142858,
            "views": 4835476463
          },
          {
            "actor": "Charlize Theron",
            "actorID": "nm0000234",
            "films": 38,
            "rating": 6.626315789473684,
            "views": 4829311982
          },
          {
            "actor": "Michael Pena",
            "actorID": "nm0671567",
            "films": 31,
            "rating": 6.67741935483871,
            "views": 4776670354
          },
          {
            "actor": "Seth Green",
            "actorID": "nm0001293",
            "films": 32,
            "rating": 6.331250000000001,
            "views": 4754833547
          },
          {
            "actor": "Joan Cusack",
            "actorID": "nm0000349",
            "films": 38,
            "rating": 6.468421052631579,
            "views": 4750737993
          },
          {
            "actor": "Kevin Dunn",
            "actorID": "nm0242656",
            "films": 37,
            "rating": 6.321621621621622,
            "views": 4715031647
          },
          {
            "actor": "Benicio Del Toro",
            "actorID": "nm0001125",
            "films": 32,
            "rating": 6.887499999999999,
            "views": 4705063913
          },
          {
            "actor": "Bruce Spence",
            "actorID": "nm0817748",
            "films": 15,
            "rating": 6.586666666666667,
            "views": 4699418748
          },
          {
            "actor": "Jeff Garlin",
            "actorID": "nm0307531",
            "films": 24,
            "rating": 6.016666666666667,
            "views": 4695567868
          },
          {
            "actor": "Sam Worthington",
            "actorID": "nm0941777",
            "films": 18,
            "rating": 6.5,
            "views": 4674116676
          },
          {
            "actor": "Rose Byrne",
            "actorID": "nm0126284",
            "films": 27,
            "rating": 6.603703703703702,
            "views": 4674116485
          },
          {
            "actor": "Dakota Fanning",
            "actorID": "nm0266824",
            "films": 23,
            "rating": 6.321739130434783,
            "views": 4668011352
          },
          {
            "actor": "Kristen Stewart",
            "actorID": "nm0829576",
            "films": 27,
            "rating": 5.966666666666667,
            "views": 4629897351
          },
          {
            "actor": "James Remar",
            "actorID": "nm0001664",
            "films": 37,
            "rating": 6.272972972972973,
            "views": 4626846926
          },
          {
            "actor": "Carla Gugino",
            "actorID": "nm0001303",
            "films": 31,
            "rating": 6.100000000000001,
            "views": 4603781584
          },
          {
            "actor": "Alfre Woodard",
            "actorID": "nm0005569",
            "films": 29,
            "rating": 6.5344827586206895,
            "views": 4602210331
          },
          {
            "actor": "Shea Whigham",
            "actorID": "nm0924154",
            "films": 31,
            "rating": 6.812903225806452,
            "views": 4599583134
          },
          {
            "actor": "Laurie Metcalf",
            "actorID": "nm0582418",
            "films": 26,
            "rating": 6.634615384615385,
            "views": 4594083860
          },
          {
            "actor": "Danny Glover",
            "actorID": "nm0000418",
            "films": 47,
            "rating": 6.519148936170212,
            "views": 4591977092
          },
          {
            "actor": "Jeremy Irons",
            "actorID": "nm0000460",
            "films": 35,
            "rating": 6.6,
            "views": 4591015997
          },
          {
            "actor": "Ken Watanabe",
            "actorID": "nm0913822",
            "films": 12,
            "rating": 7.091666666666666,
            "views": 4582786754
          },
          {
            "actor": "Reno Wilson",
            "actorID": "nm0934008",
            "films": 12,
            "rating": 6.1000000000000005,
            "views": 4580187995
          },
          {
            "actor": "Bruce Campbell",
            "actorID": "nm0132257",
            "films": 25,
            "rating": 6.404,
            "views": 4573839298
          },
          {
            "actor": "Tom Kenny",
            "actorID": "nm0444786",
            "films": 18,
            "rating": 6.266666666666666,
            "views": 4572228138
          },
          {
            "actor": "Noel Gugliemi",
            "actorID": "nm0346595",
            "films": 22,
            "rating": 6.590909090909093,
            "views": 4571732799
          },
          {
            "actor": "Gil Birmingham",
            "actorID": "nm0083655",
            "films": 12,
            "rating": 5.95,
            "views": 4569639950
          },
          {
            "actor": "Tim Allen",
            "actorID": "nm0000741",
            "films": 17,
            "rating": 6.382352941176471,
            "views": 4536510158
          },
          {
            "actor": "Maya Rudolph",
            "actorID": "nm0748973",
            "films": 29,
            "rating": 6.310344827586208,
            "views": 4533255108
          },
          {
            "actor": "Tessa Thompson",
            "actorID": "nm1935086",
            "films": 11,
            "rating": 6.827272727272727,
            "views": 4530867008
          },
          {
            "actor": "Richard Kind",
            "actorID": "nm0454236",
            "films": 25,
            "rating": 6.424000000000001,
            "views": 4519575455
          },
          {
            "actor": "Bill Murray",
            "actorID": "nm0000195",
            "films": 49,
            "rating": 6.7857142857142865,
            "views": 4518665230
          },
          {
            "actor": "Laz Alonso",
            "actorID": "nm0022306",
            "films": 10,
            "rating": 6.39,
            "views": 4516397558
          },
          {
            "actor": "Diane Lane",
            "actorID": "nm0000178",
            "films": 38,
            "rating": 6.389473684210526,
            "views": 4515967551
          },
          {
            "actor": "Peter Stormare",
            "actorID": "nm0001780",
            "films": 36,
            "rating": 6.580555555555555,
            "views": 4511972796
          },
          {
            "actor": "Miriam Margolyes",
            "actorID": "nm0546816",
            "films": 34,
            "rating": 6.585294117647059,
            "views": 4501138020
          },
          {
            "actor": "Ed Harris",
            "actorID": "nm0000438",
            "films": 47,
            "rating": 6.834042553191488,
            "views": 4489975585
          },
          {
            "actor": "Viggo Mortensen",
            "actorID": "nm0001557",
            "films": 30,
            "rating": 6.703333333333334,
            "views": 4474158888
          },
          {
            "actor": "Richard Schiff",
            "actorID": "nm0771493",
            "films": 38,
            "rating": 6.2368421052631575,
            "views": 4465544490
          },
          {
            "actor": "Edie McClurg",
            "actorID": "nm0566052",
            "films": 28,
            "rating": 6.292857142857142,
            "views": 4465493508
          },
          {
            "actor": "Stephen Fry",
            "actorID": "nm0000410",
            "films": 23,
            "rating": 6.678260869565216,
            "views": 4434486247
          },
          {
            "actor": "Paul Walker",
            "actorID": "nm0908094",
            "films": 19,
            "rating": 6.394736842105263,
            "views": 4414877483
          },
          {
            "actor": "Hank Azaria",
            "actorID": "nm0000279",
            "films": 28,
            "rating": 6.432142857142857,
            "views": 4410218115
          },
          {
            "actor": "Albert Brooks",
            "actorID": "nm0000983",
            "films": 20,
            "rating": 6.865,
            "views": 4403692940
          },
          {
            "actor": "Dan Aykroyd",
            "actorID": "nm0000101",
            "films": 53,
            "rating": 6.047169811320755,
            "views": 4400145141
          },
          {
            "actor": "John Ortiz",
            "actorID": "nm0651159",
            "films": 27,
            "rating": 6.648148148148147,
            "views": 4386706119
          },
          {
            "actor": "Gemma Jones",
            "actorID": "nm0428121",
            "films": 14,
            "rating": 7.028571428571429,
            "views": 4378471823
          },
          {
            "actor": "Kath Soucie",
            "actorID": "nm0815718",
            "films": 24,
            "rating": 6.575000000000002,
            "views": 4369895406
          },
          {
            "actor": "Mark Strong",
            "actorID": "nm0835016",
            "films": 35,
            "rating": 6.942857142857143,
            "views": 4369883116
          },
          {
            "actor": "Jena Malone",
            "actorID": "nm0540441",
            "films": 23,
            "rating": 7.008695652173913,
            "views": 4360174504
          },
          {
            "actor": "Amy Sedaris",
            "actorID": "nm0781238",
            "films": 15,
            "rating": 6.133333333333332,
            "views": 4347799073
          },
          {
            "actor": "Terry Crews",
            "actorID": "nm0187719",
            "films": 31,
            "rating": 6.1,
            "views": 4341713049
          },
          {
            "actor": "Robin Wright",
            "actorID": "nm0000705",
            "films": 32,
            "rating": 6.6875,
            "views": 4336891417
          },
          {
            "actor": "Rance Howard",
            "actorID": "nm0397555",
            "films": 46,
            "rating": 6.376086956521739,
            "views": 4323146900
          },
          {
            "actor": "Frances de la Tour",
            "actorID": "nm0209428",
            "films": 11,
            "rating": 6.827272727272727,
            "views": 4316224985
          },
          {
            "actor": "Joey King",
            "actorID": "nm1428821",
            "films": 17,
            "rating": 6.311764705882354,
            "views": 4288588500
          },
          {
            "actor": "Maurice LaMarche",
            "actorID": "nm0005606",
            "films": 14,
            "rating": 6.65,
            "views": 4284396379
          },
          {
            "actor": "Chris Cooper",
            "actorID": "nm0177933",
            "films": 37,
            "rating": 7.048648648648649,
            "views": 4266017262
          },
          {
            "actor": "Christopher Walken",
            "actorID": "nm0000686",
            "films": 57,
            "rating": 6.375438596491228,
            "views": 4256887014
          },
          {
            "actor": "Michelle Monaghan",
            "actorID": "nm1157358",
            "films": 22,
            "rating": 6.749999999999999,
            "views": 4256272648
          },
          {
            "actor": "Donald Glover",
            "actorID": "nm2255973",
            "films": 10,
            "rating": 6.470000000000001,
            "views": 4253790391
          },
          {
            "actor": "Denzel Washington",
            "actorID": "nm0000243",
            "films": 46,
            "rating": 6.878260869565217,
            "views": 4245790864
          },
          {
            "actor": "Seann William Scott",
            "actorID": "nm0005405",
            "films": 24,
            "rating": 6.199999999999999,
            "views": 4243664158
          },
          {
            "actor": "Tobey Maguire",
            "actorID": "nm0001497",
            "films": 22,
            "rating": 6.904545454545455,
            "views": 4225186859
          },
          {
            "actor": "Pierce Brosnan",
            "actorID": "nm0000112",
            "films": 31,
            "rating": 6.4,
            "views": 4223195348
          },
          {
            "actor": "Ioan Gruffudd",
            "actorID": "nm0344435",
            "films": 11,
            "rating": 6.363636363636363,
            "views": 4221423671
          },
          {
            "actor": "John Malkovich",
            "actorID": "nm0000518",
            "films": 43,
            "rating": 6.588372093023256,
            "views": 4219338141
          },
          {
            "actor": "Tom Wilkinson",
            "actorID": "nm0929489",
            "films": 43,
            "rating": 6.9302325581395365,
            "views": 4213292686
          },
          {
            "actor": "Ray Winstone",
            "actorID": "nm0935653",
            "films": 21,
            "rating": 6.557142857142858,
            "views": 4195511697
          },
          {
            "actor": "Liv Tyler",
            "actorID": "nm0000239",
            "films": 23,
            "rating": 6.81304347826087,
            "views": 4186919034
          },
          {
            "actor": "Benjamin Bratt",
            "actorID": "nm0000973",
            "films": 23,
            "rating": 6.48695652173913,
            "views": 4182749706
          },
          {
            "actor": "Naomie Harris",
            "actorID": "nm0365140",
            "films": 13,
            "rating": 6.823076923076922,
            "views": 4180256140
          },
          {
            "actor": "Kellan Lutz",
            "actorID": "nm1553725",
            "films": 13,
            "rating": 5.292307692307693,
            "views": 4178451261
          },
          {
            "actor": "Keith David",
            "actorID": "nm0202966",
            "films": 50,
            "rating": 6.468,
            "views": 4173832455
          },
          {
            "actor": "Halle Berry",
            "actorID": "nm0000932",
            "films": 29,
            "rating": 6.172413793103449,
            "views": 4170106697
          },
          {
            "actor": "Cedric the Entertainer",
            "actorID": "nm0147825",
            "films": 25,
            "rating": 6.024000000000001,
            "views": 4167213277
          },
          {
            "actor": "Dominic West",
            "actorID": "nm0922035",
            "films": 23,
            "rating": 6.4739130434782615,
            "views": 4157596535
          },
          {
            "actor": "Emma Stone",
            "actorID": "nm1297015",
            "films": 25,
            "rating": 6.728000000000001,
            "views": 4148437556
          },
          {
            "actor": "Wes Studi",
            "actorID": "nm0836071",
            "films": 16,
            "rating": 6.700000000000001,
            "views": 4147579738
          },
          {
            "actor": "Nicholas Hoult",
            "actorID": "nm0396558",
            "films": 15,
            "rating": 6.953333333333333,
            "views": 4146786078
          },
          {
            "actor": "Andy Garcia",
            "actorID": "nm0000412",
            "films": 37,
            "rating": 6.43783783783784,
            "views": 4141831868
          },
          {
            "actor": "Jesse Eisenberg",
            "actorID": "nm0251986",
            "films": 23,
            "rating": 6.626086956521739,
            "views": 4139889859
          },
          {
            "actor": "Jake Johnson",
            "actorID": "nm2159926",
            "films": 14,
            "rating": 6.6499999999999995,
            "views": 4134254525
          },
          {
            "actor": "Victor Garber",
            "actorID": "nm0001255",
            "films": 21,
            "rating": 6.661904761904762,
            "views": 4133587146
          },
          {
            "actor": "Bryan Cranston",
            "actorID": "nm0186505",
            "films": 26,
            "rating": 6.888461538461538,
            "views": 4128440738
          },
          {
            "actor": "Geraldine James",
            "actorID": "nm0416524",
            "films": 16,
            "rating": 6.98125,
            "views": 4122058074
          },
          {
            "actor": "Julie White",
            "actorID": "nm0925033",
            "films": 11,
            "rating": 6.409090909090909,
            "views": 4120548576
          },
          {
            "actor": "Allen Covert",
            "actorID": "nm0184445",
            "films": 28,
            "rating": 5.889285714285714,
            "views": 4117808912
          },
          {
            "actor": "Matthew McConaughey",
            "actorID": "nm0000190",
            "films": 43,
            "rating": 6.486046511627906,
            "views": 4116229054
          },
          {
            "actor": "Taylor Lautner",
            "actorID": "nm1210124",
            "films": 10,
            "rating": 5.07,
            "views": 4107605063
          },
          {
            "actor": "CCH Pounder",
            "actorID": "nm0001634",
            "films": 13,
            "rating": 6.423076923076924,
            "views": 4105628256
          },
          {
            "actor": "Yvette Nicole Brown",
            "actorID": "nm1304328",
            "films": 11,
            "rating": 6.418181818181818,
            "views": 4102954694
          },
          {
            "actor": "Bobby Cannavale",
            "actorID": "nm0134072",
            "films": 25,
            "rating": 6.507999999999998,
            "views": 4085097195
          },
          {
            "actor": "Jackie Chan",
            "actorID": "nm0000329",
            "films": 25,
            "rating": 6.439999999999999,
            "views": 4078044998
          },
          {
            "actor": "Michael Shannon",
            "actorID": "nm0788335",
            "films": 38,
            "rating": 6.621052631578947,
            "views": 4064143110
          },
          {
            "actor": "Liam Hemsworth",
            "actorID": "nm2955013",
            "films": 12,
            "rating": 6.333333333333335,
            "views": 4042031486
          },
          {
            "actor": "Kate Winslet",
            "actorID": "nm0000701",
            "films": 34,
            "rating": 6.800000000000001,
            "views": 4024570001
          },
          {
            "actor": "Leslie Phillips",
            "actorID": "nm0680587",
            "films": 12,
            "rating": 6.916666666666667,
            "views": 4018501173
          },
          {
            "actor": "Billy Burke",
            "actorID": "nm0121605",
            "films": 15,
            "rating": 5.880000000000001,
            "views": 4017043882
          },
          {
            "actor": "Michael Fassbender",
            "actorID": "nm1055413",
            "films": 26,
            "rating": 6.780769230769232,
            "views": 4016379315
          },
          {
            "actor": "John Lithgow",
            "actorID": "nm0001475",
            "films": 41,
            "rating": 6.507317073170732,
            "views": 4014482110
          },
          {
            "actor": "Ted Raimi",
            "actorID": "nm0001646",
            "films": 22,
            "rating": 6.55,
            "views": 4004819602
          },
          {
            "actor": "Tait Fletcher",
            "actorID": "nm1324884",
            "films": 15,
            "rating": 6.573333333333334,
            "views": 4002929892
          },
          {
            "actor": "Kevin James",
            "actorID": "nm0416673",
            "films": 18,
            "rating": 5.822222222222222,
            "views": 3993176695
          },
          {
            "actor": "Philip Baker Hall",
            "actorID": "nm0001311",
            "films": 39,
            "rating": 6.741025641025642,
            "views": 3978876258
          },
          {
            "actor": "Joseph Gordon-Levitt",
            "actorID": "nm0330687",
            "films": 33,
            "rating": 6.872727272727271,
            "views": 3970334620
          },
          {
            "actor": "Eugene Levy",
            "actorID": "nm0506405",
            "films": 36,
            "rating": 6.0888888888888895,
            "views": 3960752014
          },
          {
            "actor": "Rami Malek",
            "actorID": "nm1785339",
            "films": 14,
            "rating": 6.492857142857142,
            "views": 3960356772
          },
          {
            "actor": "Rhoda Griffis",
            "actorID": "nm0341421",
            "films": 33,
            "rating": 6.4393939393939394,
            "views": 3949274894
          },
          {
            "actor": "Sean Astin",
            "actorID": "nm0000276",
            "films": 18,
            "rating": 6.938888888888887,
            "views": 3941307894
          },
          {
            "actor": "Ezra Miller",
            "actorID": "nm3009232",
            "films": 10,
            "rating": 6.81,
            "views": 3939265519
          },
          {
            "actor": "Ian McShane",
            "actorID": "nm0574534",
            "films": 21,
            "rating": 6.4761904761904745,
            "views": 3936270238
          },
          {
            "actor": "Kirsten Dunst",
            "actorID": "nm0000379",
            "films": 31,
            "rating": 6.580645161290321,
            "views": 3930207323
          },
          {
            "actor": "Jonathan Loughran",
            "actorID": "nm0521781",
            "films": 28,
            "rating": 5.950000000000002,
            "views": 3928122638
          },
          {
            "actor": "Spencer Garrett",
            "actorID": "nm0308208",
            "films": 22,
            "rating": 6.604545454545453,
            "views": 3926507568
          },
          {
            "actor": "Shirley Henderson",
            "actorID": "nm0376602",
            "films": 21,
            "rating": 6.866666666666666,
            "views": 3926396201
          },
          {
            "actor": "Will Ferrell",
            "actorID": "nm0002071",
            "films": 38,
            "rating": 6.16578947368421,
            "views": 3926132721
          },
          {
            "actor": "James D'Arcy",
            "actorID": "nm0195439",
            "films": 11,
            "rating": 6.3999999999999995,
            "views": 3883972149
          },
          {
            "actor": "John Travolta",
            "actorID": "nm0000237",
            "films": 42,
            "rating": 5.980952380952381,
            "views": 3877239499
          },
          {
            "actor": "Sam Neill",
            "actorID": "nm0000554",
            "films": 30,
            "rating": 6.746666666666667,
            "views": 3868873871
          },
          {
            "actor": "Common",
            "actorID": "nm0996669",
            "films": 23,
            "rating": 6.539130434782609,
            "views": 3856385518
          },
          {
            "actor": "Jenifer Lewis",
            "actorID": "nm0507338",
            "films": 33,
            "rating": 6.130303030303029,
            "views": 3854872366
          },
          {
            "actor": "Josh Duhamel",
            "actorID": "nm0241049",
            "films": 14,
            "rating": 6.021428571428572,
            "views": 3852782521
          },
          {
            "actor": "Colin Farrell",
            "actorID": "nm0268199",
            "films": 37,
            "rating": 6.691891891891893,
            "views": 3840625827
          },
          {
            "actor": "Clint Howard",
            "actorID": "nm0397212",
            "films": 38,
            "rating": 6.094736842105262,
            "views": 3836549553
          },
          {
            "actor": "Luis Guzman",
            "actorID": "nm0350079",
            "films": 45,
            "rating": 6.268888888888889,
            "views": 3825131673
          },
          {
            "actor": "Zach Galifianakis",
            "actorID": "nm0302108",
            "films": 26,
            "rating": 6.315384615384614,
            "views": 3820725186
          },
          {
            "actor": "Jessica Chastain",
            "actorID": "nm1567113",
            "films": 20,
            "rating": 6.94,
            "views": 3813349328
          },
          {
            "actor": "Russell Crowe",
            "actorID": "nm0000128",
            "films": 30,
            "rating": 6.883333333333334,
            "views": 3803700771
          },
          {
            "actor": "Ken Stott",
            "actorID": "nm0832792",
            "films": 13,
            "rating": 6.8538461538461535,
            "views": 3798604043
          },
          {
            "actor": "Vincent D'Onofrio",
            "actorID": "nm0000352",
            "films": 36,
            "rating": 6.619444444444445,
            "views": 3791880368
          },
          {
            "actor": "Brian Cox",
            "actorID": "nm0004051",
            "films": 42,
            "rating": 6.799999999999998,
            "views": 3775616089
          },
          {
            "actor": "Rupert Everett",
            "actorID": "nm0000391",
            "films": 20,
            "rating": 6.414999999999999,
            "views": 3764722009
          },
          {
            "actor": "Catherine Keener",
            "actorID": "nm0001416",
            "films": 34,
            "rating": 6.71470588235294,
            "views": 3764139644
          },
          {
            "actor": "Bobby Moynihan",
            "actorID": "nm1293885",
            "films": 13,
            "rating": 6.361538461538462,
            "views": 3746051992
          },
          {
            "actor": "Joe Morton",
            "actorID": "nm0608012",
            "films": 29,
            "rating": 6.175862068965519,
            "views": 3742441831
          },
          {
            "actor": "Leland Orser",
            "actorID": "nm0650702",
            "films": 20,
            "rating": 6.6,
            "views": 3741240313
          },
          {
            "actor": "Missi Pyle",
            "actorID": "nm0701512",
            "films": 24,
            "rating": 6.495833333333333,
            "views": 3731377352
          },
          {
            "actor": "Stephen Lang",
            "actorID": "nm0002332",
            "films": 22,
            "rating": 6.390909090909091,
            "views": 3729490519
          },
          {
            "actor": "John Krasinski",
            "actorID": "nm1024677",
            "films": 25,
            "rating": 6.5360000000000005,
            "views": 3719865774
          },
          {
            "actor": "Irrfan Khan",
            "actorID": "nm0451234",
            "films": 10,
            "rating": 7.25,
            "views": 3710862121
          },
          {
            "actor": "J.P. Manoux",
            "actorID": "nm0002262",
            "films": 14,
            "rating": 6.4,
            "views": 3698309153
          },
          {
            "actor": "Rachel McAdams",
            "actorID": "nm1046097",
            "films": 24,
            "rating": 6.904166666666668,
            "views": 3689843859
          },
          {
            "actor": "Kevin Spacey",
            "actorID": "nm0000228",
            "films": 37,
            "rating": 6.935135135135136,
            "views": 3683120624
          },
          {
            "actor": "Lucy Liu",
            "actorID": "nm0005154",
            "films": 21,
            "rating": 6.5285714285714285,
            "views": 3675148050
          },
          {
            "actor": "Ed Helms",
            "actorID": "nm1159180",
            "films": 20,
            "rating": 6.005,
            "views": 3664223882
          },
          {
            "actor": "Marion Cotillard",
            "actorID": "nm0182839",
            "films": 22,
            "rating": 7.027272727272727,
            "views": 3660261592
          },
          {
            "actor": "Anne Lockhart",
            "actorID": "nm0516860",
            "films": 28,
            "rating": 6.325000000000001,
            "views": 3648121225
          },
          {
            "actor": "Anna Faris",
            "actorID": "nm0267506",
            "films": 28,
            "rating": 5.832142857142856,
            "views": 3636462963
          },
          {
            "actor": "Ted Levine",
            "actorID": "nm0505971",
            "films": 27,
            "rating": 6.511111111111109,
            "views": 3631494014
          },
          {
            "actor": "Matt Adler",
            "actorID": "nm0012208",
            "films": 17,
            "rating": 6.735294117647059,
            "views": 3630235613
          },
          {
            "actor": "Henry Cavill",
            "actorID": "nm0147147",
            "films": 12,
            "rating": 6.791666666666668,
            "views": 3625645166
          },
          {
            "actor": "Michael Clarke Duncan",
            "actorID": "nm0003817",
            "films": 23,
            "rating": 6.104347826086957,
            "views": 3622098561
          },
          {
            "actor": "Nick Offerman",
            "actorID": "nm0644406",
            "films": 26,
            "rating": 6.676923076923076,
            "views": 3620983394
          },
          {
            "actor": "Emilio Rivera",
            "actorID": "nm0729256",
            "films": 19,
            "rating": 6.536842105263158,
            "views": 3619093173
          },
          {
            "actor": "Peter Facinelli",
            "actorID": "nm0004906",
            "films": 10,
            "rating": 5.49,
            "views": 3616977364
          },
          {
            "actor": "Rade Serbedzija",
            "actorID": "nm0784884",
            "films": 20,
            "rating": 6.4799999999999995,
            "views": 3613893178
          },
          {
            "actor": "Hannibal Buress",
            "actorID": "nm2868110",
            "films": 13,
            "rating": 6.538461538461538,
            "views": 3603586082
          },
          {
            "actor": "Joseph Mazzello",
            "actorID": "nm0001515",
            "films": 14,
            "rating": 6.835714285714286,
            "views": 3595741909
          },
          {
            "actor": "Grey Griffin",
            "actorID": "nm0217221",
            "films": 11,
            "rating": 6.427272727272726,
            "views": 3595722090
          },
          {
            "actor": "Danny Huston",
            "actorID": "nm0396812",
            "films": 29,
            "rating": 6.696551724137931,
            "views": 3593857913
          },
          {
            "actor": "Elizabeth Reaser",
            "actorID": "nm0714147",
            "films": 12,
            "rating": 5.933333333333333,
            "views": 3583033197
          },
          {
            "actor": "Paula Malcomson",
            "actorID": "nm0539155",
            "films": 10,
            "rating": 6.85,
            "views": 3564320374
          },
          {
            "actor": "Frances McDormand",
            "actorID": "nm0000531",
            "films": 36,
            "rating": 6.930555555555555,
            "views": 3564275196
          },
          {
            "actor": "Bruce Greenwood",
            "actorID": "nm0339304",
            "films": 34,
            "rating": 6.485294117647058,
            "views": 3561097190
          },
          {
            "actor": "Vince Vaughn",
            "actorID": "nm0000681",
            "films": 34,
            "rating": 6.338235294117646,
            "views": 3549616899
          },
          {
            "actor": "Ray Stevenson",
            "actorID": "nm0829032",
            "films": 14,
            "rating": 6.35,
            "views": 3546810833
          },
          {
            "actor": "Jon Hamm",
            "actorID": "nm0358316",
            "films": 17,
            "rating": 6.670588235294118,
            "views": 3539937096
          },
          {
            "actor": "Leslie Mann",
            "actorID": "nm0005182",
            "films": 26,
            "rating": 6.1461538461538465,
            "views": 3538962293
          },
          {
            "actor": "Christopher Plummer",
            "actorID": "nm0001626",
            "films": 40,
            "rating": 6.702499999999999,
            "views": 3536385351
          },
          {
            "actor": "David Strathairn",
            "actorID": "nm0000657",
            "films": 45,
            "rating": 6.74888888888889,
            "views": 3534567951
          },
          {
            "actor": "Aaron Taylor-Johnson",
            "actorID": "nm1093951",
            "films": 13,
            "rating": 6.9692307692307685,
            "views": 3532326578
          },
          {
            "actor": "Zoe Kravitz",
            "actorID": "nm2368789",
            "films": 15,
            "rating": 6.6,
            "views": 3531635803
          },
          {
            "actor": "Tom Hollander",
            "actorID": "nm0390903",
            "films": 20,
            "rating": 6.959999999999999,
            "views": 3527509310
          },
          {
            "actor": "James Hong",
            "actorID": "nm0393222",
            "films": 38,
            "rating": 6.1,
            "views": 3524087849
          },
          {
            "actor": "Jennifer Lopez",
            "actorID": "nm0000182",
            "films": 28,
            "rating": 5.903571428571429,
            "views": 3519964130
          },
          {
            "actor": "Miranda Otto",
            "actorID": "nm0001584",
            "films": 11,
            "rating": 6.872727272727272,
            "views": 3512184117
          },
          {
            "actor": "David Warner",
            "actorID": "nm0001831",
            "films": 19,
            "rating": 6.363157894736842,
            "views": 3503938720
          },
          {
            "actor": "Crystal the Monkey",
            "actorID": "nm2640714",
            "films": 12,
            "rating": 5.958333333333335,
            "views": 3496634193
          },
          {
            "actor": "Billy Connolly",
            "actorID": "nm0175262",
            "films": 19,
            "rating": 6.51578947368421,
            "views": 3490950095
          },
          {
            "actor": "Drew Barrymore",
            "actorID": "nm0000106",
            "films": 38,
            "rating": 6.210526315789474,
            "views": 3490576248
          },
          {
            "actor": "Holly Hunter",
            "actorID": "nm0000456",
            "films": 22,
            "rating": 6.736363636363635,
            "views": 3484500806
          },
          {
            "actor": "Danny McBride",
            "actorID": "nm1144419",
            "films": 25,
            "rating": 6.436000000000002,
            "views": 3481764470
          },
          {
            "actor": "Patrick Warburton",
            "actorID": "nm0911320",
            "films": 20,
            "rating": 6.045000000000001,
            "views": 3478488559
          },
          {
            "actor": "Richard Riehle",
            "actorID": "nm0726223",
            "films": 40,
            "rating": 6.307499999999999,
            "views": 3469985845
          },
          {
            "actor": "Emily Blunt",
            "actorID": "nm1289434",
            "films": 25,
            "rating": 6.764000000000001,
            "views": 3469974780
          },
          {
            "actor": "Cuba Gooding Jr.",
            "actorID": "nm0000421",
            "films": 31,
            "rating": 6.4806451612903215,
            "views": 3467005587
          },
          {
            "actor": "Sven-Ole Thorsen",
            "actorID": "nm0861752",
            "films": 35,
            "rating": 6.228571428571428,
            "views": 3466526076
          },
          {
            "actor": "Lake Bell",
            "actorID": "nm1128572",
            "films": 15,
            "rating": 6.426666666666665,
            "views": 3463205128
          },
          {
            "actor": "Cliff Curtis",
            "actorID": "nm0193295",
            "films": 28,
            "rating": 6.571428571428572,
            "views": 3461830910
          },
          {
            "actor": "Topher Grace",
            "actorID": "nm0333410",
            "films": 18,
            "rating": 6.477777777777778,
            "views": 3457139045
          },
          {
            "actor": "Craig T. Nelson",
            "actorID": "nm0005266",
            "films": 26,
            "rating": 6.596153846153846,
            "views": 3450926622
          },
          {
            "actor": "Christoph Waltz",
            "actorID": "nm0910607",
            "films": 16,
            "rating": 6.6875,
            "views": 3449207020
          },
          {
            "actor": "Deep Roy",
            "actorID": "nm0746989",
            "films": 14,
            "rating": 6.721428571428573,
            "views": 3449126529
          },
          {
            "actor": "Amy Poehler",
            "actorID": "nm0688132",
            "films": 15,
            "rating": 6.179999999999999,
            "views": 3431984687
          },
          {
            "actor": "Ben Whishaw",
            "actorID": "nm0924210",
            "films": 18,
            "rating": 6.900000000000001,
            "views": 3431261972
          },
          {
            "actor": "Jay Baruchel",
            "actorID": "nm0059431",
            "films": 17,
            "rating": 6.8352941176470585,
            "views": 3429140596
          },
          {
            "actor": "Harvey Keitel",
            "actorID": "nm0000172",
            "films": 48,
            "rating": 6.614583333333335,
            "views": 3421877209
          },
          {
            "actor": "Simon McBurney",
            "actorID": "nm0564402",
            "films": 20,
            "rating": 6.845000000000001,
            "views": 3414410992
          },
          {
            "actor": "Bill Pullman",
            "actorID": "nm0000597",
            "films": 39,
            "rating": 6.338461538461538,
            "views": 3413485665
          },
          {
            "actor": "Sally Field",
            "actorID": "nm0000398",
            "films": 22,
            "rating": 6.536363636363638,
            "views": 3406049758
          },
          {
            "actor": "Joe Manganiello",
            "actorID": "nm0542133",
            "films": 11,
            "rating": 6.0636363636363635,
            "views": 3396519408
          },
          {
            "actor": "Reggie Lee",
            "actorID": "nm0498046",
            "films": 12,
            "rating": 6.858333333333333,
            "views": 3393118601
          },
          {
            "actor": "Famke Janssen",
            "actorID": "nm0000463",
            "films": 23,
            "rating": 6.47391304347826,
            "views": 3391940120
          },
          {
            "actor": "Rob Riggle",
            "actorID": "nm1443527",
            "films": 23,
            "rating": 6.282608695652174,
            "views": 3389760966
          },
          {
            "actor": "Tom Lister Jr.",
            "actorID": "nm0001474",
            "films": 29,
            "rating": 6.10344827586207,
            "views": 3384924334
          },
          {
            "actor": "Liev Schreiber",
            "actorID": "nm0000630",
            "films": 37,
            "rating": 6.556756756756757,
            "views": 3384619513
          },
          {
            "actor": "Colm Feore",
            "actorID": "nm0272173",
            "films": 21,
            "rating": 6.452380952380953,
            "views": 3382412556
          },
          {
            "actor": "James Marsden",
            "actorID": "nm0005188",
            "films": 25,
            "rating": 6.348,
            "views": 3380142122
          },
          {
            "actor": "Ron Perlman",
            "actorID": "nm0000579",
            "films": 32,
            "rating": 6.309374999999998,
            "views": 3377968490
          },
          {
            "actor": "Mindy Kaling",
            "actorID": "nm1411676",
            "films": 13,
            "rating": 6.476923076923077,
            "views": 3368466921
          },
          {
            "actor": "Glenn Close",
            "actorID": "nm0000335",
            "films": 30,
            "rating": 6.479999999999999,
            "views": 3368076818
          },
          {
            "actor": "Oscar Isaac",
            "actorID": "nm1209966",
            "films": 24,
            "rating": 6.745833333333333,
            "views": 3367130934
          },
          {
            "actor": "Steve Zahn",
            "actorID": "nm0001872",
            "films": 36,
            "rating": 6.394444444444445,
            "views": 3365126930
          },
          {
            "actor": "Patrick St. Esprit",
            "actorID": "nm0820520",
            "films": 12,
            "rating": 6.641666666666667,
            "views": 3359911112
          },
          {
            "actor": "Mahershala Ali",
            "actorID": "nm0991810",
            "films": 12,
            "rating": 7.283333333333334,
            "views": 3356337950
          },
          {
            "actor": "Billy Zane",
            "actorID": "nm0000708",
            "films": 22,
            "rating": 6.222727272727272,
            "views": 3353399308
          },
          {
            "actor": "Walton Goggins",
            "actorID": "nm0324658",
            "films": 24,
            "rating": 6.425000000000001,
            "views": 3349442839
          },
          {
            "actor": "Dale Dye",
            "actorID": "nm0245653",
            "films": 31,
            "rating": 6.567741935483871,
            "views": 3341632138
          },
          {
            "actor": "Brett Cullen",
            "actorID": "nm0191442",
            "films": 18,
            "rating": 6.56111111111111,
            "views": 3325352105
          },
          {
            "actor": "Jake Gyllenhaal",
            "actorID": "nm0350453",
            "films": 32,
            "rating": 6.971875000000001,
            "views": 3323521827
          },
          {
            "actor": "Bernie Mac",
            "actorID": "nm0005170",
            "films": 22,
            "rating": 6.027272727272728,
            "views": 3320025670
          },
          {
            "actor": "Chris Pine",
            "actorID": "nm1517976",
            "films": 21,
            "rating": 6.519047619047618,
            "views": 3317668608
          },
          {
            "actor": "Joaquin Phoenix",
            "actorID": "nm0001618",
            "films": 34,
            "rating": 6.81764705882353,
            "views": 3313970865
          },
          {
            "actor": "Jennifer Connelly",
            "actorID": "nm0000124",
            "films": 32,
            "rating": 6.684375000000001,
            "views": 3313913888
          },
          {
            "actor": "Rob Schneider",
            "actorID": "nm0001705",
            "films": 30,
            "rating": 5.733333333333332,
            "views": 3306770439
          },
          {
            "actor": "Mary Ellen Trainor",
            "actorID": "nm0870729",
            "films": 25,
            "rating": 6.692,
            "views": 3306468120
          },
          {
            "actor": "Christopher Mintz-Plasse",
            "actorID": "nm2395586",
            "films": 18,
            "rating": 6.66111111111111,
            "views": 3306149386
          },
          {
            "actor": "Viola Davis",
            "actorID": "nm0205626",
            "films": 29,
            "rating": 6.672413793103449,
            "views": 3301547293
          },
          {
            "actor": "Kelsey Grammer",
            "actorID": "nm0001288",
            "films": 14,
            "rating": 6.4,
            "views": 3300834573
          },
          {
            "actor": "Sterling K. Brown",
            "actorID": "nm1250791",
            "films": 11,
            "rating": 6.5,
            "views": 3296465165
          },
          {
            "actor": "Ned Dennehy",
            "actorID": "nm0219329",
            "films": 17,
            "rating": 6.7823529411764705,
            "views": 3287007457
          },
          {
            "actor": "Jackie Sandler",
            "actorID": "nm0864490",
            "films": 21,
            "rating": 5.647619047619049,
            "views": 3282665247
          },
          {
            "actor": "Peter Serafinowicz",
            "actorID": "nm0784818",
            "films": 12,
            "rating": 6.9750000000000005,
            "views": 3282542337
          },
          {
            "actor": "Kelly Macdonald",
            "actorID": "nm0531808",
            "films": 17,
            "rating": 6.9,
            "views": 3280975905
          },
          {
            "actor": "Matthew Broderick",
            "actorID": "nm0000111",
            "films": 34,
            "rating": 6.411764705882353,
            "views": 3275164300
          },
          {
            "actor": "Guy Pearce",
            "actorID": "nm0001602",
            "films": 27,
            "rating": 6.866666666666666,
            "views": 3256979072
          },
          {
            "actor": "Mads Mikkelsen",
            "actorID": "nm0586568",
            "films": 19,
            "rating": 7.063157894736841,
            "views": 3248263850
          },
          {
            "actor": "David Leitch",
            "actorID": "nm0500610",
            "films": 10,
            "rating": 6.88,
            "views": 3247097724
          },
          {
            "actor": "Rafe Spall",
            "actorID": "nm1245863",
            "films": 16,
            "rating": 6.993750000000001,
            "views": 3246290007
          },
          {
            "actor": "Terence Stamp",
            "actorID": "nm0000654",
            "films": 28,
            "rating": 6.325000000000001,
            "views": 3237560553
          },
          {
            "actor": "Dennis Quaid",
            "actorID": "nm0000598",
            "films": 54,
            "rating": 6.3888888888888875,
            "views": 3236459506
          },
          {
            "actor": "Greg Grunberg",
            "actorID": "nm0342399",
            "films": 13,
            "rating": 6.338461538461539,
            "views": 3227007927
          },
          {
            "actor": "Mel Brooks",
            "actorID": "nm0000316",
            "films": 16,
            "rating": 6.51875,
            "views": 3226338065
          },
          {
            "actor": "Javier Botet",
            "actorID": "nm2306701",
            "films": 11,
            "rating": 6.245454545454544,
            "views": 3225029408
          },
          {
            "actor": "Adewale Akinnuoye-Agbaje",
            "actorID": "nm0015382",
            "films": 18,
            "rating": 6.233333333333335,
            "views": 3223857961
          },
          {
            "actor": "Garry Shandling",
            "actorID": "nm0788009",
            "films": 12,
            "rating": 6.333333333333333,
            "views": 3222256011
          },
          {
            "actor": "Kevin Kline",
            "actorID": "nm0000177",
            "films": 37,
            "rating": 6.583783783783784,
            "views": 3214698906
          },
          {
            "actor": "Molly Shannon",
            "actorID": "nm0788340",
            "films": 26,
            "rating": 6.073076923076924,
            "views": 3214663212
          },
          {
            "actor": "Dylan Baker",
            "actorID": "nm0048414",
            "films": 36,
            "rating": 6.522222222222222,
            "views": 3209618240
          },
          {
            "actor": "Michelle Yeoh",
            "actorID": "nm0000706",
            "films": 13,
            "rating": 6.715384615384616,
            "views": 3206015628
          },
          {
            "actor": "R. Lee Ermey",
            "actorID": "nm0000388",
            "films": 27,
            "rating": 6.814814814814815,
            "views": 3200080519
          },
          {
            "actor": "Wanda Sykes",
            "actorID": "nm0843100",
            "films": 16,
            "rating": 5.756249999999999,
            "views": 3196884315
          },
          {
            "actor": "Graham Greene",
            "actorID": "nm0001295",
            "films": 17,
            "rating": 6.576470588235294,
            "views": 3195709287
          },
          {
            "actor": "James Rebhorn",
            "actorID": "nm0714310",
            "films": 37,
            "rating": 6.451351351351351,
            "views": 3183915353
          },
          {
            "actor": "Rachel Weisz",
            "actorID": "nm0001838",
            "films": 41,
            "rating": 6.558536585365853,
            "views": 3182233703
          },
          {
            "actor": "Sam Claflin",
            "actorID": "nm3510471",
            "films": 13,
            "rating": 6.615384615384614,
            "views": 3175720434
          },
          {
            "actor": "Renee Zellweger",
            "actorID": "nm0000250",
            "films": 27,
            "rating": 6.522222222222221,
            "views": 3174397302
          },
          {
            "actor": "Jemaine Clement",
            "actorID": "nm1318596",
            "films": 12,
            "rating": 6.758333333333333,
            "views": 3169168725
          },
          {
            "actor": "Shaun Toub",
            "actorID": "nm0869467",
            "films": 13,
            "rating": 6.661538461538464,
            "views": 3167022820
          },
          {
            "actor": "Christine Baranski",
            "actorID": "nm0004724",
            "films": 27,
            "rating": 6.325925925925925,
            "views": 3166830112
          },
          {
            "actor": "Billy Crystal",
            "actorID": "nm0000345",
            "films": 24,
            "rating": 6.541666666666668,
            "views": 3166609558
          },
          {
            "actor": "Joe Pantoliano",
            "actorID": "nm0001592",
            "films": 33,
            "rating": 6.257575757575758,
            "views": 3166547741
          },
          {
            "actor": "Dan Hedaya",
            "actorID": "nm0000445",
            "films": 42,
            "rating": 6.404761904761906,
            "views": 3165354595
          },
          {
            "actor": "Edward Norton",
            "actorID": "nm0001570",
            "films": 30,
            "rating": 7.113333333333334,
            "views": 3161513523
          },
          {
            "actor": "Casey Affleck",
            "actorID": "nm0000729",
            "films": 29,
            "rating": 6.651724137931034,
            "views": 3159167544
          },
          {
            "actor": "Oliver Platt",
            "actorID": "nm0001624",
            "films": 35,
            "rating": 6.482857142857142,
            "views": 3156495190
          },
          {
            "actor": "Jeff Bennett",
            "actorID": "nm0071818",
            "films": 14,
            "rating": 6.707142857142857,
            "views": 3151430689
          },
          {
            "actor": "Tony Hale",
            "actorID": "nm0355024",
            "films": 17,
            "rating": 6.276470588235294,
            "views": 3150554573
          },
          {
            "actor": "Michael Madsen",
            "actorID": "nm0000514",
            "films": 29,
            "rating": 6.389655172413793,
            "views": 3149665139
          },
          {
            "actor": "P.J. Byrne",
            "actorID": "nm0126260",
            "films": 22,
            "rating": 6.195454545454547,
            "views": 3143027593
          },
          {
            "actor": "Joel David Moore",
            "actorID": "nm0601376",
            "films": 10,
            "rating": 6.030000000000001,
            "views": 3134258785
          },
          {
            "actor": "Eric Bana",
            "actorID": "nm0051509",
            "films": 17,
            "rating": 7.017647058823529,
            "views": 3134190913
          },
          {
            "actor": "Kathryn Hahn",
            "actorID": "nm1063517",
            "films": 27,
            "rating": 6.481481481481482,
            "views": 3125876625
          },
          {
            "actor": "Estelle Harris",
            "actorID": "nm0364680",
            "films": 12,
            "rating": 6.708333333333333,
            "views": 3120140362
          },
          {
            "actor": "Rowan Atkinson",
            "actorID": "nm0000100",
            "films": 15,
            "rating": 6.6,
            "views": 3117373541
          },
          {
            "actor": "Frances Fisher",
            "actorID": "nm0004920",
            "films": 22,
            "rating": 6.363636363636366,
            "views": 3116102356
          },
          {
            "actor": "David Harbour",
            "actorID": "nm1092086",
            "films": 18,
            "rating": 6.588888888888888,
            "views": 3115034778
          },
          {
            "actor": "James Nesbitt",
            "actorID": "nm0626362",
            "films": 12,
            "rating": 7.2250000000000005,
            "views": 3113471988
          },
          {
            "actor": "Tony Curran",
            "actorID": "nm0192889",
            "films": 18,
            "rating": 6.51111111111111,
            "views": 3109033894
          },
          {
            "actor": "Stephen Tobolowsky",
            "actorID": "nm0864997",
            "films": 48,
            "rating": 6.150000000000001,
            "views": 3101461260
          },
          {
            "actor": "Michael Rooker",
            "actorID": "nm0740264",
            "films": 26,
            "rating": 6.680769230769231,
            "views": 3100169893
          },
          {
            "actor": "Jeff Bridges",
            "actorID": "nm0000313",
            "films": 47,
            "rating": 6.672340425531916,
            "views": 3099016058
          },
          {
            "actor": "Toby Kebbell",
            "actorID": "nm1527905",
            "films": 18,
            "rating": 6.688888888888888,
            "views": 3098129254
          },
          {
            "actor": "Bruce McGill",
            "actorID": "nm0569226",
            "films": 40,
            "rating": 6.589999999999999,
            "views": 3095585490
          },
          {
            "actor": "Pete Postlethwaite",
            "actorID": "nm0000592",
            "films": 22,
            "rating": 6.931818181818182,
            "views": 3091781471
          },
          {
            "actor": "Richard Steven Horvitz",
            "actorID": "nm0395777",
            "films": 19,
            "rating": 6.278947368421052,
            "views": 3074378752
          },
          {
            "actor": "David Spade",
            "actorID": "nm0005450",
            "films": 28,
            "rating": 6,
            "views": 3073034608
          },
          {
            "actor": "Matt Walsh",
            "actorID": "nm0909768",
            "films": 25,
            "rating": 6.292000000000001,
            "views": 3064517190
          },
          {
            "actor": "Harry Dean Stanton",
            "actorID": "nm0001765",
            "films": 43,
            "rating": 6.502325581395347,
            "views": 3061384808
          },
          {
            "actor": "John Michael Higgins",
            "actorID": "nm0383422",
            "films": 26,
            "rating": 6.346153846153846,
            "views": 3060659643
          },
          {
            "actor": "Albert Finney",
            "actorID": "nm0001215",
            "films": 19,
            "rating": 7.031578947368421,
            "views": 3059391866
          },
          {
            "actor": "Jennifer Aniston",
            "actorID": "nm0000098",
            "films": 31,
            "rating": 6.135483870967741,
            "views": 3058900603
          },
          {
            "actor": "Miranda Richardson",
            "actorID": "nm0001669",
            "films": 28,
            "rating": 6.710714285714287,
            "views": 3048206407
          },
          {
            "actor": "Jim Carter",
            "actorID": "nm0141697",
            "films": 27,
            "rating": 6.474074074074071,
            "views": 3045130498
          },
          {
            "actor": "Joel Edgerton",
            "actorID": "nm0249291",
            "films": 21,
            "rating": 6.795238095238095,
            "views": 3044798789
          },
          {
            "actor": "Martin Sheen",
            "actorID": "nm0000640",
            "films": 28,
            "rating": 6.74285714285714,
            "views": 3043240274
          },
          {
            "actor": "Andy Samberg",
            "actorID": "nm1676221",
            "films": 18,
            "rating": 6.394444444444443,
            "views": 3043206357
          },
          {
            "actor": "Wes Bentley",
            "actorID": "nm0004747",
            "films": 16,
            "rating": 6.375000000000001,
            "views": 3035926794
          },
          {
            "actor": "Scott Eastwood",
            "actorID": "nm2207222",
            "films": 10,
            "rating": 6.9399999999999995,
            "views": 3035197161
          },
          {
            "actor": "Vera Farmiga",
            "actorID": "nm0267812",
            "films": 22,
            "rating": 6.736363636363637,
            "views": 3034913118
          },
          {
            "actor": "Hugh Grant",
            "actorID": "nm0000424",
            "films": 31,
            "rating": 6.641935483870969,
            "views": 3034714513
          },
          {
            "actor": "Derek Mears",
            "actorID": "nm0575216",
            "films": 16,
            "rating": 6.01875,
            "views": 3034288983
          },
          {
            "actor": "Flea",
            "actorID": "nm0281359",
            "films": 18,
            "rating": 6.733333333333333,
            "views": 3017279595
          },
          {
            "actor": "Nick Swardson",
            "actorID": "nm0841910",
            "films": 20,
            "rating": 5.755000000000001,
            "views": 3017025610
          },
          {
            "actor": "Brad Dourif",
            "actorID": "nm0000374",
            "films": 31,
            "rating": 6.232258064516129,
            "views": 3015721698
          },
          {
            "actor": "Anthony Anderson",
            "actorID": "nm0026364",
            "films": 25,
            "rating": 6.0840000000000005,
            "views": 3012647930
          },
          {
            "actor": "Hayden Christensen",
            "actorID": "nm0159789",
            "films": 15,
            "rating": 6.420000000000001,
            "views": 3010706052
          },
          {
            "actor": "Jonathan Pryce",
            "actorID": "nm0000596",
            "films": 28,
            "rating": 6.471428571428571,
            "views": 3003868496
          },
          {
            "actor": "Bill Camp",
            "actorID": "nm0131966",
            "films": 28,
            "rating": 6.882142857142858,
            "views": 3001039721
          },
          {
            "actor": "Tracey Walter",
            "actorID": "nm0910145",
            "films": 44,
            "rating": 6.343181818181818,
            "views": 2995263144
          },
          {
            "actor": "Zeljko Ivanek",
            "actorID": "nm0411964",
            "films": 28,
            "rating": 6.917857142857142,
            "views": 2993600590
          },
          {
            "actor": "Derek Jacobi",
            "actorID": "nm0001394",
            "films": 19,
            "rating": 6.989473684210527,
            "views": 2993159520
          },
          {
            "actor": "Al Sapienza",
            "actorID": "nm0002326",
            "films": 16,
            "rating": 6.331249999999999,
            "views": 2992844393
          },
          {
            "actor": "Rhys Ifans",
            "actorID": "nm0406975",
            "films": 26,
            "rating": 6.457692307692308,
            "views": 2991771637
          },
          {
            "actor": "Juno Temple",
            "actorID": "nm1017334",
            "films": 23,
            "rating": 6.582608695652175,
            "views": 2988409680
          },
          {
            "actor": "Gary Sinise",
            "actorID": "nm0000641",
            "films": 17,
            "rating": 6.694117647058824,
            "views": 2978865013
          },
          {
            "actor": "Catherine O'Hara",
            "actorID": "nm0001573",
            "films": 30,
            "rating": 6.6433333333333335,
            "views": 2973057666
          },
          {
            "actor": "Patrick Gallagher",
            "actorID": "nm0302466",
            "films": 10,
            "rating": 6.419999999999999,
            "views": 2967264486
          },
          {
            "actor": "Jay Hernandez",
            "actorID": "nm0379596",
            "films": 18,
            "rating": 6.138888888888889,
            "views": 2964217591
          },
          {
            "actor": "Josh Stewart",
            "actorID": "nm1577637",
            "films": 11,
            "rating": 7.0636363636363635,
            "views": 2959869369
          },
          {
            "actor": "Sung Kang",
            "actorID": "nm0437646",
            "films": 12,
            "rating": 6.566666666666666,
            "views": 2956194743
          },
          {
            "actor": "Austin Pendleton",
            "actorID": "nm0671721",
            "films": 26,
            "rating": 6.346153846153846,
            "views": 2952159874
          },
          {
            "actor": "Thomas Haden Church",
            "actorID": "nm0002006",
            "films": 23,
            "rating": 6.282608695652174,
            "views": 2945204885
          },
          {
            "actor": "Emily Mortimer",
            "actorID": "nm0607865",
            "films": 28,
            "rating": 6.746428571428572,
            "views": 2943991362
          },
          {
            "actor": "Margot Robbie",
            "actorID": "nm3053338",
            "films": 15,
            "rating": 6.7733333333333325,
            "views": 2936911303
          },
          {
            "actor": "Michael Gough",
            "actorID": "nm0001284",
            "films": 17,
            "rating": 6.535294117647059,
            "views": 2934425644
          },
          {
            "actor": "Jared Harris",
            "actorID": "nm0364813",
            "films": 31,
            "rating": 6.52258064516129,
            "views": 2931375807
          },
          {
            "actor": "Martin Starr",
            "actorID": "nm0771414",
            "films": 13,
            "rating": 6.738461538461538,
            "views": 2931108128
          },
          {
            "actor": "Sally Hawkins",
            "actorID": "nm1020089",
            "films": 19,
            "rating": 7.052631578947368,
            "views": 2922178364
          },
          {
            "actor": "Richard Cetrone",
            "actorID": "nm0149150",
            "films": 12,
            "rating": 6.291666666666667,
            "views": 2915488561
          },
          {
            "actor": "Jennifer Coolidge",
            "actorID": "nm0177639",
            "films": 28,
            "rating": 5.814285714285715,
            "views": 2915172195
          },
          {
            "actor": "Megan Fox",
            "actorID": "nm1083271",
            "films": 12,
            "rating": 5.808333333333334,
            "views": 2912465195
          },
          {
            "actor": "Rebel Wilson",
            "actorID": "nm2313103",
            "films": 15,
            "rating": 6.2,
            "views": 2903750112
          },
          {
            "actor": "Aidan Gillen",
            "actorID": "nm0318821",
            "films": 10,
            "rating": 6.93,
            "views": 2901697769
          },
          {
            "actor": "Mila Kunis",
            "actorID": "nm0005109",
            "films": 19,
            "rating": 6.173684210526315,
            "views": 2897540013
          },
          {
            "actor": "Leigh Whannell",
            "actorID": "nm1191481",
            "films": 12,
            "rating": 6.358333333333333,
            "views": 2896548382
          },
          {
            "actor": "Rip Torn",
            "actorID": "nm0001800",
            "films": 32,
            "rating": 6.0718749999999995,
            "views": 2894494929
          },
          {
            "actor": "Billy Bob Thornton",
            "actorID": "nm0000671",
            "films": 36,
            "rating": 6.647222222222222,
            "views": 2889428577
          },
          {
            "actor": "Randall Park",
            "actorID": "nm1320827",
            "films": 17,
            "rating": 6.2176470588235295,
            "views": 2888738950
          },
          {
            "actor": "Laura Dern",
            "actorID": "nm0000368",
            "films": 29,
            "rating": 6.834482758620688,
            "views": 2887472951
          },
          {
            "actor": "Clint Eastwood",
            "actorID": "nm0000142",
            "films": 27,
            "rating": 6.725925925925925,
            "views": 2884959035
          },
          {
            "actor": "Aaron Eckhart",
            "actorID": "nm0001173",
            "films": 27,
            "rating": 6.4148148148148145,
            "views": 2881642099
          },
          {
            "actor": "Ty Burrell",
            "actorID": "nm0123092",
            "films": 15,
            "rating": 6.566666666666666,
            "views": 2878630324
          },
          {
            "actor": "Maggie Grace",
            "actorID": "nm1192254",
            "films": 11,
            "rating": 6.036363636363635,
            "views": 2878432636
          },
          {
            "actor": "Celia Imrie",
            "actorID": "nm0408309",
            "films": 18,
            "rating": 6.411111111111112,
            "views": 2877838748
          },
          {
            "actor": "Bill Cobbs",
            "actorID": "nm0167850",
            "films": 35,
            "rating": 6.317142857142857,
            "views": 2870901139
          },
          {
            "actor": "Ewen Bremner",
            "actorID": "nm0001971",
            "films": 21,
            "rating": 6.8047619047619055,
            "views": 2861365419
          },
          {
            "actor": "Jason Clarke",
            "actorID": "nm0164809",
            "films": 22,
            "rating": 6.486363636363637,
            "views": 2861092996
          },
          {
            "actor": "Elle Fanning",
            "actorID": "nm1102577",
            "films": 25,
            "rating": 6.755999999999998,
            "views": 2854561699
          },
          {
            "actor": "Mckenna Grace",
            "actorID": "nm5085683",
            "films": 10,
            "rating": 6.5200000000000005,
            "views": 2853348458
          },
          {
            "actor": "Nick Nolte",
            "actorID": "nm0000560",
            "films": 41,
            "rating": 6.482926829268291,
            "views": 2852763400
          },
          {
            "actor": "M.C. Gainey",
            "actorID": "nm0301370",
            "films": 34,
            "rating": 6.038235294117648,
            "views": 2851168460
          },
          {
            "actor": "Harry Lennix",
            "actorID": "nm0502015",
            "films": 19,
            "rating": 6.689473684210527,
            "views": 2845509201
          },
          {
            "actor": "Max Martini",
            "actorID": "nm0242882",
            "films": 14,
            "rating": 6.264285714285713,
            "views": 2844661212
          },
          {
            "actor": "Larry Miller",
            "actorID": "nm0588777",
            "films": 36,
            "rating": 6.1055555555555525,
            "views": 2835130025
          },
          {
            "actor": "Justin Theroux",
            "actorID": "nm0857620",
            "films": 18,
            "rating": 6.411111111111112,
            "views": 2834649362
          },
          {
            "actor": "Justin Long",
            "actorID": "nm0519043",
            "films": 30,
            "rating": 5.913333333333333,
            "views": 2831229550
          },
          {
            "actor": "John Cho",
            "actorID": "nm0158626",
            "films": 24,
            "rating": 6.491666666666667,
            "views": 2830097908
          },
          {
            "actor": "Kevin Durand",
            "actorID": "nm0243806",
            "films": 19,
            "rating": 6.21578947368421,
            "views": 2828321490
          },
          {
            "actor": "Aasif Mandvi",
            "actorID": "nm0541902",
            "films": 19,
            "rating": 6.310526315789475,
            "views": 2823737210
          },
          {
            "actor": "Patricia Clarkson",
            "actorID": "nm0165101",
            "films": 34,
            "rating": 6.814705882352941,
            "views": 2820914456
          },
          {
            "actor": "Sam Rockwell",
            "actorID": "nm0005377",
            "films": 38,
            "rating": 6.78421052631579,
            "views": 2820609386
          },
          {
            "actor": "Bryan Callen",
            "actorID": "nm0130437",
            "films": 11,
            "rating": 6.709090909090909,
            "views": 2820558550
          },
          {
            "actor": "Jeff Daniels",
            "actorID": "nm0001099",
            "films": 39,
            "rating": 6.725641025641025,
            "views": 2820115466
          },
          {
            "actor": "Reese Witherspoon",
            "actorID": "nm0000702",
            "films": 34,
            "rating": 6.500000000000001,
            "views": 2815156942
          },
          {
            "actor": "Fredric Lehne",
            "actorID": "nm0499791",
            "films": 10,
            "rating": 7.13,
            "views": 2813825865
          },
          {
            "actor": "Rebecca Ferguson",
            "actorID": "nm0272581",
            "films": 10,
            "rating": 6.529999999999999,
            "views": 2809168184
          },
          {
            "actor": "Annie Potts",
            "actorID": "nm0001633",
            "films": 13,
            "rating": 6.76923076923077,
            "views": 2808624449
          },
          {
            "actor": "Richard Harris",
            "actorID": "nm0001321",
            "films": 10,
            "rating": 6.88,
            "views": 2805049277
          },
          {
            "actor": "Javier Bardem",
            "actorID": "nm0000849",
            "films": 16,
            "rating": 6.96875,
            "views": 2799545108
          },
          {
            "actor": "Kevin Bacon",
            "actorID": "nm0000102",
            "films": 44,
            "rating": 6.613636363636362,
            "views": 2796979641
          },
          {
            "actor": "Jenette Goldstein",
            "actorID": "nm0001280",
            "films": 12,
            "rating": 6.583333333333333,
            "views": 2796676499
          },
          {
            "actor": "Kevin McNally",
            "actorID": "nm0573618",
            "films": 14,
            "rating": 6.671428571428572,
            "views": 2782413337
          },
          {
            "actor": "Michelle Williams",
            "actorID": "nm0931329",
            "films": 25,
            "rating": 6.735999999999999,
            "views": 2781652908
          },
          {
            "actor": "Beth Grant",
            "actorID": "nm0335275",
            "films": 36,
            "rating": 6.661111111111111,
            "views": 2778958758
          },
          {
            "actor": "Jack Nicholson",
            "actorID": "nm0000197",
            "films": 29,
            "rating": 6.717241379310345,
            "views": 2776660690
          },
          {
            "actor": "John Cusack",
            "actorID": "nm0000131",
            "films": 48,
            "rating": 6.675,
            "views": 2773869964
          },
          {
            "actor": "James Badge Dale",
            "actorID": "nm0197647",
            "films": 14,
            "rating": 6.978571428571429,
            "views": 2771860069
          },
          {
            "actor": "Rosemary Harris",
            "actorID": "nm0365281",
            "films": 11,
            "rating": 6.8909090909090915,
            "views": 2765401705
          },
          {
            "actor": "Monica Bellucci",
            "actorID": "nm0000899",
            "films": 13,
            "rating": 6.707692307692308,
            "views": 2765205472
          },
          {
            "actor": "Melissa McCarthy",
            "actorID": "nm0565250",
            "films": 24,
            "rating": 6.262499999999998,
            "views": 2764345614
          },
          {
            "actor": "Rodrigo Santoro",
            "actorID": "nm0763928",
            "films": 15,
            "rating": 6.586666666666667,
            "views": 2762619575
          },
          {
            "actor": "Timothy Dalton",
            "actorID": "nm0001096",
            "films": 13,
            "rating": 6.384615384615385,
            "views": 2761387829
          },
          {
            "actor": "Jeremy Piven",
            "actorID": "nm0005315",
            "films": 33,
            "rating": 6.672727272727272,
            "views": 2759851580
          },
          {
            "actor": "Michael Byrne",
            "actorID": "nm0126250",
            "films": 17,
            "rating": 6.394117647058825,
            "views": 2753488745
          },
          {
            "actor": "Kate McKinnon",
            "actorID": "nm0571952",
            "films": 12,
            "rating": 6.324999999999999,
            "views": 2753179625
          },
          {
            "actor": "Miguel Ferrer",
            "actorID": "nm0001208",
            "films": 20,
            "rating": 6.155,
            "views": 2752365409
          },
          {
            "actor": "Billy Crudup",
            "actorID": "nm0001082",
            "films": 25,
            "rating": 6.9,
            "views": 2752016769
          },
          {
            "actor": "Nathan Fillion",
            "actorID": "nm0277213",
            "films": 12,
            "rating": 6.908333333333332,
            "views": 2751641444
          },
          {
            "actor": "Nicky Katt",
            "actorID": "nm0441588",
            "films": 28,
            "rating": 6.678571428571429,
            "views": 2751551521
          },
          {
            "actor": "Michael Stuhlbarg",
            "actorID": "nm0836121",
            "films": 18,
            "rating": 7.283333333333331,
            "views": 2750791642
          },
          {
            "actor": "Rachael Harris",
            "actorID": "nm0006713",
            "films": 20,
            "rating": 6.264999999999999,
            "views": 2749480070
          },
          {
            "actor": "Richard E. Grant",
            "actorID": "nm0001290",
            "films": 27,
            "rating": 6.611111111111111,
            "views": 2746876191
          },
          {
            "actor": "Barry Pepper",
            "actorID": "nm0001608",
            "films": 18,
            "rating": 6.5666666666666655,
            "views": 2746821445
          },
          {
            "actor": "Brendan Fraser",
            "actorID": "nm0000409",
            "films": 31,
            "rating": 6.077419354838712,
            "views": 2746272527
          },
          {
            "actor": "Jason Marsden",
            "actorID": "nm0005189",
            "films": 12,
            "rating": 6.566666666666666,
            "views": 2739520430
          },
          {
            "actor": "Colin Hanks",
            "actorID": "nm0004988",
            "films": 13,
            "rating": 6.246153846153847,
            "views": 2736116931
          },
          {
            "actor": "Dennis Haysbert",
            "actorID": "nm0371660",
            "films": 28,
            "rating": 6.4642857142857135,
            "views": 2728885797
          },
          {
            "actor": "Chris Parnell",
            "actorID": "nm0663177",
            "films": 19,
            "rating": 6.231578947368422,
            "views": 2725397109
          },
          {
            "actor": "Catherine Zeta-Jones",
            "actorID": "nm0001876",
            "films": 22,
            "rating": 6.204545454545454,
            "views": 2725155873
          },
          {
            "actor": "Paul Dooley",
            "actorID": "nm0233209",
            "films": 26,
            "rating": 6.288461538461538,
            "views": 2717980080
          },
          {
            "actor": "Jimmy Smits",
            "actorID": "nm0001751",
            "films": 12,
            "rating": 6.374999999999999,
            "views": 2714619150
          },
          {
            "actor": "Wade Williams",
            "actorID": "nm0931898",
            "films": 10,
            "rating": 6.769999999999999,
            "views": 2713758452
          },
          {
            "actor": "Salma Hayek",
            "actorID": "nm0000161",
            "films": 30,
            "rating": 6.363333333333334,
            "views": 2711524696
          },
          {
            "actor": "Clancy Brown",
            "actorID": "nm0000317",
            "films": 31,
            "rating": 6.522580645161291,
            "views": 2708561938
          },
          {
            "actor": "Steve Martin",
            "actorID": "nm0000188",
            "films": 38,
            "rating": 6.265789473684211,
            "views": 2706077406
          },
          {
            "actor": "Christopher Heyerdahl",
            "actorID": "nm0382216",
            "films": 10,
            "rating": 5.58,
            "views": 2704240798
          },
          {
            "actor": "Keri Russell",
            "actorID": "nm0005392",
            "films": 13,
            "rating": 6.738461538461539,
            "views": 2702557419
          },
          {
            "actor": "Xander Berkeley",
            "actorID": "nm0075359",
            "films": 40,
            "rating": 6.519999999999999,
            "views": 2701368441
          },
          {
            "actor": "Lindsay Duncan",
            "actorID": "nm0242026",
            "films": 13,
            "rating": 6.823076923076924,
            "views": 2700891737
          },
          {
            "actor": "Kyle Chandler",
            "actorID": "nm0151419",
            "films": 16,
            "rating": 6.987500000000001,
            "views": 2697318417
          },
          {
            "actor": "Becky Ann Baker",
            "actorID": "nm0048250",
            "films": 20,
            "rating": 6.544999999999999,
            "views": 2695334496
          },
          {
            "actor": "Charlie Day",
            "actorID": "nm0206359",
            "films": 13,
            "rating": 6.415384615384615,
            "views": 2694371136
          },
          {
            "actor": "Richard Gere",
            "actorID": "nm0000152",
            "films": 33,
            "rating": 6.160606060606059,
            "views": 2693872470
          },
          {
            "actor": "Rainn Wilson",
            "actorID": "nm0933988",
            "films": 17,
            "rating": 6.235294117647059,
            "views": 2692100537
          },
          {
            "actor": "Jai Courtney",
            "actorID": "nm2541974",
            "films": 11,
            "rating": 6.490909090909091,
            "views": 2686014185
          },
          {
            "actor": "Ed O'Neill",
            "actorID": "nm0642145",
            "films": 20,
            "rating": 6.520000000000001,
            "views": 2685065490
          },
          {
            "actor": "Embeth Davidtz",
            "actorID": "nm0001110",
            "films": 18,
            "rating": 6.888888888888889,
            "views": 2682519883
          },
          {
            "actor": "Patrick Dempsey",
            "actorID": "nm0001131",
            "films": 21,
            "rating": 6.199999999999999,
            "views": 2681462215
          },
          {
            "actor": "Erick Avari",
            "actorID": "nm0042805",
            "films": 19,
            "rating": 5.86842105263158,
            "views": 2679374250
          },
          {
            "actor": "Keith Szarabajka",
            "actorID": "nm0843775",
            "films": 11,
            "rating": 6.863636363636365,
            "views": 2678380802
          },
          {
            "actor": "Daniel Mays",
            "actorID": "nm0990547",
            "films": 14,
            "rating": 7.1499999999999995,
            "views": 2671001701
          },
          {
            "actor": "Steve Blum",
            "actorID": "nm0089710",
            "films": 12,
            "rating": 7.241666666666667,
            "views": 2669191479
          },
          {
            "actor": "Dolph Lundgren",
            "actorID": "nm0000185",
            "films": 15,
            "rating": 6.146666666666667,
            "views": 2666483278
          },
          {
            "actor": "Julian Glover",
            "actorID": "nm0002103",
            "films": 12,
            "rating": 7.008333333333333,
            "views": 2663467944
          },
          {
            "actor": "Mark Hamill",
            "actorID": "nm0000434",
            "films": 12,
            "rating": 6.608333333333333,
            "views": 2661302791
          },
          {
            "actor": "Jason Lee",
            "actorID": "nm0005134",
            "films": 24,
            "rating": 6.366666666666666,
            "views": 2658429505
          },
          {
            "actor": "Dave Franco",
            "actorID": "nm2002649",
            "films": 18,
            "rating": 6.7,
            "views": 2655940939
          },
          {
            "actor": "Nathan Lane",
            "actorID": "nm0001447",
            "films": 24,
            "rating": 6.295833333333333,
            "views": 2652347390
          },
          {
            "actor": "Al Pacino",
            "actorID": "nm0000199",
            "films": 31,
            "rating": 6.712903225806451,
            "views": 2645644291
          },
          {
            "actor": "Gregg Henry",
            "actorID": "nm0001344",
            "films": 16,
            "rating": 6.6499999999999995,
            "views": 2644702252
          },
          {
            "actor": "Neil Patrick Harris",
            "actorID": "nm0000439",
            "films": 15,
            "rating": 6.3133333333333335,
            "views": 2638141289
          },
          {
            "actor": "Mark Margolis",
            "actorID": "nm0546797",
            "films": 36,
            "rating": 6.675000000000001,
            "views": 2632694658
          },
          {
            "actor": "William H. Macy",
            "actorID": "nm0000513",
            "films": 47,
            "rating": 6.774468085106382,
            "views": 2631576300
          },
          {
            "actor": "Connie Nielsen",
            "actorID": "nm0001567",
            "films": 18,
            "rating": 6.605555555555557,
            "views": 2630572491
          },
          {
            "actor": "Angus Wright",
            "actorID": "nm0942202",
            "films": 14,
            "rating": 6.6642857142857155,
            "views": 2628785107
          },
          {
            "actor": "Jonathan Banks",
            "actorID": "nm0052186",
            "films": 19,
            "rating": 6.2368421052631575,
            "views": 2627716326
          },
          {
            "actor": "Sean Connery",
            "actorID": "nm0000125",
            "films": 27,
            "rating": 6.425925925925925,
            "views": 2615058410
          },
          {
            "actor": "Verne Troyer",
            "actorID": "nm0873942",
            "films": 14,
            "rating": 6.021428571428571,
            "views": 2613796349
          },
          {
            "actor": "Elden Henson",
            "actorID": "nm0711805",
            "films": 21,
            "rating": 6.385714285714285,
            "views": 2601871431
          },
          {
            "actor": "Patton Oswalt",
            "actorID": "nm0652663",
            "films": 22,
            "rating": 6.377272727272726,
            "views": 2599672593
          },
          {
            "actor": "Tim Blake Nelson",
            "actorID": "nm0625789",
            "films": 27,
            "rating": 6.466666666666664,
            "views": 2599542007
          },
          {
            "actor": "Christopher Lloyd",
            "actorID": "nm0000502",
            "films": 35,
            "rating": 6.245714285714285,
            "views": 2599311782
          },
          {
            "actor": "B.J. Novak",
            "actorID": "nm1145983",
            "films": 10,
            "rating": 6.7299999999999995,
            "views": 2598761164
          },
          {
            "actor": "Tommy Flanagan",
            "actorID": "nm0281107",
            "films": 14,
            "rating": 6.95,
            "views": 2594780357
          },
          {
            "actor": "Brian Stepanek",
            "actorID": "nm0826745",
            "films": 12,
            "rating": 6.633333333333333,
            "views": 2594610971
          },
          {
            "actor": "Cliff Robertson",
            "actorID": "nm0731772",
            "films": 10,
            "rating": 6.510000000000001,
            "views": 2591362263
          },
          {
            "actor": "James Cosmo",
            "actorID": "nm0181920",
            "films": 14,
            "rating": 6.728571428571428,
            "views": 2588429349
          },
          {
            "actor": "Marcia Gay Harden",
            "actorID": "nm0001315",
            "films": 25,
            "rating": 6.364,
            "views": 2588107564
          },
          {
            "actor": "Thandiwe Newton",
            "actorID": "nm0628601",
            "films": 20,
            "rating": 6.380000000000001,
            "views": 2576038675
          },
          {
            "actor": "Nick Searcy",
            "actorID": "nm0780678",
            "films": 25,
            "rating": 6.675999999999998,
            "views": 2575945120
          },
          {
            "actor": "Crispin Glover",
            "actorID": "nm0000417",
            "films": 25,
            "rating": 6.207999999999998,
            "views": 2575879480
          },
          {
            "actor": "John Hawkes",
            "actorID": "nm0370035",
            "films": 32,
            "rating": 6.356249999999998,
            "views": 2568580440
          },
          {
            "actor": "Scott Adkins",
            "actorID": "nm0012078",
            "films": 15,
            "rating": 6.306666666666667,
            "views": 2565402203
          },
          {
            "actor": "Elizabeth Debicki",
            "actorID": "nm4456120",
            "films": 10,
            "rating": 6.99,
            "views": 2564626294
          },
          {
            "actor": "Amy Hill",
            "actorID": "nm0384032",
            "films": 18,
            "rating": 5.938888888888888,
            "views": 2562017790
          },
          {
            "actor": "Kodi Smit-McPhee",
            "actorID": "nm2240346",
            "films": 10,
            "rating": 6.93,
            "views": 2555622223
          },
          {
            "actor": "Amber Heard",
            "actorID": "nm1720028",
            "films": 20,
            "rating": 6.120000000000001,
            "views": 2551825687
          },
          {
            "actor": "Amanda Seyfried",
            "actorID": "nm1086543",
            "films": 22,
            "rating": 6.3136363636363635,
            "views": 2550290790
          },
          {
            "actor": "George Lopez",
            "actorID": "nm0520064",
            "films": 14,
            "rating": 5.464285714285714,
            "views": 2547806232
          },
          {
            "actor": "Scoot McNairy",
            "actorID": "nm1058940",
            "films": 20,
            "rating": 6.540000000000001,
            "views": 2547508330
          },
          {
            "actor": "Dan Fogler",
            "actorID": "nm0283945",
            "films": 10,
            "rating": 6.410000000000001,
            "views": 2545452150
          },
          {
            "actor": "Susan Sarandon",
            "actorID": "nm0000215",
            "films": 48,
            "rating": 6.414583333333334,
            "views": 2543634824
          },
          {
            "actor": "Jennifer Garner",
            "actorID": "nm0004950",
            "films": 26,
            "rating": 6.384615384615385,
            "views": 2543589208
          },
          {
            "actor": "Jean Reno",
            "actorID": "nm0000606",
            "films": 20,
            "rating": 6.35,
            "views": 2540806317
          },
          {
            "actor": "Russell Brand",
            "actorID": "nm1258970",
            "films": 10,
            "rating": 6.42,
            "views": 2536108141
          },
          {
            "actor": "Cary Elwes",
            "actorID": "nm0000144",
            "films": 24,
            "rating": 6.520833333333333,
            "views": 2532310887
          },
          {
            "actor": "Thomas F. Wilson",
            "actorID": "nm0001855",
            "films": 16,
            "rating": 6.462500000000001,
            "views": 2528858575
          },
          {
            "actor": "Olafur Darri Olafsson",
            "actorID": "nm0959963",
            "films": 11,
            "rating": 6.254545454545454,
            "views": 2528363298
          },
          {
            "actor": "Edi Gathegi",
            "actorID": "nm1346230",
            "films": 10,
            "rating": 6.070000000000001,
            "views": 2527950296
          },
          {
            "actor": "Robert Knepper",
            "actorID": "nm0460694",
            "films": 19,
            "rating": 6.205263157894738,
            "views": 2520547730
          },
          {
            "actor": "Nick Frost",
            "actorID": "nm0296545",
            "films": 18,
            "rating": 6.738888888888889,
            "views": 2519417011
          },
          {
            "actor": "Luenell",
            "actorID": "nm0132685",
            "films": 11,
            "rating": 6.5,
            "views": 2518794491
          },
          {
            "actor": "Diane Keaton",
            "actorID": "nm0000473",
            "films": 30,
            "rating": 6.243333333333335,
            "views": 2517178773
          },
          {
            "actor": "Alan Cumming",
            "actorID": "nm0001086",
            "films": 25,
            "rating": 5.796,
            "views": 2511669984
          },
          {
            "actor": "David Schwimmer",
            "actorID": "nm0001710",
            "films": 13,
            "rating": 6.323076923076924,
            "views": 2511623540
          },
          {
            "actor": "Sam Elliott",
            "actorID": "nm0000385",
            "films": 27,
            "rating": 6.566666666666666,
            "views": 2510517688
          },
          {
            "actor": "Isla Fisher",
            "actorID": "nm0279545",
            "films": 20,
            "rating": 6.510000000000001,
            "views": 2509428109
          },
          {
            "actor": "Chris O'Dowd",
            "actorID": "nm1483369",
            "films": 17,
            "rating": 6.764705882352943,
            "views": 2508214493
          },
          {
            "actor": "Josh Peck",
            "actorID": "nm0669681",
            "films": 13,
            "rating": 6.207692307692308,
            "views": 2507861293
          },
          {
            "actor": "Vincent Cassel",
            "actorID": "nm0001993",
            "films": 21,
            "rating": 6.966666666666666,
            "views": 2501983793
          },
          {
            "actor": "Robert Patrick",
            "actorID": "nm0001598",
            "films": 31,
            "rating": 6.064516129032258,
            "views": 2499171073
          },
          {
            "actor": "Zac Efron",
            "actorID": "nm1374980",
            "films": 20,
            "rating": 6.200000000000001,
            "views": 2494373328
          },
          {
            "actor": "Lukas Haas",
            "actorID": "nm0001305",
            "films": 25,
            "rating": 6.604,
            "views": 2489575514
          },
          {
            "actor": "Nick Kroll",
            "actorID": "nm1802209",
            "films": 17,
            "rating": 6.211764705882352,
            "views": 2488698802
          },
          {
            "actor": "J.B. Smoove",
            "actorID": "nm1356578",
            "films": 14,
            "rating": 5.942857142857142,
            "views": 2488336240
          },
          {
            "actor": "David Oyelowo",
            "actorID": "nm0654648",
            "films": 18,
            "rating": 6.627777777777778,
            "views": 2488050444
          },
          {
            "actor": "Craig Robinson",
            "actorID": "nm0732497",
            "films": 18,
            "rating": 6.111111111111111,
            "views": 2485878351
          },
          {
            "actor": "Bradley Whitford",
            "actorID": "nm0925966",
            "films": 32,
            "rating": 6.603125000000001,
            "views": 2485284726
          },
          {
            "actor": "Giannina Facio",
            "actorID": "nm0264857",
            "films": 11,
            "rating": 7.090909090909091,
            "views": 2482117985
          },
          {
            "actor": "Moises Arias",
            "actorID": "nm2030779",
            "films": 12,
            "rating": 6.458333333333333,
            "views": 2480216276
          },
          {
            "actor": "Danny Trejo",
            "actorID": "nm0001803",
            "films": 38,
            "rating": 6.3921052631578945,
            "views": 2474455622
          },
          {
            "actor": "Eva Green",
            "actorID": "nm1200692",
            "films": 13,
            "rating": 6.792307692307693,
            "views": 2473522083
          },
          {
            "actor": "Elizabeth Perkins",
            "actorID": "nm0001610",
            "films": 18,
            "rating": 6.2444444444444445,
            "views": 2470231491
          },
          {
            "actor": "Dave Foley",
            "actorID": "nm0004929",
            "films": 15,
            "rating": 6.1466666666666665,
            "views": 2468816585
          },
          {
            "actor": "Brent Spiner",
            "actorID": "nm0000653",
            "films": 18,
            "rating": 6.294444444444444,
            "views": 2465658486
          },
          {
            "actor": "Kristin Scott Thomas",
            "actorID": "nm0000218",
            "films": 27,
            "rating": 6.651851851851852,
            "views": 2464938944
          },
          {
            "actor": "Kevin Michael Richardson",
            "actorID": "nm0724656",
            "films": 20,
            "rating": 6.135,
            "views": 2463393656
          },
          {
            "actor": "Gene Hackman",
            "actorID": "nm0000432",
            "films": 45,
            "rating": 6.475555555555556,
            "views": 2463181253
          },
          {
            "actor": "Andrew Howard",
            "actorID": "nm0397110",
            "films": 12,
            "rating": 6.383333333333334,
            "views": 2462555169
          },
          {
            "actor": "Jon Bernthal",
            "actorID": "nm1256532",
            "films": 18,
            "rating": 7.050000000000001,
            "views": 2461198364
          },
          {
            "actor": "Jon Lovitz",
            "actorID": "nm0001484",
            "films": 33,
            "rating": 5.993939393939395,
            "views": 2460658595
          },
          {
            "actor": "Cheryl Howard",
            "actorID": "nm0397194",
            "films": 10,
            "rating": 6.87,
            "views": 2459313705
          },
          {
            "actor": "Julia Stiles",
            "actorID": "nm0005466",
            "films": 18,
            "rating": 6.511111111111111,
            "views": 2456050656
          },
          {
            "actor": "Said Taghmaoui",
            "actorID": "nm0846548",
            "films": 16,
            "rating": 6.731249999999999,
            "views": 2455107634
          },
          {
            "actor": "Brian Doyle-Murray",
            "actorID": "nm0236519",
            "films": 30,
            "rating": 6.166666666666666,
            "views": 2451614807
          },
          {
            "actor": "Demi Moore",
            "actorID": "nm0000193",
            "films": 31,
            "rating": 6.0032258064516135,
            "views": 2451402167
          },
          {
            "actor": "Doug Jones",
            "actorID": "nm0427964",
            "films": 28,
            "rating": 6.010714285714286,
            "views": 2449481117
          },
          {
            "actor": "Lucas Black",
            "actorID": "nm0085407",
            "films": 14,
            "rating": 6.742857142857143,
            "views": 2446786409
          },
          {
            "actor": "Dakota Johnson",
            "actorID": "nm0424848",
            "films": 15,
            "rating": 6.22,
            "views": 2444867215
          },
          {
            "actor": "Jason Flemyng",
            "actorID": "nm0002076",
            "films": 26,
            "rating": 6.63076923076923,
            "views": 2443785416
          },
          {
            "actor": "Peter Jacobson",
            "actorID": "nm0414772",
            "films": 20,
            "rating": 6.445,
            "views": 2440739048
          },
          {
            "actor": "Delroy Lindo",
            "actorID": "nm0005148",
            "films": 25,
            "rating": 6.5360000000000005,
            "views": 2439820963
          },
          {
            "actor": "Selena Gomez",
            "actorID": "nm1411125",
            "films": 13,
            "rating": 6.199999999999999,
            "views": 2438830870
          },
          {
            "actor": "Siobhan Fallon Hogan",
            "actorID": "nm0266441",
            "films": 26,
            "rating": 6.465384615384616,
            "views": 2435013252
          },
          {
            "actor": "Mark Boone Junior",
            "actorID": "nm0095478",
            "films": 34,
            "rating": 6.502941176470588,
            "views": 2434062918
          },
          {
            "actor": "Kerry Washington",
            "actorID": "nm0913488",
            "films": 15,
            "rating": 6.453333333333333,
            "views": 2432745027
          },
          {
            "actor": "Judd Lormand",
            "actorID": "nm1885015",
            "films": 12,
            "rating": 6.441666666666666,
            "views": 2432630266
          },
          {
            "actor": "David Tennant",
            "actorID": "nm0855039",
            "films": 10,
            "rating": 6.94,
            "views": 2432018304
          },
          {
            "actor": "William Sadler",
            "actorID": "nm0006669",
            "films": 23,
            "rating": 6.604347826086956,
            "views": 2431762712
          },
          {
            "actor": "Kenneth Choi",
            "actorID": "nm0158846",
            "films": 10,
            "rating": 6.640000000000001,
            "views": 2426307523
          },
          {
            "actor": "Dana Ivey",
            "actorID": "nm0412374",
            "films": 25,
            "rating": 6.536000000000001,
            "views": 2425488788
          },
          {
            "actor": "Martin Lawrence",
            "actorID": "nm0001454",
            "films": 23,
            "rating": 5.873913043478262,
            "views": 2422634218
          },
          {
            "actor": "Eddie Izzard",
            "actorID": "nm0412850",
            "films": 17,
            "rating": 6.264705882352941,
            "views": 2421108031
          },
          {
            "actor": "Marc John Jefferies",
            "actorID": "nm0420384",
            "films": 13,
            "rating": 5.984615384615385,
            "views": 2418382094
          },
          {
            "actor": "Giancarlo Esposito",
            "actorID": "nm0002064",
            "films": 32,
            "rating": 6.66875,
            "views": 2411600371
          },
          {
            "actor": "James Corden",
            "actorID": "nm0179479",
            "films": 16,
            "rating": 6.2562500000000005,
            "views": 2410971591
          },
          {
            "actor": "Jeremy Howard",
            "actorID": "nm0397386",
            "films": 12,
            "rating": 6.325000000000002,
            "views": 2409299077
          },
          {
            "actor": "David O'Hara",
            "actorID": "nm0641244",
            "films": 15,
            "rating": 6.820000000000001,
            "views": 2408553362
          },
          {
            "actor": "Margo Martindale",
            "actorID": "nm0553269",
            "films": 37,
            "rating": 6.521621621621622,
            "views": 2406563578
          },
          {
            "actor": "Terrence Howard",
            "actorID": "nm0005024",
            "films": 31,
            "rating": 6.370967741935484,
            "views": 2406466423
          },
          {
            "actor": "Erik von Detten",
            "actorID": "nm0902184",
            "films": 10,
            "rating": 6.42,
            "views": 2403021670
          },
          {
            "actor": "Ellie Kemper",
            "actorID": "nm2608689",
            "films": 10,
            "rating": 6.279999999999999,
            "views": 2401584891
          },
          {
            "actor": "Toni Collette",
            "actorID": "nm0001057",
            "films": 27,
            "rating": 6.703703703703702,
            "views": 2398397890
          },
          {
            "actor": "Justin Bartha",
            "actorID": "nm0058581",
            "films": 10,
            "rating": 5.909999999999999,
            "views": 2393880729
          },
          {
            "actor": "Ashley Johnson",
            "actorID": "nm0424534",
            "films": 11,
            "rating": 6.618181818181818,
            "views": 2393802245
          },
          {
            "actor": "James Spader",
            "actorID": "nm0000652",
            "films": 27,
            "rating": 6.31851851851852,
            "views": 2392521266
          },
          {
            "actor": "Harland Williams",
            "actorID": "nm0005558",
            "films": 18,
            "rating": 6.194444444444444,
            "views": 2388424478
          },
          {
            "actor": "Martin Short",
            "actorID": "nm0001737",
            "films": 26,
            "rating": 6.203846153846152,
            "views": 2385841522
          },
          {
            "actor": "Justin Timberlake",
            "actorID": "nm0005493",
            "films": 16,
            "rating": 6.21875,
            "views": 2383010891
          },
          {
            "actor": "Carrie Fisher",
            "actorID": "nm0000402",
            "films": 27,
            "rating": 6.448148148148148,
            "views": 2382954938
          },
          {
            "actor": "Val Kilmer",
            "actorID": "nm0000174",
            "films": 37,
            "rating": 6.4270270270270276,
            "views": 2379714012
          },
          {
            "actor": "Olivia Munn",
            "actorID": "nm1601397",
            "films": 11,
            "rating": 6.00909090909091,
            "views": 2377178084
          },
          {
            "actor": "Christopher Fairbank",
            "actorID": "nm0265457",
            "films": 16,
            "rating": 6.5625,
            "views": 2374417000
          },
          {
            "actor": "Ike Barinholtz",
            "actorID": "nm0054697",
            "films": 15,
            "rating": 5.513333333333334,
            "views": 2371265995
          },
          {
            "actor": "Carl Reiner",
            "actorID": "nm0005348",
            "films": 12,
            "rating": 6.575000000000002,
            "views": 2370490797
          },
          {
            "actor": "Mykelti Williamson",
            "actorID": "nm0932112",
            "films": 26,
            "rating": 6.488461538461538,
            "views": 2366270968
          },
          {
            "actor": "Richard Brake",
            "actorID": "nm0104114",
            "films": 16,
            "rating": 6.531249999999999,
            "views": 2361873331
          },
          {
            "actor": "Joe Pesci",
            "actorID": "nm0000582",
            "films": 25,
            "rating": 6.799999999999999,
            "views": 2361734594
          },
          {
            "actor": "Clifton Collins Jr.",
            "actorID": "nm0004286",
            "films": 30,
            "rating": 6.706666666666666,
            "views": 2360010136
          },
          {
            "actor": "Lucas Till",
            "actorID": "nm1395771",
            "films": 10,
            "rating": 6.4300000000000015,
            "views": 2356552735
          },
          {
            "actor": "Dana Carvey",
            "actorID": "nm0001022",
            "films": 16,
            "rating": 6.0062500000000005,
            "views": 2355510775
          },
          {
            "actor": "Jamie Chung",
            "actorID": "nm1512166",
            "films": 10,
            "rating": 6.069999999999999,
            "views": 2348355519
          },
          {
            "actor": "Eva Mendes",
            "actorID": "nm0578949",
            "films": 20,
            "rating": 6.140000000000001,
            "views": 2346898852
          },
          {
            "actor": "Scott Glenn",
            "actorID": "nm0001277",
            "films": 33,
            "rating": 6.578787878787879,
            "views": 2341450599
          },
          {
            "actor": "James Woods",
            "actorID": "nm0000249",
            "films": 40,
            "rating": 6.51,
            "views": 2331223014
          },
          {
            "actor": "Mary Steenburgen",
            "actorID": "nm0005460",
            "films": 34,
            "rating": 6.632352941176471,
            "views": 2328382970
          },
          {
            "actor": "Tom McCarthy",
            "actorID": "nm0565336",
            "films": 13,
            "rating": 6.453846153846154,
            "views": 2327278555
          },
          {
            "actor": "Jimmy Fallon",
            "actorID": "nm0266422",
            "films": 13,
            "rating": 5.96923076923077,
            "views": 2324336682
          },
          {
            "actor": "Alanna Ubach",
            "actorID": "nm0005513",
            "films": 16,
            "rating": 6.237499999999999,
            "views": 2324220562
          },
          {
            "actor": "Bob Gunton",
            "actorID": "nm0348409",
            "films": 33,
            "rating": 6.536363636363639,
            "views": 2321908317
          },
          {
            "actor": "Michael Kelly",
            "actorID": "nm0446672",
            "films": 14,
            "rating": 6.9642857142857135,
            "views": 2321299296
          },
          {
            "actor": "Shawn Roberts",
            "actorID": "nm0731575",
            "films": 16,
            "rating": 5.775000000000001,
            "views": 2316516447
          },
          {
            "actor": "Will Forte",
            "actorID": "nm0287182",
            "films": 23,
            "rating": 6.317391304347828,
            "views": 2312634902
          },
          {
            "actor": "Daniel Bruhl",
            "actorID": "nm0117709",
            "films": 13,
            "rating": 7.253846153846155,
            "views": 2311768393
          },
          {
            "actor": "Jean-Claude Van Damme",
            "actorID": "nm0000241",
            "films": 25,
            "rating": 5.868,
            "views": 2308704740
          },
          {
            "actor": "Michael J. Fox",
            "actorID": "nm0000150",
            "films": 23,
            "rating": 6.478260869565218,
            "views": 2303079935
          },
          {
            "actor": "Lin Shaye",
            "actorID": "nm0005417",
            "films": 42,
            "rating": 6.083333333333333,
            "views": 2301417179
          },
          {
            "actor": "Sean Whalen",
            "actorID": "nm0923490",
            "films": 16,
            "rating": 6.200000000000001,
            "views": 2301408449
          },
          {
            "actor": "M. Emmet Walsh",
            "actorID": "nm0001826",
            "films": 47,
            "rating": 6.3085106382978715,
            "views": 2297442360
          },
          {
            "actor": "Sam Raimi",
            "actorID": "nm0000600",
            "films": 13,
            "rating": 6.83846153846154,
            "views": 2296894118
          },
          {
            "actor": "Chloe Grace Moretz",
            "actorID": "nm1631269",
            "films": 25,
            "rating": 6.284000000000001,
            "views": 2295770746
          },
          {
            "actor": "Tony Goldwyn",
            "actorID": "nm0001282",
            "films": 18,
            "rating": 6.394444444444444,
            "views": 2294536662
          },
          {
            "actor": "Taraji P. Henson",
            "actorID": "nm0378245",
            "films": 19,
            "rating": 6.347368421052631,
            "views": 2293149327
          },
          {
            "actor": "Alan Arkin",
            "actorID": "nm0000273",
            "films": 35,
            "rating": 6.559999999999999,
            "views": 2290131856
          },
          {
            "actor": "Betty White",
            "actorID": "nm0924508",
            "films": 10,
            "rating": 6.24,
            "views": 2288931387
          },
          {
            "actor": "Michael Massee",
            "actorID": "nm0557219",
            "films": 13,
            "rating": 6.446153846153846,
            "views": 2288476315
          },
          {
            "actor": "David Ogden Stiers",
            "actorID": "nm0001773",
            "films": 23,
            "rating": 6.5608695652173905,
            "views": 2287968884
          },
          {
            "actor": "Hope Davis",
            "actorID": "nm0204706",
            "films": 21,
            "rating": 6.766666666666667,
            "views": 2284583413
          },
          {
            "actor": "Titus Welliver",
            "actorID": "nm0920038",
            "films": 17,
            "rating": 6.405882352941177,
            "views": 2281982537
          },
          {
            "actor": "Sean O'Bryan",
            "actorID": "nm0639917",
            "films": 24,
            "rating": 6.216666666666668,
            "views": 2278429746
          },
          {
            "actor": "Charles Dance",
            "actorID": "nm0001097",
            "films": 25,
            "rating": 6.516,
            "views": 2275855761
          },
          {
            "actor": "Miguel Sandoval",
            "actorID": "nm0762153",
            "films": 22,
            "rating": 6.386363636363638,
            "views": 2271857447
          },
          {
            "actor": "Tracy Reiner",
            "actorID": "nm0718021",
            "films": 20,
            "rating": 6.675,
            "views": 2270801206
          },
          {
            "actor": "Powers Boothe",
            "actorID": "nm0000959",
            "films": 16,
            "rating": 6.83125,
            "views": 2263553446
          },
          {
            "actor": "Burn Gorman",
            "actorID": "nm1218607",
            "films": 11,
            "rating": 6.5181818181818185,
            "views": 2263502166
          },
          {
            "actor": "Noah Taylor",
            "actorID": "nm0852965",
            "films": 20,
            "rating": 6.970000000000001,
            "views": 2262617153
          },
          {
            "actor": "Tom Sizemore",
            "actorID": "nm0001744",
            "films": 29,
            "rating": 6.544827586206898,
            "views": 2256074266
          },
          {
            "actor": "Amanda Peet",
            "actorID": "nm0001605",
            "films": 22,
            "rating": 6.2590909090909115,
            "views": 2254663235
          },
          {
            "actor": "Dan Castellaneta",
            "actorID": "nm0144657",
            "films": 19,
            "rating": 5.773684210526316,
            "views": 2254633911
          },
          {
            "actor": "June Squibb",
            "actorID": "nm0820053",
            "films": 18,
            "rating": 6.5888888888888895,
            "views": 2253699584
          },
          {
            "actor": "Holt McCallany",
            "actorID": "nm0564697",
            "films": 25,
            "rating": 6.444,
            "views": 2253296429
          },
          {
            "actor": "Elizabeth Daily",
            "actorID": "nm0197354",
            "films": 28,
            "rating": 6.167857142857142,
            "views": 2252970507
          },
          {
            "actor": "Sela Ward",
            "actorID": "nm0000688",
            "films": 14,
            "rating": 6.207142857142856,
            "views": 2252714612
          },
          {
            "actor": "Annette Bening",
            "actorID": "nm0000906",
            "films": 25,
            "rating": 6.644,
            "views": 2250608927
          },
          {
            "actor": "Terry Chen",
            "actorID": "nm0155389",
            "films": 14,
            "rating": 6.185714285714286,
            "views": 2248391644
          },
          {
            "actor": "Jodie Foster",
            "actorID": "nm0000149",
            "films": 23,
            "rating": 6.7391304347826075,
            "views": 2245020278
          },
          {
            "actor": "Jet Li",
            "actorID": "nm0001472",
            "films": 14,
            "rating": 6.478571428571428,
            "views": 2244581496
          },
          {
            "actor": "John Carroll Lynch",
            "actorID": "nm0002253",
            "films": 35,
            "rating": 6.499999999999998,
            "views": 2230488340
          },
          {
            "actor": "Frances Conroy",
            "actorID": "nm0175814",
            "films": 19,
            "rating": 6.426315789473684,
            "views": 2226844880
          },
          {
            "actor": "Dash Mihok",
            "actorID": "nm0005231",
            "films": 15,
            "rating": 6.666666666666667,
            "views": 2223783895
          },
          {
            "actor": "Jason Sudeikis",
            "actorID": "nm0837177",
            "films": 24,
            "rating": 6.183333333333333,
            "views": 2223375387
          },
          {
            "actor": "Brian Blessed",
            "actorID": "nm0000306",
            "films": 10,
            "rating": 6.63,
            "views": 2222086154
          },
          {
            "actor": "Kim Basinger",
            "actorID": "nm0000107",
            "films": 30,
            "rating": 6.053333333333333,
            "views": 2219864579
          },
          {
            "actor": "Felicity Jones",
            "actorID": "nm0428065",
            "films": 11,
            "rating": 6.763636363636365,
            "views": 2218324461
          },
          {
            "actor": "Paul Guilfoyle",
            "actorID": "nm0002117",
            "films": 31,
            "rating": 6.3516129032258055,
            "views": 2215815737
          },
          {
            "actor": "Naomi Watts",
            "actorID": "nm0915208",
            "films": 37,
            "rating": 6.575675675675675,
            "views": 2215654866
          },
          {
            "actor": "John C. McGinley",
            "actorID": "nm0001525",
            "films": 34,
            "rating": 6.385294117647058,
            "views": 2211466545
          },
          {
            "actor": "Jennifer Ehle",
            "actorID": "nm0000383",
            "films": 19,
            "rating": 6.552631578947367,
            "views": 2203887153
          },
          {
            "actor": "Michael B. Jordan",
            "actorID": "nm0430107",
            "films": 11,
            "rating": 6.345454545454545,
            "views": 2203248731
          },
          {
            "actor": "Donnie Yen",
            "actorID": "nm0947447",
            "films": 10,
            "rating": 6.75,
            "views": 2201908617
          },
          {
            "actor": "Rashida Jones",
            "actorID": "nm0429069",
            "films": 13,
            "rating": 6.461538461538462,
            "views": 2199808768
          },
          {
            "actor": "Hector Elizondo",
            "actorID": "nm0001185",
            "films": 31,
            "rating": 5.980645161290322,
            "views": 2193611608
          },
          {
            "actor": "Leonard Nimoy",
            "actorID": "nm0000559",
            "films": 10,
            "rating": 6.6800000000000015,
            "views": 2192172678
          },
          {
            "actor": "Matt Lucas",
            "actorID": "nm0524240",
            "films": 11,
            "rating": 6.509090909090909,
            "views": 2188080539
          },
          {
            "actor": "Eddie Redmayne",
            "actorID": "nm1519666",
            "films": 12,
            "rating": 6.608333333333333,
            "views": 2186453477
          },
          {
            "actor": "Rosario Dawson",
            "actorID": "nm0206257",
            "films": 28,
            "rating": 6.428571428571428,
            "views": 2178943614
          },
          {
            "actor": "Jason Segel",
            "actorID": "nm0781981",
            "films": 17,
            "rating": 6.435294117647059,
            "views": 2174108502
          },
          {
            "actor": "Cherry Jones",
            "actorID": "nm0427728",
            "films": 17,
            "rating": 6.347058823529411,
            "views": 2172471350
          },
          {
            "actor": "Vivica A. Fox",
            "actorID": "nm0000407",
            "films": 17,
            "rating": 6.182352941176471,
            "views": 2171805904
          },
          {
            "actor": "Robert Duvall",
            "actorID": "nm0000380",
            "films": 36,
            "rating": 6.6305555555555555,
            "views": 2171349809
          },
          {
            "actor": "Vincent Regan",
            "actorID": "nm0716490",
            "films": 10,
            "rating": 6.2,
            "views": 2171251940
          },
          {
            "actor": "Maria Bello",
            "actorID": "nm0004742",
            "films": 25,
            "rating": 6.407999999999999,
            "views": 2170139523
          },
          {
            "actor": "Carmen Ejogo",
            "actorID": "nm0252238",
            "films": 17,
            "rating": 6.164705882352941,
            "views": 2167736461
          },
          {
            "actor": "Anton Yelchin",
            "actorID": "nm0947338",
            "films": 19,
            "rating": 6.6263157894736855,
            "views": 2164522488
          },
          {
            "actor": "Josh Pais",
            "actorID": "nm0656929",
            "films": 23,
            "rating": 6.791304347826087,
            "views": 2164434343
          },
          {
            "actor": "Vincent Schiavelli",
            "actorID": "nm0001704",
            "films": 18,
            "rating": 6.677777777777777,
            "views": 2161349622
          },
          {
            "actor": "Sarah Silverman",
            "actorID": "nm0798971",
            "films": 19,
            "rating": 6.494736842105262,
            "views": 2156912874
          },
          {
            "actor": "Blythe Danner",
            "actorID": "nm0001100",
            "films": 25,
            "rating": 6.556,
            "views": 2156870659
          },
          {
            "actor": "Jackie Earle Haley",
            "actorID": "nm0355097",
            "films": 15,
            "rating": 6.373333333333334,
            "views": 2156296553
          },
          {
            "actor": "Aldis Hodge",
            "actorID": "nm0388038",
            "films": 13,
            "rating": 6.530769230769229,
            "views": 2155674297
          },
          {
            "actor": "Colleen Camp",
            "actorID": "nm0131974",
            "films": 41,
            "rating": 5.863414634146344,
            "views": 2153076698
          },
          {
            "actor": "Gillian Vigman",
            "actorID": "nm0897005",
            "films": 14,
            "rating": 6.299999999999999,
            "views": 2148978970
          },
          {
            "actor": "Hugh Laurie",
            "actorID": "nm0491402",
            "films": 16,
            "rating": 5.8812500000000005,
            "views": 2148713291
          },
          {
            "actor": "Bob Odenkirk",
            "actorID": "nm0644022",
            "films": 17,
            "rating": 6.5588235294117645,
            "views": 2145714743
          },
          {
            "actor": "David Morse",
            "actorID": "nm0001556",
            "films": 27,
            "rating": 6.674074074074075,
            "views": 2136521594
          },
          {
            "actor": "Jamie Lee Curtis",
            "actorID": "nm0000130",
            "films": 36,
            "rating": 6.0166666666666675,
            "views": 2132435228
          },
          {
            "actor": "Bonnie Aarons",
            "actorID": "nm0007491",
            "films": 15,
            "rating": 6.040000000000002,
            "views": 2132420918
          },
          {
            "actor": "Bob Hoskins",
            "actorID": "nm0001364",
            "films": 32,
            "rating": 6.421874999999999,
            "views": 2132374126
          },
          {
            "actor": "Ice Cube",
            "actorID": "nm0001084",
            "films": 22,
            "rating": 6.022727272727274,
            "views": 2130392933
          },
          {
            "actor": "Victor Rasuk",
            "actorID": "nm0711559",
            "films": 10,
            "rating": 5.98,
            "views": 2128416484
          },
          {
            "actor": "David Andrews",
            "actorID": "nm0028625",
            "films": 13,
            "rating": 6.769230769230769,
            "views": 2127289320
          },
          {
            "actor": "Clive Russell",
            "actorID": "nm0751085",
            "films": 10,
            "rating": 6.83,
            "views": 2122077568
          },
          {
            "actor": "Yuji Okumoto",
            "actorID": "nm0645785",
            "films": 11,
            "rating": 6.863636363636363,
            "views": 2121340524
          },
          {
            "actor": "Andrew Garfield",
            "actorID": "nm1940449",
            "films": 12,
            "rating": 7.008333333333333,
            "views": 2119879899
          },
          {
            "actor": "Ray Liotta",
            "actorID": "nm0000501",
            "films": 36,
            "rating": 6.388888888888889,
            "views": 2118751096
          },
          {
            "actor": "Willie Garson",
            "actorID": "nm0308606",
            "films": 25,
            "rating": 6.284000000000001,
            "views": 2117927473
          },
          {
            "actor": "Jose Zuniga",
            "actorID": "nm0959242",
            "films": 18,
            "rating": 6.383333333333334,
            "views": 2117200068
          },
          {
            "actor": "Donal Logue",
            "actorID": "nm0006610",
            "films": 24,
            "rating": 6.45,
            "views": 2116833201
          },
          {
            "actor": "Kenneth Welsh",
            "actorID": "nm0920564",
            "films": 26,
            "rating": 6.023076923076922,
            "views": 2115925406
          },
          {
            "actor": "Michael Ironside",
            "actorID": "nm0000461",
            "films": 24,
            "rating": 6.166666666666668,
            "views": 2115207963
          },
          {
            "actor": "Penelope Cruz",
            "actorID": "nm0004851",
            "films": 24,
            "rating": 6.387499999999999,
            "views": 2104640967
          },
          {
            "actor": "Tim Robbins",
            "actorID": "nm0000209",
            "films": 36,
            "rating": 6.530555555555554,
            "views": 2103236002
          },
          {
            "actor": "Maggie Gyllenhaal",
            "actorID": "nm0350454",
            "films": 20,
            "rating": 6.8149999999999995,
            "views": 2102911382
          },
          {
            "actor": "Rob Huebel",
            "actorID": "nm1097364",
            "films": 16,
            "rating": 6.06875,
            "views": 2102465233
          },
          {
            "actor": "Wendell Pierce",
            "actorID": "nm0682495",
            "films": 24,
            "rating": 6.408333333333332,
            "views": 2101171758
          },
          {
            "actor": "John Heard",
            "actorID": "nm0001334",
            "films": 35,
            "rating": 6.700000000000001,
            "views": 2098908929
          },
          {
            "actor": "Kate Beckinsale",
            "actorID": "nm0000295",
            "films": 22,
            "rating": 6.513636363636365,
            "views": 2096542925
          },
          {
            "actor": "Timothy Olyphant",
            "actorID": "nm0648249",
            "films": 25,
            "rating": 6.4239999999999995,
            "views": 2096223235
          },
          {
            "actor": "Cloris Leachman",
            "actorID": "nm0001458",
            "films": 28,
            "rating": 6.203571428571429,
            "views": 2092365331
          },
          {
            "actor": "Tracy Morgan",
            "actorID": "nm0605079",
            "films": 18,
            "rating": 5.9222222222222225,
            "views": 2092116575
          },
          {
            "actor": "Dean Norris",
            "actorID": "nm0606487",
            "films": 30,
            "rating": 6.400000000000002,
            "views": 2089695112
          },
          {
            "actor": "Matt Schulze",
            "actorID": "nm0776580",
            "films": 12,
            "rating": 6.341666666666666,
            "views": 2089257137
          },
          {
            "actor": "Billy West",
            "actorID": "nm0921942",
            "films": 11,
            "rating": 6.163636363636363,
            "views": 2087221260
          },
          {
            "actor": "Luke Wilson",
            "actorID": "nm0005561",
            "films": 32,
            "rating": 6.206249999999999,
            "views": 2083298970
          },
          {
            "actor": "Logan Lerman",
            "actorID": "nm0503567",
            "films": 15,
            "rating": 6.526666666666667,
            "views": 2082094557
          },
          {
            "actor": "Daniel von Bargen",
            "actorID": "nm0901926",
            "films": 28,
            "rating": 6.496428571428569,
            "views": 2082080747
          },
          {
            "actor": "Frankie Faison",
            "actorID": "nm0265670",
            "films": 31,
            "rating": 6.196774193548387,
            "views": 2078738373
          },
          {
            "actor": "Rob Paulsen",
            "actorID": "nm0667326",
            "films": 11,
            "rating": 6.5636363636363635,
            "views": 2078491244
          },
          {
            "actor": "Jamie Kennedy",
            "actorID": "nm0005085",
            "films": 20,
            "rating": 6.249999999999999,
            "views": 2073611384
          },
          {
            "actor": "Joe Lo Truglio",
            "actorID": "nm0516266",
            "films": 15,
            "rating": 6.673333333333332,
            "views": 2072542340
          },
          {
            "actor": "Elias Koteas",
            "actorID": "nm0000480",
            "films": 37,
            "rating": 6.45945945945946,
            "views": 2072301360
          },
          {
            "actor": "Meg Ryan",
            "actorID": "nm0000212",
            "films": 31,
            "rating": 6.1741935483870956,
            "views": 2072036705
          },
          {
            "actor": "Kevin Smith",
            "actorID": "nm0003620",
            "films": 16,
            "rating": 6.593749999999999,
            "views": 2061409368
          },
          {
            "actor": "Donna Murphy",
            "actorID": "nm0614220",
            "films": 11,
            "rating": 6.490909090909091,
            "views": 2060255444
          },
          {
            "actor": "Ned Beatty",
            "actorID": "nm0000885",
            "films": 26,
            "rating": 6.323076923076924,
            "views": 2058050535
          },
          {
            "actor": "Matthew Modine",
            "actorID": "nm0000546",
            "films": 26,
            "rating": 6.530769230769232,
            "views": 2057517529
          },
          {
            "actor": "Rosamund Pike",
            "actorID": "nm0683253",
            "films": 20,
            "rating": 6.6899999999999995,
            "views": 2055572930
          },
          {
            "actor": "Stephen McHattie",
            "actorID": "nm0565569",
            "films": 16,
            "rating": 6.5062500000000005,
            "views": 2050479256
          },
          {
            "actor": "Milla Jovovich",
            "actorID": "nm0000170",
            "films": 25,
            "rating": 6.004000000000001,
            "views": 2046703676
          },
          {
            "actor": "Don McManus",
            "actorID": "nm0573134",
            "films": 21,
            "rating": 6.690476190476191,
            "views": 2043381760
          },
          {
            "actor": "Lili Taylor",
            "actorID": "nm0000666",
            "films": 25,
            "rating": 6.544000000000002,
            "views": 2040447922
          },
          {
            "actor": "Diego Luna",
            "actorID": "nm0526019",
            "films": 13,
            "rating": 6.815384615384616,
            "views": 2038771377
          },
          {
            "actor": "Keir O'Donnell",
            "actorID": "nm1218757",
            "films": 10,
            "rating": 6.38,
            "views": 2038631267
          },
          {
            "actor": "Julian Rhind-Tutt",
            "actorID": "nm0722279",
            "films": 10,
            "rating": 6.69,
            "views": 2038233981
          },
          {
            "actor": "Jessica Alba",
            "actorID": "nm0004695",
            "films": 21,
            "rating": 5.914285714285715,
            "views": 2037564300
          },
          {
            "actor": "Max von Sydow",
            "actorID": "nm0001884",
            "films": 27,
            "rating": 6.822222222222222,
            "views": 2036869491
          },
          {
            "actor": "Abigail Breslin",
            "actorID": "nm1113550",
            "films": 18,
            "rating": 6.583333333333332,
            "views": 2035318086
          },
          {
            "actor": "Abraham Benrubi",
            "actorID": "nm0072344",
            "films": 16,
            "rating": 6.4875,
            "views": 2033838708
          },
          {
            "actor": "Kevin Pollak",
            "actorID": "nm0001629",
            "films": 35,
            "rating": 6.305714285714284,
            "views": 2029507621
          },
          {
            "actor": "Paul Reubens",
            "actorID": "nm0000607",
            "films": 18,
            "rating": 6.2,
            "views": 2027888333
          },
          {
            "actor": "Kenan Thompson",
            "actorID": "nm0860380",
            "films": 17,
            "rating": 5.435294117647058,
            "views": 2026069304
          },
          {
            "actor": "Kate Mara",
            "actorID": "nm0544718",
            "films": 17,
            "rating": 6.3882352941176475,
            "views": 2024517098
          },
          {
            "actor": "Ivana Milicevic",
            "actorID": "nm0587431",
            "films": 15,
            "rating": 6.6066666666666665,
            "views": 2023567896
          },
          {
            "actor": "Lisa Kudrow",
            "actorID": "nm0001435",
            "films": 21,
            "rating": 6.104761904761905,
            "views": 2022871319
          },
          {
            "actor": "Rex Linn",
            "actorID": "nm0513010",
            "films": 29,
            "rating": 6.327586206896552,
            "views": 2017573386
          },
          {
            "actor": "Frank Langella",
            "actorID": "nm0001449",
            "films": 31,
            "rating": 6.1483870967741945,
            "views": 2017132281
          },
          {
            "actor": "Ashton Kutcher",
            "actorID": "nm0005110",
            "films": 22,
            "rating": 5.836363636363637,
            "views": 2016479427
          },
          {
            "actor": "T.I.",
            "actorID": "nm1939267",
            "films": 11,
            "rating": 6.454545454545456,
            "views": 2015263166
          },
          {
            "actor": "Michael Jeter",
            "actorID": "nm0005052",
            "films": 22,
            "rating": 6.736363636363635,
            "views": 2013307609
          },
          {
            "actor": "Ritchie Coster",
            "actorID": "nm0182662",
            "films": 11,
            "rating": 6.618181818181819,
            "views": 2011715175
          },
          {
            "actor": "Jeremy Sisto",
            "actorID": "nm0005438",
            "films": 17,
            "rating": 6.611764705882353,
            "views": 2011610905
          },
          {
            "actor": "Jack McBrayer",
            "actorID": "nm1442113",
            "films": 11,
            "rating": 6.327272727272727,
            "views": 2010712940
          },
          {
            "actor": "Noel Fisher",
            "actorID": "nm0279720",
            "films": 10,
            "rating": 5.47,
            "views": 2009026534
          },
          {
            "actor": "Michael Gaston",
            "actorID": "nm0309461",
            "films": 20,
            "rating": 6.790000000000001,
            "views": 2007381518
          },
          {
            "actor": "Rebecca Hall",
            "actorID": "nm0356017",
            "films": 13,
            "rating": 6.569230769230769,
            "views": 2006495733
          },
          {
            "actor": "Sean Harris",
            "actorID": "nm0365317",
            "films": 10,
            "rating": 6.8100000000000005,
            "views": 2006103573
          },
          {
            "actor": "W. Earl Brown",
            "actorID": "nm0114868",
            "films": 22,
            "rating": 6.409090909090909,
            "views": 2003556007
          },
          {
            "actor": "Tony Todd",
            "actorID": "nm0865302",
            "films": 19,
            "rating": 6.510526315789474,
            "views": 2002827672
          },
          {
            "actor": "Mary Kay Place",
            "actorID": "nm0005316",
            "films": 27,
            "rating": 6.525925925925925,
            "views": 2001485549
          },
          {
            "actor": "Kim Coates",
            "actorID": "nm0167649",
            "films": 19,
            "rating": 6.126315789473685,
            "views": 2001343836
          },
          {
            "actor": "Bokeem Woodbine",
            "actorID": "nm0940158",
            "films": 19,
            "rating": 6.657894736842106,
            "views": 2000703359
          },
          {
            "actor": "Laura Linney",
            "actorID": "nm0001473",
            "films": 26,
            "rating": 6.976923076923077,
            "views": 1997866248
          },
          {
            "actor": "Cheri Oteri",
            "actorID": "nm0652783",
            "films": 12,
            "rating": 5.758333333333334,
            "views": 1994393773
          },
          {
            "actor": "Charlton Heston",
            "actorID": "nm0000032",
            "films": 13,
            "rating": 6.461538461538462,
            "views": 1994017236
          },
          {
            "actor": "Mackenzie Crook",
            "actorID": "nm0188871",
            "films": 11,
            "rating": 6.845454545454545,
            "views": 1991835460
          },
          {
            "actor": "Robert Loggia",
            "actorID": "nm0005162",
            "films": 32,
            "rating": 6.190625000000001,
            "views": 1991447564
          },
          {
            "actor": "Jorma Taccone",
            "actorID": "nm1672246",
            "films": 11,
            "rating": 6.581818181818182,
            "views": 1990674914
          },
          {
            "actor": "Judd Hirsch",
            "actorID": "nm0002139",
            "films": 10,
            "rating": 6.93,
            "views": 1986741383
          },
          {
            "actor": "William Mapother",
            "actorID": "nm0544611",
            "films": 16,
            "rating": 6.8375,
            "views": 1985750876
          },
          {
            "actor": "Rory McCann",
            "actorID": "nm0564920",
            "films": 11,
            "rating": 6.336363636363637,
            "views": 1985158607
          },
          {
            "actor": "Jurgen Prochnow",
            "actorID": "nm0001638",
            "films": 21,
            "rating": 6.071428571428571,
            "views": 1984424825
          },
          {
            "actor": "Greg Kinnear",
            "actorID": "nm0001427",
            "films": 28,
            "rating": 6.321428571428571,
            "views": 1980690429
          },
          {
            "actor": "Clive Owen",
            "actorID": "nm0654110",
            "films": 24,
            "rating": 6.791666666666667,
            "views": 1980474326
          },
          {
            "actor": "Amy Ryan",
            "actorID": "nm0752407",
            "films": 20,
            "rating": 6.93,
            "views": 1979912372
          },
          {
            "actor": "David Paymer",
            "actorID": "nm0001601",
            "films": 38,
            "rating": 6.26842105263158,
            "views": 1977141931
          },
          {
            "actor": "Andrew Daly",
            "actorID": "nm0198408",
            "films": 12,
            "rating": 5.908333333333334,
            "views": 1974679212
          },
          {
            "actor": "Eddie Griffin",
            "actorID": "nm0341176",
            "films": 20,
            "rating": 5.654999999999999,
            "views": 1971391816
          },
          {
            "actor": "Thomas Middleditch",
            "actorID": "nm3042755",
            "films": 13,
            "rating": 6.415384615384616,
            "views": 1970098892
          },
          {
            "actor": "Elisabeth Shue",
            "actorID": "nm0000223",
            "films": 25,
            "rating": 6.560000000000001,
            "views": 1964025690
          },
          {
            "actor": "Elliot Page",
            "actorID": "nm0680983",
            "films": 10,
            "rating": 6.889999999999999,
            "views": 1960778591
          },
          {
            "actor": "Colin Salmon",
            "actorID": "nm0758760",
            "films": 11,
            "rating": 6.372727272727274,
            "views": 1959015529
          },
          {
            "actor": "Peter Dante",
            "actorID": "nm0200601",
            "films": 17,
            "rating": 5.641176470588236,
            "views": 1958088703
          },
          {
            "actor": "Mark Ivanir",
            "actorID": "nm0411980",
            "films": 14,
            "rating": 6.464285714285715,
            "views": 1957735475
          },
          {
            "actor": "Haley Joel Osment",
            "actorID": "nm0005286",
            "films": 10,
            "rating": 6.57,
            "views": 1953209851
          },
          {
            "actor": "Melora Walters",
            "actorID": "nm0001828",
            "films": 16,
            "rating": 6.906249999999999,
            "views": 1951401444
          },
          {
            "actor": "Garry Marshall",
            "actorID": "nm0005190",
            "films": 19,
            "rating": 6.194736842105264,
            "views": 1950590148
          },
          {
            "actor": "Geoffrey Blake",
            "actorID": "nm0086553",
            "films": 14,
            "rating": 6.828571428571428,
            "views": 1943753750
          },
          {
            "actor": "Sean Penn",
            "actorID": "nm0000576",
            "films": 42,
            "rating": 6.695238095238094,
            "views": 1942971433
          },
          {
            "actor": "Jason Mantzoukas",
            "actorID": "nm1727621",
            "films": 12,
            "rating": 6.383333333333334,
            "views": 1942625478
          },
          {
            "actor": "Tim Guinee",
            "actorID": "nm0347375",
            "films": 20,
            "rating": 6.684999999999998,
            "views": 1937259538
          },
          {
            "actor": "Corey Stoll",
            "actorID": "nm1015684",
            "films": 14,
            "rating": 6.950000000000001,
            "views": 1936542146
          },
          {
            "actor": "Helen Hunt",
            "actorID": "nm0000166",
            "films": 22,
            "rating": 6.495454545454547,
            "views": 1936311181
          },
          {
            "actor": "Cary-Hiroyuki Tagawa",
            "actorID": "nm0846480",
            "films": 21,
            "rating": 6.219047619047619,
            "views": 1934711914
          },
          {
            "actor": "Melissa Leo",
            "actorID": "nm0502425",
            "films": 19,
            "rating": 6.836842105263156,
            "views": 1934183817
          },
          {
            "actor": "Campbell Scott",
            "actorID": "nm0001714",
            "films": 14,
            "rating": 6.778571428571428,
            "views": 1930229982
          },
          {
            "actor": "John Benjamin Hickey",
            "actorID": "nm0382632",
            "films": 18,
            "rating": 6.605555555555557,
            "views": 1929490163
          },
          {
            "actor": "Vanessa Redgrave",
            "actorID": "nm0000603",
            "films": 23,
            "rating": 6.7826086956521765,
            "views": 1926758080
          },
          {
            "actor": "Diane Kruger",
            "actorID": "nm1208167",
            "films": 15,
            "rating": 6.920000000000001,
            "views": 1924351075
          },
          {
            "actor": "Ato Essandoh",
            "actorID": "nm1017951",
            "films": 11,
            "rating": 6.845454545454547,
            "views": 1924082574
          },
          {
            "actor": "Leslie Bibb",
            "actorID": "nm0004753",
            "films": 16,
            "rating": 6.15,
            "views": 1923945320
          },
          {
            "actor": "Jeffrey Dean Morgan",
            "actorID": "nm0604742",
            "films": 11,
            "rating": 6.127272727272728,
            "views": 1921054882
          },
          {
            "actor": "Jared Leto",
            "actorID": "nm0001467",
            "films": 19,
            "rating": 6.915789473684209,
            "views": 1920874473
          },
          {
            "actor": "Ryan Gosling",
            "actorID": "nm0331516",
            "films": 23,
            "rating": 7.13913043478261,
            "views": 1920065553
          },
          {
            "actor": "Winona Ryder",
            "actorID": "nm0000213",
            "films": 34,
            "rating": 6.56470588235294,
            "views": 1918834699
          },
          {
            "actor": "Katherine Waterston",
            "actorID": "nm2239702",
            "films": 11,
            "rating": 6.8090909090909095,
            "views": 1917769197
          },
          {
            "actor": "Brad William Henke",
            "actorID": "nm0377034",
            "films": 16,
            "rating": 6.56875,
            "views": 1914832635
          },
          {
            "actor": "Peter Berg",
            "actorID": "nm0000916",
            "films": 24,
            "rating": 6.383333333333333,
            "views": 1912872878
          },
          {
            "actor": "John Diehl",
            "actorID": "nm0225963",
            "films": 23,
            "rating": 6.339130434782608,
            "views": 1911895841
          },
          {
            "actor": "Ashley Judd",
            "actorID": "nm0000171",
            "films": 25,
            "rating": 6.484000000000001,
            "views": 1910790807
          },
          {
            "actor": "Jamie Bell",
            "actorID": "nm0068260",
            "films": 16,
            "rating": 6.7875000000000005,
            "views": 1909704319
          },
          {
            "actor": "Celia Weston",
            "actorID": "nm0922927",
            "films": 31,
            "rating": 6.419354838709677,
            "views": 1909011170
          },
          {
            "actor": "Rob Corddry",
            "actorID": "nm1117791",
            "films": 23,
            "rating": 6.195652173913044,
            "views": 1905735050
          },
          {
            "actor": "Jimmy Bennett",
            "actorID": "nm1497548",
            "films": 14,
            "rating": 6.035714285714286,
            "views": 1904934917
          },
          {
            "actor": "Robert Wisdom",
            "actorID": "nm0936298",
            "films": 19,
            "rating": 6.226315789473684,
            "views": 1904469494
          },
          {
            "actor": "David Krumholtz",
            "actorID": "nm0472710",
            "films": 25,
            "rating": 6.648000000000001,
            "views": 1904359461
          },
          {
            "actor": "Damian Young",
            "actorID": "nm0949433",
            "films": 16,
            "rating": 6.5249999999999995,
            "views": 1900139350
          },
          {
            "actor": "Freddie Prinze Jr.",
            "actorID": "nm0005327",
            "films": 12,
            "rating": 5.408333333333332,
            "views": 1899229474
          },
          {
            "actor": "Anna Paquin",
            "actorID": "nm0001593",
            "films": 18,
            "rating": 6.949999999999999,
            "views": 1896033898
          },
          {
            "actor": "Kurtwood Smith",
            "actorID": "nm0001748",
            "films": 30,
            "rating": 6.3566666666666665,
            "views": 1895005067
          },
          {
            "actor": "Peter Sarsgaard",
            "actorID": "nm0765597",
            "films": 26,
            "rating": 6.7846153846153845,
            "views": 1893489109
          },
          {
            "actor": "Lois Smith",
            "actorID": "nm0809135",
            "films": 21,
            "rating": 6.7476190476190485,
            "views": 1890322421
          },
          {
            "actor": "Jon Gries",
            "actorID": "nm0340973",
            "films": 17,
            "rating": 6.4823529411764715,
            "views": 1889986447
          },
          {
            "actor": "Kiefer Sutherland",
            "actorID": "nm0000662",
            "films": 35,
            "rating": 6.4,
            "views": 1888811523
          },
          {
            "actor": "Alun Armstrong",
            "actorID": "nm0035605",
            "films": 19,
            "rating": 6.526315789473683,
            "views": 1886555773
          },
          {
            "actor": "Mandy Moore",
            "actorID": "nm0601553",
            "films": 15,
            "rating": 6.046666666666667,
            "views": 1884772467
          },
          {
            "actor": "Heath Ledger",
            "actorID": "nm0005132",
            "films": 14,
            "rating": 6.9142857142857155,
            "views": 1883670938
          },
          {
            "actor": "Heather Graham",
            "actorID": "nm0001287",
            "films": 27,
            "rating": 6.266666666666668,
            "views": 1882812361
          },
          {
            "actor": "Ethan Hawke",
            "actorID": "nm0000160",
            "films": 43,
            "rating": 6.7627906976744185,
            "views": 1881543605
          },
          {
            "actor": "Mike Starr",
            "actorID": "nm0823563",
            "films": 48,
            "rating": 6.3354166666666645,
            "views": 1881489951
          },
          {
            "actor": "Wendy Crewson",
            "actorID": "nm0187724",
            "films": 21,
            "rating": 6.309523809523809,
            "views": 1878453430
          },
          {
            "actor": "Maury Chaykin",
            "actorID": "nm0001999",
            "films": 37,
            "rating": 6.2,
            "views": 1878289452
          },
          {
            "actor": "Joel McKinnon Miller",
            "actorID": "nm0571930",
            "films": 14,
            "rating": 6.442857142857142,
            "views": 1878167191
          },
          {
            "actor": "Edward James Olmos",
            "actorID": "nm0001579",
            "films": 19,
            "rating": 6.6,
            "views": 1878017420
          },
          {
            "actor": "Joe Mantegna",
            "actorID": "nm0001505",
            "films": 26,
            "rating": 6.376923076923077,
            "views": 1875742672
          },
          {
            "actor": "Hailee Steinfeld",
            "actorID": "nm2794962",
            "films": 12,
            "rating": 6.891666666666667,
            "views": 1871021919
          },
          {
            "actor": "John Cena",
            "actorID": "nm1078479",
            "films": 13,
            "rating": 6.046153846153847,
            "views": 1869959880
          },
          {
            "actor": "Ricky Gervais",
            "actorID": "nm0315041",
            "films": 11,
            "rating": 6.463636363636365,
            "views": 1868369917
          },
          {
            "actor": "Adrien Brody",
            "actorID": "nm0004778",
            "films": 26,
            "rating": 6.853846153846153,
            "views": 1867826245
          },
          {
            "actor": "Shaquille O'Neal",
            "actorID": "nm0641944",
            "films": 16,
            "rating": 5.2125,
            "views": 1862503869
          },
          {
            "actor": "Gregory Alan Williams",
            "actorID": "nm0930707",
            "films": 19,
            "rating": 6.4947368421052625,
            "views": 1859822539
          },
          {
            "actor": "Jennifer Tilly",
            "actorID": "nm0000236",
            "films": 23,
            "rating": 6.039130434782609,
            "views": 1855311086
          },
          {
            "actor": "Angela Lansbury",
            "actorID": "nm0001450",
            "films": 10,
            "rating": 6.910000000000001,
            "views": 1854823143
          },
          {
            "actor": "Neil Flynn",
            "actorID": "nm0283568",
            "films": 12,
            "rating": 6.408333333333334,
            "views": 1852985393
          },
          {
            "actor": "Sarah Paulson",
            "actorID": "nm0005299",
            "films": 16,
            "rating": 6.6875,
            "views": 1845600409
          },
          {
            "actor": "Alex Borstein",
            "actorID": "nm0097504",
            "films": 15,
            "rating": 6.040000000000001,
            "views": 1845486518
          },
          {
            "actor": "Quentin Tarantino",
            "actorID": "nm0000233",
            "films": 18,
            "rating": 7.072222222222224,
            "views": 1845192879
          },
          {
            "actor": "Lily James",
            "actorID": "nm4141252",
            "films": 10,
            "rating": 6.709999999999999,
            "views": 1843040050
          },
          {
            "actor": "Sharon Stone",
            "actorID": "nm0000232",
            "films": 34,
            "rating": 5.908823529411765,
            "views": 1842990704
          },
          {
            "actor": "Cam Gigandet",
            "actorID": "nm1544217",
            "films": 12,
            "rating": 5.591666666666668,
            "views": 1838508725
          },
          {
            "actor": "Minnie Driver",
            "actorID": "nm0000378",
            "films": 20,
            "rating": 7.029999999999999,
            "views": 1836801826
          },
          {
            "actor": "Matt Craven",
            "actorID": "nm0002023",
            "films": 21,
            "rating": 6.566666666666667,
            "views": 1834176631
          },
          {
            "actor": "Mary Elizabeth Winstead",
            "actorID": "nm0935541",
            "films": 19,
            "rating": 6.394736842105263,
            "views": 1833941898
          },
          {
            "actor": "Michael Lerner",
            "actorID": "nm0503627",
            "films": 25,
            "rating": 5.975999999999999,
            "views": 1832528906
          },
          {
            "actor": "Dermot Mulroney",
            "actorID": "nm0000551",
            "films": 37,
            "rating": 6.372972972972972,
            "views": 1827807388
          },
          {
            "actor": "Maggie Q",
            "actorID": "nm0702572",
            "films": 10,
            "rating": 6.209999999999999,
            "views": 1826949884
          },
          {
            "actor": "Stephen Graham",
            "actorID": "nm0334318",
            "films": 17,
            "rating": 6.764705882352941,
            "views": 1825052559
          },
          {
            "actor": "Carl Weathers",
            "actorID": "nm0001835",
            "films": 10,
            "rating": 6.2299999999999995,
            "views": 1824497535
          },
          {
            "actor": "Giancarlo Giannini",
            "actorID": "nm0316284",
            "films": 12,
            "rating": 6.366666666666666,
            "views": 1824116063
          },
          {
            "actor": "Hugh Bonneville",
            "actorID": "nm0095017",
            "films": 13,
            "rating": 6.815384615384615,
            "views": 1823787444
          },
          {
            "actor": "Mickey Rourke",
            "actorID": "nm0000620",
            "films": 35,
            "rating": 6.445714285714286,
            "views": 1823708770
          },
          {
            "actor": "Courtney B. Vance",
            "actorID": "nm0005524",
            "films": 19,
            "rating": 6.326315789473684,
            "views": 1822774035
          },
          {
            "actor": "Evan Rachel Wood",
            "actorID": "nm0939697",
            "films": 16,
            "rating": 6.656249999999999,
            "views": 1816814696
          },
          {
            "actor": "Sam Richardson",
            "actorID": "nm3931538",
            "films": 10,
            "rating": 6.389999999999999,
            "views": 1816575556
          },
          {
            "actor": "Sarah Jessica Parker",
            "actorID": "nm0000572",
            "films": 23,
            "rating": 5.965217391304349,
            "views": 1812140402
          },
          {
            "actor": "Michael Beach",
            "actorID": "nm0004729",
            "films": 21,
            "rating": 6.619047619047619,
            "views": 1812097262
          },
          {
            "actor": "Tress MacNeille",
            "actorID": "nm0534134",
            "films": 15,
            "rating": 6.679999999999999,
            "views": 1808989060
          },
          {
            "actor": "Tobin Bell",
            "actorID": "nm0068551",
            "films": 20,
            "rating": 6.659999999999999,
            "views": 1808146352
          },
          {
            "actor": "Adam Brody",
            "actorID": "nm0111013",
            "films": 17,
            "rating": 6.347058823529411,
            "views": 1807855625
          },
          {
            "actor": "Ariel Winter",
            "actorID": "nm1736769",
            "films": 13,
            "rating": 6.3538461538461535,
            "views": 1807059038
          },
          {
            "actor": "Brian Dennehy",
            "actorID": "nm0001133",
            "films": 32,
            "rating": 6.456249999999999,
            "views": 1805726746
          },
          {
            "actor": "Dominic Cooper",
            "actorID": "nm1002641",
            "films": 15,
            "rating": 6.660000000000001,
            "views": 1805712579
          },
          {
            "actor": "Randy Quaid",
            "actorID": "nm0001642",
            "films": 33,
            "rating": 5.857575757575757,
            "views": 1805538699
          },
          {
            "actor": "Eli Roth",
            "actorID": "nm0744834",
            "films": 13,
            "rating": 6.184615384615383,
            "views": 1805168791
          },
          {
            "actor": "C. Thomas Howell",
            "actorID": "nm0001367",
            "films": 13,
            "rating": 6.592307692307693,
            "views": 1805003701
          },
          {
            "actor": "Richard T. Jones",
            "actorID": "nm0429114",
            "films": 20,
            "rating": 6.124999999999999,
            "views": 1804306056
          },
          {
            "actor": "Josh Lucas",
            "actorID": "nm0524197",
            "films": 25,
            "rating": 6.564,
            "views": 1804171317
          },
          {
            "actor": "Peter Mullan",
            "actorID": "nm0611932",
            "films": 16,
            "rating": 7.037499999999999,
            "views": 1803290916
          },
          {
            "actor": "Wood Harris",
            "actorID": "nm0365445",
            "films": 13,
            "rating": 6.884615384615385,
            "views": 1799892941
          },
          {
            "actor": "Terry Serpico",
            "actorID": "nm0785352",
            "films": 18,
            "rating": 6.594444444444445,
            "views": 1797513051
          },
          {
            "actor": "Ray McKinnon",
            "actorID": "nm0571964",
            "films": 17,
            "rating": 6.847058823529412,
            "views": 1797480362
          },
          {
            "actor": "Charlie Sheen",
            "actorID": "nm0000221",
            "films": 34,
            "rating": 6.214705882352941,
            "views": 1795235614
          },
          {
            "actor": "Dale Dickey",
            "actorID": "nm0225460",
            "films": 14,
            "rating": 6.721428571428572,
            "views": 1786350786
          },
          {
            "actor": "Caroline Aaron",
            "actorID": "nm0000715",
            "films": 33,
            "rating": 6.44848484848485,
            "views": 1783765387
          },
          {
            "actor": "James Caan",
            "actorID": "nm0001001",
            "films": 28,
            "rating": 6.467857142857144,
            "views": 1782023524
          },
          {
            "actor": "Jim Caviezel",
            "actorID": "nm0001029",
            "films": 19,
            "rating": 6.56842105263158,
            "views": 1778680068
          },
          {
            "actor": "Geraldine Chaplin",
            "actorID": "nm0001036",
            "films": 11,
            "rating": 6.718181818181818,
            "views": 1770519099
          },
          {
            "actor": "Frank Whaley",
            "actorID": "nm0001844",
            "films": 23,
            "rating": 6.726086956521738,
            "views": 1764708922
          },
          {
            "actor": "Bodhi Elfman",
            "actorID": "nm0001183",
            "films": 11,
            "rating": 6.454545454545454,
            "views": 1763911732
          },
          {
            "actor": "Uma Thurman",
            "actorID": "nm0000235",
            "films": 34,
            "rating": 6.255882352941177,
            "views": 1761851881
          },
          {
            "actor": "Brandon T. Jackson",
            "actorID": "nm1040365",
            "films": 10,
            "rating": 6.03,
            "views": 1758868887
          },
          {
            "actor": "Martha Plimpton",
            "actorID": "nm0000588",
            "films": 16,
            "rating": 6.6625,
            "views": 1758258446
          },
          {
            "actor": "Carrie-Anne Moss",
            "actorID": "nm0005251",
            "films": 11,
            "rating": 6.490909090909091,
            "views": 1756114360
          },
          {
            "actor": "Adam Driver",
            "actorID": "nm3485845",
            "films": 17,
            "rating": 6.923529411764705,
            "views": 1754339437
          },
          {
            "actor": "Dennis Dugan",
            "actorID": "nm0240797",
            "films": 17,
            "rating": 5.88235294117647,
            "views": 1753375261
          },
          {
            "actor": "Taran Killam",
            "actorID": "nm0453115",
            "films": 10,
            "rating": 5.709999999999999,
            "views": 1752020283
          },
          {
            "actor": "Jessica Biel",
            "actorID": "nm0004754",
            "films": 21,
            "rating": 6.185714285714285,
            "views": 1750451770
          },
          {
            "actor": "Elliott Gould",
            "actorID": "nm0001285",
            "films": 18,
            "rating": 6.53888888888889,
            "views": 1749330555
          },
          {
            "actor": "Matt Frewer",
            "actorID": "nm0001242",
            "films": 18,
            "rating": 6.111111111111112,
            "views": 1747485846
          },
          {
            "actor": "Reg E. Cathey",
            "actorID": "nm0146146",
            "films": 20,
            "rating": 6.480000000000001,
            "views": 1747288560
          },
          {
            "actor": "David Koechner",
            "actorID": "nm0462712",
            "films": 33,
            "rating": 5.981818181818181,
            "views": 1747260669
          },
          {
            "actor": "Jim Rash",
            "actorID": "nm0711110",
            "films": 10,
            "rating": 6.470000000000001,
            "views": 1744818428
          },
          {
            "actor": "Michael Smiley",
            "actorID": "nm0806968",
            "films": 13,
            "rating": 6.6000000000000005,
            "views": 1744114857
          },
          {
            "actor": "Will Patton",
            "actorID": "nm0001599",
            "films": 30,
            "rating": 6.506666666666665,
            "views": 1740089278
          },
          {
            "actor": "Scott Adsit",
            "actorID": "nm0012523",
            "films": 14,
            "rating": 6.557142857142858,
            "views": 1739027467
          },
          {
            "actor": "Zooey Deschanel",
            "actorID": "nm0221046",
            "films": 22,
            "rating": 6.495454545454547,
            "views": 1736179915
          },
          {
            "actor": "James Tolkan",
            "actorID": "nm0866055",
            "films": 21,
            "rating": 6.242857142857141,
            "views": 1735810085
          },
          {
            "actor": "Ethan Suplee",
            "actorID": "nm0839486",
            "films": 21,
            "rating": 7.0666666666666655,
            "views": 1735614145
          },
          {
            "actor": "Mae Whitman",
            "actorID": "nm0926165",
            "films": 17,
            "rating": 6.423529411764706,
            "views": 1731547400
          },
          {
            "actor": "Garrett Hedlund",
            "actorID": "nm1330560",
            "films": 13,
            "rating": 6.5076923076923086,
            "views": 1728084707
          },
          {
            "actor": "Jay O. Sanders",
            "actorID": "nm0761587",
            "films": 26,
            "rating": 6.334615384615385,
            "views": 1727375520
          },
          {
            "actor": "Joan Allen",
            "actorID": "nm0000260",
            "films": 22,
            "rating": 6.872727272727274,
            "views": 1726004859
          },
          {
            "actor": "Tim Roth",
            "actorID": "nm0000619",
            "films": 28,
            "rating": 6.7821428571428575,
            "views": 1725829799
          },
          {
            "actor": "Kurt Fuller",
            "actorID": "nm0298281",
            "films": 22,
            "rating": 6.199999999999999,
            "views": 1724564669
          },
          {
            "actor": "Adam Godley",
            "actorID": "nm0324134",
            "films": 11,
            "rating": 6.636363636363637,
            "views": 1720206514
          },
          {
            "actor": "KaDee Strickland",
            "actorID": "nm0834380",
            "films": 10,
            "rating": 6.410000000000001,
            "views": 1719180332
          },
          {
            "actor": "Steven Williams",
            "actorID": "nm0931736",
            "films": 13,
            "rating": 6.307692307692308,
            "views": 1718790721
          },
          {
            "actor": "Bruce Dern",
            "actorID": "nm0001136",
            "films": 24,
            "rating": 6.612500000000001,
            "views": 1718448706
          },
          {
            "actor": "Emily Watson",
            "actorID": "nm0001833",
            "films": 22,
            "rating": 7.150000000000002,
            "views": 1717207841
          },
          {
            "actor": "Colin Ford",
            "actorID": "nm1225406",
            "films": 10,
            "rating": 5.869999999999999,
            "views": 1714798159
          },
          {
            "actor": "Kevin Corrigan",
            "actorID": "nm0180984",
            "films": 32,
            "rating": 6.703125,
            "views": 1714796100
          },
          {
            "actor": "Tim Curry",
            "actorID": "nm0000347",
            "films": 22,
            "rating": 6.168181818181818,
            "views": 1712264876
          },
          {
            "actor": "Evan Jones",
            "actorID": "nm0428055",
            "films": 12,
            "rating": 6.908333333333332,
            "views": 1710772035
          },
          {
            "actor": "Eric Roberts",
            "actorID": "nm0000616",
            "films": 21,
            "rating": 6.252380952380953,
            "views": 1710760133
          },
          {
            "actor": "Jon Stewart",
            "actorID": "nm0829537",
            "films": 13,
            "rating": 6.307692307692308,
            "views": 1710280258
          },
          {
            "actor": "Scott Wilson",
            "actorID": "nm0934113",
            "films": 26,
            "rating": 6.357692307692308,
            "views": 1708806978
          },
          {
            "actor": "Michael O'Neill",
            "actorID": "nm0642259",
            "films": 18,
            "rating": 6.555555555555554,
            "views": 1708155979
          },
          {
            "actor": "John Candy",
            "actorID": "nm0001006",
            "films": 28,
            "rating": 6.4107142857142865,
            "views": 1705969921
          },
          {
            "actor": "James Coburn",
            "actorID": "nm0000336",
            "films": 14,
            "rating": 6.135714285714286,
            "views": 1705962244
          },
          {
            "actor": "Johnny Galecki",
            "actorID": "nm0301959",
            "films": 13,
            "rating": 6.361538461538462,
            "views": 1701876447
          },
          {
            "actor": "Michael Rapaport",
            "actorID": "nm0001650",
            "films": 26,
            "rating": 6.292307692307692,
            "views": 1701654193
          },
          {
            "actor": "Fred Armisen",
            "actorID": "nm0035488",
            "films": 15,
            "rating": 5.92,
            "views": 1700626617
          },
          {
            "actor": "Pat Hingle",
            "actorID": "nm0385757",
            "films": 18,
            "rating": 6.238888888888889,
            "views": 1700523902
          },
          {
            "actor": "Jason Ritter",
            "actorID": "nm0728762",
            "films": 10,
            "rating": 6.01,
            "views": 1697205131
          },
          {
            "actor": "Daniel Dae Kim",
            "actorID": "nm0196654",
            "films": 10,
            "rating": 6.15,
            "views": 1696885866
          },
          {
            "actor": "Ginnifer Goodwin",
            "actorID": "nm0329481",
            "films": 10,
            "rating": 6.69,
            "views": 1695107817
          },
          {
            "actor": "Billy Magnussen",
            "actorID": "nm2915105",
            "films": 10,
            "rating": 6.679999999999998,
            "views": 1694551622
          },
          {
            "actor": "Dianne Wiest",
            "actorID": "nm0001848",
            "films": 30,
            "rating": 6.686666666666666,
            "views": 1694511325
          },
          {
            "actor": "Kate Hudson",
            "actorID": "nm0005028",
            "films": 23,
            "rating": 6.152173913043479,
            "views": 1688874049
          },
          {
            "actor": "Natasha Lyonne",
            "actorID": "nm0005169",
            "films": 19,
            "rating": 6.336842105263156,
            "views": 1688736141
          },
          {
            "actor": "Jared Sandler",
            "actorID": "nm0761977",
            "films": 10,
            "rating": 5.63,
            "views": 1686715007
          },
          {
            "actor": "Regina Hall",
            "actorID": "nm0356021",
            "films": 18,
            "rating": 6.116666666666666,
            "views": 1686111014
          },
          {
            "actor": "Rick Moranis",
            "actorID": "nm0001548",
            "films": 17,
            "rating": 6.370588235294117,
            "views": 1685386456
          },
          {
            "actor": "Tom Berenger",
            "actorID": "nm0000297",
            "films": 25,
            "rating": 6.6,
            "views": 1683583561
          },
          {
            "actor": "Louis Lombardi",
            "actorID": "nm0518385",
            "films": 17,
            "rating": 6.288235294117647,
            "views": 1680862554
          },
          {
            "actor": "Callum Keith Rennie",
            "actorID": "nm0719678",
            "films": 16,
            "rating": 5.99375,
            "views": 1678920810
          },
          {
            "actor": "Joel McHale",
            "actorID": "nm0570364",
            "films": 11,
            "rating": 6.354545454545455,
            "views": 1678313588
          },
          {
            "actor": "Tzi Ma",
            "actorID": "nm0002245",
            "films": 16,
            "rating": 6.550000000000001,
            "views": 1676664602
          },
          {
            "actor": "Julie Christie",
            "actorID": "nm0001046",
            "films": 11,
            "rating": 6.718181818181819,
            "views": 1673972948
          },
          {
            "actor": "Bill Irwin",
            "actorID": "nm0410347",
            "films": 17,
            "rating": 6.3999999999999995,
            "views": 1670637057
          },
          {
            "actor": "Don S. Davis",
            "actorID": "nm0204493",
            "films": 23,
            "rating": 6.321739130434783,
            "views": 1670349131
          },
          {
            "actor": "Mark Addy",
            "actorID": "nm0004692",
            "films": 12,
            "rating": 6.141666666666668,
            "views": 1669295186
          },
          {
            "actor": "Lesley Manville",
            "actorID": "nm0544334",
            "films": 11,
            "rating": 7.136363636363638,
            "views": 1668626624
          },
          {
            "actor": "Patrick Fischler",
            "actorID": "nm0279209",
            "films": 19,
            "rating": 6.242105263157894,
            "views": 1662640729
          },
          {
            "actor": "Zoe Bell",
            "actorID": "nm1057928",
            "films": 10,
            "rating": 6.93,
            "views": 1662303161
          },
          {
            "actor": "Isabella Rossellini",
            "actorID": "nm0000618",
            "films": 17,
            "rating": 6.776470588235293,
            "views": 1661380972
          },
          {
            "actor": "Nora Dunn",
            "actorID": "nm0004887",
            "films": 28,
            "rating": 6.2285714285714295,
            "views": 1657311882
          },
          {
            "actor": "Sarita Choudhury",
            "actorID": "nm0002004",
            "films": 12,
            "rating": 6.133333333333334,
            "views": 1657273488
          },
          {
            "actor": "Branscombe Richmond",
            "actorID": "nm0725079",
            "films": 28,
            "rating": 5.924999999999999,
            "views": 1650250515
          },
          {
            "actor": "Horatio Sanz",
            "actorID": "nm0764445",
            "films": 14,
            "rating": 5.914285714285716,
            "views": 1649218777
          },
          {
            "actor": "Catherine Reitman",
            "actorID": "nm0718642",
            "films": 12,
            "rating": 6.291666666666665,
            "views": 1636374337
          },
          {
            "actor": "Christina Ricci",
            "actorID": "nm0000207",
            "films": 30,
            "rating": 6.2266666666666675,
            "views": 1634389231
          },
          {
            "actor": "Aziz Ansari",
            "actorID": "nm2106637",
            "films": 10,
            "rating": 6.359999999999999,
            "views": 1633869804
          },
          {
            "actor": "Rosie O'Donnell",
            "actorID": "nm0005280",
            "films": 14,
            "rating": 5.97142857142857,
            "views": 1628174416
          },
          {
            "actor": "Simon Callow",
            "actorID": "nm0001003",
            "films": 19,
            "rating": 6.778947368421053,
            "views": 1626735908
          },
          {
            "actor": "Gilbert Gottfried",
            "actorID": "nm0331906",
            "films": 14,
            "rating": 5.692857142857143,
            "views": 1625093786
          },
          {
            "actor": "Wesley Snipes",
            "actorID": "nm0000648",
            "films": 30,
            "rating": 6.236666666666666,
            "views": 1622028176
          },
          {
            "actor": "Nick Chinlund",
            "actorID": "nm0157915",
            "films": 13,
            "rating": 6.076923076923078,
            "views": 1621649386
          },
          {
            "actor": "Mark Pellegrino",
            "actorID": "nm0671032",
            "films": 14,
            "rating": 6.128571428571431,
            "views": 1620016669
          },
          {
            "actor": "Mark Rolston",
            "actorID": "nm0001679",
            "films": 15,
            "rating": 6.6,
            "views": 1619905011
          },
          {
            "actor": "Harve Presnell",
            "actorID": "nm0696193",
            "films": 13,
            "rating": 6.676923076923076,
            "views": 1619358873
          },
          {
            "actor": "Harvey Fierstein",
            "actorID": "nm0001213",
            "films": 10,
            "rating": 6.470000000000001,
            "views": 1619336478
          },
          {
            "actor": "Malin Akerman",
            "actorID": "nm0015196",
            "films": 16,
            "rating": 6.0687500000000005,
            "views": 1617802362
          },
          {
            "actor": "Scott Caan",
            "actorID": "nm0004790",
            "films": 17,
            "rating": 6.158823529411766,
            "views": 1614849283
          },
          {
            "actor": "Bette Midler",
            "actorID": "nm0000541",
            "films": 18,
            "rating": 6.166666666666668,
            "views": 1612773566
          },
          {
            "actor": "Mia Wasikowska",
            "actorID": "nm1985859",
            "films": 13,
            "rating": 6.776923076923078,
            "views": 1612450884
          },
          {
            "actor": "Tea Leoni",
            "actorID": "nm0000495",
            "films": 12,
            "rating": 6.483333333333333,
            "views": 1612310865
          },
          {
            "actor": "Christina Applegate",
            "actorID": "nm0000775",
            "films": 21,
            "rating": 5.966666666666666,
            "views": 1611587560
          },
          {
            "actor": "Sofia Vergara",
            "actorID": "nm0005527",
            "films": 17,
            "rating": 5.5058823529411764,
            "views": 1610817226
          },
          {
            "actor": "Carla Gallo",
            "actorID": "nm0303013",
            "films": 11,
            "rating": 6.7,
            "views": 1607903594
          },
          {
            "actor": "Sam Shepard",
            "actorID": "nm0001731",
            "films": 30,
            "rating": 6.716666666666667,
            "views": 1607051369
          },
          {
            "actor": "Sean Hayes",
            "actorID": "nm0005003",
            "films": 11,
            "rating": 5.790909090909091,
            "views": 1606882414
          },
          {
            "actor": "Edgar Ramirez",
            "actorID": "nm1183149",
            "films": 12,
            "rating": 6.558333333333334,
            "views": 1603960146
          },
          {
            "actor": "Tony Jay",
            "actorID": "nm0419645",
            "films": 14,
            "rating": 6.414285714285714,
            "views": 1602402126
          },
          {
            "actor": "Lance Reddick",
            "actorID": "nm0714698",
            "films": 11,
            "rating": 6.4818181818181815,
            "views": 1601744733
          },
          {
            "actor": "Samantha Morton",
            "actorID": "nm0608090",
            "films": 14,
            "rating": 6.921428571428572,
            "views": 1597502396
          },
          {
            "actor": "Mark Rylance",
            "actorID": "nm0753314",
            "films": 10,
            "rating": 6.840000000000001,
            "views": 1596242920
          },
          {
            "actor": "Eric Idle",
            "actorID": "nm0001385",
            "films": 16,
            "rating": 5.9625,
            "views": 1594216221
          },
          {
            "actor": "Adam Scott",
            "actorID": "nm0004395",
            "films": 22,
            "rating": 6.254545454545456,
            "views": 1593004356
          },
          {
            "actor": "Julie Delpy",
            "actorID": "nm0000365",
            "films": 15,
            "rating": 7.266666666666667,
            "views": 1591971004
          },
          {
            "actor": "Stuart Wilson",
            "actorID": "nm0934179",
            "films": 14,
            "rating": 6.507142857142857,
            "views": 1591748268
          },
          {
            "actor": "Nancy Cartwright",
            "actorID": "nm0004813",
            "films": 11,
            "rating": 6.736363636363637,
            "views": 1588579028
          },
          {
            "actor": "Zachary Gordon",
            "actorID": "nm2325393",
            "films": 12,
            "rating": 6.2250000000000005,
            "views": 1587617667
          },
          {
            "actor": "Dane DeHaan",
            "actorID": "nm2851530",
            "films": 12,
            "rating": 6.625,
            "views": 1585760055
          },
          {
            "actor": "Charles S. Dutton",
            "actorID": "nm0001165",
            "films": 25,
            "rating": 6.284,
            "views": 1582500138
          },
          {
            "actor": "F. Murray Abraham",
            "actorID": "nm0000719",
            "films": 23,
            "rating": 6.813043478260869,
            "views": 1580134278
          },
          {
            "actor": "Judge Reinhold",
            "actorID": "nm0001662",
            "films": 16,
            "rating": 6.225,
            "views": 1580097359
          },
          {
            "actor": "J.T. Walsh",
            "actorID": "nm0000687",
            "films": 36,
            "rating": 6.6,
            "views": 1578854465
          },
          {
            "actor": "Alan Ruck",
            "actorID": "nm0001688",
            "films": 17,
            "rating": 6.194117647058824,
            "views": 1571389714
          },
          {
            "actor": "Cole Hauser",
            "actorID": "nm0369513",
            "films": 16,
            "rating": 6.5,
            "views": 1571080372
          },
          {
            "actor": "Michael Jace",
            "actorID": "nm0413052",
            "films": 11,
            "rating": 6.754545454545456,
            "views": 1569858440
          },
          {
            "actor": "Marlon Wayans",
            "actorID": "nm0005541",
            "films": 18,
            "rating": 5.672222222222221,
            "views": 1568382078
          },
          {
            "actor": "Sharlto Copley",
            "actorID": "nm1663205",
            "films": 10,
            "rating": 6.720000000000001,
            "views": 1568287982
          },
          {
            "actor": "Bebe Neuwirth",
            "actorID": "nm0001564",
            "films": 16,
            "rating": 6.1000000000000005,
            "views": 1567750247
          },
          {
            "actor": "Kat Dennings",
            "actorID": "nm0993507",
            "films": 11,
            "rating": 6.20909090909091,
            "views": 1566149736
          },
          {
            "actor": "James Faulkner",
            "actorID": "nm0269077",
            "films": 11,
            "rating": 6.590909090909091,
            "views": 1565880493
          },
          {
            "actor": "Michael Kenneth Williams",
            "actorID": "nm0931324",
            "films": 17,
            "rating": 6.529411764705883,
            "views": 1565531846
          },
          {
            "actor": "William Shatner",
            "actorID": "nm0000638",
            "films": 16,
            "rating": 6.38125,
            "views": 1564618214
          },
          {
            "actor": "Christopher McDonald",
            "actorID": "nm0001520",
            "films": 41,
            "rating": 6.09268292682927,
            "views": 1563581661
          },
          {
            "actor": "Peter Capaldi",
            "actorID": "nm0134922",
            "films": 12,
            "rating": 6.966666666666668,
            "views": 1562904690
          },
          {
            "actor": "Caroline Goodall",
            "actorID": "nm0328751",
            "films": 19,
            "rating": 6.542105263157895,
            "views": 1561486211
          },
          {
            "actor": "Matthew Lillard",
            "actorID": "nm0000498",
            "films": 23,
            "rating": 6.000000000000001,
            "views": 1561071954
          },
          {
            "actor": "Adam Goldberg",
            "actorID": "nm0004965",
            "films": 18,
            "rating": 6.783333333333333,
            "views": 1559536446
          },
          {
            "actor": "Chris Tucker",
            "actorID": "nm0000676",
            "films": 13,
            "rating": 6.584615384615386,
            "views": 1555984588
          },
          {
            "actor": "Glenn Plummer",
            "actorID": "nm0687625",
            "films": 24,
            "rating": 6.349999999999999,
            "views": 1555884409
          },
          {
            "actor": "Ken Leung",
            "actorID": "nm0504962",
            "films": 13,
            "rating": 7.061538461538461,
            "views": 1554698554
          },
          {
            "actor": "Pruitt Taylor Vince",
            "actorID": "nm0898546",
            "films": 31,
            "rating": 6.667741935483869,
            "views": 1554259465
          },
          {
            "actor": "Lea Thompson",
            "actorID": "nm0000670",
            "films": 17,
            "rating": 5.935294117647059,
            "views": 1553279678
          },
          {
            "actor": "Mary McDonnell",
            "actorID": "nm0001521",
            "films": 12,
            "rating": 7.075,
            "views": 1547165685
          },
          {
            "actor": "Wallace Langham",
            "actorID": "nm0005120",
            "films": 19,
            "rating": 6.352631578947368,
            "views": 1546326939
          },
          {
            "actor": "Jordi Molla",
            "actorID": "nm0003244",
            "films": 12,
            "rating": 6.666666666666665,
            "views": 1545591796
          },
          {
            "actor": "Edwin Hodge",
            "actorID": "nm0388064",
            "films": 12,
            "rating": 6.074999999999999,
            "views": 1544007486
          },
          {
            "actor": "Dougray Scott",
            "actorID": "nm0779084",
            "films": 10,
            "rating": 6.33,
            "views": 1543932329
          },
          {
            "actor": "Christian Clemenson",
            "actorID": "nm0166061",
            "films": 20,
            "rating": 6.495000000000002,
            "views": 1537369978
          },
          {
            "actor": "Tyler Labine",
            "actorID": "nm0479527",
            "films": 11,
            "rating": 6.345454545454545,
            "views": 1535744877
          },
          {
            "actor": "Pat Healy",
            "actorID": "nm0372366",
            "films": 14,
            "rating": 6.771428571428571,
            "views": 1533503489
          },
          {
            "actor": "Peter Coyote",
            "actorID": "nm0001075",
            "films": 18,
            "rating": 6.355555555555557,
            "views": 1533308417
          },
          {
            "actor": "Amanda Plummer",
            "actorID": "nm0001625",
            "films": 18,
            "rating": 6.644444444444444,
            "views": 1532146972
          },
          {
            "actor": "Johnny Knoxville",
            "actorID": "nm0424216",
            "films": 15,
            "rating": 5.786666666666666,
            "views": 1532016263
          },
          {
            "actor": "Tyler Perry",
            "actorID": "nm1347153",
            "films": 12,
            "rating": 5.783333333333332,
            "views": 1530358864
          },
          {
            "actor": "Patricia Arquette",
            "actorID": "nm0000099",
            "films": 19,
            "rating": 6.747368421052631,
            "views": 1528808021
          },
          {
            "actor": "Harris Yulin",
            "actorID": "nm0950867",
            "films": 23,
            "rating": 6.456521739130435,
            "views": 1524388825
          },
          {
            "actor": "Kevin J. O'Connor",
            "actorID": "nm0640413",
            "films": 21,
            "rating": 6.447619047619048,
            "views": 1523742799
          },
          {
            "actor": "Patrick Bauchau",
            "actorID": "nm0000872",
            "films": 13,
            "rating": 6.507692307692308,
            "views": 1523379324
          },
          {
            "actor": "Ben Falcone",
            "actorID": "nm1229520",
            "films": 16,
            "rating": 6.1187499999999995,
            "views": 1523372970
          },
          {
            "actor": "Devin Ratray",
            "actorID": "nm0711864",
            "films": 14,
            "rating": 6.35,
            "views": 1522546051
          },
          {
            "actor": "Kristin Chenoweth",
            "actorID": "nm0155693",
            "films": 12,
            "rating": 5.925000000000001,
            "views": 1521081571
          },
          {
            "actor": "Jesse James",
            "actorID": "nm0416596",
            "films": 12,
            "rating": 6.258333333333333,
            "views": 1519083991
          },
          {
            "actor": "Neal McDonough",
            "actorID": "nm0568180",
            "films": 19,
            "rating": 6.078947368421052,
            "views": 1510450106
          },
          {
            "actor": "Bai Ling",
            "actorID": "nm0000499",
            "films": 15,
            "rating": 6.386666666666666,
            "views": 1508096621
          },
          {
            "actor": "Harold Ramis",
            "actorID": "nm0000601",
            "films": 16,
            "rating": 6.68125,
            "views": 1506797472
          },
          {
            "actor": "Fran Drescher",
            "actorID": "nm0000376",
            "films": 12,
            "rating": 6.416666666666667,
            "views": 1505802036
          },
          {
            "actor": "Ernie Hudson",
            "actorID": "nm0001368",
            "films": 23,
            "rating": 5.821739130434783,
            "views": 1502562680
          },
          {
            "actor": "Art LaFleur",
            "actorID": "nm0480869",
            "films": 30,
            "rating": 6.146666666666665,
            "views": 1501799082
          },
          {
            "actor": "Tate Donovan",
            "actorID": "nm0004883",
            "films": 20,
            "rating": 6.5,
            "views": 1500836402
          },
          {
            "actor": "Toby Huss",
            "actorID": "nm0403947",
            "films": 28,
            "rating": 6.167857142857144,
            "views": 1498268964
          },
          {
            "actor": "Jaime King",
            "actorID": "nm0454809",
            "films": 13,
            "rating": 6.084615384615384,
            "views": 1498091376
          },
          {
            "actor": "Linda Hunt",
            "actorID": "nm0001373",
            "films": 17,
            "rating": 6.3352941176470585,
            "views": 1495565040
          },
          {
            "actor": "Dabney Coleman",
            "actorID": "nm0001056",
            "films": 24,
            "rating": 6.045833333333335,
            "views": 1494660693
          },
          {
            "actor": "Jeffrey Jones",
            "actorID": "nm0000470",
            "films": 27,
            "rating": 6.251851851851853,
            "views": 1494545264
          },
          {
            "actor": "Andrea Martin",
            "actorID": "nm0551908",
            "films": 21,
            "rating": 5.9904761904761905,
            "views": 1493554725
          },
          {
            "actor": "Caleb Landry Jones",
            "actorID": "nm2655177",
            "films": 12,
            "rating": 7.083333333333332,
            "views": 1492716454
          },
          {
            "actor": "Kyle MacLachlan",
            "actorID": "nm0001492",
            "films": 16,
            "rating": 6.3687499999999995,
            "views": 1491467099
          },
          {
            "actor": "Joaquim de Almeida",
            "actorID": "nm0021835",
            "films": 12,
            "rating": 6.466666666666666,
            "views": 1487632387
          },
          {
            "actor": "Chris Mulkey",
            "actorID": "nm0611889",
            "films": 24,
            "rating": 6.6000000000000005,
            "views": 1483047506
          },
          {
            "actor": "Raymond Cruz",
            "actorID": "nm0190441",
            "films": 16,
            "rating": 6.3187500000000005,
            "views": 1480228468
          },
          {
            "actor": "Kim Dickens",
            "actorID": "nm0225332",
            "films": 12,
            "rating": 6.733333333333334,
            "views": 1480161525
          },
          {
            "actor": "Tom Skerritt",
            "actorID": "nm0000643",
            "films": 25,
            "rating": 6.22,
            "views": 1479943390
          },
          {
            "actor": "Tim Matheson",
            "actorID": "nm0001513",
            "films": 13,
            "rating": 6.069230769230769,
            "views": 1475977454
          },
          {
            "actor": "Rita Wilson",
            "actorID": "nm0001854",
            "films": 22,
            "rating": 6.013636363636363,
            "views": 1474251857
          },
          {
            "actor": "Charles Napier",
            "actorID": "nm0621008",
            "films": 21,
            "rating": 6.400000000000001,
            "views": 1471675198
          },
          {
            "actor": "Liam Cunningham",
            "actorID": "nm0192377",
            "films": 15,
            "rating": 6.833333333333334,
            "views": 1470975994
          },
          {
            "actor": "Armie Hammer",
            "actorID": "nm2309517",
            "films": 14,
            "rating": 6.878571428571428,
            "views": 1469656645
          },
          {
            "actor": "Gemma Arterton",
            "actorID": "nm2605345",
            "films": 11,
            "rating": 6.545454545454546,
            "views": 1469437269
          },
          {
            "actor": "Stephen Merchant",
            "actorID": "nm0580351",
            "films": 13,
            "rating": 6.3538461538461535,
            "views": 1468879889
          },
          {
            "actor": "Shannon Elizabeth",
            "actorID": "nm0002436",
            "films": 10,
            "rating": 6.119999999999999,
            "views": 1467883913
          },
          {
            "actor": "Rufus Sewell",
            "actorID": "nm0001722",
            "films": 14,
            "rating": 6.5928571428571425,
            "views": 1466869316
          },
          {
            "actor": "Taylor Kitsch",
            "actorID": "nm2018237",
            "films": 11,
            "rating": 6.390909090909091,
            "views": 1464340096
          },
          {
            "actor": "Ian Hart",
            "actorID": "nm0001324",
            "films": 11,
            "rating": 7.181818181818182,
            "views": 1463173513
          },
          {
            "actor": "Alice Eve",
            "actorID": "nm1404408",
            "films": 11,
            "rating": 6.263636363636363,
            "views": 1460728813
          },
          {
            "actor": "Denis O'Hare",
            "actorID": "nm0641354",
            "films": 23,
            "rating": 6.78695652173913,
            "views": 1458916112
          },
          {
            "actor": "James Russo",
            "actorID": "nm0751638",
            "films": 21,
            "rating": 6.685714285714286,
            "views": 1458176814
          },
          {
            "actor": "Theresa Randle",
            "actorID": "nm0005337",
            "films": 17,
            "rating": 6.305882352941175,
            "views": 1457606607
          },
          {
            "actor": "Peter Boyle",
            "actorID": "nm0001967",
            "films": 21,
            "rating": 5.852380952380952,
            "views": 1456162918
          },
          {
            "actor": "Danielle Burgio",
            "actorID": "nm0121413",
            "films": 10,
            "rating": 6.040000000000001,
            "views": 1454933472
          },
          {
            "actor": "Jake Busey",
            "actorID": "nm0000998",
            "films": 14,
            "rating": 6.435714285714285,
            "views": 1454917737
          },
          {
            "actor": "Noomi Rapace",
            "actorID": "nm0636426",
            "films": 10,
            "rating": 6.859999999999999,
            "views": 1454336039
          },
          {
            "actor": "Christina Hendricks",
            "actorID": "nm0376716",
            "films": 12,
            "rating": 6.466666666666666,
            "views": 1454254804
          },
          {
            "actor": "Regina King",
            "actorID": "nm0005093",
            "films": 16,
            "rating": 6.4312499999999995,
            "views": 1453867577
          },
          {
            "actor": "Vinnie Jones",
            "actorID": "nm0005068",
            "films": 15,
            "rating": 6.453333333333333,
            "views": 1451034394
          },
          {
            "actor": "Michael Wincott",
            "actorID": "nm0000699",
            "films": 26,
            "rating": 6.692307692307693,
            "views": 1446997965
          },
          {
            "actor": "Alison Brie",
            "actorID": "nm1555340",
            "films": 12,
            "rating": 6.683333333333334,
            "views": 1445893980
          },
          {
            "actor": "Peter O'Toole",
            "actorID": "nm0000564",
            "films": 14,
            "rating": 6.45,
            "views": 1445441152
          },
          {
            "actor": "Hal Holbrook",
            "actorID": "nm0001358",
            "films": 21,
            "rating": 6.566666666666667,
            "views": 1445113305
          },
          {
            "actor": "Valente Rodriguez",
            "actorID": "nm0735538",
            "films": 15,
            "rating": 6.333333333333333,
            "views": 1444091624
          },
          {
            "actor": "T.J. Thyne",
            "actorID": "nm0862328",
            "films": 10,
            "rating": 6.270000000000001,
            "views": 1442358301
          },
          {
            "actor": "Iain Glen",
            "actorID": "nm0322513",
            "films": 16,
            "rating": 6.406250000000001,
            "views": 1439153069
          },
          {
            "actor": "Jillian Bell",
            "actorID": "nm3255459",
            "films": 12,
            "rating": 6.375,
            "views": 1436378857
          },
          {
            "actor": "Lee Garlington",
            "actorID": "nm0307600",
            "films": 26,
            "rating": 6.226923076923077,
            "views": 1432231127
          },
          {
            "actor": "Joan Plowright",
            "actorID": "nm0687506",
            "films": 18,
            "rating": 6.188888888888889,
            "views": 1430551313
          },
          {
            "actor": "Eric Stoltz",
            "actorID": "nm0000655",
            "films": 31,
            "rating": 6.599999999999999,
            "views": 1430256566
          },
          {
            "actor": "Andrew Bryniarski",
            "actorID": "nm0117420",
            "films": 11,
            "rating": 5.7727272727272725,
            "views": 1429440893
          },
          {
            "actor": "Adam Baldwin",
            "actorID": "nm0000284",
            "films": 18,
            "rating": 6.688888888888888,
            "views": 1426819396
          },
          {
            "actor": "Larry Hankin",
            "actorID": "nm0359969",
            "films": 19,
            "rating": 6.252631578947369,
            "views": 1424974899
          },
          {
            "actor": "Gary Cole",
            "actorID": "nm0170550",
            "films": 25,
            "rating": 6.38,
            "views": 1423685818
          },
          {
            "actor": "Lance Henriksen",
            "actorID": "nm0000448",
            "films": 28,
            "rating": 6.321428571428571,
            "views": 1423270997
          },
          {
            "actor": "George Segal",
            "actorID": "nm0001719",
            "films": 11,
            "rating": 6.063636363636363,
            "views": 1422533077
          },
          {
            "actor": "Boyd Holbrook",
            "actorID": "nm2933542",
            "films": 10,
            "rating": 6.76,
            "views": 1421998674
          },
          {
            "actor": "Dave Chappelle",
            "actorID": "nm0152638",
            "films": 12,
            "rating": 6.333333333333333,
            "views": 1421425974
          },
          {
            "actor": "Lee Arenberg",
            "actorID": "nm0034305",
            "films": 16,
            "rating": 5.581249999999999,
            "views": 1421108394
          },
          {
            "actor": "Anthony LaPaglia",
            "actorID": "nm0001439",
            "films": 25,
            "rating": 6.312,
            "views": 1420397466
          },
          {
            "actor": "Mena Suvari",
            "actorID": "nm0002546",
            "films": 17,
            "rating": 6.141176470588235,
            "views": 1419726709
          },
          {
            "actor": "Christopher Meloni",
            "actorID": "nm0005221",
            "films": 14,
            "rating": 6.399999999999999,
            "views": 1418889573
          },
          {
            "actor": "James Fox",
            "actorID": "nm0289038",
            "films": 19,
            "rating": 6.468421052631578,
            "views": 1418768201
          },
          {
            "actor": "Kelly Preston",
            "actorID": "nm0000593",
            "films": 32,
            "rating": 5.93125,
            "views": 1418392710
          },
          {
            "actor": "Til Schweiger",
            "actorID": "nm0001709",
            "films": 14,
            "rating": 6.300000000000002,
            "views": 1416140862
          },
          {
            "actor": "Fred Willard",
            "actorID": "nm0929609",
            "films": 23,
            "rating": 5.995652173913044,
            "views": 1415957370
          },
          {
            "actor": "William Atherton",
            "actorID": "nm0040472",
            "films": 10,
            "rating": 6.7299999999999995,
            "views": 1413462225
          },
          {
            "actor": "Michael Jai White",
            "actorID": "nm0925220",
            "films": 15,
            "rating": 5.6000000000000005,
            "views": 1411928260
          },
          {
            "actor": "Katherine Heigl",
            "actorID": "nm0001337",
            "films": 16,
            "rating": 5.88125,
            "views": 1411426999
          },
          {
            "actor": "Nicholas Pryor",
            "actorID": "nm0699425",
            "films": 15,
            "rating": 6.24,
            "views": 1409716732
          },
          {
            "actor": "Ellen Burstyn",
            "actorID": "nm0000995",
            "films": 20,
            "rating": 6.709999999999999,
            "views": 1409673705
          },
          {
            "actor": "Martin Donovan",
            "actorID": "nm0233027",
            "films": 20,
            "rating": 6.625,
            "views": 1409507400
          },
          {
            "actor": "Bridget Moynahan",
            "actorID": "nm0005256",
            "films": 10,
            "rating": 6.74,
            "views": 1409039610
          },
          {
            "actor": "Jesse Plemons",
            "actorID": "nm0687146",
            "films": 16,
            "rating": 6.749999999999999,
            "views": 1405693253
          },
          {
            "actor": "Robert Forster",
            "actorID": "nm0001233",
            "films": 18,
            "rating": 6.138888888888888,
            "views": 1405172386
          },
          {
            "actor": "Peter Gallagher",
            "actorID": "nm0001251",
            "films": 28,
            "rating": 6.439285714285715,
            "views": 1403862620
          },
          {
            "actor": "Chelcie Ross",
            "actorID": "nm0743304",
            "films": 22,
            "rating": 6.695454545454547,
            "views": 1403829884
          },
          {
            "actor": "Olga Kurylenko",
            "actorID": "nm1385871",
            "films": 14,
            "rating": 6.457142857142856,
            "views": 1402971528
          },
          {
            "actor": "Pat Roach",
            "actorID": "nm0730053",
            "films": 11,
            "rating": 6.445454545454546,
            "views": 1399426143
          },
          {
            "actor": "Anthony Michael Hall",
            "actorID": "nm0001309",
            "films": 15,
            "rating": 6.533333333333333,
            "views": 1399359008
          },
          {
            "actor": "Kumail Nanjiani",
            "actorID": "nm3529685",
            "films": 15,
            "rating": 6.0666666666666655,
            "views": 1396793073
          },
          {
            "actor": "Henry Thomas",
            "actorID": "nm0001794",
            "films": 12,
            "rating": 6.758333333333333,
            "views": 1394991739
          },
          {
            "actor": "Clark Duke",
            "actorID": "nm0241173",
            "films": 11,
            "rating": 6.518181818181817,
            "views": 1391580304
          },
          {
            "actor": "Debra Winger",
            "actorID": "nm0000700",
            "films": 19,
            "rating": 6.521052631578947,
            "views": 1390811071
          },
          {
            "actor": "Katie Holmes",
            "actorID": "nm0005017",
            "films": 22,
            "rating": 6.304545454545456,
            "views": 1390486511
          },
          {
            "actor": "Marianne Jean-Baptiste",
            "actorID": "nm0001399",
            "films": 11,
            "rating": 6.681818181818182,
            "views": 1390381764
          },
          {
            "actor": "Steven Berkoff",
            "actorID": "nm0000925",
            "films": 13,
            "rating": 6.207692307692307,
            "views": 1390141956
          },
          {
            "actor": "Ron Rifkin",
            "actorID": "nm0726492",
            "films": 15,
            "rating": 6.7733333333333325,
            "views": 1389740916
          },
          {
            "actor": "Michael Bowen",
            "actorID": "nm0100889",
            "films": 20,
            "rating": 6.659999999999999,
            "views": 1389727392
          },
          {
            "actor": "Ali Larter",
            "actorID": "nm0005123",
            "films": 13,
            "rating": 6.076923076923077,
            "views": 1389449818
          },
          {
            "actor": "Pip Torrens",
            "actorID": "nm0868476",
            "films": 22,
            "rating": 6.663636363636365,
            "views": 1389164020
          },
          {
            "actor": "Richard Dreyfuss",
            "actorID": "nm0000377",
            "films": 30,
            "rating": 6.3999999999999995,
            "views": 1389128812
          },
          {
            "actor": "William Morgan Sheppard",
            "actorID": "nm0792003",
            "films": 14,
            "rating": 6.914285714285714,
            "views": 1389049352
          },
          {
            "actor": "Snoop Dogg",
            "actorID": "nm0004879",
            "films": 16,
            "rating": 5.781250000000001,
            "views": 1386229092
          },
          {
            "actor": "Christopher Eccleston",
            "actorID": "nm0001172",
            "films": 11,
            "rating": 7.036363636363635,
            "views": 1385356902
          },
          {
            "actor": "David Costabile",
            "actorID": "nm0182345",
            "films": 12,
            "rating": 6.533333333333334,
            "views": 1385331291
          },
          {
            "actor": "Paul Dano",
            "actorID": "nm0200452",
            "films": 19,
            "rating": 7.021052631578947,
            "views": 1383754191
          },
          {
            "actor": "Chris Browning",
            "actorID": "nm0115152",
            "films": 11,
            "rating": 6.49090909090909,
            "views": 1383415773
          },
          {
            "actor": "Daniel Stern",
            "actorID": "nm0827663",
            "films": 24,
            "rating": 6.479166666666667,
            "views": 1382999371
          },
          {
            "actor": "Robert Pastorelli",
            "actorID": "nm0665123",
            "films": 13,
            "rating": 6.053846153846154,
            "views": 1382869449
          },
          {
            "actor": "Fay Masterson",
            "actorID": "nm0557739",
            "films": 10,
            "rating": 6.19,
            "views": 1378321516
          },
          {
            "actor": "Nonso Anozie",
            "actorID": "nm1996829",
            "films": 12,
            "rating": 6.3999999999999995,
            "views": 1377879081
          },
          {
            "actor": "Mark Moses",
            "actorID": "nm0608601",
            "films": 14,
            "rating": 6.614285714285714,
            "views": 1376528403
          },
          {
            "actor": "Karen Allen",
            "actorID": "nm0000261",
            "films": 14,
            "rating": 6.721428571428572,
            "views": 1376459153
          },
          {
            "actor": "Isiah Whitlock Jr.",
            "actorID": "nm0926086",
            "films": 24,
            "rating": 6.620833333333331,
            "views": 1374263786
          },
          {
            "actor": "Sarah Michelle Gellar",
            "actorID": "nm0001264",
            "films": 14,
            "rating": 5.771428571428572,
            "views": 1373958006
          },
          {
            "actor": "Shawnee Smith",
            "actorID": "nm0809938",
            "films": 15,
            "rating": 6.26,
            "views": 1373418765
          },
          {
            "actor": "Alice Krige",
            "actorID": "nm0000481",
            "films": 14,
            "rating": 6.257142857142857,
            "views": 1372963186
          },
          {
            "actor": "Morris Chestnut",
            "actorID": "nm0004820",
            "films": 20,
            "rating": 6.14,
            "views": 1370889592
          },
          {
            "actor": "Julian Richings",
            "actorID": "nm0724995",
            "films": 19,
            "rating": 6.368421052631579,
            "views": 1370673156
          },
          {
            "actor": "Carmen Electra",
            "actorID": "nm0001182",
            "films": 14,
            "rating": 4.621428571428573,
            "views": 1369739987
          },
          {
            "actor": "Jane Krakowski",
            "actorID": "nm0005105",
            "films": 13,
            "rating": 6.223076923076925,
            "views": 1369542524
          },
          {
            "actor": "Bob Balaban",
            "actorID": "nm0000837",
            "films": 33,
            "rating": 6.733333333333333,
            "views": 1367227820
          },
          {
            "actor": "Rene Auberjonois",
            "actorID": "nm0041281",
            "films": 15,
            "rating": 6.4466666666666645,
            "views": 1366328004
          },
          {
            "actor": "January Jones",
            "actorID": "nm0005064",
            "films": 11,
            "rating": 6.554545454545456,
            "views": 1364268124
          },
          {
            "actor": "Anthony Heald",
            "actorID": "nm0372217",
            "films": 18,
            "rating": 6.566666666666666,
            "views": 1363874678
          },
          {
            "actor": "Malcolm McDowell",
            "actorID": "nm0000532",
            "films": 29,
            "rating": 6.0137931034482754,
            "views": 1362553234
          },
          {
            "actor": "Ben Daniels",
            "actorID": "nm0199842",
            "films": 10,
            "rating": 6.5600000000000005,
            "views": 1361390840
          },
          {
            "actor": "Chris O'Donnell",
            "actorID": "nm0000563",
            "films": 17,
            "rating": 6.211764705882353,
            "views": 1360729602
          },
          {
            "actor": "Harry Connick Jr.",
            "actorID": "nm0001065",
            "films": 12,
            "rating": 6.658333333333332,
            "views": 1360287912
          },
          {
            "actor": "Yeardley Smith",
            "actorID": "nm0810379",
            "films": 12,
            "rating": 6.308333333333334,
            "views": 1358687913
          },
          {
            "actor": "Ben Chaplin",
            "actorID": "nm0001035",
            "films": 12,
            "rating": 6.541666666666667,
            "views": 1358492728
          },
          {
            "actor": "Debi Mazar",
            "actorID": "nm0000529",
            "films": 29,
            "rating": 6.386206896551723,
            "views": 1354308180
          },
          {
            "actor": "Burt Reynolds",
            "actorID": "nm0000608",
            "films": 32,
            "rating": 5.737500000000002,
            "views": 1353629904
          },
          {
            "actor": "Jim Belushi",
            "actorID": "nm0000902",
            "films": 30,
            "rating": 6.096666666666668,
            "views": 1353520866
          },
          {
            "actor": "Udo Kier",
            "actorID": "nm0001424",
            "films": 27,
            "rating": 6.2333333333333325,
            "views": 1351663292
          },
          {
            "actor": "Colm Meaney",
            "actorID": "nm0000538",
            "films": 25,
            "rating": 6.756,
            "views": 1351382500
          },
          {
            "actor": "Glynn Turman",
            "actorID": "nm0877270",
            "films": 14,
            "rating": 6.364285714285716,
            "views": 1351317634
          },
          {
            "actor": "John Corbett",
            "actorID": "nm0179173",
            "films": 16,
            "rating": 6.018749999999999,
            "views": 1350900197
          },
          {
            "actor": "Christian Slater",
            "actorID": "nm0000225",
            "films": 38,
            "rating": 6.389473684210526,
            "views": 1349252724
          },
          {
            "actor": "Matt Winston",
            "actorID": "nm0935616",
            "films": 16,
            "rating": 6.5625,
            "views": 1348528284
          },
          {
            "actor": "Jake Hoffman",
            "actorID": "nm0388933",
            "films": 10,
            "rating": 6.99,
            "views": 1348232441
          },
          {
            "actor": "Joe Anderson",
            "actorID": "nm1725848",
            "films": 10,
            "rating": 6.49,
            "views": 1347130841
          },
          {
            "actor": "Kieran Culkin",
            "actorID": "nm0001085",
            "films": 14,
            "rating": 6.557142857142856,
            "views": 1346475784
          },
          {
            "actor": "Matt Dillon",
            "actorID": "nm0000369",
            "films": 32,
            "rating": 6.375,
            "views": 1344258826
          },
          {
            "actor": "Sandy Martin",
            "actorID": "nm0553036",
            "films": 17,
            "rating": 6.494117647058823,
            "views": 1342724378
          },
          {
            "actor": "Michael Rosenbaum",
            "actorID": "nm0742146",
            "films": 10,
            "rating": 6.08,
            "views": 1342146851
          },
          {
            "actor": "Kevin Sussman",
            "actorID": "nm0839934",
            "films": 13,
            "rating": 6.5,
            "views": 1340768418
          },
          {
            "actor": "Edward Asner",
            "actorID": "nm0000799",
            "films": 10,
            "rating": 6.409999999999999,
            "views": 1339728602
          },
          {
            "actor": "Gerard Depardieu",
            "actorID": "nm0000367",
            "films": 21,
            "rating": 6.728571428571428,
            "views": 1338897383
          },
          {
            "actor": "Jacob Vargas",
            "actorID": "nm0889846",
            "films": 24,
            "rating": 6.395833333333333,
            "views": 1338220226
          },
          {
            "actor": "Ted Danson",
            "actorID": "nm0001101",
            "films": 16,
            "rating": 6.300000000000002,
            "views": 1335000054
          },
          {
            "actor": "James Gandolfini",
            "actorID": "nm0001254",
            "films": 31,
            "rating": 6.564516129032258,
            "views": 1334446804
          },
          {
            "actor": "Kim Cattrall",
            "actorID": "nm0000326",
            "films": 16,
            "rating": 5.806250000000001,
            "views": 1334438107
          },
          {
            "actor": "Juliette Lewis",
            "actorID": "nm0000496",
            "films": 31,
            "rating": 6.490322580645161,
            "views": 1334189250
          },
          {
            "actor": "Sherri Shepherd",
            "actorID": "nm0791868",
            "films": 13,
            "rating": 5.7153846153846155,
            "views": 1333760347
          },
          {
            "actor": "Len Cariou",
            "actorID": "nm0137230",
            "films": 13,
            "rating": 6.876923076923077,
            "views": 1333051769
          },
          {
            "actor": "Kris Kristofferson",
            "actorID": "nm0001434",
            "films": 20,
            "rating": 6.25,
            "views": 1331666948
          },
          {
            "actor": "Joel Murray",
            "actorID": "nm0615063",
            "films": 11,
            "rating": 6.263636363636365,
            "views": 1326912080
          },
          {
            "actor": "Olivia Wilde",
            "actorID": "nm1312575",
            "films": 20,
            "rating": 6.49,
            "views": 1326538832
          },
          {
            "actor": "Robert Carlyle",
            "actorID": "nm0001015",
            "films": 15,
            "rating": 6.739999999999999,
            "views": 1325226776
          },
          {
            "actor": "Ben Schwartz",
            "actorID": "nm2355635",
            "films": 11,
            "rating": 6.4363636363636365,
            "views": 1324084296
          },
          {
            "actor": "Olivia Williams",
            "actorID": "nm0931404",
            "films": 14,
            "rating": 6.607142857142856,
            "views": 1320486924
          },
          {
            "actor": "Vondie Curtis-Hall",
            "actorID": "nm0193554",
            "films": 18,
            "rating": 6.711111111111111,
            "views": 1319956429
          },
          {
            "actor": "Lena Headey",
            "actorID": "nm0372176",
            "films": 17,
            "rating": 6.435294117647058,
            "views": 1318835427
          },
          {
            "actor": "Anjelica Huston",
            "actorID": "nm0001378",
            "films": 30,
            "rating": 6.866666666666666,
            "views": 1318688306
          },
          {
            "actor": "Grace Zabriskie",
            "actorID": "nm0951471",
            "films": 22,
            "rating": 6.177272727272728,
            "views": 1315723425
          },
          {
            "actor": "Ronny Cox",
            "actorID": "nm0001074",
            "films": 16,
            "rating": 6.024999999999999,
            "views": 1315629540
          },
          {
            "actor": "Teresa Palmer",
            "actorID": "nm1954240",
            "films": 15,
            "rating": 6.206666666666666,
            "views": 1315108689
          },
          {
            "actor": "Megan Mullally",
            "actorID": "nm0005259",
            "films": 15,
            "rating": 6.093333333333335,
            "views": 1313915478
          },
          {
            "actor": "Nikolaj Coster-Waldau",
            "actorID": "nm0182666",
            "films": 10,
            "rating": 6.5200000000000005,
            "views": 1311742979
          },
          {
            "actor": "Maury Sterling",
            "actorID": "nm0827561",
            "films": 11,
            "rating": 6.336363636363635,
            "views": 1310996484
          },
          {
            "actor": "Jason Biggs",
            "actorID": "nm0004755",
            "films": 13,
            "rating": 6.338461538461538,
            "views": 1310255098
          },
          {
            "actor": "Kathleen Turner",
            "actorID": "nm0000678",
            "films": 24,
            "rating": 6.2250000000000005,
            "views": 1310171578
          },
          {
            "actor": "Vanessa Hudgens",
            "actorID": "nm1227814",
            "films": 10,
            "rating": 5.67,
            "views": 1308043378
          },
          {
            "actor": "Andre Braugher",
            "actorID": "nm0105672",
            "films": 12,
            "rating": 6.525000000000001,
            "views": 1306756305
          },
          {
            "actor": "Mary-Louise Parker",
            "actorID": "nm0000571",
            "films": 18,
            "rating": 6.68888888888889,
            "views": 1305874106
          },
          {
            "actor": "Phil Reeves",
            "actorID": "nm0716277",
            "films": 15,
            "rating": 6.293333333333333,
            "views": 1303245374
          },
          {
            "actor": "RZA",
            "actorID": "nm0753526",
            "films": 15,
            "rating": 6.433333333333332,
            "views": 1302849648
          },
          {
            "actor": "Kiersten Warren",
            "actorID": "nm0912916",
            "films": 11,
            "rating": 6.345454545454545,
            "views": 1301674667
          },
          {
            "actor": "Hayden Panettiere",
            "actorID": "nm0659363",
            "films": 11,
            "rating": 6.218181818181819,
            "views": 1298009229
          },
          {
            "actor": "Yan-Kay Crystal Lowe",
            "actorID": "nm0522909",
            "films": 11,
            "rating": 5.845454545454545,
            "views": 1297915125
          },
          {
            "actor": "Bruce Davison",
            "actorID": "nm0001117",
            "films": 22,
            "rating": 6.590909090909093,
            "views": 1297911495
          },
          {
            "actor": "Courteney Cox",
            "actorID": "nm0001073",
            "films": 12,
            "rating": 6.025000000000001,
            "views": 1296731716
          },
          {
            "actor": "Eileen Atkins",
            "actorID": "nm0040586",
            "films": 15,
            "rating": 6.573333333333333,
            "views": 1296518325
          },
          {
            "actor": "Brooke Smith",
            "actorID": "nm0807548",
            "films": 14,
            "rating": 6.65,
            "views": 1296019484
          },
          {
            "actor": "David Rasche",
            "actorID": "nm0711058",
            "films": 20,
            "rating": 6,
            "views": 1293430574
          },
          {
            "actor": "Bree Turner",
            "actorID": "nm0877430",
            "films": 10,
            "rating": 5.83,
            "views": 1290895226
          },
          {
            "actor": "Norm MacDonald",
            "actorID": "nm0005172",
            "films": 12,
            "rating": 5.691666666666666,
            "views": 1290763554
          },
          {
            "actor": "Ralf Moeller",
            "actorID": "nm0005241",
            "films": 11,
            "rating": 5.672727272727273,
            "views": 1289748676
          },
          {
            "actor": "Eugenio Derbez",
            "actorID": "nm0220240",
            "films": 10,
            "rating": 5.6899999999999995,
            "views": 1289560691
          },
          {
            "actor": "Ed Begley Jr.",
            "actorID": "nm0000893",
            "films": 32,
            "rating": 6.259374999999999,
            "views": 1288724167
          },
          {
            "actor": "Diedrich Bader",
            "actorID": "nm0046033",
            "films": 13,
            "rating": 5.869230769230769,
            "views": 1286666692
          },
          {
            "actor": "Chris Messina",
            "actorID": "nm0582149",
            "films": 20,
            "rating": 6.62,
            "views": 1285491850
          },
          {
            "actor": "Rachel Ticotin",
            "actorID": "nm0001797",
            "films": 17,
            "rating": 6.511764705882353,
            "views": 1285220425
          },
          {
            "actor": "Danielle Harris",
            "actorID": "nm0364583",
            "films": 15,
            "rating": 6.126666666666667,
            "views": 1285110455
          },
          {
            "actor": "Robert Prosky",
            "actorID": "nm0698764",
            "films": 27,
            "rating": 6.255555555555555,
            "views": 1283069242
          },
          {
            "actor": "Claire Danes",
            "actorID": "nm0000132",
            "films": 15,
            "rating": 6.666666666666666,
            "views": 1282136327
          },
          {
            "actor": "Adrian Scarborough",
            "actorID": "nm0769083",
            "films": 12,
            "rating": 7.208333333333333,
            "views": 1281833162
          },
          {
            "actor": "Aaron Paul",
            "actorID": "nm0666739",
            "films": 12,
            "rating": 6.550000000000001,
            "views": 1279470571
          },
          {
            "actor": "Dennis Farina",
            "actorID": "nm0001199",
            "films": 20,
            "rating": 6.519999999999999,
            "views": 1277687405
          },
          {
            "actor": "Harold Perrineau",
            "actorID": "nm0674782",
            "films": 13,
            "rating": 6.6000000000000005,
            "views": 1277389012
          },
          {
            "actor": "Alice Braga",
            "actorID": "nm0103797",
            "films": 12,
            "rating": 6.616666666666666,
            "views": 1277292036
          },
          {
            "actor": "Mitch Pileggi",
            "actorID": "nm0683379",
            "films": 10,
            "rating": 5.92,
            "views": 1276255160
          },
          {
            "actor": "Chris Bauer",
            "actorID": "nm0061777",
            "films": 18,
            "rating": 6.75,
            "views": 1275097201
          },
          {
            "actor": "Holland Taylor",
            "actorID": "nm0852466",
            "films": 18,
            "rating": 6.2333333333333325,
            "views": 1273868135
          },
          {
            "actor": "Chris Noth",
            "actorID": "nm0636562",
            "films": 10,
            "rating": 6.039999999999999,
            "views": 1273557906
          },
          {
            "actor": "Nicholas Turturro",
            "actorID": "nm0878155",
            "films": 15,
            "rating": 6.133333333333332,
            "views": 1273016482
          },
          {
            "actor": "Rob Lowe",
            "actorID": "nm0000507",
            "films": 24,
            "rating": 6.2124999999999995,
            "views": 1272686892
          },
          {
            "actor": "J.C. MacKenzie",
            "actorID": "nm0533323",
            "films": 12,
            "rating": 6.949999999999999,
            "views": 1271275290
          },
          {
            "actor": "Teri Polo",
            "actorID": "nm0001632",
            "films": 10,
            "rating": 6.18,
            "views": 1268274165
          },
          {
            "actor": "Steve Harris",
            "actorID": "nm0004996",
            "films": 11,
            "rating": 5.918181818181818,
            "views": 1266970936
          },
          {
            "actor": "Josh Hartnett",
            "actorID": "nm0001326",
            "films": 15,
            "rating": 6.453333333333333,
            "views": 1266828773
          },
          {
            "actor": "Timothy Carhart",
            "actorID": "nm0137114",
            "films": 17,
            "rating": 6.405882352941177,
            "views": 1265731838
          },
          {
            "actor": "Lochlyn Munro",
            "actorID": "nm0613147",
            "films": 18,
            "rating": 5.861111111111112,
            "views": 1264082238
          },
          {
            "actor": "Don Johnson",
            "actorID": "nm0000467",
            "films": 15,
            "rating": 6.16,
            "views": 1261379331
          },
          {
            "actor": "Suzy Nakamura",
            "actorID": "nm0620232",
            "films": 11,
            "rating": 6.136363636363637,
            "views": 1261141888
          },
          {
            "actor": "Roger Cross",
            "actorID": "nm0003078",
            "films": 11,
            "rating": 5.636363636363636,
            "views": 1259387122
          },
          {
            "actor": "Julie Kavner",
            "actorID": "nm0001413",
            "films": 15,
            "rating": 6.573333333333334,
            "views": 1259295084
          },
          {
            "actor": "Loretta Devine",
            "actorID": "nm0222643",
            "films": 16,
            "rating": 5.9875,
            "views": 1256822611
          },
          {
            "actor": "Domenick Lombardozzi",
            "actorID": "nm0518511",
            "films": 17,
            "rating": 6.582352941176471,
            "views": 1255001429
          },
          {
            "actor": "Ally Sheedy",
            "actorID": "nm0000639",
            "films": 18,
            "rating": 6.177777777777778,
            "views": 1254252981
          },
          {
            "actor": "Lauren Holly",
            "actorID": "nm0000452",
            "films": 13,
            "rating": 6.561538461538462,
            "views": 1251696688
          },
          {
            "actor": "Saoirse Ronan",
            "actorID": "nm1519680",
            "films": 18,
            "rating": 6.938888888888888,
            "views": 1249206323
          },
          {
            "actor": "Niecy Nash",
            "actorID": "nm0621788",
            "films": 11,
            "rating": 6.127272727272728,
            "views": 1247696835
          },
          {
            "actor": "Rob Reiner",
            "actorID": "nm0001661",
            "films": 18,
            "rating": 6.5166666666666675,
            "views": 1246194483
          },
          {
            "actor": "Mako",
            "actorID": "nm0538683",
            "films": 18,
            "rating": 6.011111111111113,
            "views": 1246078816
          },
          {
            "actor": "Juliette Binoche",
            "actorID": "nm0000300",
            "films": 20,
            "rating": 6.910000000000001,
            "views": 1244011895
          },
          {
            "actor": "Romany Malco",
            "actorID": "nm0539082",
            "films": 12,
            "rating": 5.908333333333332,
            "views": 1243779661
          },
          {
            "actor": "Janeane Garofalo",
            "actorID": "nm0000413",
            "films": 28,
            "rating": 6.321428571428572,
            "views": 1242846328
          },
          {
            "actor": "Jean Smart",
            "actorID": "nm0005443",
            "films": 20,
            "rating": 6.33,
            "views": 1239214920
          },
          {
            "actor": "Joely Richardson",
            "actorID": "nm0000613",
            "films": 22,
            "rating": 6.454545454545456,
            "views": 1238767777
          },
          {
            "actor": "Radha Mitchell",
            "actorID": "nm0593664",
            "films": 15,
            "rating": 6.553333333333333,
            "views": 1237159537
          },
          {
            "actor": "Neal Huff",
            "actorID": "nm0400223",
            "films": 12,
            "rating": 7.0249999999999995,
            "views": 1237130804
          },
          {
            "actor": "Gianni Russo",
            "actorID": "nm0751625",
            "films": 14,
            "rating": 6.171428571428572,
            "views": 1236452380
          },
          {
            "actor": "Geena Davis",
            "actorID": "nm0000133",
            "films": 17,
            "rating": 6.647058823529412,
            "views": 1235752018
          },
          {
            "actor": "Parker Posey",
            "actorID": "nm0000205",
            "films": 27,
            "rating": 6.37037037037037,
            "views": 1234444998
          },
          {
            "actor": "Kevin McKidd",
            "actorID": "nm0571727",
            "films": 11,
            "rating": 6.6,
            "views": 1234419347
          },
          {
            "actor": "Alexandra Daddario",
            "actorID": "nm1275259",
            "films": 11,
            "rating": 5.918181818181818,
            "views": 1234200490
          },
          {
            "actor": "Ron Eldard",
            "actorID": "nm0253035",
            "films": 12,
            "rating": 6.741666666666667,
            "views": 1234086930
          },
          {
            "actor": "Margaret Colin",
            "actorID": "nm0171513",
            "films": 13,
            "rating": 5.876923076923077,
            "views": 1233978477
          },
          {
            "actor": "Arliss Howard",
            "actorID": "nm0397124",
            "films": 17,
            "rating": 6.847058823529412,
            "views": 1233036922
          },
          {
            "actor": "Mel Rodriguez",
            "actorID": "nm0735440",
            "films": 10,
            "rating": 6.34,
            "views": 1231470183
          },
          {
            "actor": "Kenneth Cranham",
            "actorID": "nm0186469",
            "films": 14,
            "rating": 6.764285714285714,
            "views": 1226452153
          },
          {
            "actor": "Brittany Murphy",
            "actorID": "nm0005261",
            "films": 14,
            "rating": 6.478571428571428,
            "views": 1226232925
          },
          {
            "actor": "Rick Ducommun",
            "actorID": "nm0239958",
            "films": 20,
            "rating": 6.125,
            "views": 1225607953
          },
          {
            "actor": "Alan Alda",
            "actorID": "nm0000257",
            "films": 20,
            "rating": 6.585000000000001,
            "views": 1223882687
          },
          {
            "actor": "Michelle Harrison",
            "actorID": "nm0365768",
            "films": 10,
            "rating": 5.609999999999999,
            "views": 1223547877
          },
          {
            "actor": "Lynn Collins",
            "actorID": "nm1211488",
            "films": 12,
            "rating": 6.599999999999999,
            "views": 1222666783
          },
          {
            "actor": "Zoey Deutch",
            "actorID": "nm3614913",
            "films": 10,
            "rating": 6.410000000000001,
            "views": 1219830783
          },
          {
            "actor": "Tcheky Karyo",
            "actorID": "nm0001409",
            "films": 19,
            "rating": 6.563157894736843,
            "views": 1219533444
          },
          {
            "actor": "D.B. Sweeney",
            "actorID": "nm0000665",
            "films": 15,
            "rating": 6.366666666666666,
            "views": 1218840925
          },
          {
            "actor": "Lily Tomlin",
            "actorID": "nm0005499",
            "films": 20,
            "rating": 6.540000000000001,
            "views": 1218532314
          },
          {
            "actor": "Candice Bergen",
            "actorID": "nm0000298",
            "films": 12,
            "rating": 5.925,
            "views": 1218383856
          },
          {
            "actor": "Kathleen Freeman",
            "actorID": "nm0293466",
            "films": 21,
            "rating": 5.961904761904762,
            "views": 1218096223
          },
          {
            "actor": "Tiffany Haddish",
            "actorID": "nm1840504",
            "films": 10,
            "rating": 5.659999999999999,
            "views": 1216706790
          },
          {
            "actor": "Jack Huston",
            "actorID": "nm1658935",
            "films": 12,
            "rating": 6.400000000000001,
            "views": 1213759783
          },
          {
            "actor": "Tom Bower",
            "actorID": "nm0101005",
            "films": 28,
            "rating": 6.389285714285712,
            "views": 1212338734
          },
          {
            "actor": "Ian McNeice",
            "actorID": "nm0573862",
            "films": 20,
            "rating": 6.4399999999999995,
            "views": 1211587794
          },
          {
            "actor": "Fred Savage",
            "actorID": "nm0000625",
            "films": 10,
            "rating": 6.45,
            "views": 1208300400
          },
          {
            "actor": "Roger Corman",
            "actorID": "nm0000339",
            "films": 10,
            "rating": 6.8,
            "views": 1202692092
          },
          {
            "actor": "Ann Dowd",
            "actorID": "nm0235652",
            "films": 24,
            "rating": 6.6625000000000005,
            "views": 1202574536
          },
          {
            "actor": "Bryan Brown",
            "actorID": "nm0000986",
            "films": 13,
            "rating": 6.115384615384615,
            "views": 1201199034
          },
          {
            "actor": "Vyto Ruginis",
            "actorID": "nm0749490",
            "films": 16,
            "rating": 6.362500000000001,
            "views": 1199481320
          },
          {
            "actor": "Tim Meadows",
            "actorID": "nm0005218",
            "films": 12,
            "rating": 5.658333333333334,
            "views": 1198781601
          },
          {
            "actor": "Dev Patel",
            "actorID": "nm2353862",
            "films": 10,
            "rating": 6.789999999999999,
            "views": 1198727337
          },
          {
            "actor": "Sienna Miller",
            "actorID": "nm1092227",
            "films": 17,
            "rating": 6.488235294117647,
            "views": 1197981803
          },
          {
            "actor": "Rachel Nichols",
            "actorID": "nm0629697",
            "films": 10,
            "rating": 5.819999999999999,
            "views": 1195404268
          },
          {
            "actor": "David Alan Grier",
            "actorID": "nm0004979",
            "films": 22,
            "rating": 6.036363636363637,
            "views": 1194100383
          },
          {
            "actor": "Elizabeth McGovern",
            "actorID": "nm0001527",
            "films": 23,
            "rating": 6.673913043478261,
            "views": 1193071159
          },
          {
            "actor": "Ed Lauter",
            "actorID": "nm0491590",
            "films": 29,
            "rating": 6.403448275862069,
            "views": 1191824139
          },
          {
            "actor": "Joey Diaz",
            "actorID": "nm0224995",
            "films": 10,
            "rating": 5.7299999999999995,
            "views": 1189000319
          },
          {
            "actor": "Gabriel Byrne",
            "actorID": "nm0000321",
            "films": 32,
            "rating": 6.396875,
            "views": 1188441247
          },
          {
            "actor": "Ian Tracey",
            "actorID": "nm0870439",
            "films": 14,
            "rating": 6.228571428571429,
            "views": 1186751055
          },
          {
            "actor": "Elizabeth Pena",
            "actorID": "nm0001615",
            "films": 18,
            "rating": 6.58888888888889,
            "views": 1184574299
          },
          {
            "actor": "Alicia Vikander",
            "actorID": "nm2539953",
            "films": 14,
            "rating": 6.750000000000001,
            "views": 1183489124
          },
          {
            "actor": "Joy Bryant",
            "actorID": "nm0117146",
            "films": 11,
            "rating": 6.3,
            "views": 1181891045
          },
          {
            "actor": "Amber Valletta",
            "actorID": "nm0005520",
            "films": 11,
            "rating": 6.090909090909091,
            "views": 1178192169
          },
          {
            "actor": "Doug Hutchison",
            "actorID": "nm0006535",
            "films": 13,
            "rating": 6.292307692307692,
            "views": 1173951697
          },
          {
            "actor": "Chris Elliott",
            "actorID": "nm0254402",
            "films": 14,
            "rating": 6.4071428571428575,
            "views": 1173868540
          },
          {
            "actor": "Barry Livingston",
            "actorID": "nm0515225",
            "films": 11,
            "rating": 6.436363636363637,
            "views": 1173180704
          },
          {
            "actor": "Charlie Murphy",
            "actorID": "nm0614151",
            "films": 12,
            "rating": 6.233333333333333,
            "views": 1171640609
          },
          {
            "actor": "Noah Emmerich",
            "actorID": "nm0001187",
            "films": 19,
            "rating": 6.894736842105263,
            "views": 1170897663
          },
          {
            "actor": "Martin Scorsese",
            "actorID": "nm0000217",
            "films": 16,
            "rating": 7.231250000000001,
            "views": 1170497047
          },
          {
            "actor": "Rick Hoffman",
            "actorID": "nm0389069",
            "films": 10,
            "rating": 6.040000000000001,
            "views": 1169634530
          },
          {
            "actor": "Michael Dorn",
            "actorID": "nm0000373",
            "films": 11,
            "rating": 6.418181818181818,
            "views": 1169161922
          },
          {
            "actor": "Chris Owen",
            "actorID": "nm0654104",
            "films": 13,
            "rating": 6.415384615384615,
            "views": 1167248313
          },
          {
            "actor": "Jon Abrahams",
            "actorID": "nm0009016",
            "films": 16,
            "rating": 6.3187500000000005,
            "views": 1166968214
          },
          {
            "actor": "Obba Babatunde",
            "actorID": "nm0044762",
            "films": 18,
            "rating": 6.433333333333334,
            "views": 1166628252
          },
          {
            "actor": "Lainie Kazan",
            "actorID": "nm0443577",
            "films": 18,
            "rating": 5.888888888888889,
            "views": 1164825959
          },
          {
            "actor": "Faizon Love",
            "actorID": "nm0522324",
            "films": 22,
            "rating": 5.718181818181819,
            "views": 1164015787
          },
          {
            "actor": "Piper Perabo",
            "actorID": "nm0005305",
            "films": 13,
            "rating": 5.992307692307692,
            "views": 1163501515
          },
          {
            "actor": "Tim McInnerny",
            "actorID": "nm0570570",
            "films": 13,
            "rating": 6.523076923076924,
            "views": 1163122298
          },
          {
            "actor": "Leon Rippy",
            "actorID": "nm0728132",
            "films": 25,
            "rating": 6.1560000000000015,
            "views": 1162728092
          },
          {
            "actor": "David Hyde Pierce",
            "actorID": "nm0001383",
            "films": 19,
            "rating": 6.515789473684211,
            "views": 1162719137
          },
          {
            "actor": "Jeremy Davies",
            "actorID": "nm0001111",
            "films": 16,
            "rating": 6.73125,
            "views": 1160722675
          },
          {
            "actor": "Thomas Jane",
            "actorID": "nm0005048",
            "films": 21,
            "rating": 6.2666666666666675,
            "views": 1159507418
          },
          {
            "actor": "Tina Fey",
            "actorID": "nm0275486",
            "films": 10,
            "rating": 6.62,
            "views": 1157616435
          },
          {
            "actor": "Aubrey Plaza",
            "actorID": "nm2201555",
            "films": 13,
            "rating": 6.446153846153846,
            "views": 1155457323
          },
          {
            "actor": "Fionnula Flanagan",
            "actorID": "nm0001217",
            "films": 14,
            "rating": 6.878571428571428,
            "views": 1155402287
          },
          {
            "actor": "Ben Foster",
            "actorID": "nm0004936",
            "films": 23,
            "rating": 6.743478260869565,
            "views": 1150527212
          },
          {
            "actor": "Marley Shelton",
            "actorID": "nm0005420",
            "films": 20,
            "rating": 6.26,
            "views": 1147869935
          },
          {
            "actor": "Chevy Chase",
            "actorID": "nm0000331",
            "films": 31,
            "rating": 5.958064516129033,
            "views": 1147053153
          },
          {
            "actor": "John Mahoney",
            "actorID": "nm0001498",
            "films": 24,
            "rating": 6.795833333333332,
            "views": 1146861533
          },
          {
            "actor": "Sydney Pollack",
            "actorID": "nm0001628",
            "films": 12,
            "rating": 6.758333333333334,
            "views": 1146643472
          },
          {
            "actor": "Andie MacDowell",
            "actorID": "nm0000510",
            "films": 23,
            "rating": 6.365217391304348,
            "views": 1146345613
          },
          {
            "actor": "Ellen Albertini Dow",
            "actorID": "nm0016687",
            "films": 14,
            "rating": 6.0928571428571425,
            "views": 1145850132
          },
          {
            "actor": "Raymond J. Barry",
            "actorID": "nm0000855",
            "films": 23,
            "rating": 6.326086956521739,
            "views": 1139857984
          },
          {
            "actor": "Casey Siemaszko",
            "actorID": "nm0797150",
            "films": 14,
            "rating": 6.799999999999999,
            "views": 1138819575
          },
          {
            "actor": "Patrick Swayze",
            "actorID": "nm0000664",
            "films": 21,
            "rating": 6.385714285714285,
            "views": 1136998422
          },
          {
            "actor": "Macaulay Culkin",
            "actorID": "nm0000346",
            "films": 14,
            "rating": 6.485714285714286,
            "views": 1136953272
          },
          {
            "actor": "Jason Alexander",
            "actorID": "nm0004517",
            "films": 15,
            "rating": 6.046666666666666,
            "views": 1136710263
          },
          {
            "actor": "William Forsythe",
            "actorID": "nm0001235",
            "films": 29,
            "rating": 6.006896551724139,
            "views": 1134376321
          },
          {
            "actor": "Treat Williams",
            "actorID": "nm0001852",
            "films": 22,
            "rating": 6.422727272727273,
            "views": 1132440476
          },
          {
            "actor": "Eric Christian Olsen",
            "actorID": "nm0647638",
            "films": 16,
            "rating": 5.875,
            "views": 1132404408
          },
          {
            "actor": "Mekhi Phifer",
            "actorID": "nm0001616",
            "films": 14,
            "rating": 6.1642857142857155,
            "views": 1132300695
          },
          {
            "actor": "Michael Nyqvist",
            "actorID": "nm0638824",
            "films": 10,
            "rating": 7.019999999999999,
            "views": 1132284338
          },
          {
            "actor": "Michael McDonald",
            "actorID": "nm0567912",
            "films": 10,
            "rating": 5.98,
            "views": 1131519038
          },
          {
            "actor": "Emma Roberts",
            "actorID": "nm0731075",
            "films": 17,
            "rating": 6.088235294117648,
            "views": 1130985514
          },
          {
            "actor": "Eddie Kaye Thomas",
            "actorID": "nm0858776",
            "films": 12,
            "rating": 5.900000000000001,
            "views": 1129723604
          },
          {
            "actor": "Teri Hatcher",
            "actorID": "nm0000159",
            "films": 11,
            "rating": 6.245454545454544,
            "views": 1129126163
          },
          {
            "actor": "Cynthia Nixon",
            "actorID": "nm0633223",
            "films": 17,
            "rating": 6.405882352941177,
            "views": 1126061273
          },
          {
            "actor": "Alessandro Nivola",
            "actorID": "nm0005273",
            "films": 20,
            "rating": 6.5550000000000015,
            "views": 1124540938
          },
          {
            "actor": "Kate Bosworth",
            "actorID": "nm0098378",
            "films": 15,
            "rating": 6.239999999999999,
            "views": 1123435369
          },
          {
            "actor": "George Takei",
            "actorID": "nm0001786",
            "films": 10,
            "rating": 6.8,
            "views": 1123397752
          },
          {
            "actor": "Jake Weber",
            "actorID": "nm0916617",
            "films": 12,
            "rating": 6.666666666666667,
            "views": 1122163556
          },
          {
            "actor": "Art Malik",
            "actorID": "nm0539562",
            "films": 11,
            "rating": 6.354545454545455,
            "views": 1121649247
          },
          {
            "actor": "Barbara Hershey",
            "actorID": "nm0001347",
            "films": 26,
            "rating": 6.6038461538461535,
            "views": 1120678866
          },
          {
            "actor": "Emilio Estevez",
            "actorID": "nm0000389",
            "films": 24,
            "rating": 6.391666666666668,
            "views": 1120262192
          },
          {
            "actor": "Paul Reiser",
            "actorID": "nm0001663",
            "films": 16,
            "rating": 6.4312499999999995,
            "views": 1119650504
          },
          {
            "actor": "Aaron Douglas",
            "actorID": "nm0234928",
            "films": 10,
            "rating": 6.04,
            "views": 1118723975
          },
          {
            "actor": "Teri Wyble",
            "actorID": "nm3582715",
            "films": 10,
            "rating": 6.08,
            "views": 1115301187
          },
          {
            "actor": "Fran Kranz",
            "actorID": "nm0469823",
            "films": 11,
            "rating": 6.672727272727273,
            "views": 1112926052
          },
          {
            "actor": "Rooney Mara",
            "actorID": "nm1913734",
            "films": 16,
            "rating": 6.781250000000001,
            "views": 1111332563
          },
          {
            "actor": "Edward Herrmann",
            "actorID": "nm0001346",
            "films": 22,
            "rating": 6.327272727272728,
            "views": 1110009740
          },
          {
            "actor": "Chi McBride",
            "actorID": "nm0564277",
            "films": 18,
            "rating": 6.427777777777776,
            "views": 1107785466
          },
          {
            "actor": "James Frain",
            "actorID": "nm0289656",
            "films": 13,
            "rating": 6.807692307692308,
            "views": 1107080368
          },
          {
            "actor": "Edward Burns",
            "actorID": "nm0122653",
            "films": 12,
            "rating": 6.066666666666666,
            "views": 1106835513
          },
          {
            "actor": "Kevin Chapman",
            "actorID": "nm0152430",
            "films": 16,
            "rating": 6.725,
            "views": 1105354402
          },
          {
            "actor": "Mike O'Malley",
            "actorID": "nm0005282",
            "films": 10,
            "rating": 6.070000000000001,
            "views": 1104840956
          },
          {
            "actor": "Anne Haney",
            "actorID": "nm0359774",
            "films": 14,
            "rating": 5.985714285714286,
            "views": 1104453361
          },
          {
            "actor": "Brian Posehn",
            "actorID": "nm0692634",
            "films": 14,
            "rating": 6.035714285714286,
            "views": 1104197653
          },
          {
            "actor": "Tika Sumpter",
            "actorID": "nm1754366",
            "films": 10,
            "rating": 6.15,
            "views": 1103840108
          },
          {
            "actor": "Riki Lindhome",
            "actorID": "nm1641251",
            "films": 10,
            "rating": 6.589999999999999,
            "views": 1103226959
          },
          {
            "actor": "Miko Hughes",
            "actorID": "nm0400816",
            "films": 12,
            "rating": 5.875,
            "views": 1102819519
          },
          {
            "actor": "Anthony Edwards",
            "actorID": "nm0000381",
            "films": 18,
            "rating": 6.333333333333334,
            "views": 1102590973
          },
          {
            "actor": "Meagan Good",
            "actorID": "nm0328709",
            "films": 18,
            "rating": 5.655555555555555,
            "views": 1100470672
          },
          {
            "actor": "Ann Cusack",
            "actorID": "nm0193639",
            "films": 16,
            "rating": 6.525,
            "views": 1099571267
          },
          {
            "actor": "Andrew Wilson",
            "actorID": "nm0932992",
            "films": 17,
            "rating": 6.1,
            "views": 1099067143
          },
          {
            "actor": "Carey Mulligan",
            "actorID": "nm1659547",
            "films": 13,
            "rating": 7.153846153846154,
            "views": 1098395730
          },
          {
            "actor": "Sissy Spacek",
            "actorID": "nm0000651",
            "films": 25,
            "rating": 6.76,
            "views": 1097048151
          },
          {
            "actor": "Denise Richards",
            "actorID": "nm0000612",
            "films": 11,
            "rating": 6.263636363636365,
            "views": 1096360779
          },
          {
            "actor": "Brian George",
            "actorID": "nm0313364",
            "films": 16,
            "rating": 5.9,
            "views": 1093778280
          },
          {
            "actor": "Daryl Hannah",
            "actorID": "nm0000435",
            "films": 25,
            "rating": 6.568,
            "views": 1093381558
          },
          {
            "actor": "Bruno Kirby",
            "actorID": "nm0456124",
            "films": 15,
            "rating": 6.986666666666666,
            "views": 1091694741
          },
          {
            "actor": "James Le Gros",
            "actorID": "nm0001457",
            "films": 29,
            "rating": 6.420689655172414,
            "views": 1091118191
          },
          {
            "actor": "Joseph Sikora",
            "actorID": "nm0797746",
            "films": 10,
            "rating": 6.76,
            "views": 1089591575
          },
          {
            "actor": "Halston Sage",
            "actorID": "nm4296013",
            "films": 10,
            "rating": 6.159999999999999,
            "views": 1088901784
          },
          {
            "actor": "Jim Gaffigan",
            "actorID": "nm0300712",
            "films": 13,
            "rating": 6.223076923076921,
            "views": 1087596709
          },
          {
            "actor": "Lara Flynn Boyle",
            "actorID": "nm0001223",
            "films": 14,
            "rating": 6.457142857142857,
            "views": 1085293510
          },
          {
            "actor": "Rosie Perez",
            "actorID": "nm0001609",
            "films": 14,
            "rating": 6.721428571428571,
            "views": 1084069392
          },
          {
            "actor": "Breckin Meyer",
            "actorID": "nm0005227",
            "films": 18,
            "rating": 5.988888888888889,
            "views": 1081120254
          },
          {
            "actor": "Roger Bart",
            "actorID": "nm0058372",
            "films": 11,
            "rating": 6.736363636363635,
            "views": 1080744530
          },
          {
            "actor": "Madonna",
            "actorID": "nm0000187",
            "films": 18,
            "rating": 5.6499999999999995,
            "views": 1079994778
          },
          {
            "actor": "Patrick Breen",
            "actorID": "nm0106755",
            "films": 12,
            "rating": 6.366666666666667,
            "views": 1079916322
          },
          {
            "actor": "Pamela Adlon",
            "actorID": "nm0781899",
            "films": 15,
            "rating": 5.98,
            "views": 1079508862
          },
          {
            "actor": "Michael Bacall",
            "actorID": "nm0045209",
            "films": 11,
            "rating": 6.7,
            "views": 1078616021
          },
          {
            "actor": "Miguel A. Nunez Jr.",
            "actorID": "nm0639200",
            "films": 19,
            "rating": 5.605263157894736,
            "views": 1077754670
          },
          {
            "actor": "Miles Teller",
            "actorID": "nm1886602",
            "films": 14,
            "rating": 6.528571428571428,
            "views": 1077233486
          },
          {
            "actor": "Lizzy Caplan",
            "actorID": "nm0135221",
            "films": 13,
            "rating": 6.607692307692308,
            "views": 1077211137
          },
          {
            "actor": "Nick Cassavetes",
            "actorID": "nm0001024",
            "films": 10,
            "rating": 6.489999999999999,
            "views": 1072001034
          },
          {
            "actor": "Rick Gonzalez",
            "actorID": "nm0327779",
            "films": 13,
            "rating": 6.184615384615385,
            "views": 1071693913
          },
          {
            "actor": "Michael Parks",
            "actorID": "nm0662981",
            "films": 12,
            "rating": 7.033333333333334,
            "views": 1070519692
          },
          {
            "actor": "Donald Gibb",
            "actorID": "nm0316455",
            "films": 14,
            "rating": 6.007142857142858,
            "views": 1068551569
          },
          {
            "actor": "Michael Cera",
            "actorID": "nm0148418",
            "films": 13,
            "rating": 6.699999999999999,
            "views": 1068511552
          },
          {
            "actor": "LL Cool J",
            "actorID": "nm0005112",
            "films": 14,
            "rating": 5.799999999999999,
            "views": 1063622288
          },
          {
            "actor": "Shirley MacLaine",
            "actorID": "nm0000511",
            "films": 16,
            "rating": 6.125,
            "views": 1062882095
          },
          {
            "actor": "Jerry O'Connell",
            "actorID": "nm0005278",
            "films": 17,
            "rating": 5.723529411764705,
            "views": 1062406455
          },
          {
            "actor": "Jeremy Strong",
            "actorID": "nm0834989",
            "films": 13,
            "rating": 6.923076923076922,
            "views": 1060849567
          },
          {
            "actor": "Jennifer Morrison",
            "actorID": "nm0607185",
            "films": 11,
            "rating": 6.154545454545455,
            "views": 1060603096
          },
          {
            "actor": "John Spencer",
            "actorID": "nm0817983",
            "films": 13,
            "rating": 6.6923076923076925,
            "views": 1058619595
          },
          {
            "actor": "Rebecca De Mornay",
            "actorID": "nm0000360",
            "films": 19,
            "rating": 6.38421052631579,
            "views": 1058183367
          },
          {
            "actor": "LaKeith Stanfield",
            "actorID": "nm3147751",
            "films": 10,
            "rating": 7.279999999999999,
            "views": 1057804606
          },
          {
            "actor": "Abbie Cornish",
            "actorID": "nm0180411",
            "films": 14,
            "rating": 6.607142857142857,
            "views": 1057626463
          },
          {
            "actor": "Max Casella",
            "actorID": "nm0143295",
            "films": 18,
            "rating": 6.449999999999999,
            "views": 1057201313
          },
          {
            "actor": "Penelope Wilton",
            "actorID": "nm0934362",
            "films": 14,
            "rating": 7.05,
            "views": 1056803381
          },
          {
            "actor": "Peter MacNicol",
            "actorID": "nm0001493",
            "films": 12,
            "rating": 6.091666666666668,
            "views": 1053392393
          },
          {
            "actor": "Robert Costanzo",
            "actorID": "nm0182456",
            "films": 16,
            "rating": 6.00625,
            "views": 1052291828
          },
          {
            "actor": "Jeffrey DeMunn",
            "actorID": "nm0218810",
            "films": 20,
            "rating": 6.815,
            "views": 1052204285
          },
          {
            "actor": "Tom Guiry",
            "actorID": "nm0347509",
            "films": 10,
            "rating": 7.05,
            "views": 1051586905
          },
          {
            "actor": "Joanna Lumley",
            "actorID": "nm0525921",
            "films": 11,
            "rating": 6.627272727272728,
            "views": 1050964230
          },
          {
            "actor": "Cher",
            "actorID": "nm0000333",
            "films": 13,
            "rating": 6.530769230769232,
            "views": 1050640367
          },
          {
            "actor": "Saffron Burrows",
            "actorID": "nm0004787",
            "films": 14,
            "rating": 6.549999999999999,
            "views": 1050110388
          },
          {
            "actor": "Sarah Gadon",
            "actorID": "nm0300589",
            "films": 12,
            "rating": 6.466666666666666,
            "views": 1045579321
          },
          {
            "actor": "Tia Carrere",
            "actorID": "nm0000119",
            "films": 10,
            "rating": 6.09,
            "views": 1044660364
          },
          {
            "actor": "Anne Heche",
            "actorID": "nm0000162",
            "films": 18,
            "rating": 6.211111111111111,
            "views": 1043403850
          },
          {
            "actor": "Andy Dick",
            "actorID": "nm0004873",
            "films": 18,
            "rating": 5.627777777777777,
            "views": 1042163631
          },
          {
            "actor": "Lauren Tom",
            "actorID": "nm0866300",
            "films": 14,
            "rating": 6.221428571428572,
            "views": 1041897258
          },
          {
            "actor": "Gina Gershon",
            "actorID": "nm0000153",
            "films": 23,
            "rating": 6.1521739130434785,
            "views": 1041667211
          },
          {
            "actor": "Tara Reid",
            "actorID": "nm0005346",
            "films": 12,
            "rating": 5.708333333333333,
            "views": 1039173735
          },
          {
            "actor": "Paul Sorvino",
            "actorID": "nm0000649",
            "films": 20,
            "rating": 6.414999999999999,
            "views": 1038931486
          },
          {
            "actor": "Harold Gould",
            "actorID": "nm0332390",
            "films": 10,
            "rating": 5.8100000000000005,
            "views": 1035989673
          },
          {
            "actor": "Kevin Connolly",
            "actorID": "nm0175305",
            "films": 10,
            "rating": 6.58,
            "views": 1035734873
          },
          {
            "actor": "Rutger Hauer",
            "actorID": "nm0000442",
            "films": 21,
            "rating": 6.6571428571428575,
            "views": 1035265727
          },
          {
            "actor": "Brent Sexton",
            "actorID": "nm0786641",
            "films": 10,
            "rating": 6.4,
            "views": 1031971202
          },
          {
            "actor": "Clarke Peters",
            "actorID": "nm0676370",
            "films": 10,
            "rating": 6.859999999999999,
            "views": 1031339592
          },
          {
            "actor": "Paul Newman",
            "actorID": "nm0000056",
            "films": 14,
            "rating": 6.700000000000001,
            "views": 1029598034
          },
          {
            "actor": "John Glover",
            "actorID": "nm0001278",
            "films": 17,
            "rating": 6.211764705882353,
            "views": 1026263979
          },
          {
            "actor": "Leelee Sobieski",
            "actorID": "nm0005447",
            "films": 11,
            "rating": 5.718181818181819,
            "views": 1025937091
          },
          {
            "actor": "Mandy Patinkin",
            "actorID": "nm0001597",
            "films": 21,
            "rating": 6.49047619047619,
            "views": 1025103060
          },
          {
            "actor": "Dee Wallace",
            "actorID": "nm0908914",
            "films": 13,
            "rating": 6.438461538461538,
            "views": 1024947410
          },
          {
            "actor": "Matthew Goode",
            "actorID": "nm0328828",
            "films": 15,
            "rating": 7.079999999999998,
            "views": 1023960560
          },
          {
            "actor": "David Zayas",
            "actorID": "nm0953882",
            "films": 12,
            "rating": 6.4750000000000005,
            "views": 1019249003
          },
          {
            "actor": "Nia Long",
            "actorID": "nm0000505",
            "films": 17,
            "rating": 6.235294117647059,
            "views": 1016995314
          },
          {
            "actor": "Kym Whitley",
            "actorID": "nm0005552",
            "films": 11,
            "rating": 6.3,
            "views": 1016502173
          },
          {
            "actor": "Michael Ealy",
            "actorID": "nm1013003",
            "films": 11,
            "rating": 6.245454545454544,
            "views": 1014825407
          },
          {
            "actor": "Neve Campbell",
            "actorID": "nm0000117",
            "films": 11,
            "rating": 6.163636363636363,
            "views": 1013983509
          },
          {
            "actor": "Ken Howard",
            "actorID": "nm0397432",
            "films": 11,
            "rating": 6.636363636363637,
            "views": 1012650995
          },
          {
            "actor": "Hilary Swank",
            "actorID": "nm0005476",
            "films": 16,
            "rating": 6.4750000000000005,
            "views": 1011284646
          },
          {
            "actor": "Jeanne Tripplehorn",
            "actorID": "nm0000675",
            "films": 10,
            "rating": 6.14,
            "views": 1010816006
          },
          {
            "actor": "Roma Maffia",
            "actorID": "nm0005173",
            "films": 10,
            "rating": 6.57,
            "views": 1010563869
          },
          {
            "actor": "Jason Watkins",
            "actorID": "nm0914327",
            "films": 10,
            "rating": 6.42,
            "views": 1009830145
          },
          {
            "actor": "Alexa PenaVega",
            "actorID": "nm0891786",
            "films": 11,
            "rating": 5.918181818181819,
            "views": 1009569130
          },
          {
            "actor": "Joseph D. Reitman",
            "actorID": "nm0718647",
            "films": 12,
            "rating": 6.166666666666665,
            "views": 1005712141
          },
          {
            "actor": "Michael Rispoli",
            "actorID": "nm0728346",
            "films": 19,
            "rating": 6.389473684210526,
            "views": 1005610214
          },
          {
            "actor": "Ulrich Thomsen",
            "actorID": "nm0860947",
            "films": 13,
            "rating": 6.523076923076924,
            "views": 1001777342
          },
          {
            "actor": "Jason Mitchell",
            "actorID": "nm4207146",
            "films": 10,
            "rating": 6.58,
            "views": 1001572083
          },
          {
            "actor": "Chris Klein",
            "actorID": "nm0005098",
            "films": 11,
            "rating": 5.881818181818182,
            "views": 1001481735
          },
          {
            "actor": "Mary Elizabeth Mastrantonio",
            "actorID": "nm0001512",
            "films": 12,
            "rating": 6.583333333333333,
            "views": 1000854047
          },
          {
            "actor": "Greg Germann",
            "actorID": "nm0314524",
            "films": 15,
            "rating": 6.260000000000001,
            "views": 1000806144
          },
          {
            "actor": "Gregory Itzin",
            "actorID": "nm0411857",
            "films": 16,
            "rating": 6.5562499999999995,
            "views": 997921621
          },
          {
            "actor": "Robert John Burke",
            "actorID": "nm0121559",
            "films": 20,
            "rating": 6.555,
            "views": 997914602
          },
          {
            "actor": "Anne Archer",
            "actorID": "nm0000271",
            "films": 13,
            "rating": 6.223076923076923,
            "views": 997914529
          },
          {
            "actor": "Vincent Pastore",
            "actorID": "nm0665114",
            "films": 25,
            "rating": 6.472,
            "views": 996794641
          },
          {
            "actor": "Daniel Roebuck",
            "actorID": "nm0736263",
            "films": 19,
            "rating": 6.1157894736842096,
            "views": 995741693
          },
          {
            "actor": "Susan Blommaert",
            "actorID": "nm0088964",
            "films": 17,
            "rating": 6.682352941176471,
            "views": 993755400
          },
          {
            "actor": "Marin Ireland",
            "actorID": "nm1677477",
            "films": 10,
            "rating": 6.9,
            "views": 992584811
          },
          {
            "actor": "Thomas Mann",
            "actorID": "nm3287038",
            "films": 10,
            "rating": 6.2700000000000005,
            "views": 992087978
          },
          {
            "actor": "Milo Ventimiglia",
            "actorID": "nm0893257",
            "films": 13,
            "rating": 5.976923076923077,
            "views": 991944225
          },
          {
            "actor": "Eric Balfour",
            "actorID": "nm0050156",
            "films": 12,
            "rating": 5.841666666666668,
            "views": 991685395
          },
          {
            "actor": "David Arquette",
            "actorID": "nm0000274",
            "films": 20,
            "rating": 6.095,
            "views": 990971181
          },
          {
            "actor": "Jason Robards",
            "actorID": "nm0001673",
            "films": 20,
            "rating": 6.465000000000001,
            "views": 990534243
          },
          {
            "actor": "Rob Brydon",
            "actorID": "nm0117339",
            "films": 11,
            "rating": 6.636363636363635,
            "views": 989599213
          },
          {
            "actor": "Kyle Gallner",
            "actorID": "nm0973177",
            "films": 11,
            "rating": 6.218181818181819,
            "views": 987479961
          },
          {
            "actor": "Martin Landau",
            "actorID": "nm0001445",
            "films": 21,
            "rating": 6.4,
            "views": 980993053
          },
          {
            "actor": "Bill Duke",
            "actorID": "nm0004886",
            "films": 17,
            "rating": 6.31764705882353,
            "views": 980297165
          },
          {
            "actor": "Emile Hirsch",
            "actorID": "nm0386472",
            "films": 12,
            "rating": 6.866666666666667,
            "views": 979269744
          },
          {
            "actor": "Dina Meyer",
            "actorID": "nm0000539",
            "films": 11,
            "rating": 6.0636363636363635,
            "views": 978757262
          },
          {
            "actor": "Barry Corbin",
            "actorID": "nm0179224",
            "films": 25,
            "rating": 6.128000000000001,
            "views": 977391424
          },
          {
            "actor": "Jonathan Rhys Meyers",
            "actorID": "nm0001667",
            "films": 13,
            "rating": 6.623076923076924,
            "views": 977076842
          },
          {
            "actor": "Mary Lynn Rajskub",
            "actorID": "nm0707476",
            "films": 17,
            "rating": 6.758823529411764,
            "views": 975728031
          },
          {
            "actor": "Stacy Keach",
            "actorID": "nm0005078",
            "films": 15,
            "rating": 6.540000000000001,
            "views": 974915275
          },
          {
            "actor": "Kelli Garner",
            "actorID": "nm0307726",
            "films": 10,
            "rating": 6.410000000000001,
            "views": 974807729
          },
          {
            "actor": "David Denman",
            "actorID": "nm0219292",
            "films": 17,
            "rating": 6.305882352941175,
            "views": 970530100
          },
          {
            "actor": "Sam Anderson",
            "actorID": "nm0027402",
            "films": 11,
            "rating": 6.181818181818182,
            "views": 970366287
          },
          {
            "actor": "Paul Bates",
            "actorID": "nm0061003",
            "films": 17,
            "rating": 6.147058823529411,
            "views": 970135727
          },
          {
            "actor": "Goldie Hawn",
            "actorID": "nm0000443",
            "films": 17,
            "rating": 6.011764705882353,
            "views": 969617755
          },
          {
            "actor": "Theresa Russell",
            "actorID": "nm0000622",
            "films": 13,
            "rating": 6.092307692307693,
            "views": 969489985
          },
          {
            "actor": "Julia Louis-Dreyfus",
            "actorID": "nm0000506",
            "films": 12,
            "rating": 6.358333333333333,
            "views": 968320340
          },
          {
            "actor": "James Ransone",
            "actorID": "nm0710447",
            "films": 13,
            "rating": 6.238461538461538,
            "views": 966692073
          },
          {
            "actor": "Christine Ebersole",
            "actorID": "nm0002056",
            "films": 14,
            "rating": 6.064285714285714,
            "views": 965891438
          },
          {
            "actor": "Thora Birch",
            "actorID": "nm0000301",
            "films": 13,
            "rating": 6.46923076923077,
            "views": 965517748
          },
          {
            "actor": "Jane Adams",
            "actorID": "nm0011038",
            "films": 19,
            "rating": 6.578947368421052,
            "views": 965404149
          },
          {
            "actor": "Michael Imperioli",
            "actorID": "nm0408284",
            "films": 18,
            "rating": 6.794444444444446,
            "views": 965040792
          },
          {
            "actor": "James Brolin",
            "actorID": "nm0000981",
            "films": 12,
            "rating": 6.449999999999999,
            "views": 962828206
          },
          {
            "actor": "John Kapelos",
            "actorID": "nm0438127",
            "films": 23,
            "rating": 6.278260869565218,
            "views": 958903755
          },
          {
            "actor": "Gary Busey",
            "actorID": "nm0000997",
            "films": 21,
            "rating": 6.304761904761904,
            "views": 956175852
          },
          {
            "actor": "Daniel Day-Lewis",
            "actorID": "nm0000358",
            "films": 17,
            "rating": 7.300000000000001,
            "views": 954990319
          },
          {
            "actor": "Jason Schwartzman",
            "actorID": "nm0005403",
            "films": 17,
            "rating": 6.823529411764705,
            "views": 952517185
          },
          {
            "actor": "Joanna Gleason",
            "actorID": "nm0322306",
            "films": 10,
            "rating": 6.549999999999999,
            "views": 952017281
          },
          {
            "actor": "Sanaa Lathan",
            "actorID": "nm0005125",
            "films": 11,
            "rating": 6.645454545454545,
            "views": 951585300
          },
          {
            "actor": "Burt Young",
            "actorID": "nm0949350",
            "films": 18,
            "rating": 6.266666666666667,
            "views": 950952759
          },
          {
            "actor": "Corey Feldman",
            "actorID": "nm0000397",
            "films": 15,
            "rating": 6.493333333333331,
            "views": 949566036
          },
          {
            "actor": "Ron Livingston",
            "actorID": "nm0515296",
            "films": 19,
            "rating": 6.5473684210526315,
            "views": 949472517
          },
          {
            "actor": "Robert Picardo",
            "actorID": "nm0000585",
            "films": 24,
            "rating": 6.354166666666665,
            "views": 948199726
          },
          {
            "actor": "Alexander Skarsgard",
            "actorID": "nm0002907",
            "films": 14,
            "rating": 6.471428571428571,
            "views": 947192469
          },
          {
            "actor": "Jessica St. Clair",
            "actorID": "nm1167794",
            "films": 11,
            "rating": 6.236363636363635,
            "views": 947069324
          },
          {
            "actor": "Paul Calderon",
            "actorID": "nm0129538",
            "films": 18,
            "rating": 6.772222222222222,
            "views": 946774577
          },
          {
            "actor": "Chris Penn",
            "actorID": "nm0001606",
            "films": 23,
            "rating": 6.426086956521738,
            "views": 945805192
          },
          {
            "actor": "Bill McKinney",
            "actorID": "nm0571853",
            "films": 14,
            "rating": 6.442857142857142,
            "views": 945507609
          },
          {
            "actor": "Jane Alexander",
            "actorID": "nm0000737",
            "films": 12,
            "rating": 6.5249999999999995,
            "views": 944207196
          },
          {
            "actor": "John Pyper-Ferguson",
            "actorID": "nm0701561",
            "films": 10,
            "rating": 6.4,
            "views": 943260665
          },
          {
            "actor": "William Lee Scott",
            "actorID": "nm0005406",
            "films": 10,
            "rating": 6.5,
            "views": 942305366
          },
          {
            "actor": "Alicia Silverstone",
            "actorID": "nm0000224",
            "films": 15,
            "rating": 5.746666666666666,
            "views": 941796443
          },
          {
            "actor": "Saul Rubinek",
            "actorID": "nm0007210",
            "films": 20,
            "rating": 6.355,
            "views": 941741519
          },
          {
            "actor": "Bronson Pinchot",
            "actorID": "nm0001621",
            "films": 12,
            "rating": 6.366666666666666,
            "views": 940481215
          },
          {
            "actor": "Fred Ward",
            "actorID": "nm0911542",
            "films": 27,
            "rating": 6.374074074074074,
            "views": 939132929
          },
          {
            "actor": "Rachel Dratch",
            "actorID": "nm0237222",
            "films": 10,
            "rating": 5.819999999999999,
            "views": 938275775
          },
          {
            "actor": "James Pickens Jr.",
            "actorID": "nm0681782",
            "films": 19,
            "rating": 6.5473684210526315,
            "views": 937696518
          },
          {
            "actor": "Carol Kane",
            "actorID": "nm0001406",
            "films": 27,
            "rating": 5.970370370370369,
            "views": 936813083
          },
          {
            "actor": "Dan Butler",
            "actorID": "nm0124873",
            "films": 12,
            "rating": 6.808333333333334,
            "views": 933069474
          },
          {
            "actor": "Mike Vogel",
            "actorID": "nm1036181",
            "films": 12,
            "rating": 6.308333333333334,
            "views": 931749815
          },
          {
            "actor": "Charlie Hunnam",
            "actorID": "nm0402271",
            "films": 11,
            "rating": 6.790909090909091,
            "views": 929006260
          },
          {
            "actor": "Clea DuVall",
            "actorID": "nm0245112",
            "films": 15,
            "rating": 6.506666666666667,
            "views": 925633963
          },
          {
            "actor": "Tom Everett Scott",
            "actorID": "nm0779866",
            "films": 12,
            "rating": 6.083333333333333,
            "views": 925493048
          },
          {
            "actor": "Natassia Malthe",
            "actorID": "nm0853573",
            "films": 13,
            "rating": 5.538461538461538,
            "views": 924149262
          },
          {
            "actor": "Dean Stockwell",
            "actorID": "nm0001777",
            "films": 19,
            "rating": 6.394736842105263,
            "views": 922246055
          },
          {
            "actor": "David Clennon",
            "actorID": "nm0166359",
            "films": 22,
            "rating": 6.64090909090909,
            "views": 922072966
          },
          {
            "actor": "Stephen Dorff",
            "actorID": "nm0001151",
            "films": 20,
            "rating": 5.8149999999999995,
            "views": 920977689
          },
          {
            "actor": "Veronica Cartwright",
            "actorID": "nm0001021",
            "films": 15,
            "rating": 6.180000000000001,
            "views": 918525433
          },
          {
            "actor": "Jessica Lange",
            "actorID": "nm0001448",
            "films": 22,
            "rating": 6.618181818181819,
            "views": 918157396
          },
          {
            "actor": "Max Minghella",
            "actorID": "nm1540404",
            "films": 12,
            "rating": 6.625000000000001,
            "views": 918028697
          },
          {
            "actor": "Columbus Short",
            "actorID": "nm1551922",
            "films": 10,
            "rating": 5.8999999999999995,
            "views": 915820661
          },
          {
            "actor": "Casey Wilson",
            "actorID": "nm1988111",
            "films": 10,
            "rating": 6.33,
            "views": 914579606
          },
          {
            "actor": "Olympia Dukakis",
            "actorID": "nm0001156",
            "films": 15,
            "rating": 6.226666666666665,
            "views": 912813953
          },
          {
            "actor": "Richard Crenna",
            "actorID": "nm0001077",
            "films": 12,
            "rating": 6.341666666666668,
            "views": 912281033
          },
          {
            "actor": "Beau Bridges",
            "actorID": "nm0000977",
            "films": 17,
            "rating": 6.347058823529411,
            "views": 910746673
          },
          {
            "actor": "Clarence Williams III",
            "actorID": "nm0929934",
            "films": 17,
            "rating": 6.4,
            "views": 909189687
          },
          {
            "actor": "Joseph Fiennes",
            "actorID": "nm0001212",
            "films": 10,
            "rating": 6.8,
            "views": 907541761
          },
          {
            "actor": "Richard Roundtree",
            "actorID": "nm0745780",
            "films": 15,
            "rating": 5.5600000000000005,
            "views": 906176329
          },
          {
            "actor": "Lindsay Lohan",
            "actorID": "nm0517820",
            "films": 13,
            "rating": 5.699999999999999,
            "views": 905827875
          },
          {
            "actor": "Clifton Powell",
            "actorID": "nm0694066",
            "films": 16,
            "rating": 6.175000000000001,
            "views": 905759066
          },
          {
            "actor": "Tom Hulce",
            "actorID": "nm0001371",
            "films": 10,
            "rating": 6.83,
            "views": 902795293
          },
          {
            "actor": "Josh Stamberg",
            "actorID": "nm0821817",
            "films": 11,
            "rating": 6.118181818181818,
            "views": 901951948
          },
          {
            "actor": "Cathy Moriarty",
            "actorID": "nm0001550",
            "films": 19,
            "rating": 6.184210526315789,
            "views": 900020342
          },
          {
            "actor": "Rachel Griffiths",
            "actorID": "nm0341737",
            "films": 10,
            "rating": 6.9799999999999995,
            "views": 899201023
          },
          {
            "actor": "Linus Roache",
            "actorID": "nm0730070",
            "films": 11,
            "rating": 6.7272727272727275,
            "views": 897727940
          },
          {
            "actor": "Virginia Madsen",
            "actorID": "nm0000515",
            "films": 24,
            "rating": 6.104166666666667,
            "views": 897502933
          },
          {
            "actor": "William Windom",
            "actorID": "nm0934750",
            "films": 11,
            "rating": 6.627272727272728,
            "views": 895740757
          },
          {
            "actor": "Charlotte Rampling",
            "actorID": "nm0001648",
            "films": 18,
            "rating": 6.655555555555555,
            "views": 895513829
          },
          {
            "actor": "Marjean Holden",
            "actorID": "nm0390232",
            "films": 10,
            "rating": 5.619999999999999,
            "views": 895126439
          },
          {
            "actor": "Josh Hamilton",
            "actorID": "nm0357979",
            "films": 14,
            "rating": 7.042857142857143,
            "views": 894151556
          },
          {
            "actor": "Paul Winfield",
            "actorID": "nm0934902",
            "films": 11,
            "rating": 6.1909090909090905,
            "views": 893944965
          },
          {
            "actor": "David Patrick Kelly",
            "actorID": "nm0446314",
            "films": 20,
            "rating": 6.840000000000001,
            "views": 893460902
          },
          {
            "actor": "Damon Herriman",
            "actorID": "nm0380632",
            "films": 10,
            "rating": 6.2700000000000005,
            "views": 893340508
          },
          {
            "actor": "Chazz Palminteri",
            "actorID": "nm0001590",
            "films": 19,
            "rating": 6.552631578947369,
            "views": 890655974
          },
          {
            "actor": "Lynne Thigpen",
            "actorID": "nm0858106",
            "films": 19,
            "rating": 6.347368421052632,
            "views": 890555267
          },
          {
            "actor": "Amy Smart",
            "actorID": "nm0005442",
            "films": 17,
            "rating": 6.294117647058824,
            "views": 888845089
          },
          {
            "actor": "Charles Durning",
            "actorID": "nm0001164",
            "films": 26,
            "rating": 6.173076923076923,
            "views": 887499620
          },
          {
            "actor": "Curtis Armstrong",
            "actorID": "nm0035664",
            "films": 19,
            "rating": 5.973684210526315,
            "views": 885410978
          },
          {
            "actor": "Christopher Guest",
            "actorID": "nm0001302",
            "films": 13,
            "rating": 6.853846153846154,
            "views": 884396597
          },
          {
            "actor": "David Suchet",
            "actorID": "nm0837064",
            "films": 16,
            "rating": 5.9937499999999995,
            "views": 882088395
          },
          {
            "actor": "Blake Lively",
            "actorID": "nm0515116",
            "films": 11,
            "rating": 6.40909090909091,
            "views": 879522995
          },
          {
            "actor": "Sally Kirkland",
            "actorID": "nm0000476",
            "films": 13,
            "rating": 6.376923076923078,
            "views": 879344873
          },
          {
            "actor": "Michael Pitt",
            "actorID": "nm0685856",
            "films": 17,
            "rating": 6.641176470588236,
            "views": 878929479
          },
          {
            "actor": "50 Cent",
            "actorID": "nm1265067",
            "films": 10,
            "rating": 6.49,
            "views": 878316001
          },
          {
            "actor": "George Dzundza",
            "actorID": "nm0001169",
            "films": 16,
            "rating": 5.96875,
            "views": 877814761
          },
          {
            "actor": "Goran Visnjic",
            "actorID": "nm0899681",
            "films": 10,
            "rating": 6.529999999999999,
            "views": 877696906
          },
          {
            "actor": "Dennis Hopper",
            "actorID": "nm0000454",
            "films": 29,
            "rating": 6.158620689655172,
            "views": 877433388
          },
          {
            "actor": "Jennifer Jason Leigh",
            "actorID": "nm0000492",
            "films": 42,
            "rating": 6.564285714285712,
            "views": 876845727
          },
          {
            "actor": "Selma Blair",
            "actorID": "nm0004757",
            "films": 15,
            "rating": 5.913333333333333,
            "views": 876745659
          },
          {
            "actor": "Jerry Orbach",
            "actorID": "nm0001583",
            "films": 14,
            "rating": 6.628571428571428,
            "views": 875516506
          },
          {
            "actor": "Tom Arnold",
            "actorID": "nm0000792",
            "films": 17,
            "rating": 5.6000000000000005,
            "views": 875386245
          },
          {
            "actor": "Alex Macqueen",
            "actorID": "nm1276507",
            "films": 11,
            "rating": 6.627272727272726,
            "views": 874099432
          },
          {
            "actor": "Penelope Ann Miller",
            "actorID": "nm0000542",
            "films": 20,
            "rating": 6.419999999999999,
            "views": 872904653
          },
          {
            "actor": "Michael Biehn",
            "actorID": "nm0000299",
            "films": 17,
            "rating": 6.429411764705883,
            "views": 872814922
          },
          {
            "actor": "Peter Firth",
            "actorID": "nm0278752",
            "films": 10,
            "rating": 6.68,
            "views": 872434915
          },
          {
            "actor": "James Garner",
            "actorID": "nm0001258",
            "films": 14,
            "rating": 6.621428571428572,
            "views": 871976514
          },
          {
            "actor": "John Ashton",
            "actorID": "nm0039226",
            "films": 15,
            "rating": 6.186666666666667,
            "views": 871299664
          },
          {
            "actor": "Debra Messing",
            "actorID": "nm0005226",
            "films": 10,
            "rating": 5.99,
            "views": 869783549
          },
          {
            "actor": "Dwight Yoakam",
            "actorID": "nm0948267",
            "films": 13,
            "rating": 6.3999999999999995,
            "views": 869515294
          },
          {
            "actor": "Todd Field",
            "actorID": "nm0276062",
            "films": 10,
            "rating": 6.17,
            "views": 868500267
          },
          {
            "actor": "Kathy Najimy",
            "actorID": "nm0001562",
            "films": 15,
            "rating": 6.28,
            "views": 867762665
          },
          {
            "actor": "Michael McKean",
            "actorID": "nm0571106",
            "films": 38,
            "rating": 6.1763157894736835,
            "views": 867416861
          },
          {
            "actor": "Tom Savini",
            "actorID": "nm0767741",
            "films": 16,
            "rating": 6.643750000000001,
            "views": 867199327
          },
          {
            "actor": "Mitchell Ryan",
            "actorID": "nm0752751",
            "films": 11,
            "rating": 5.818181818181818,
            "views": 866495313
          },
          {
            "actor": "Ethan Phillips",
            "actorID": "nm0680392",
            "films": 20,
            "rating": 6.42,
            "views": 866418059
          },
          {
            "actor": "Gabrielle Union",
            "actorID": "nm0005517",
            "films": 14,
            "rating": 6.142857142857143,
            "views": 866015682
          },
          {
            "actor": "John Doman",
            "actorID": "nm0231283",
            "films": 11,
            "rating": 6.8,
            "views": 865289859
          },
          {
            "actor": "Courtney Gains",
            "actorID": "nm0301381",
            "films": 13,
            "rating": 6.353846153846154,
            "views": 864878431
          },
          {
            "actor": "Kathy Baker",
            "actorID": "nm0000834",
            "films": 24,
            "rating": 6.750000000000001,
            "views": 863175277
          },
          {
            "actor": "Lauren Graham",
            "actorID": "nm0334179",
            "films": 10,
            "rating": 6.4,
            "views": 862127914
          },
          {
            "actor": "John de Lancie",
            "actorID": "nm0209496",
            "films": 14,
            "rating": 6.585714285714286,
            "views": 861873708
          },
          {
            "actor": "Fred Melamed",
            "actorID": "nm0577329",
            "films": 20,
            "rating": 6.610000000000001,
            "views": 860574622
          },
          {
            "actor": "Oliver Stone",
            "actorID": "nm0000231",
            "films": 10,
            "rating": 6.8,
            "views": 859489388
          },
          {
            "actor": "Eli Wallach",
            "actorID": "nm0908919",
            "films": 14,
            "rating": 6.485714285714286,
            "views": 857874006
          },
          {
            "actor": "Rupert Vansittart",
            "actorID": "nm0889338",
            "films": 12,
            "rating": 6.608333333333334,
            "views": 857562225
          },
          {
            "actor": "Charles Rocket",
            "actorID": "nm0734236",
            "films": 14,
            "rating": 6.207142857142857,
            "views": 856930741
          },
          {
            "actor": "Stuart Pankin",
            "actorID": "nm0659573",
            "films": 12,
            "rating": 5.7749999999999995,
            "views": 856454201
          },
          {
            "actor": "Anna Thomson",
            "actorID": "nm0505764",
            "films": 21,
            "rating": 6.652380952380954,
            "views": 855368005
          },
          {
            "actor": "Joey Lauren Adams",
            "actorID": "nm0000725",
            "films": 16,
            "rating": 6.074999999999999,
            "views": 853882898
          },
          {
            "actor": "Christine Lakin",
            "actorID": "nm0003115",
            "films": 12,
            "rating": 5.483333333333333,
            "views": 853402658
          },
          {
            "actor": "Timothy Hutton",
            "actorID": "nm0000459",
            "films": 23,
            "rating": 6.539130434782607,
            "views": 852747148
          },
          {
            "actor": "Jim Beaver",
            "actorID": "nm0064769",
            "films": 16,
            "rating": 6.531250000000002,
            "views": 849366556
          },
          {
            "actor": "Marg Helgenberger",
            "actorID": "nm0001339",
            "films": 14,
            "rating": 6.192857142857143,
            "views": 848885141
          },
          {
            "actor": "Maura Tierney",
            "actorID": "nm0005491",
            "films": 12,
            "rating": 6.458333333333333,
            "views": 848278232
          },
          {
            "actor": "Olivia Colman",
            "actorID": "nm1469236",
            "films": 10,
            "rating": 6.88,
            "views": 845336049
          },
          {
            "actor": "Glenne Headly",
            "actorID": "nm0000444",
            "films": 23,
            "rating": 6.091304347826087,
            "views": 844123361
          },
          {
            "actor": "Dey Young",
            "actorID": "nm0949477",
            "films": 12,
            "rating": 6.091666666666668,
            "views": 843606222
          },
          {
            "actor": "Ann-Margret",
            "actorID": "nm0000268",
            "films": 14,
            "rating": 6.035714285714286,
            "views": 843330755
          },
          {
            "actor": "Martin Mull",
            "actorID": "nm0611898",
            "films": 12,
            "rating": 6.175,
            "views": 842948506
          },
          {
            "actor": "Mary Beth Hurt",
            "actorID": "nm0002148",
            "films": 19,
            "rating": 6.373684210526315,
            "views": 842505891
          },
          {
            "actor": "Jay Mohr",
            "actorID": "nm0001542",
            "films": 16,
            "rating": 6.1937500000000005,
            "views": 841522671
          },
          {
            "actor": "Nat Faxon",
            "actorID": "nm0269542",
            "films": 11,
            "rating": 5.845454545454547,
            "views": 840138128
          },
          {
            "actor": "Dylan McDermott",
            "actorID": "nm0001518",
            "films": 17,
            "rating": 6.470588235294119,
            "views": 835916191
          },
          {
            "actor": "Sakina Jaffrey",
            "actorID": "nm0415529",
            "films": 11,
            "rating": 6.418181818181819,
            "views": 834362224
          },
          {
            "actor": "Richard Moll",
            "actorID": "nm0596959",
            "films": 10,
            "rating": 5.75,
            "views": 833329555
          },
          {
            "actor": "Mike Hagerty",
            "actorID": "nm0002235",
            "films": 14,
            "rating": 5.850000000000001,
            "views": 831685512
          },
          {
            "actor": "Roger Allam",
            "actorID": "nm0019885",
            "films": 11,
            "rating": 6.781818181818181,
            "views": 829948356
          },
          {
            "actor": "Ken Jenkins",
            "actorID": "nm0420898",
            "films": 15,
            "rating": 6.173333333333334,
            "views": 828505544
          },
          {
            "actor": "Costas Mandylor",
            "actorID": "nm0541908",
            "films": 13,
            "rating": 6.1692307692307695,
            "views": 828112258
          },
          {
            "actor": "Kyra Sedgwick",
            "actorID": "nm0001718",
            "films": 18,
            "rating": 6.511111111111111,
            "views": 826606272
          },
          {
            "actor": "Robert LaSardo",
            "actorID": "nm0489436",
            "films": 19,
            "rating": 5.9789473684210535,
            "views": 826537220
          },
          {
            "actor": "Jane Fonda",
            "actorID": "nm0000404",
            "films": 14,
            "rating": 6.107142857142857,
            "views": 825186951
          },
          {
            "actor": "Lawrence Tierney",
            "actorID": "nm0862937",
            "films": 11,
            "rating": 6.290909090909091,
            "views": 824557872
          },
          {
            "actor": "Valeria Golino",
            "actorID": "nm0000420",
            "films": 12,
            "rating": 6.833333333333332,
            "views": 824271029
          },
          {
            "actor": "Camryn Manheim",
            "actorID": "nm0005179",
            "films": 16,
            "rating": 6.1812499999999995,
            "views": 824239352
          },
          {
            "actor": "Rosemarie DeWitt",
            "actorID": "nm1679669",
            "films": 12,
            "rating": 6.641666666666668,
            "views": 823411681
          },
          {
            "actor": "Patrick Kilpatrick",
            "actorID": "nm0453304",
            "films": 11,
            "rating": 5.945454545454546,
            "views": 823346252
          },
          {
            "actor": "Brion James",
            "actorID": "nm0001397",
            "films": 22,
            "rating": 6.163636363636363,
            "views": 822479078
          },
          {
            "actor": "Salli Richardson-Whitfield",
            "actorID": "nm0724757",
            "films": 10,
            "rating": 5.9399999999999995,
            "views": 822192847
          },
          {
            "actor": "Scott Michael Campbell",
            "actorID": "nm0132843",
            "films": 10,
            "rating": 6.1099999999999985,
            "views": 820951020
          },
          {
            "actor": "Sandra Oh",
            "actorID": "nm0644897",
            "films": 17,
            "rating": 6.405882352941177,
            "views": 820003232
          },
          {
            "actor": "Max Perlich",
            "actorID": "nm0001611",
            "films": 24,
            "rating": 6.258333333333333,
            "views": 819579636
          },
          {
            "actor": "Stephen Dillane",
            "actorID": "nm0226820",
            "films": 14,
            "rating": 6.792857142857143,
            "views": 819124810
          },
          {
            "actor": "David Keith",
            "actorID": "nm0001418",
            "films": 17,
            "rating": 6.199999999999999,
            "views": 818925521
          },
          {
            "actor": "Frances Bay",
            "actorID": "nm0062844",
            "films": 20,
            "rating": 6.045,
            "views": 816645782
          },
          {
            "actor": "Arden Myrin",
            "actorID": "nm0617141",
            "films": 10,
            "rating": 6.21,
            "views": 816621636
          },
          {
            "actor": "Jennifer Love Hewitt",
            "actorID": "nm0001349",
            "films": 10,
            "rating": 5.76,
            "views": 816568792
          },
          {
            "actor": "George Wyner",
            "actorID": "nm0943927",
            "films": 15,
            "rating": 6.513333333333334,
            "views": 815054099
          },
          {
            "actor": "Shirley Knight",
            "actorID": "nm0004309",
            "films": 13,
            "rating": 5.907692307692309,
            "views": 813947439
          },
          {
            "actor": "Carrie Preston",
            "actorID": "nm0696387",
            "films": 11,
            "rating": 6.554545454545454,
            "views": 813090317
          },
          {
            "actor": "Kate Walsh",
            "actorID": "nm0005532",
            "films": 11,
            "rating": 6.299999999999998,
            "views": 812979937
          },
          {
            "actor": "Wilford Brimley",
            "actorID": "nm0000979",
            "films": 16,
            "rating": 6.66875,
            "views": 812496141
          },
          {
            "actor": "Damon Wayans",
            "actorID": "nm0001834",
            "films": 17,
            "rating": 6.094117647058823,
            "views": 811462480
          },
          {
            "actor": "Armand Assante",
            "actorID": "nm0000800",
            "films": 15,
            "rating": 6.220000000000001,
            "views": 810739587
          },
          {
            "actor": "Dane Cook",
            "actorID": "nm0176981",
            "films": 12,
            "rating": 5.983333333333333,
            "views": 807380896
          },
          {
            "actor": "James Gammon",
            "actorID": "nm0304000",
            "films": 28,
            "rating": 6.44642857142857,
            "views": 806980009
          },
          {
            "actor": "Gillian Anderson",
            "actorID": "nm0000096",
            "films": 11,
            "rating": 6.954545454545454,
            "views": 804788327
          },
          {
            "actor": "Rhona Mitra",
            "actorID": "nm0593961",
            "films": 12,
            "rating": 6.208333333333333,
            "views": 804405820
          },
          {
            "actor": "Heather Matarazzo",
            "actorID": "nm0000525",
            "films": 11,
            "rating": 6.281818181818181,
            "views": 803948641
          },
          {
            "actor": "Kathleen Quinlan",
            "actorID": "nm0000599",
            "films": 16,
            "rating": 6.39375,
            "views": 798421484
          },
          {
            "actor": "Norman Reedus",
            "actorID": "nm0005342",
            "films": 15,
            "rating": 6.579999999999999,
            "views": 796626882
          },
          {
            "actor": "Ana Gasteyer",
            "actorID": "nm0309430",
            "films": 11,
            "rating": 5.627272727272727,
            "views": 795054132
          },
          {
            "actor": "Wes Craven",
            "actorID": "nm0000127",
            "films": 10,
            "rating": 6.33,
            "views": 793811130
          },
          {
            "actor": "Conchata Ferrell",
            "actorID": "nm0004916",
            "films": 12,
            "rating": 6.816666666666666,
            "views": 793479123
          },
          {
            "actor": "Dennis Boutsikaris",
            "actorID": "nm0100381",
            "films": 11,
            "rating": 6.127272727272728,
            "views": 791889302
          },
          {
            "actor": "Nathaniel Parker",
            "actorID": "nm0662511",
            "films": 10,
            "rating": 6.33,
            "views": 791500224
          },
          {
            "actor": "John Magaro",
            "actorID": "nm1910274",
            "films": 13,
            "rating": 6.676923076923076,
            "views": 791495816
          },
          {
            "actor": "Brian Van Holt",
            "actorID": "nm0887144",
            "films": 11,
            "rating": 6.3090909090909095,
            "views": 790893191
          },
          {
            "actor": "Alex Rocco",
            "actorID": "nm0733678",
            "films": 18,
            "rating": 5.8,
            "views": 790782692
          },
          {
            "actor": "Mickey Jones",
            "actorID": "nm0428856",
            "films": 21,
            "rating": 6.119047619047619,
            "views": 788351291
          },
          {
            "actor": "Ryan Phillippe",
            "actorID": "nm0000202",
            "films": 18,
            "rating": 6.516666666666667,
            "views": 786803013
          },
          {
            "actor": "Frank Vincent",
            "actorID": "nm0898634",
            "films": 17,
            "rating": 6.741176470588235,
            "views": 786458911
          },
          {
            "actor": "Jimmi Simpson",
            "actorID": "nm0801051",
            "films": 12,
            "rating": 5.991666666666667,
            "views": 784639662
          },
          {
            "actor": "Nicholas Farrell",
            "actorID": "nm0268297",
            "films": 12,
            "rating": 6.741666666666668,
            "views": 781568459
          },
          {
            "actor": "John Getz",
            "actorID": "nm0315288",
            "films": 13,
            "rating": 6.323076923076922,
            "views": 780945666
          },
          {
            "actor": "Terry Kinney",
            "actorID": "nm0455767",
            "films": 14,
            "rating": 6.485714285714287,
            "views": 780744063
          },
          {
            "actor": "Jason Beghe",
            "actorID": "nm0000892",
            "films": 10,
            "rating": 6.24,
            "views": 780242888
          },
          {
            "actor": "David Duchovny",
            "actorID": "nm0000141",
            "films": 16,
            "rating": 6.3687499999999995,
            "views": 778703231
          },
          {
            "actor": "Christine Taylor",
            "actorID": "nm0852132",
            "films": 11,
            "rating": 6.118181818181818,
            "views": 770618204
          },
          {
            "actor": "Paddy Considine",
            "actorID": "nm0175916",
            "films": 14,
            "rating": 7.2714285714285705,
            "views": 770105695
          },
          {
            "actor": "Elisabeth Moss",
            "actorID": "nm0005253",
            "films": 18,
            "rating": 6.333333333333332,
            "views": 770002999
          },
          {
            "actor": "Simon Baker",
            "actorID": "nm0048932",
            "films": 13,
            "rating": 6.3307692307692305,
            "views": 768365005
          },
          {
            "actor": "Julia Ormond",
            "actorID": "nm0000566",
            "films": 11,
            "rating": 6.5181818181818185,
            "views": 767099885
          },
          {
            "actor": "Steven Seagal",
            "actorID": "nm0000219",
            "films": 13,
            "rating": 5.707692307692307,
            "views": 766632698
          },
          {
            "actor": "Britt Robertson",
            "actorID": "nm1429380",
            "films": 11,
            "rating": 6.627272727272726,
            "views": 763917802
          },
          {
            "actor": "Geoff Pierson",
            "actorID": "nm0682762",
            "films": 11,
            "rating": 6.0181818181818185,
            "views": 763303882
          },
          {
            "actor": "Aunjanue Ellis",
            "actorID": "nm0254712",
            "films": 13,
            "rating": 6.884615384615385,
            "views": 763027331
          },
          {
            "actor": "Leon",
            "actorID": "nm0502442",
            "films": 14,
            "rating": 6.1571428571428575,
            "views": 762997220
          },
          {
            "actor": "Dax Shepard",
            "actorID": "nm1009277",
            "films": 15,
            "rating": 6.013333333333334,
            "views": 762776515
          },
          {
            "actor": "Merritt Wever",
            "actorID": "nm0923266",
            "films": 10,
            "rating": 6.890000000000001,
            "views": 762062533
          },
          {
            "actor": "Wil Wheaton",
            "actorID": "nm0000696",
            "films": 10,
            "rating": 6.540000000000001,
            "views": 761536278
          },
          {
            "actor": "Pamela Reed",
            "actorID": "nm0715622",
            "films": 16,
            "rating": 6.20625,
            "views": 761378450
          },
          {
            "actor": "Sean Patrick Thomas",
            "actorID": "nm0859503",
            "films": 11,
            "rating": 6.036363636363635,
            "views": 760554649
          },
          {
            "actor": "Matthew Glave",
            "actorID": "nm0322182",
            "films": 10,
            "rating": 5.800000000000001,
            "views": 760220201
          },
          {
            "actor": "Roger Rees",
            "actorID": "nm0715953",
            "films": 13,
            "rating": 6.438461538461539,
            "views": 757241706
          },
          {
            "actor": "Julian Sands",
            "actorID": "nm0001696",
            "films": 21,
            "rating": 6.280952380952381,
            "views": 756530278
          },
          {
            "actor": "Garret Dillahunt",
            "actorID": "nm0226813",
            "films": 11,
            "rating": 7.145454545454545,
            "views": 753536050
          },
          {
            "actor": "Tony Plana",
            "actorID": "nm0686470",
            "films": 23,
            "rating": 6.291304347826089,
            "views": 753451209
          },
          {
            "actor": "Jim Sturgess",
            "actorID": "nm0836343",
            "films": 12,
            "rating": 6.658333333333332,
            "views": 751039483
          },
          {
            "actor": "Ethan Embry",
            "actorID": "nm0256121",
            "films": 18,
            "rating": 6.538888888888889,
            "views": 749474883
          },
          {
            "actor": "Angus Macfadyen",
            "actorID": "nm0005171",
            "films": 11,
            "rating": 6.627272727272728,
            "views": 748008463
          },
          {
            "actor": "Ray Wise",
            "actorID": "nm0936403",
            "films": 15,
            "rating": 6.526666666666667,
            "views": 747426350
          },
          {
            "actor": "Melora Hardin",
            "actorID": "nm0002124",
            "films": 12,
            "rating": 5.708333333333333,
            "views": 746841750
          },
          {
            "actor": "Joshua Jackson",
            "actorID": "nm0005045",
            "films": 18,
            "rating": 5.872222222222222,
            "views": 745896318
          },
          {
            "actor": "Henry Silva",
            "actorID": "nm0798328",
            "films": 13,
            "rating": 5.815384615384616,
            "views": 745735821
          },
          {
            "actor": "Monet Mazur",
            "actorID": "nm0005195",
            "films": 11,
            "rating": 5.79090909090909,
            "views": 745480376
          },
          {
            "actor": "Mary McCormack",
            "actorID": "nm0005203",
            "films": 14,
            "rating": 6.250000000000001,
            "views": 744259190
          },
          {
            "actor": "Leslie Nielsen",
            "actorID": "nm0000558",
            "films": 16,
            "rating": 5.6312500000000005,
            "views": 742042779
          },
          {
            "actor": "Sean Young",
            "actorID": "nm0000707",
            "films": 18,
            "rating": 6.044444444444443,
            "views": 741879006
          },
          {
            "actor": "Peter Riegert",
            "actorID": "nm0726200",
            "films": 12,
            "rating": 6.566666666666667,
            "views": 740698447
          },
          {
            "actor": "Paul Williams",
            "actorID": "nm0931437",
            "films": 10,
            "rating": 6.09,
            "views": 739466669
          },
          {
            "actor": "Griffin Dunne",
            "actorID": "nm0001162",
            "films": 20,
            "rating": 6.44,
            "views": 737892604
          },
          {
            "actor": "Beverly D'Angelo",
            "actorID": "nm0000350",
            "films": 23,
            "rating": 6.178260869565219,
            "views": 735581202
          },
          {
            "actor": "Rhea Perlman",
            "actorID": "nm0674231",
            "films": 10,
            "rating": 6.3,
            "views": 734231897
          },
          {
            "actor": "Roscoe Lee Browne",
            "actorID": "nm0001975",
            "films": 10,
            "rating": 5.819999999999999,
            "views": 732612979
          },
          {
            "actor": "Kristy Swanson",
            "actorID": "nm0001785",
            "films": 14,
            "rating": 6.135714285714285,
            "views": 732032759
          },
          {
            "actor": "Paul Scheer",
            "actorID": "nm1179677",
            "films": 11,
            "rating": 5.7272727272727275,
            "views": 731891642
          },
          {
            "actor": "Joss Ackland",
            "actorID": "nm0000722",
            "films": 22,
            "rating": 6.20909090909091,
            "views": 728908286
          },
          {
            "actor": "Melanie Lynskey",
            "actorID": "nm0001491",
            "films": 15,
            "rating": 6.760000000000001,
            "views": 728261100
          },
          {
            "actor": "Diane Venora",
            "actorID": "nm0893204",
            "films": 16,
            "rating": 6.65625,
            "views": 727362331
          },
          {
            "actor": "Talia Shire",
            "actorID": "nm0001735",
            "films": 11,
            "rating": 6.127272727272726,
            "views": 725556217
          },
          {
            "actor": "Jerry Stiller",
            "actorID": "nm0005467",
            "films": 11,
            "rating": 6.081818181818181,
            "views": 724694897
          },
          {
            "actor": "Lisa Banes",
            "actorID": "nm0051862",
            "films": 11,
            "rating": 6.581818181818182,
            "views": 722493386
          },
          {
            "actor": "Alicia Witt",
            "actorID": "nm0001860",
            "films": 12,
            "rating": 6.416666666666667,
            "views": 721878622
          },
          {
            "actor": "Rory Cochrane",
            "actorID": "nm0168262",
            "films": 14,
            "rating": 6.621428571428572,
            "views": 721860930
          },
          {
            "actor": "Aidan Quinn",
            "actorID": "nm0001644",
            "films": 22,
            "rating": 6.495454545454546,
            "views": 719999786
          },
          {
            "actor": "Carlos Gomez",
            "actorID": "nm0326988",
            "films": 12,
            "rating": 6.458333333333333,
            "views": 715731695
          },
          {
            "actor": "Lucy Punch",
            "actorID": "nm0700577",
            "films": 16,
            "rating": 6.35,
            "views": 715400568
          },
          {
            "actor": "Aida Turturro",
            "actorID": "nm0878152",
            "films": 15,
            "rating": 6.146666666666666,
            "views": 715384971
          },
          {
            "actor": "Teri Garr",
            "actorID": "nm0000414",
            "films": 20,
            "rating": 6.2700000000000005,
            "views": 714710575
          },
          {
            "actor": "Swoosie Kurtz",
            "actorID": "nm0001436",
            "films": 18,
            "rating": 6.433333333333334,
            "views": 713925009
          },
          {
            "actor": "Craig Bierko",
            "actorID": "nm0081572",
            "films": 13,
            "rating": 6.223076923076922,
            "views": 713528579
          },
          {
            "actor": "Madeline Carroll",
            "actorID": "nm1630992",
            "films": 10,
            "rating": 6.2700000000000005,
            "views": 712837027
          },
          {
            "actor": "Jerry Hardin",
            "actorID": "nm0362222",
            "films": 23,
            "rating": 6.3478260869565215,
            "views": 710258603
          },
          {
            "actor": "Claire Forlani",
            "actorID": "nm0001231",
            "films": 14,
            "rating": 6.092857142857143,
            "views": 709451087
          },
          {
            "actor": "Tracey Ullman",
            "actorID": "nm0001808",
            "films": 14,
            "rating": 6.207142857142857,
            "views": 709045671
          },
          {
            "actor": "Dave Sheridan",
            "actorID": "nm0792156",
            "films": 11,
            "rating": 5.7,
            "views": 708278658
          },
          {
            "actor": "David Hayman",
            "actorID": "nm0371342",
            "films": 16,
            "rating": 6.6875,
            "views": 707864755
          },
          {
            "actor": "Raul Julia",
            "actorID": "nm0000471",
            "films": 16,
            "rating": 6.243750000000001,
            "views": 707297705
          },
          {
            "actor": "William Baldwin",
            "actorID": "nm0000287",
            "films": 11,
            "rating": 6.218181818181819,
            "views": 707270162
          },
          {
            "actor": "Mare Winningham",
            "actorID": "nm0001858",
            "films": 12,
            "rating": 6.4333333333333345,
            "views": 706479186
          },
          {
            "actor": "Donald Faison",
            "actorID": "nm0265668",
            "films": 14,
            "rating": 6.3357142857142845,
            "views": 703653777
          },
          {
            "actor": "Lynda Boyd",
            "actorID": "nm0007155",
            "films": 13,
            "rating": 6.138461538461538,
            "views": 703407532
          },
          {
            "actor": "David Carradine",
            "actorID": "nm0001016",
            "films": 10,
            "rating": 5.97,
            "views": 702851112
          },
          {
            "actor": "Raoul Max Trujillo",
            "actorID": "nm0874232",
            "films": 12,
            "rating": 6.45,
            "views": 702789492
          },
          {
            "actor": "Gabriel Mann",
            "actorID": "nm0542759",
            "films": 12,
            "rating": 6.533333333333332,
            "views": 702585506
          },
          {
            "actor": "Gina McKee",
            "actorID": "nm0571160",
            "films": 12,
            "rating": 6.783333333333334,
            "views": 702577613
          },
          {
            "actor": "Terry O'Quinn",
            "actorID": "nm0642368",
            "films": 20,
            "rating": 6.630000000000001,
            "views": 702551045
          },
          {
            "actor": "Jon Tenney",
            "actorID": "nm0855103",
            "films": 16,
            "rating": 6.143749999999999,
            "views": 702207654
          },
          {
            "actor": "Phil Hartman",
            "actorID": "nm0367005",
            "films": 22,
            "rating": 6.013636363636363,
            "views": 700522036
          },
          {
            "actor": "Linda Fiorentino",
            "actorID": "nm0000400",
            "films": 12,
            "rating": 6.324999999999999,
            "views": 700367003
          },
          {
            "actor": "Robert Pugh",
            "actorID": "nm0700059",
            "films": 10,
            "rating": 6.67,
            "views": 700339357
          },
          {
            "actor": "Maurice Compte",
            "actorID": "nm0173997",
            "films": 11,
            "rating": 6.472727272727273,
            "views": 699404202
          },
          {
            "actor": "Keith Allen",
            "actorID": "nm0020717",
            "films": 10,
            "rating": 6.969999999999999,
            "views": 699271297
          },
          {
            "actor": "Max Thieriot",
            "actorID": "nm1302735",
            "films": 10,
            "rating": 5.86,
            "views": 699110854
          },
          {
            "actor": "Bonnie Bedelia",
            "actorID": "nm0000889",
            "films": 12,
            "rating": 6.458333333333335,
            "views": 697198005
          },
          {
            "actor": "Peter Fonda",
            "actorID": "nm0001228",
            "films": 15,
            "rating": 5.980000000000001,
            "views": 696207372
          },
          {
            "actor": "Taylor Negron",
            "actorID": "nm0624510",
            "films": 21,
            "rating": 5.704761904761905,
            "views": 695758532
          },
          {
            "actor": "Robert Davi",
            "actorID": "nm0001108",
            "films": 18,
            "rating": 5.722222222222221,
            "views": 695377119
          },
          {
            "actor": "Richard Edson",
            "actorID": "nm0002057",
            "films": 18,
            "rating": 6.427777777777777,
            "views": 694959842
          },
          {
            "actor": "Andrew Dice Clay",
            "actorID": "nm0001048",
            "films": 11,
            "rating": 6.118181818181818,
            "views": 694761849
          },
          {
            "actor": "John Pankow",
            "actorID": "nm0659601",
            "films": 15,
            "rating": 6.233333333333333,
            "views": 694274474
          },
          {
            "actor": "James Avery",
            "actorID": "nm0043041",
            "films": 16,
            "rating": 5.75,
            "views": 693714006
          },
          {
            "actor": "Glenn Shadix",
            "actorID": "nm0787187",
            "films": 13,
            "rating": 6.200000000000001,
            "views": 693061067
          },
          {
            "actor": "Taye Diggs",
            "actorID": "nm0004875",
            "films": 13,
            "rating": 6.523076923076924,
            "views": 693036109
          },
          {
            "actor": "Paul Ben-Victor",
            "actorID": "nm0070115",
            "films": 24,
            "rating": 6.016666666666666,
            "views": 691682890
          },
          {
            "actor": "River Phoenix",
            "actorID": "nm0000203",
            "films": 13,
            "rating": 6.784615384615384,
            "views": 690786558
          },
          {
            "actor": "Vanessa Williams",
            "actorID": "nm0001853",
            "films": 12,
            "rating": 5.891666666666667,
            "views": 690139852
          },
          {
            "actor": "Emily Browning",
            "actorID": "nm0115161",
            "films": 10,
            "rating": 5.97,
            "views": 689897221
          },
          {
            "actor": "Dennis Franz",
            "actorID": "nm0001240",
            "films": 12,
            "rating": 6.75,
            "views": 687916832
          },
          {
            "actor": "Beau Knapp",
            "actorID": "nm3354041",
            "films": 12,
            "rating": 6.5249999999999995,
            "views": 687235686
          },
          {
            "actor": "Illeana Douglas",
            "actorID": "nm0001152",
            "films": 22,
            "rating": 6.490909090909091,
            "views": 685505871
          },
          {
            "actor": "Deborah Kara Unger",
            "actorID": "nm0000679",
            "films": 15,
            "rating": 6.52,
            "views": 685370959
          },
          {
            "actor": "Meredith Salenger",
            "actorID": "nm0001694",
            "films": 10,
            "rating": 5.97,
            "views": 683308198
          },
          {
            "actor": "Phyllida Law",
            "actorID": "nm0492373",
            "films": 13,
            "rating": 6.584615384615384,
            "views": 679323980
          },
          {
            "actor": "Ashley Peldon",
            "actorID": "nm0670779",
            "films": 10,
            "rating": 6.24,
            "views": 679276426
          },
          {
            "actor": "Yasiin Bey",
            "actorID": "nm0080049",
            "films": 14,
            "rating": 6.592857142857143,
            "views": 677363434
          },
          {
            "actor": "Alison Pill",
            "actorID": "nm0683467",
            "films": 13,
            "rating": 6.769230769230769,
            "views": 676764568
          },
          {
            "actor": "Lucas Hedges",
            "actorID": "nm2348627",
            "films": 11,
            "rating": 7.281818181818181,
            "views": 675968372
          },
          {
            "actor": "Alexis Arquette",
            "actorID": "nm0000793",
            "films": 12,
            "rating": 6.591666666666666,
            "views": 675559307
          },
          {
            "actor": "Henry Gibson",
            "actorID": "nm0002099",
            "films": 12,
            "rating": 6.425,
            "views": 674706354
          },
          {
            "actor": "Kate Nelligan",
            "actorID": "nm0625075",
            "films": 12,
            "rating": 6.55,
            "views": 674126056
          },
          {
            "actor": "Jessica Cauffiel",
            "actorID": "nm0004814",
            "films": 11,
            "rating": 5.736363636363635,
            "views": 673959999
          },
          {
            "actor": "Jenna Elfman",
            "actorID": "nm0001184",
            "films": 10,
            "rating": 6,
            "views": 673230491
          },
          {
            "actor": "Chuck Norris",
            "actorID": "nm0001569",
            "films": 17,
            "rating": 5.5176470588235285,
            "views": 671345282
          },
          {
            "actor": "Steve Schirripa",
            "actorID": "nm0771993",
            "films": 13,
            "rating": 6.2846153846153845,
            "views": 670080067
          },
          {
            "actor": "Gaby Hoffmann",
            "actorID": "nm0000451",
            "films": 14,
            "rating": 6.414285714285713,
            "views": 669102881
          },
          {
            "actor": "G.W. Bailey",
            "actorID": "nm0047265",
            "films": 14,
            "rating": 5.578571428571429,
            "views": 668343180
          },
          {
            "actor": "Michelle Krusiec",
            "actorID": "nm0472891",
            "films": 10,
            "rating": 5.94,
            "views": 668224895
          },
          {
            "actor": "George Gaynes",
            "actorID": "nm0310960",
            "films": 15,
            "rating": 5.920000000000001,
            "views": 667168934
          },
          {
            "actor": "Dom DeLuise",
            "actorID": "nm0001123",
            "films": 20,
            "rating": 5.930000000000001,
            "views": 666718602
          },
          {
            "actor": "Johnny Simmons",
            "actorID": "nm2215447",
            "films": 10,
            "rating": 6.309999999999999,
            "views": 666499487
          },
          {
            "actor": "Scott Bakula",
            "actorID": "nm0000836",
            "films": 11,
            "rating": 6.5,
            "views": 664653709
          },
          {
            "actor": "Matt Ross",
            "actorID": "nm0743671",
            "films": 11,
            "rating": 6.672727272727272,
            "views": 663237898
          },
          {
            "actor": "Fisher Stevens",
            "actorID": "nm0001770",
            "films": 26,
            "rating": 6.2423076923076914,
            "views": 663138642
          },
          {
            "actor": "Robert Carradine",
            "actorID": "nm0001019",
            "films": 12,
            "rating": 5.925000000000001,
            "views": 662574554
          },
          {
            "actor": "Olivia Thirlby",
            "actorID": "nm1880888",
            "films": 11,
            "rating": 6.609090909090909,
            "views": 662245231
          },
          {
            "actor": "Stephen Campbell Moore",
            "actorID": "nm1304386",
            "films": 12,
            "rating": 6.499999999999999,
            "views": 660729649
          },
          {
            "actor": "Daryl Mitchell",
            "actorID": "nm0593258",
            "films": 12,
            "rating": 5.8500000000000005,
            "views": 659971311
          },
          {
            "actor": "Lena Olin",
            "actorID": "nm0000565",
            "films": 17,
            "rating": 6.541176470588233,
            "views": 658833435
          },
          {
            "actor": "Adrienne Barbeau",
            "actorID": "nm0000105",
            "films": 11,
            "rating": 6.618181818181818,
            "views": 658434306
          },
          {
            "actor": "Gabriel Macht",
            "actorID": "nm0532683",
            "films": 14,
            "rating": 6.121428571428572,
            "views": 657812812
          },
          {
            "actor": "Ruben Blades",
            "actorID": "nm0001952",
            "films": 17,
            "rating": 6.058823529411765,
            "views": 657509806
          },
          {
            "actor": "Harriet Walter",
            "actorID": "nm0910040",
            "films": 12,
            "rating": 7.125,
            "views": 655325116
          },
          {
            "actor": "Jami Gertz",
            "actorID": "nm0000415",
            "films": 13,
            "rating": 6,
            "views": 651522014
          },
          {
            "actor": "Pat Morita",
            "actorID": "nm0001552",
            "films": 12,
            "rating": 5.724999999999999,
            "views": 650413731
          },
          {
            "actor": "Cara Seymour",
            "actorID": "nm0786806",
            "films": 11,
            "rating": 7.281818181818182,
            "views": 648538456
          },
          {
            "actor": "Paul Gleason",
            "actorID": "nm0322339",
            "films": 17,
            "rating": 6.276470588235294,
            "views": 647992103
          },
          {
            "actor": "Wendie Malick",
            "actorID": "nm0005176",
            "films": 12,
            "rating": 6.158333333333334,
            "views": 647748136
          },
          {
            "actor": "Lorraine Toussaint",
            "actorID": "nm0005501",
            "films": 11,
            "rating": 6.209090909090909,
            "views": 644956859
          },
          {
            "actor": "William B. Davis",
            "actorID": "nm0205657",
            "films": 10,
            "rating": 6.21,
            "views": 644342689
          },
          {
            "actor": "John Larroquette",
            "actorID": "nm0488662",
            "films": 16,
            "rating": 6.193750000000001,
            "views": 643001049
          },
          {
            "actor": "Blair Underwood",
            "actorID": "nm0005516",
            "films": 10,
            "rating": 6.09,
            "views": 642946575
          },
          {
            "actor": "Kevin Anderson",
            "actorID": "nm0000754",
            "films": 12,
            "rating": 6.241666666666666,
            "views": 640449883
          },
          {
            "actor": "Walter Matthau",
            "actorID": "nm0000527",
            "films": 15,
            "rating": 6.126666666666666,
            "views": 639825742
          },
          {
            "actor": "John Gielgud",
            "actorID": "nm0000024",
            "films": 19,
            "rating": 6.489473684210528,
            "views": 638272080
          },
          {
            "actor": "Marc Blucas",
            "actorID": "nm0089456",
            "films": 14,
            "rating": 6.135714285714285,
            "views": 638244954
          },
          {
            "actor": "Anne Bancroft",
            "actorID": "nm0000843",
            "films": 21,
            "rating": 6.457142857142858,
            "views": 637589994
          },
          {
            "actor": "Charles Grodin",
            "actorID": "nm0001301",
            "films": 17,
            "rating": 6.052941176470589,
            "views": 636330709
          },
          {
            "actor": "Cicely Tyson",
            "actorID": "nm0001807",
            "films": 10,
            "rating": 6.2299999999999995,
            "views": 635594342
          },
          {
            "actor": "Buck Taylor",
            "actorID": "nm0852076",
            "films": 11,
            "rating": 6.418181818181816,
            "views": 633342277
          },
          {
            "actor": "Josh Charles",
            "actorID": "nm0001038",
            "films": 10,
            "rating": 6.609999999999999,
            "views": 632896079
          },
          {
            "actor": "Geoffrey Lewis",
            "actorID": "nm0507212",
            "films": 20,
            "rating": 6.265000000000001,
            "views": 630970665
          },
          {
            "actor": "Jack O'Connell",
            "actorID": "nm1925239",
            "films": 10,
            "rating": 6.94,
            "views": 630599746
          },
          {
            "actor": "Isaac Hayes",
            "actorID": "nm0005002",
            "films": 14,
            "rating": 6.1499999999999995,
            "views": 630407274
          },
          {
            "actor": "Rosanna Arquette",
            "actorID": "nm0000275",
            "films": 23,
            "rating": 6.334782608695653,
            "views": 629706082
          },
          {
            "actor": "Eric Bogosian",
            "actorID": "nm0091899",
            "films": 12,
            "rating": 6.55,
            "views": 628643273
          },
          {
            "actor": "Jon Seda",
            "actorID": "nm0781218",
            "films": 12,
            "rating": 6.491666666666667,
            "views": 628415715
          },
          {
            "actor": "Mimi Rogers",
            "actorID": "nm0000211",
            "films": 21,
            "rating": 6.171428571428571,
            "views": 628105307
          },
          {
            "actor": "Joshua Malina",
            "actorID": "nm0539651",
            "films": 11,
            "rating": 6.463636363636365,
            "views": 628086044
          },
          {
            "actor": "Julie Hagerty",
            "actorID": "nm0353546",
            "films": 20,
            "rating": 6.35,
            "views": 627249589
          },
          {
            "actor": "Kirstie Alley",
            "actorID": "nm0000263",
            "films": 16,
            "rating": 6.081250000000001,
            "views": 626719551
          },
          {
            "actor": "Jaime Pressly",
            "actorID": "nm0005326",
            "films": 10,
            "rating": 5.42,
            "views": 625770807
          },
          {
            "actor": "Denholm Elliott",
            "actorID": "nm0001186",
            "films": 12,
            "rating": 6.816666666666667,
            "views": 623896317
          },
          {
            "actor": "Bridgette Wilson-Sampras",
            "actorID": "nm0933098",
            "films": 12,
            "rating": 6,
            "views": 623218534
          },
          {
            "actor": "Kate Capshaw",
            "actorID": "nm0001009",
            "films": 14,
            "rating": 5.878571428571429,
            "views": 621921759
          },
          {
            "actor": "Khandi Alexander",
            "actorID": "nm0018554",
            "films": 12,
            "rating": 6.408333333333334,
            "views": 621418952
          },
          {
            "actor": "Orlando Jones",
            "actorID": "nm0428963",
            "films": 14,
            "rating": 6.185714285714285,
            "views": 619063392
          },
          {
            "actor": "Ellen Barkin",
            "actorID": "nm0000289",
            "films": 28,
            "rating": 6.410714285714286,
            "views": 618655956
          },
          {
            "actor": "Kang-ho Song",
            "actorID": "nm0814280",
            "films": 10,
            "rating": 7.489999999999999,
            "views": 617525002
          },
          {
            "actor": "June Diane Raphael",
            "actorID": "nm2053085",
            "films": 10,
            "rating": 6.26,
            "views": 614685405
          },
          {
            "actor": "Joanna Cassidy",
            "actorID": "nm0001026",
            "films": 14,
            "rating": 6.178571428571428,
            "views": 614074881
          },
          {
            "actor": "Hugh Dancy",
            "actorID": "nm0199215",
            "films": 10,
            "rating": 6.289999999999999,
            "views": 612535649
          },
          {
            "actor": "Madeline Kahn",
            "actorID": "nm0001404",
            "films": 12,
            "rating": 6.074999999999999,
            "views": 612323423
          },
          {
            "actor": "David Caruso",
            "actorID": "nm0000325",
            "films": 13,
            "rating": 6.161538461538462,
            "views": 610289177
          },
          {
            "actor": "Tamala Jones",
            "actorID": "nm0005067",
            "films": 12,
            "rating": 5.791666666666667,
            "views": 609028483
          },
          {
            "actor": "Vinessa Shaw",
            "actorID": "nm0005416",
            "films": 12,
            "rating": 6.425000000000001,
            "views": 607339891
          },
          {
            "actor": "Lolita Davidovich",
            "actorID": "nm0000357",
            "films": 19,
            "rating": 6.273684210526316,
            "views": 606608551
          },
          {
            "actor": "Melanie Griffith",
            "actorID": "nm0000429",
            "films": 22,
            "rating": 6.395454545454546,
            "views": 605238275
          },
          {
            "actor": "Bridget Fonda",
            "actorID": "nm0000403",
            "films": 27,
            "rating": 6.337037037037039,
            "views": 605100614
          },
          {
            "actor": "Samm Levine",
            "actorID": "nm0505949",
            "films": 10,
            "rating": 5.94,
            "views": 604577424
          },
          {
            "actor": "Tom Noonan",
            "actorID": "nm0006888",
            "films": 23,
            "rating": 6.404347826086957,
            "views": 604568061
          },
          {
            "actor": "Kelly Lynch",
            "actorID": "nm0001488",
            "films": 16,
            "rating": 5.7375,
            "views": 603037129
          },
          {
            "actor": "Kate Burton",
            "actorID": "nm0123632",
            "films": 15,
            "rating": 6.46,
            "views": 602968958
          },
          {
            "actor": "Ken Marino",
            "actorID": "nm0547800",
            "films": 11,
            "rating": 6.554545454545454,
            "views": 599840961
          },
          {
            "actor": "Stephen Collins",
            "actorID": "nm0004834",
            "films": 10,
            "rating": 6.1000000000000005,
            "views": 598949284
          },
          {
            "actor": "Rory Culkin",
            "actorID": "nm0191412",
            "films": 11,
            "rating": 6.60909090909091,
            "views": 597726546
          },
          {
            "actor": "Scott Speedman",
            "actorID": "nm0005454",
            "films": 10,
            "rating": 6.529999999999999,
            "views": 597407078
          },
          {
            "actor": "Jeff Fahey",
            "actorID": "nm0001194",
            "films": 11,
            "rating": 6.345454545454545,
            "views": 595304546
          },
          {
            "actor": "Rod Steiger",
            "actorID": "nm0001768",
            "films": 12,
            "rating": 6.216666666666666,
            "views": 593840910
          },
          {
            "actor": "Kimberly Elise",
            "actorID": "nm0253708",
            "films": 11,
            "rating": 6.527272727272728,
            "views": 592183128
          },
          {
            "actor": "Peter Falk",
            "actorID": "nm0000393",
            "films": 13,
            "rating": 6.5307692307692315,
            "views": 591482152
          },
          {
            "actor": "Stephen Spinella",
            "actorID": "nm0818880",
            "films": 10,
            "rating": 6.589999999999999,
            "views": 591356154
          },
          {
            "actor": "Shawn Hatosy",
            "actorID": "nm0004999",
            "films": 15,
            "rating": 6.406666666666667,
            "views": 591352882
          },
          {
            "actor": "Alison Lohman",
            "actorID": "nm0517844",
            "films": 10,
            "rating": 6.779999999999999,
            "views": 591057923
          },
          {
            "actor": "Stockard Channing",
            "actorID": "nm0000330",
            "films": 19,
            "rating": 6.226315789473685,
            "views": 590018569
          },
          {
            "actor": "Freddy Rodriguez",
            "actorID": "nm0135585",
            "films": 12,
            "rating": 6.366666666666667,
            "views": 588848423
          },
          {
            "actor": "Mark Gatiss",
            "actorID": "nm0309693",
            "films": 11,
            "rating": 6.845454545454545,
            "views": 587623090
          },
          {
            "actor": "Jamey Sheridan",
            "actorID": "nm0792177",
            "films": 18,
            "rating": 6.644444444444444,
            "views": 587574594
          },
          {
            "actor": "Amy Irving",
            "actorID": "nm0001388",
            "films": 14,
            "rating": 6.478571428571429,
            "views": 587107675
          },
          {
            "actor": "Taryn Manning",
            "actorID": "nm0543383",
            "films": 10,
            "rating": 6.18,
            "views": 586939744
          },
          {
            "actor": "Mercedes Ruehl",
            "actorID": "nm0001689",
            "films": 13,
            "rating": 6.607692307692307,
            "views": 586553841
          },
          {
            "actor": "Jason Patric",
            "actorID": "nm0000574",
            "films": 14,
            "rating": 6.442857142857141,
            "views": 586250672
          },
          {
            "actor": "Tim Russ",
            "actorID": "nm0750913",
            "films": 10,
            "rating": 6.32,
            "views": 582726288
          },
          {
            "actor": "Dexter Fletcher",
            "actorID": "nm0002077",
            "films": 17,
            "rating": 6.623529411764705,
            "views": 581137765
          },
          {
            "actor": "Jessica Hecht",
            "actorID": "nm0372961",
            "films": 14,
            "rating": 6.657142857142857,
            "views": 577910189
          },
          {
            "actor": "Denise Crosby",
            "actorID": "nm0000344",
            "films": 11,
            "rating": 6.072727272727271,
            "views": 577903516
          },
          {
            "actor": "Bobcat Goldthwait",
            "actorID": "nm0001281",
            "films": 16,
            "rating": 6.068750000000001,
            "views": 577019302
          },
          {
            "actor": "Bud Cort",
            "actorID": "nm0001069",
            "films": 15,
            "rating": 6.620000000000001,
            "views": 576297277
          },
          {
            "actor": "Kevin Dillon",
            "actorID": "nm0001143",
            "films": 11,
            "rating": 6.4818181818181815,
            "views": 576039301
          },
          {
            "actor": "Jack Warden",
            "actorID": "nm0912001",
            "films": 22,
            "rating": 5.990909090909091,
            "views": 575879299
          },
          {
            "actor": "Ann Magnuson",
            "actorID": "nm0005174",
            "films": 17,
            "rating": 5.847058823529412,
            "views": 574577066
          },
          {
            "actor": "Ben Shenkman",
            "actorID": "nm0791570",
            "films": 10,
            "rating": 6.889999999999999,
            "views": 572730911
          },
          {
            "actor": "Steven Mackintosh",
            "actorID": "nm0533599",
            "films": 14,
            "rating": 6.971428571428572,
            "views": 571636907
          },
          {
            "actor": "Lela Rochon",
            "actorID": "nm0005375",
            "films": 14,
            "rating": 5.878571428571428,
            "views": 569948976
          },
          {
            "actor": "Dylan Walsh",
            "actorID": "nm0909620",
            "films": 10,
            "rating": 6.3500000000000005,
            "views": 569841084
          },
          {
            "actor": "Method Man",
            "actorID": "nm0541218",
            "films": 17,
            "rating": 5.9823529411764715,
            "views": 569277891
          },
          {
            "actor": "Harry Carey Jr.",
            "actorID": "nm0001013",
            "films": 12,
            "rating": 6.658333333333334,
            "views": 569075016
          },
          {
            "actor": "Imogen Poots",
            "actorID": "nm1782299",
            "films": 16,
            "rating": 6.63125,
            "views": 567797584
          },
          {
            "actor": "Madeleine Stowe",
            "actorID": "nm0000656",
            "films": 16,
            "rating": 6.481249999999999,
            "views": 566958526
          },
          {
            "actor": "Jennifer Beals",
            "actorID": "nm0000884",
            "films": 17,
            "rating": 6.341176470588234,
            "views": 562163882
          },
          {
            "actor": "Kane Hodder",
            "actorID": "nm0387987",
            "films": 23,
            "rating": 5.730434782608695,
            "views": 560323841
          },
          {
            "actor": "Greta Scacchi",
            "actorID": "nm0000627",
            "films": 15,
            "rating": 6.6466666666666665,
            "views": 559210236
          },
          {
            "actor": "Jeff Kober",
            "actorID": "nm0462116",
            "films": 10,
            "rating": 6.17,
            "views": 558285062
          },
          {
            "actor": "Jennifer Grey",
            "actorID": "nm0000426",
            "films": 12,
            "rating": 6.641666666666667,
            "views": 557879523
          },
          {
            "actor": "Charles Martin Smith",
            "actorID": "nm0001747",
            "films": 10,
            "rating": 6.279999999999999,
            "views": 557785864
          },
          {
            "actor": "Tisha Campbell",
            "actorID": "nm0132896",
            "films": 12,
            "rating": 5.916666666666667,
            "views": 557000023
          },
          {
            "actor": "Jack Lemmon",
            "actorID": "nm0000493",
            "films": 16,
            "rating": 6.95,
            "views": 556598142
          },
          {
            "actor": "Donald Sumpter",
            "actorID": "nm0838910",
            "films": 10,
            "rating": 6.7299999999999995,
            "views": 556041901
          },
          {
            "actor": "Phyllis Somerville",
            "actorID": "nm0813902",
            "films": 10,
            "rating": 6.4799999999999995,
            "views": 555221003
          },
          {
            "actor": "Jacki Weaver",
            "actorID": "nm0915865",
            "films": 13,
            "rating": 6.476923076923077,
            "views": 553371983
          },
          {
            "actor": "Edward Furlong",
            "actorID": "nm0000411",
            "films": 12,
            "rating": 6.500000000000001,
            "views": 552754474
          },
          {
            "actor": "Rick Rossovich",
            "actorID": "nm0001685",
            "films": 11,
            "rating": 6.218181818181819,
            "views": 549765519
          },
          {
            "actor": "Brian Thompson",
            "actorID": "nm0859921",
            "films": 13,
            "rating": 6.169230769230769,
            "views": 548531108
          },
          {
            "actor": "Gong Li",
            "actorID": "nm0000084",
            "films": 11,
            "rating": 7.163636363636363,
            "views": 547398820
          },
          {
            "actor": "Joanna Scanlan",
            "actorID": "nm0768936",
            "films": 10,
            "rating": 6.880000000000001,
            "views": 543716682
          },
          {
            "actor": "Steven Hill",
            "actorID": "nm0384696",
            "films": 13,
            "rating": 6.338461538461539,
            "views": 543161427
          },
          {
            "actor": "Chloe Webb",
            "actorID": "nm0916050",
            "films": 11,
            "rating": 6.209090909090909,
            "views": 540433959
          },
          {
            "actor": "Marguerite Moreau",
            "actorID": "nm0603413",
            "films": 10,
            "rating": 5.89,
            "views": 539504449
          },
          {
            "actor": "Ari Graynor",
            "actorID": "nm0310966",
            "films": 14,
            "rating": 6.514285714285714,
            "views": 538153963
          },
          {
            "actor": "Balthazar Getty",
            "actorID": "nm0001267",
            "films": 13,
            "rating": 6.576923076923077,
            "views": 536015350
          },
          {
            "actor": "Brendan Sexton III",
            "actorID": "nm0786639",
            "films": 12,
            "rating": 7.008333333333334,
            "views": 535775792
          },
          {
            "actor": "Vincent Kartheiser",
            "actorID": "nm0440229",
            "films": 12,
            "rating": 6.1499999999999995,
            "views": 535100072
          },
          {
            "actor": "Larenz Tate",
            "actorID": "nm0005478",
            "films": 11,
            "rating": 6.645454545454546,
            "views": 534606055
          },
          {
            "actor": "Jesse Bradford",
            "actorID": "nm0103038",
            "films": 12,
            "rating": 6.266666666666667,
            "views": 533920821
          },
          {
            "actor": "Laura San Giacomo",
            "actorID": "nm0000624",
            "films": 10,
            "rating": 6.5,
            "views": 533602443
          },
          {
            "actor": "Johnny Whitworth",
            "actorID": "nm0926615",
            "films": 12,
            "rating": 6.141666666666667,
            "views": 532652974
          },
          {
            "actor": "Jonathan Tucker",
            "actorID": "nm0006958",
            "films": 11,
            "rating": 6.418181818181819,
            "views": 531473704
          },
          {
            "actor": "Jessica Tandy",
            "actorID": "nm0001788",
            "films": 11,
            "rating": 6.572727272727272,
            "views": 531093281
          },
          {
            "actor": "Brian White",
            "actorID": "nm0924552",
            "films": 12,
            "rating": 5.916666666666665,
            "views": 530158518
          },
          {
            "actor": "Anson Mount",
            "actorID": "nm0609845",
            "films": 11,
            "rating": 6.045454545454546,
            "views": 529626179
          },
          {
            "actor": "Samantha Mathis",
            "actorID": "nm0000526",
            "films": 15,
            "rating": 6.473333333333333,
            "views": 529409700
          },
          {
            "actor": "Maria Pitillo",
            "actorID": "nm0001623",
            "films": 10,
            "rating": 6.320000000000001,
            "views": 528547657
          },
          {
            "actor": "Woody Allen",
            "actorID": "nm0000095",
            "films": 21,
            "rating": 7.028571428571429,
            "views": 528480519
          },
          {
            "actor": "Catherine McCormack",
            "actorID": "nm0001517",
            "films": 10,
            "rating": 6.56,
            "views": 528286003
          },
          {
            "actor": "Burgess Meredith",
            "actorID": "nm0580565",
            "films": 13,
            "rating": 6.153846153846152,
            "views": 527436055
          },
          {
            "actor": "Amanda Crew",
            "actorID": "nm1468739",
            "films": 10,
            "rating": 6.279999999999999,
            "views": 527358577
          },
          {
            "actor": "Eliza Dushku",
            "actorID": "nm0244630",
            "films": 10,
            "rating": 6.290000000000001,
            "views": 527315978
          },
          {
            "actor": "Brooke Shields",
            "actorID": "nm0000222",
            "films": 13,
            "rating": 5.507692307692308,
            "views": 527019619
          },
          {
            "actor": "Frances Sternhagen",
            "actorID": "nm0827973",
            "films": 13,
            "rating": 6.238461538461538,
            "views": 526571050
          },
          {
            "actor": "JoBeth Williams",
            "actorID": "nm0001851",
            "films": 16,
            "rating": 6.21875,
            "views": 525581631
          },
          {
            "actor": "Gena Rowlands",
            "actorID": "nm0001687",
            "films": 16,
            "rating": 6.73125,
            "views": 524574317
          },
          {
            "actor": "Natascha McElhone",
            "actorID": "nm0001523",
            "films": 10,
            "rating": 6.470000000000001,
            "views": 523287036
          },
          {
            "actor": "Elizabeth Berrington",
            "actorID": "nm0077397",
            "films": 11,
            "rating": 6.9818181818181815,
            "views": 522230906
          },
          {
            "actor": "Patti D'Arbanville",
            "actorID": "nm0001091",
            "films": 12,
            "rating": 5.666666666666667,
            "views": 522197082
          },
          {
            "actor": "Pam Grier",
            "actorID": "nm0000427",
            "films": 21,
            "rating": 5.7476190476190485,
            "views": 518000826
          },
          {
            "actor": "Michael Angarano",
            "actorID": "nm0029400",
            "films": 13,
            "rating": 6.523076923076924,
            "views": 516135934
          },
          {
            "actor": "Kelly McGillis",
            "actorID": "nm0000534",
            "films": 11,
            "rating": 6.2,
            "views": 515020504
          },
          {
            "actor": "Robert Wagner",
            "actorID": "nm0001822",
            "films": 11,
            "rating": 5.963636363636363,
            "views": 513213494
          },
          {
            "actor": "Zoe Kazan",
            "actorID": "nm1443740",
            "films": 10,
            "rating": 6.9399999999999995,
            "views": 511330998
          },
          {
            "actor": "Bruno Ganz",
            "actorID": "nm0004486",
            "films": 12,
            "rating": 7.333333333333333,
            "views": 510829448
          },
          {
            "actor": "Judy Davis",
            "actorID": "nm0001114",
            "films": 17,
            "rating": 6.752941176470589,
            "views": 505231544
          },
          {
            "actor": "Tony Chiu-Wai Leung",
            "actorID": "nm0504897",
            "films": 12,
            "rating": 7.408333333333332,
            "views": 505153401
          },
          {
            "actor": "Matthew Cowles",
            "actorID": "nm0184804",
            "films": 10,
            "rating": 6.24,
            "views": 503164650
          },
          {
            "actor": "Casey Sander",
            "actorID": "nm0761389",
            "films": 11,
            "rating": 5.927272727272728,
            "views": 500671272
          },
          {
            "actor": "Jack Noseworthy",
            "actorID": "nm0005276",
            "films": 11,
            "rating": 6.072727272727272,
            "views": 500561512
          },
          {
            "actor": "Kyle Bornheimer",
            "actorID": "nm1531180",
            "films": 10,
            "rating": 6.35,
            "views": 499795416
          },
          {
            "actor": "Steven Wright",
            "actorID": "nm0942833",
            "films": 13,
            "rating": 5.869230769230769,
            "views": 499622840
          },
          {
            "actor": "Garette Ratliff Henson",
            "actorID": "nm0378207",
            "films": 10,
            "rating": 6.08,
            "views": 499265198
          },
          {
            "actor": "Rosalind Chao",
            "actorID": "nm0001034",
            "films": 10,
            "rating": 6.32,
            "views": 498717840
          },
          {
            "actor": "Andrea Riseborough",
            "actorID": "nm2057859",
            "films": 10,
            "rating": 7.05,
            "views": 498580334
          },
          {
            "actor": "Steven Bauer",
            "actorID": "nm0000874",
            "films": 12,
            "rating": 6.733333333333333,
            "views": 496160346
          },
          {
            "actor": "Michael Weston",
            "actorID": "nm0922995",
            "films": 12,
            "rating": 6.199999999999999,
            "views": 493110587
          },
          {
            "actor": "Richard Pryor",
            "actorID": "nm0001640",
            "films": 16,
            "rating": 5.975,
            "views": 492046124
          },
          {
            "actor": "Omar Epps",
            "actorID": "nm0004898",
            "films": 15,
            "rating": 6.173333333333333,
            "views": 491509726
          },
          {
            "actor": "Isaiah Washington",
            "actorID": "nm0913460",
            "films": 13,
            "rating": 6.292307692307692,
            "views": 490354033
          },
          {
            "actor": "Jennifer Esposito",
            "actorID": "nm0261170",
            "films": 11,
            "rating": 5.690909090909091,
            "views": 489434998
          },
          {
            "actor": "Tom Selleck",
            "actorID": "nm0000633",
            "films": 13,
            "rating": 5.961538461538462,
            "views": 488684034
          },
          {
            "actor": "Tom Waits",
            "actorID": "nm0001823",
            "films": 23,
            "rating": 6.782608695652173,
            "views": 485785471
          },
          {
            "actor": "George Wendt",
            "actorID": "nm0001841",
            "films": 16,
            "rating": 6.1125,
            "views": 484954579
          },
          {
            "actor": "Timothy Busfield",
            "actorID": "nm0124079",
            "films": 10,
            "rating": 6.36,
            "views": 483687075
          },
          {
            "actor": "Danny Webb",
            "actorID": "nm0916073",
            "films": 12,
            "rating": 6.583333333333333,
            "views": 481288474
          },
          {
            "actor": "Arye Gross",
            "actorID": "nm0343325",
            "films": 11,
            "rating": 6.199999999999999,
            "views": 479885865
          },
          {
            "actor": "Dominic Chianese",
            "actorID": "nm0156940",
            "films": 11,
            "rating": 6.090909090909091,
            "views": 479409870
          },
          {
            "actor": "John Savage",
            "actorID": "nm0001698",
            "films": 10,
            "rating": 6.76,
            "views": 478374516
          },
          {
            "actor": "William Sanderson",
            "actorID": "nm0761836",
            "films": 14,
            "rating": 6.307142857142856,
            "views": 476235749
          },
          {
            "actor": "John Schuck",
            "actorID": "nm0775870",
            "films": 10,
            "rating": 6.1,
            "views": 473328482
          },
          {
            "actor": "Stephen Baldwin",
            "actorID": "nm0000286",
            "films": 16,
            "rating": 6.262499999999999,
            "views": 469291972
          },
          {
            "actor": "Dann Florek",
            "actorID": "nm0282648",
            "films": 11,
            "rating": 5.872727272727274,
            "views": 464668626
          },
          {
            "actor": "Jeremy Northam",
            "actorID": "nm0000562",
            "films": 18,
            "rating": 6.483333333333333,
            "views": 464179561
          },
          {
            "actor": "Ron Silver",
            "actorID": "nm0798779",
            "films": 16,
            "rating": 6.168750000000001,
            "views": 464095037
          },
          {
            "actor": "Matthew Perry",
            "actorID": "nm0001612",
            "films": 10,
            "rating": 5.89,
            "views": 463841541
          },
          {
            "actor": "Robert Englund",
            "actorID": "nm0000387",
            "films": 17,
            "rating": 5.688235294117646,
            "views": 463826367
          },
          {
            "actor": "Richard Masur",
            "actorID": "nm0557956",
            "films": 26,
            "rating": 6.380769230769231,
            "views": 463768269
          },
          {
            "actor": "Anna Chancellor",
            "actorID": "nm0151250",
            "films": 11,
            "rating": 6.627272727272726,
            "views": 463595175
          },
          {
            "actor": "Michael Richards",
            "actorID": "nm0724245",
            "films": 10,
            "rating": 5.89,
            "views": 463248860
          },
          {
            "actor": "Christopher Lambert",
            "actorID": "nm0000483",
            "films": 15,
            "rating": 5.653333333333334,
            "views": 462591294
          },
          {
            "actor": "Derek Luke",
            "actorID": "nm1035682",
            "films": 12,
            "rating": 6.466666666666668,
            "views": 462381738
          },
          {
            "actor": "Clu Gulager",
            "actorID": "nm0347656",
            "films": 10,
            "rating": 6.33,
            "views": 459553485
          },
          {
            "actor": "Tess Harper",
            "actorID": "nm0002128",
            "films": 12,
            "rating": 6.358333333333333,
            "views": 455909497
          },
          {
            "actor": "Lynn Whitfield",
            "actorID": "nm0005551",
            "films": 11,
            "rating": 5.663636363636365,
            "views": 455224165
          },
          {
            "actor": "Amy Aquino",
            "actorID": "nm0032628",
            "films": 11,
            "rating": 6.390909090909091,
            "views": 453382955
          },
          {
            "actor": "Michael Eklund",
            "actorID": "nm1002664",
            "films": 11,
            "rating": 5.6,
            "views": 452685633
          },
          {
            "actor": "Rupert Friend",
            "actorID": "nm1670029",
            "films": 11,
            "rating": 6.79090909090909,
            "views": 448008290
          },
          {
            "actor": "Jason Gedrick",
            "actorID": "nm0001263",
            "films": 10,
            "rating": 5.91,
            "views": 446744881
          },
          {
            "actor": "Rose McGowan",
            "actorID": "nm0000535",
            "films": 15,
            "rating": 5.853333333333334,
            "views": 442805518
          },
          {
            "actor": "Lou Diamond Phillips",
            "actorID": "nm0001617",
            "films": 16,
            "rating": 6.087500000000001,
            "views": 441730586
          },
          {
            "actor": "Kadeem Hardison",
            "actorID": "nm0362429",
            "films": 14,
            "rating": 5.485714285714286,
            "views": 439517412
          },
          {
            "actor": "Phil Davis",
            "actorID": "nm0205289",
            "films": 16,
            "rating": 7.05625,
            "views": 439086670
          },
          {
            "actor": "Michael O'Keefe",
            "actorID": "nm0001574",
            "films": 15,
            "rating": 6.386666666666667,
            "views": 437771124
          },
          {
            "actor": "Steve Guttenberg",
            "actorID": "nm0000430",
            "films": 17,
            "rating": 5.852941176470588,
            "views": 437060605
          },
          {
            "actor": "Kevin Tighe",
            "actorID": "nm0001798",
            "films": 15,
            "rating": 6.593333333333334,
            "views": 436678369
          },
          {
            "actor": "Louis Gossett Jr.",
            "actorID": "nm0001283",
            "films": 14,
            "rating": 5.55,
            "views": 435677093
          },
          {
            "actor": "Mia Farrow",
            "actorID": "nm0001201",
            "films": 20,
            "rating": 6.660000000000001,
            "views": 433813375
          },
          {
            "actor": "Lauren Bacall",
            "actorID": "nm0000002",
            "films": 10,
            "rating": 6.8,
            "views": 429250913
          },
          {
            "actor": "Frederick Coffin",
            "actorID": "nm0168918",
            "films": 12,
            "rating": 6.033333333333332,
            "views": 425632830
          },
          {
            "actor": "Diana Scarwid",
            "actorID": "nm0769311",
            "films": 14,
            "rating": 6.228571428571429,
            "views": 425313290
          },
          {
            "actor": "Annabella Sciorra",
            "actorID": "nm0001711",
            "films": 21,
            "rating": 6.376190476190477,
            "views": 424687764
          },
          {
            "actor": "Corey Haim",
            "actorID": "nm0000433",
            "films": 12,
            "rating": 6.125,
            "views": 424195694
          },
          {
            "actor": "Paris Hilton",
            "actorID": "nm0385296",
            "films": 10,
            "rating": 5.36,
            "views": 421058080
          },
          {
            "actor": "Danny Aiello",
            "actorID": "nm0000732",
            "films": 21,
            "rating": 6.561904761904761,
            "views": 420158230
          },
          {
            "actor": "David Morrissey",
            "actorID": "nm0607375",
            "films": 12,
            "rating": 6.183333333333333,
            "views": 419796117
          },
          {
            "actor": "Leslie Easterbrook",
            "actorID": "nm0247579",
            "films": 12,
            "rating": 5.533333333333334,
            "views": 418278566
          },
          {
            "actor": "Patrick Bergin",
            "actorID": "nm0000920",
            "films": 10,
            "rating": 5.74,
            "views": 413424243
          },
          {
            "actor": "J. Smith-Cameron",
            "actorID": "nm0810397",
            "films": 11,
            "rating": 6.518181818181817,
            "views": 413289462
          },
          {
            "actor": "Kevin P. Farley",
            "actorID": "nm0267659",
            "films": 11,
            "rating": 6.063636363636363,
            "views": 411850958
          },
          {
            "actor": "Ian Bannen",
            "actorID": "nm0000846",
            "films": 12,
            "rating": 6.758333333333332,
            "views": 411466108
          },
          {
            "actor": "William Smith",
            "actorID": "nm0810342",
            "films": 11,
            "rating": 6.318181818181818,
            "views": 409213591
          },
          {
            "actor": "Jonny Lee Miller",
            "actorID": "nm0001538",
            "films": 11,
            "rating": 6.536363636363635,
            "views": 405792707
          },
          {
            "actor": "Diane Ladd",
            "actorID": "nm0002663",
            "films": 17,
            "rating": 6.382352941176471,
            "views": 404471443
          },
          {
            "actor": "Andrew McCarthy",
            "actorID": "nm0000530",
            "films": 14,
            "rating": 6.192857142857144,
            "views": 403429387
          },
          {
            "actor": "Hart Bochner",
            "actorID": "nm0000952",
            "films": 15,
            "rating": 6.1466666666666665,
            "views": 403325834
          },
          {
            "actor": "David Proval",
            "actorID": "nm0698998",
            "films": 17,
            "rating": 6.4,
            "views": 398083529
          },
          {
            "actor": "David Graf",
            "actorID": "nm0333701",
            "films": 13,
            "rating": 5.653846153846152,
            "views": 397812080
          },
          {
            "actor": "Chris Farley",
            "actorID": "nm0000394",
            "films": 10,
            "rating": 6.220000000000001,
            "views": 397549125
          },
          {
            "actor": "Katharine Isabelle",
            "actorID": "nm0410622",
            "films": 11,
            "rating": 5.972727272727273,
            "views": 394383655
          },
          {
            "actor": "Bill Paterson",
            "actorID": "nm0665473",
            "films": 18,
            "rating": 6.627777777777777,
            "views": 393421246
          },
          {
            "actor": "Lane Smith",
            "actorID": "nm0809031",
            "films": 17,
            "rating": 6.317647058823529,
            "views": 393220012
          },
          {
            "actor": "Natasha Richardson",
            "actorID": "nm0001670",
            "films": 11,
            "rating": 6.154545454545453,
            "views": 391197250
          },
          {
            "actor": "Stephen Rea",
            "actorID": "nm0001653",
            "films": 19,
            "rating": 6.363157894736841,
            "views": 390508002
          },
          {
            "actor": "Ice-T",
            "actorID": "nm0001384",
            "films": 12,
            "rating": 5.908333333333334,
            "views": 388961098
          },
          {
            "actor": "Meat Loaf",
            "actorID": "nm0001533",
            "films": 14,
            "rating": 5.7857142857142865,
            "views": 387509700
          },
          {
            "actor": "Faye Dunaway",
            "actorID": "nm0001159",
            "films": 15,
            "rating": 6.073333333333334,
            "views": 387470671
          },
          {
            "actor": "Iggy Pop",
            "actorID": "nm0006563",
            "films": 15,
            "rating": 6.326666666666667,
            "views": 384632404
          },
          {
            "actor": "Ben Miles",
            "actorID": "nm0587060",
            "films": 10,
            "rating": 6.67,
            "views": 379765951
          },
          {
            "actor": "Will Sasso",
            "actorID": "nm0766005",
            "films": 13,
            "rating": 6.007692307692308,
            "views": 379515851
          },
          {
            "actor": "Janet Jones",
            "actorID": "nm0428314",
            "films": 11,
            "rating": 5.827272727272728,
            "views": 379313696
          },
          {
            "actor": "Kaitlyn Dever",
            "actorID": "nm3239803",
            "films": 10,
            "rating": 6.75,
            "views": 378891111
          },
          {
            "actor": "Michael J. Pollard",
            "actorID": "nm0689488",
            "films": 12,
            "rating": 6.266666666666666,
            "views": 376474415
          },
          {
            "actor": "Kenneth Mars",
            "actorID": "nm0550318",
            "films": 13,
            "rating": 6.130769230769231,
            "views": 369535133
          },
          {
            "actor": "Brenda Blethyn",
            "actorID": "nm0000950",
            "films": 11,
            "rating": 6.9818181818181815,
            "views": 366770672
          },
          {
            "actor": "Robert Sean Leonard",
            "actorID": "nm0000494",
            "films": 10,
            "rating": 6.68,
            "views": 366350609
          },
          {
            "actor": "Noah Wyle",
            "actorID": "nm0001864",
            "films": 11,
            "rating": 6.736363636363635,
            "views": 364556979
          },
          {
            "actor": "Gretchen Mol",
            "actorID": "nm0001543",
            "films": 17,
            "rating": 6.5588235294117645,
            "views": 363875524
          },
          {
            "actor": "Ricki Lake",
            "actorID": "nm0001442",
            "films": 11,
            "rating": 6.336363636363635,
            "views": 363624980
          },
          {
            "actor": "Patti LuPone",
            "actorID": "nm0526985",
            "films": 10,
            "rating": 6.5200000000000005,
            "views": 360236875
          },
          {
            "actor": "Brad Renfro",
            "actorID": "nm0000605",
            "films": 10,
            "rating": 6.610000000000001,
            "views": 356448827
          },
          {
            "actor": "Matthias Schoenaerts",
            "actorID": "nm0774386",
            "films": 11,
            "rating": 6.881818181818182,
            "views": 354851824
          },
          {
            "actor": "Melinda Dillon",
            "actorID": "nm0227039",
            "films": 10,
            "rating": 6.83,
            "views": 351039236
          },
          {
            "actor": "Chris Sarandon",
            "actorID": "nm0001697",
            "films": 13,
            "rating": 6.430769230769231,
            "views": 350968813
          },
          {
            "actor": "Michaela Watkins",
            "actorID": "nm1143861",
            "films": 11,
            "rating": 6.2,
            "views": 348903089
          },
          {
            "actor": "Laura Harring",
            "actorID": "nm0005009",
            "films": 10,
            "rating": 5.63,
            "views": 344603182
          },
          {
            "actor": "Kathleen Wilhoite",
            "actorID": "nm0001849",
            "films": 18,
            "rating": 6.1,
            "views": 344141043
          },
          {
            "actor": "Guillermo Diaz",
            "actorID": "nm0246585",
            "films": 11,
            "rating": 6.2272727272727275,
            "views": 343429909
          },
          {
            "actor": "Howard Hesseman",
            "actorID": "nm0381606",
            "films": 15,
            "rating": 6.046666666666668,
            "views": 340069510
          },
          {
            "actor": "Ione Skye",
            "actorID": "nm0001746",
            "films": 11,
            "rating": 6.536363636363637,
            "views": 339938043
          },
          {
            "actor": "Alyssa Milano",
            "actorID": "nm0000192",
            "films": 10,
            "rating": 5.720000000000001,
            "views": 337635413
          },
          {
            "actor": "Alexis Bledel",
            "actorID": "nm0088127",
            "films": 10,
            "rating": 6.42,
            "views": 334754646
          },
          {
            "actor": "Lindsay Crouse",
            "actorID": "nm0001080",
            "films": 18,
            "rating": 6.516666666666667,
            "views": 333322433
          },
          {
            "actor": "Ernest Borgnine",
            "actorID": "nm0000308",
            "films": 11,
            "rating": 5.972727272727273,
            "views": 331754381
          },
          {
            "actor": "John Ritter",
            "actorID": "nm0000615",
            "films": 14,
            "rating": 5.978571428571428,
            "views": 330887122
          },
          {
            "actor": "Lorraine Bracco",
            "actorID": "nm0000966",
            "films": 16,
            "rating": 6.25625,
            "views": 330742103
          },
          {
            "actor": "David Bowie",
            "actorID": "nm0000309",
            "films": 12,
            "rating": 6.849999999999999,
            "views": 330127919
          },
          {
            "actor": "Mark Harmon",
            "actorID": "nm0001319",
            "films": 12,
            "rating": 6.375,
            "views": 329597965
          },
          {
            "actor": "Chloe Sevigny",
            "actorID": "nm0001721",
            "films": 24,
            "rating": 6.645833333333332,
            "views": 329188161
          },
          {
            "actor": "Paul Schneider",
            "actorID": "nm0773973",
            "films": 10,
            "rating": 6.739999999999999,
            "views": 324563655
          },
          {
            "actor": "Sam McMurray",
            "actorID": "nm0573481",
            "films": 15,
            "rating": 5.819999999999999,
            "views": 320965641
          },
          {
            "actor": "Nina Siemaszko",
            "actorID": "nm0797151",
            "films": 10,
            "rating": 6.299999999999999,
            "views": 317714130
          },
          {
            "actor": "Hill Harper",
            "actorID": "nm0004991",
            "films": 12,
            "rating": 5.691666666666667,
            "views": 316336803
          },
          {
            "actor": "Jason Mewes",
            "actorID": "nm0582939",
            "films": 10,
            "rating": 6.840000000000001,
            "views": 315797586
          },
          {
            "actor": "Mark Duplass",
            "actorID": "nm0243233",
            "films": 11,
            "rating": 6.381818181818181,
            "views": 315776037
          },
          {
            "actor": "Everett McGill",
            "actorID": "nm0569239",
            "films": 10,
            "rating": 6.8,
            "views": 312681893
          },
          {
            "actor": "Kevin Zegers",
            "actorID": "nm0954225",
            "films": 10,
            "rating": 6.21,
            "views": 309501212
          },
          {
            "actor": "Phoebe Cates",
            "actorID": "nm0000121",
            "films": 14,
            "rating": 6.028571428571429,
            "views": 306833263
          },
          {
            "actor": "Robert Hays",
            "actorID": "nm0001332",
            "films": 10,
            "rating": 5.68,
            "views": 303993069
          },
          {
            "actor": "John Ventimiglia",
            "actorID": "nm0893247",
            "films": 15,
            "rating": 6.6,
            "views": 302397629
          },
          {
            "actor": "Sheila Kelley",
            "actorID": "nm0445992",
            "films": 14,
            "rating": 6.392857142857143,
            "views": 299319731
          },
          {
            "actor": "Kevin McCarthy",
            "actorID": "nm0002994",
            "films": 13,
            "rating": 6.207692307692308,
            "views": 298971129
          },
          {
            "actor": "Louise Fletcher",
            "actorID": "nm0001221",
            "films": 21,
            "rating": 6.114285714285715,
            "views": 298858895
          },
          {
            "actor": "Richard Belzer",
            "actorID": "nm0001938",
            "films": 15,
            "rating": 6.040000000000001,
            "views": 297763531
          },
          {
            "actor": "Connie Britton",
            "actorID": "nm0110168",
            "films": 10,
            "rating": 6.480000000000001,
            "views": 295128485
          },
          {
            "actor": "Jonathan Silverman",
            "actorID": "nm0001738",
            "films": 11,
            "rating": 6.045454545454546,
            "views": 294471417
          },
          {
            "actor": "Dudley Moore",
            "actorID": "nm0001545",
            "films": 13,
            "rating": 5.653846153846155,
            "views": 286324407
          },
          {
            "actor": "Joan Chen",
            "actorID": "nm0001040",
            "films": 10,
            "rating": 6.5,
            "views": 285955381
          },
          {
            "actor": "Rae Dawn Chong",
            "actorID": "nm0001044",
            "films": 12,
            "rating": 6.316666666666666,
            "views": 285671449
          },
          {
            "actor": "Dyan Cannon",
            "actorID": "nm0001007",
            "films": 10,
            "rating": 5.61,
            "views": 282246830
          },
          {
            "actor": "Amy Madigan",
            "actorID": "nm0001496",
            "films": 12,
            "rating": 6.625000000000001,
            "views": 281629329
          },
          {
            "actor": "Felicity Huffman",
            "actorID": "nm0005031",
            "films": 11,
            "rating": 6.545454545454546,
            "views": 280935239
          },
          {
            "actor": "Shelley Long",
            "actorID": "nm0001480",
            "films": 12,
            "rating": 5.758333333333333,
            "views": 279547535
          },
          {
            "actor": "Tony Sirico",
            "actorID": "nm0802831",
            "films": 17,
            "rating": 6.5058823529411764,
            "views": 279240624
          },
          {
            "actor": "Ben Gazzara",
            "actorID": "nm0001262",
            "films": 10,
            "rating": 6.860000000000001,
            "views": 274705067
          },
          {
            "actor": "Christopher Reeve",
            "actorID": "nm0001659",
            "films": 13,
            "rating": 6.146153846153846,
            "views": 272716573
          },
          {
            "actor": "Molly Ringwald",
            "actorID": "nm0000208",
            "films": 12,
            "rating": 5.891666666666666,
            "views": 272114129
          },
          {
            "actor": "Mary Stuart Masterson",
            "actorID": "nm0000524",
            "films": 14,
            "rating": 6.364285714285715,
            "views": 271774731
          },
          {
            "actor": "Michael Berryman",
            "actorID": "nm0077720",
            "films": 12,
            "rating": 5.5,
            "views": 266715593
          },
          {
            "actor": "Catherine Hicks",
            "actorID": "nm0382819",
            "films": 11,
            "rating": 5.909090909090909,
            "views": 262187227
          },
          {
            "actor": "Annabeth Gish",
            "actorID": "nm0001272",
            "films": 14,
            "rating": 6.321428571428571,
            "views": 258915936
          },
          {
            "actor": "Judith Ivey",
            "actorID": "nm0412382",
            "films": 15,
            "rating": 6.166666666666667,
            "views": 257138012
          },
          {
            "actor": "Nancy Allen",
            "actorID": "nm0000262",
            "films": 10,
            "rating": 6.09,
            "views": 256847200
          },
          {
            "actor": "Bill Moseley",
            "actorID": "nm0608405",
            "films": 16,
            "rating": 6.075,
            "views": 256647704
          },
          {
            "actor": "Keith Carradine",
            "actorID": "nm0001018",
            "films": 12,
            "rating": 6.316666666666666,
            "views": 255300289
          },
          {
            "actor": "Michael Pare",
            "actorID": "nm0001595",
            "films": 13,
            "rating": 6.015384615384615,
            "views": 255204485
          },
          {
            "actor": "Richard Bright",
            "actorID": "nm0109175",
            "films": 10,
            "rating": 6.659999999999999,
            "views": 244926149
          },
          {
            "actor": "Carl Lumbly",
            "actorID": "nm0525855",
            "films": 10,
            "rating": 6.45,
            "views": 243202007
          },
          {
            "actor": "Maggie Cheung",
            "actorID": "nm0001041",
            "films": 10,
            "rating": 7.31,
            "views": 241977468
          },
          {
            "actor": "Christine Lahti",
            "actorID": "nm0001441",
            "films": 14,
            "rating": 6.342857142857143,
            "views": 240638801
          },
          {
            "actor": "John Gallagher Jr.",
            "actorID": "nm0302330",
            "films": 10,
            "rating": 6.7200000000000015,
            "views": 239001488
          },
          {
            "actor": "Bess Armstrong",
            "actorID": "nm0000787",
            "films": 10,
            "rating": 5.720000000000001,
            "views": 237006561
          },
          {
            "actor": "Lauren Hutton",
            "actorID": "nm0001381",
            "films": 10,
            "rating": 5.59,
            "views": 228895636
          },
          {
            "actor": "William Petersen",
            "actorID": "nm0676973",
            "films": 12,
            "rating": 6.658333333333332,
            "views": 226580989
          },
          {
            "actor": "Rachael Leigh Cook",
            "actorID": "nm0000337",
            "films": 11,
            "rating": 5.7272727272727275,
            "views": 225460295
          },
          {
            "actor": "Mark Webber",
            "actorID": "nm0916406",
            "films": 12,
            "rating": 6.6000000000000005,
            "views": 224527259
          },
          {
            "actor": "Chelsea Field",
            "actorID": "nm0001210",
            "films": 10,
            "rating": 5.86,
            "views": 222223508
          },
          {
            "actor": "Richard Farnsworth",
            "actorID": "nm0002070",
            "films": 12,
            "rating": 6.375,
            "views": 221245522
          },
          {
            "actor": "Maria Conchita Alonso",
            "actorID": "nm0000744",
            "films": 13,
            "rating": 5.900000000000001,
            "views": 219207531
          },
          {
            "actor": "Pauly Shore",
            "actorID": "nm0001736",
            "films": 12,
            "rating": 5.325,
            "views": 219175444
          },
          {
            "actor": "Dana Delany",
            "actorID": "nm0001127",
            "films": 11,
            "rating": 6.2727272727272725,
            "views": 218982812
          },
          {
            "actor": "Billy Drago",
            "actorID": "nm0236711",
            "films": 10,
            "rating": 6.369999999999999,
            "views": 218976859
          },
          {
            "actor": "Judy Parfitt",
            "actorID": "nm0661407",
            "films": 10,
            "rating": 6.65,
            "views": 218677154
          },
          {
            "actor": "Spike Lee",
            "actorID": "nm0000490",
            "films": 10,
            "rating": 6.75,
            "views": 218127424
          },
          {
            "actor": "Candy Clark",
            "actorID": "nm0163748",
            "films": 10,
            "rating": 5.92,
            "views": 218019195
          },
          {
            "actor": "Peter Vaughan",
            "actorID": "nm0891092",
            "films": 12,
            "rating": 7.091666666666666,
            "views": 217815430
          },
          {
            "actor": "Mira Sorvino",
            "actorID": "nm0000227",
            "films": 15,
            "rating": 6.586666666666668,
            "views": 216940971
          },
          {
            "actor": "Judd Nelson",
            "actorID": "nm0000555",
            "films": 12,
            "rating": 5.991666666666667,
            "views": 216938872
          },
          {
            "actor": "Tovah Feldshuh",
            "actorID": "nm0271165",
            "films": 10,
            "rating": 6.28,
            "views": 216429399
          },
          {
            "actor": "Helen Shaver",
            "actorID": "nm0001726",
            "films": 10,
            "rating": 6.12,
            "views": 212706715
          },
          {
            "actor": "Tim Thomerson",
            "actorID": "nm0859772",
            "films": 14,
            "rating": 5.892857142857143,
            "views": 212472612
          },
          {
            "actor": "Dedee Pfeiffer",
            "actorID": "nm0679410",
            "films": 11,
            "rating": 6.081818181818182,
            "views": 207199664
          },
          {
            "actor": "Jordan Ladd",
            "actorID": "nm0480465",
            "films": 10,
            "rating": 6.200000000000001,
            "views": 206726803
          },
          {
            "actor": "Sarah Polley",
            "actorID": "nm0001631",
            "films": 13,
            "rating": 6.7846153846153845,
            "views": 205447018
          },
          {
            "actor": "Bill Sage",
            "actorID": "nm0756083",
            "films": 11,
            "rating": 6.572727272727272,
            "views": 200547173
          },
          {
            "actor": "Nancy Travis",
            "actorID": "nm0001802",
            "films": 13,
            "rating": 6.384615384615385,
            "views": 199903711
          },
          {
            "actor": "Paul Freeman",
            "actorID": "nm0293550",
            "films": 11,
            "rating": 5.627272727272728,
            "views": 195725466
          },
          {
            "actor": "Roy Scheider",
            "actorID": "nm0001702",
            "films": 13,
            "rating": 6.207692307692308,
            "views": 192080834
          },
          {
            "actor": "Sam Waterston",
            "actorID": "nm0001832",
            "films": 14,
            "rating": 6.942857142857142,
            "views": 191316643
          },
          {
            "actor": "Jenny Wright",
            "actorID": "nm0942486",
            "films": 11,
            "rating": 6.4818181818181815,
            "views": 189848492
          },
          {
            "actor": "Shah Rukh Khan",
            "actorID": "nm0451321",
            "films": 11,
            "rating": 7.3090909090909095,
            "views": 189155395
          },
          {
            "actor": "Ray Walston",
            "actorID": "nm0001827",
            "films": 12,
            "rating": 6.099999999999999,
            "views": 186328541
          },
          {
            "actor": "Corbin Bernsen",
            "actorID": "nm0000929",
            "films": 14,
            "rating": 6.057142857142857,
            "views": 185431817
          },
          {
            "actor": "Larry Fessenden",
            "actorID": "nm0275244",
            "films": 14,
            "rating": 6.3428571428571425,
            "views": 183216188
          },
          {
            "actor": "Meg Tilly",
            "actorID": "nm0000672",
            "films": 13,
            "rating": 6.33076923076923,
            "views": 178012812
          },
          {
            "actor": "Lesley Ann Warren",
            "actorID": "nm0000690",
            "films": 16,
            "rating": 6.174999999999999,
            "views": 176621587
          },
          {
            "actor": "Peter Weller",
            "actorID": "nm0000693",
            "films": 13,
            "rating": 6.292307692307693,
            "views": 176150910
          },
          {
            "actor": "Natasha Gregson Wagner",
            "actorID": "nm0906031",
            "films": 10,
            "rating": 6.180000000000001,
            "views": 175586795
          },
          {
            "actor": "Alia Shawkat",
            "actorID": "nm0790057",
            "films": 10,
            "rating": 6.470000000000001,
            "views": 171131327
          },
          {
            "actor": "Tim Daly",
            "actorID": "nm0004857",
            "films": 11,
            "rating": 6.127272727272726,
            "views": 166019407
          },
          {
            "actor": "Esai Morales",
            "actorID": "nm0005246",
            "films": 10,
            "rating": 6.2299999999999995,
            "views": 164476792
          },
          {
            "actor": "George Kennedy",
            "actorID": "nm0001421",
            "films": 11,
            "rating": 5.690909090909091,
            "views": 163310197
          },
          {
            "actor": "Jeffrey Combs",
            "actorID": "nm0001062",
            "films": 11,
            "rating": 5.8999999999999995,
            "views": 162717655
          },
          {
            "actor": "Jack Nance",
            "actorID": "nm0620756",
            "films": 12,
            "rating": 6.725000000000001,
            "views": 160774279
          },
          {
            "actor": "David Cronenberg",
            "actorID": "nm0000343",
            "films": 11,
            "rating": 6.3999999999999995,
            "views": 160225347
          },
          {
            "actor": "Erin Darke",
            "actorID": "nm3520615",
            "films": 10,
            "rating": 6.75,
            "views": 159610087
          },
          {
            "actor": "Dirk Blocker",
            "actorID": "nm0088781",
            "films": 10,
            "rating": 6.470000000000001,
            "views": 158786860
          },
          {
            "actor": "Sally Kellerman",
            "actorID": "nm0001419",
            "films": 10,
            "rating": 5.720000000000001,
            "views": 158635399
          },
          {
            "actor": "Isabelle Huppert",
            "actorID": "nm0001376",
            "films": 11,
            "rating": 6.781818181818182,
            "views": 155406863
          },
          {
            "actor": "Linnea Quigley",
            "actorID": "nm0001643",
            "films": 12,
            "rating": 6.0249999999999995,
            "views": 151015011
          },
          {
            "actor": "Joe Spinell",
            "actorID": "nm0818874",
            "films": 10,
            "rating": 6.1,
            "views": 150801622
          },
          {
            "actor": "Nicholas Campbell",
            "actorID": "nm0132757",
            "films": 10,
            "rating": 6.290000000000001,
            "views": 150042614
          },
          {
            "actor": "Marilu Henner",
            "actorID": "nm0000447",
            "films": 11,
            "rating": 6.145454545454545,
            "views": 143996380
          },
          {
            "actor": "Joanne Whalley",
            "actorID": "nm0000695",
            "films": 12,
            "rating": 6.391666666666666,
            "views": 142731592
          },
          {
            "actor": "Meg Foster",
            "actorID": "nm0001236",
            "films": 13,
            "rating": 5.8538461538461535,
            "views": 141733754
          },
          {
            "actor": "Michael Dudikoff",
            "actorID": "nm0001154",
            "films": 11,
            "rating": 5.499999999999999,
            "views": 141130313
          },
          {
            "actor": "Craig Sheffer",
            "actorID": "nm0001729",
            "films": 11,
            "rating": 6.427272727272728,
            "views": 132640031
          },
          {
            "actor": "Piper Laurie",
            "actorID": "nm0001453",
            "films": 11,
            "rating": 6.390909090909091,
            "views": 132251380
          },
          {
            "actor": "William Russ",
            "actorID": "nm0750916",
            "films": 12,
            "rating": 6.458333333333333,
            "views": 130716250
          },
          {
            "actor": "Lou Taylor Pucci",
            "actorID": "nm1086384",
            "films": 10,
            "rating": 6.33,
            "views": 121944841
          },
          {
            "actor": "Frederic Forrest",
            "actorID": "nm0002078",
            "films": 10,
            "rating": 6.470000000000001,
            "views": 115877382
          },
          {
            "actor": "Ryan O'Neal",
            "actorID": "nm0641939",
            "films": 10,
            "rating": 5.39,
            "views": 114045506
          },
          {
            "actor": "Debbie Harry",
            "actorID": "nm0001323",
            "films": 12,
            "rating": 6.425,
            "views": 110944894
          },
          {
            "actor": "Molly Parker",
            "actorID": "nm0662504",
            "films": 10,
            "rating": 6.27,
            "views": 102605964
          },
          {
            "actor": "Nastassja Kinski",
            "actorID": "nm0000176",
            "films": 15,
            "rating": 6.333333333333332,
            "views": 94633275
          },
          {
            "actor": "Charles Bronson",
            "actorID": "nm0000314",
            "films": 10,
            "rating": 5.879999999999999,
            "views": 82080881
          },
          {
            "actor": "Mariel Hemingway",
            "actorID": "nm0000446",
            "films": 11,
            "rating": 6.090909090909093,
            "views": 81947003
          },
          {
            "actor": "Sherilyn Fenn",
            "actorID": "nm0000145",
            "films": 10,
            "rating": 6.090000000000001,
            "views": 81077334
          },
          {
            "actor": "Alberta Watson",
            "actorID": "nm0914491",
            "films": 10,
            "rating": 6.33,
            "views": 75629572
          },
          {
            "actor": "Louise Lasser",
            "actorID": "nm0489837",
            "films": 11,
            "rating": 6.354545454545455,
            "views": 72674442
          },
          {
            "actor": "Jacqueline Bisset",
            "actorID": "nm0000302",
            "films": 10,
            "rating": 5.71,
            "views": 72646205
          },
          {
            "actor": "Alison Steadman",
            "actorID": "nm0824102",
            "films": 10,
            "rating": 6.860000000000001,
            "views": 44382104
          }
        ]
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
        console.log(actors_list)
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

    initNums(actors_list)

    drawNetwork();

}

drawChart();
