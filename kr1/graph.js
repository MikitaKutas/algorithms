class Graph {
  constructor() {
      this.adjList = {};
  }

  addEdge(v1, v2, weight) {
      if (!this.adjList[v1]) this.adjList[v1] = [];
      if (!this.adjList[v2]) this.adjList[v2] = [];
      this.adjList[v1].push({ vertex: v2, weight });
      this.adjList[v2].push({ vertex: v1, weight });
  }

  dijkstra(start) {
      const distances = {};
      const visited = new Set();
      const priorityQueue = new MinPriorityQueue();

      for (const vertex in this.adjList) {
          distances[vertex] = Infinity;
      }
      distances[start] = 0;
      priorityQueue.insert(start, 0);

      while (!priorityQueue.isEmpty()) {
          const { value: vertex } = priorityQueue.extractMin();
          visited.add(vertex);

          for (const neighbor of this.adjList[vertex]) {
              if (!visited.has(neighbor.vertex)) {
                  const newDist = distances[vertex] + neighbor.weight;
                  if (newDist < distances[neighbor.vertex]) {
                      distances[neighbor.vertex] = newDist;
                      priorityQueue.insert(neighbor.vertex, newDist);
                  }
              }
          }
      }

      return distances;
  }

  visualize() {
      const nodes = Object.keys(this.adjList).map(d => ({ id: parseInt(d) }));
      const links = [];
      for (const node in this.adjList) {
          for (const neighbor of this.adjList[node]) {
              if (parseInt(node) < neighbor.vertex) {
                  links.push({ source: parseInt(node), target: neighbor.vertex, weight: neighbor.weight });
              }
          }
      }

      const width = 800, height = 600;

      const svg = d3.select("#graph").append("svg")
          .attr("width", width)
          .attr("height", height);

      const simulation = d3.forceSimulation(nodes)
          .force("link", d3.forceLink(links).id(d => d.id).distance(d => d.weight * 10))
          .force("charge", d3.forceManyBody().strength(-300))
          .force("center", d3.forceCenter(width / 2, height / 2));

      const link = svg.append("g")
          .attr("class", "links")
          .selectAll("line")
          .data(links)
          .enter().append("line")
          .attr("class", "link")
          .attr("stroke-width", d => Math.sqrt(d.weight));

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
              .attr("cx", d => d.x)
              .attr("cy", d => d.y);
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

class MinPriorityQueue {
  constructor() {
      this.values = [];
  }

  insert(value, priority) {
      this.values.push({ value, priority });
      this.sort();
  }

  extractMin() {
      return this.values.shift();
  }

  isEmpty() {
      return this.values.length === 0;
  }

  sort() {
      this.values.sort((a, b) => a.priority - b.priority);
  }
}

// Usage example
document.addEventListener("DOMContentLoaded", () => {
  const graph = new Graph();

  // Adding edges based on provided data
  graph.addEdge(1, 2, 10);
  graph.addEdge(1, 3, 4);
  graph.addEdge(1, 4, 8);
  graph.addEdge(2, 3, 8);
  graph.addEdge(2, 5, 6);
  graph.addEdge(3, 4, 4);
  graph.addEdge(3, 5, 7);
  graph.addEdge(4, 7, 7);
  graph.addEdge(4, 6, 10);
  graph.addEdge(4, 8, 7);
  graph.addEdge(8, 6, 7);
  graph.addEdge(8, 10, 6);
  graph.addEdge(10, 6, 11);
  graph.addEdge(6, 9, 4);
  graph.addEdge(10, 9, 12);
  graph.addEdge(6, 11, 5);
  graph.addEdge(5, 4, 8);
  graph.addEdge(4, 11, 13);
  graph.addEdge(9, 11, 5);

  console.log("Shortest distances from node 1:", graph.dijkstra(1));

  graph.visualize();
});
