class MSTGraph extends Graph {
  constructor() {
      super();
  }

  primMST() {
      const key = new Array(this.adjMatrix.length).fill(Infinity);
      const parent = new Array(this.adjMatrix.length).fill(null);
      const mstSet = new Array(this.adjMatrix.length).fill(false);

      key[0] = 0;
      parent[0] = -1;

      for (let count = 0; count < this.adjMatrix.length - 1; count++) {
          let u = this.minKey(key, mstSet);

          mstSet[u] = true;

          for (let v = 0; v < this.adjMatrix.length; v++) {
              if (this.adjMatrix[u][v] && !mstSet[v] && this.adjMatrix[u][v] < key[v]) {
                  parent[v] = u;
                  key[v] = this.adjMatrix[u][v];
              }
          }
      }

      this.printMST(parent);
  }

  minKey(key, mstSet) {
      let min = Infinity, minIndex = -1;

      for (let v = 0; v < key.length; v++) {
          if (mstSet[v] === false && key[v] < min) {
              min = key[v];
              minIndex = v;
          }
      }

      return minIndex;
  }

  printMST(parent) {
      console.log("Edge \tWeight");
      for (let i = 1; i < this.adjMatrix.length; i++) {
          console.log(parent[i] + " - " + i + "\t" + this.adjMatrix[i][parent[i]]);
      }
  }
}

// Export the MSTGraph class for use in other scripts
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = MSTGraph;
} else {
  window.MSTGraph = MSTGraph;
}

// Usage example
document.addEventListener("DOMContentLoaded", () => {
  const mstGraph = new MSTGraph();
  mstGraph.addVertex();
  mstGraph.addVertex();
  mstGraph.addVertex();
  mstGraph.addEdge(0, 1, 2);
  mstGraph.addEdge(1, 2, 3);
  mstGraph.addEdge(0, 2, 1);
  mstGraph.printGraph();

  mstGraph.primMST();

  mstGraph.visualize();
});
