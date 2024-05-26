class Graph {
  constructor() {
      this.adjMatrix = [];
      this.incMatrix = [];
      this.adjList = {};
      this.edgeList = [];
  }

  addVertex() {
      let newVertex = this.adjMatrix.length;
      this.adjMatrix.push(new Array(newVertex + 1).fill(0));
      for (let i = 0; i < this.adjMatrix.length - 1; i++) {
          this.adjMatrix[i].push(0);
      }

      this.adjList[newVertex] = [];

      // Update incidence matrix
      this.incMatrix.push(new Array(this.edgeList.length).fill(0));
  }

  removeVertex(vertex) {
      if (vertex < 0 || vertex >= this.adjMatrix.length) return;

      this.adjMatrix.splice(vertex, 1);
      this.adjMatrix.forEach(row => row.splice(vertex, 1));

      delete this.adjList[vertex];

      this.edgeList = this.edgeList.filter(edge => edge[0] !== vertex && edge[1] !== vertex);

      this.incMatrix.splice(vertex, 1);
      this.incMatrix.forEach(row => row.splice(vertex, 1));
  }

  addEdge(v1, v2, weight = 1) {
      if (v1 < 0 || v2 < 0 || v1 >= this.adjMatrix.length || v2 >= this.adjMatrix.length) return;

      this.adjMatrix[v1][v2] = weight;
      this.adjMatrix[v2][v1] = weight;

      this.adjList[v1].push({ vertex: v2, weight });
      this.adjList[v2].push({ vertex: v1, weight });

      this.edgeList.push([v1, v2, weight]);

      this.incMatrix.forEach(row => row.push(0));
      this.incMatrix[v1][this.edgeList.length - 1] = 1;
      this.incMatrix[v2][this.edgeList.length - 1] = 1;
  }

  removeEdge(v1, v2) {
      if (v1 < 0 || v2 < 0 || v1 >= this.adjMatrix.length || v2 >= this.adjMatrix.length) return;

      this.adjMatrix[v1][v2] = 0;
      this.adjMatrix[v2][v1] = 0;

      this.adjList[v1] = this.adjList[v1].filter(v => v.vertex !== v2);
      this.adjList[v2] = this.adjList[v2].filter(v => v.vertex !== v1);

      this.edgeList = this.edgeList.filter(edge => !(edge[0] === v1 && edge[1] === v2));

      this.incMatrix.forEach(row => row.splice(this.edgeList.findIndex(edge => edge[0] === v1 && edge[1] === v2), 1));
  }

  printGraph() {
      console.log("Adjacency Matrix:");
      console.table(this.adjMatrix);

      console.log("Incidence Matrix:");
      console.table(this.incMatrix);

      console.log("Adjacency List:");
      console.log(this.adjList);

      console.log("Edge List:");
      console.log(this.edgeList);
  }

  visualize() {
      const nodes = Object.keys(this.adjList).map(d => ({ id: parseInt(d) }));
      const links = this.edgeList.map(d => ({ source: d[0], target: d[1] }));

      const width = 800, height = 600;

      const svg = d3.select("#graph").append("svg")
          .attr("width", width)
          .attr("height", height);

      const simulation = d3.forceSimulation(nodes)
          .force("link", d3.forceLink(links).id(d => d.id))
          .force("charge", d3.forceManyBody().strength(-300))
          .force("center", d3.forceCenter(width / 2, height / 2));

      const link = svg.append("g")
          .attr("class", "links")
          .selectAll("line")
          .data(links)
          .enter().append("line")
          .attr("class", "link");

      const node = svg.append("g")
          .attr("class", "nodes")
          .selectAll("circle")
          .data(nodes)
          .enter().append("circle")
          .attr("class", "node")
          .attr("r", 5)
          .call(drag(simulation));

      node.append("title")
          .text(d => d.id);

      simulation.on("tick", () => {
          link
              .attr("x1", d => d.source.x)
              .attr("y1", d => d.source.y)
              .attr("x2", d => d.target.x)
              .attr("y2", d => d.target.y);

          node
              .attr("cx", d => d.cx = Math.max(10, Math.min(width - 10, d.x)))
              .attr("cy", d => d.cy = Math.max(10, Math.min(height - 10, d.y)));
      });

      function drag(simulation) {
          function dragstarted(event, d) {
              if (!event.active) simulation.alphaTarget(0.3).restart();
              d.fx = d.x;
              d.fy = d.y;
          }

          function dragged(event, d) {
              d.fx = event.x;
              d.fy = event.y;
          }

          function dragended(event, d) {
              if (!event.active) simulation.alphaTarget(0);
              d.fx = null;
              d.fy = null;
          }

          return d3.drag()
              .on("start", dragstarted)
              .on("drag", dragged)
              .on("end", dragended);
      }
  }
}

// Export the Graph class for use in other scripts
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = Graph;
} else {
  window.Graph = Graph;
}
