class DFSGraph extends Graph {
  constructor() {
      super();
  }

  dfs(startVertex) {
      const visited = new Set();
      const stack = [startVertex];
      const result = [];

      while (stack.length > 0) {
          const vertex = stack.pop();

          if (!visited.has(vertex)) {
              visited.add(vertex);
              result.push(vertex);

              this.adjList[vertex].forEach(neighbor => {
                  if (!visited.has(neighbor.vertex)) {
                      stack.push(neighbor.vertex);
                  }
              });
          }
      }

      return result;
  }
}

// Export the DFSGraph class for use in other scripts
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = DFSGraph;
} else {
  window.DFSGraph = DFSGraph;
}

// Usage example
document.addEventListener("DOMContentLoaded", () => {
  const dfsGraph = new DFSGraph();
  dfsGraph.addVertex();
  dfsGraph.addVertex();
  dfsGraph.addVertex();
  dfsGraph.addEdge(0, 1, 2);
  dfsGraph.addEdge(1, 2, 3);
  dfsGraph.printGraph();

  const dfsResult = dfsGraph.dfs(0);
  console.log("DFS Result:", dfsResult);

  dfsGraph.visualize();
});
