class BinaryTreeNode {
  constructor(value) {
      this.value = value;
      this.left = null;
      this.right = null;
  }
}

function insertBinaryTreeNode(node, value) {
  if (node === null) {
      return new BinaryTreeNode(value);
  }
  if (value < node.value) {
      node.left = insertBinaryTreeNode(node.left, value);
  } else {
      node.right = insertBinaryTreeNode(node.right, value);
  }
  return node;
}

let binaryTreeRoot = null;
for (let i = 0; i < 18; i++) {
  binaryTreeRoot = insertBinaryTreeNode(binaryTreeRoot, Math.floor(Math.random() * 161));
}

function visualizeBinaryTree() {
  var container = document.getElementById('binaryTree');
  var nodes = [];
  var edges = [];
  var id = 1;

  function traverse(node, idx) {
      if (!node) return;
      nodes.push({id: idx, label: String(node.value), shape: 'circle'});

      if (node.left) {
          edges.push({from: idx, to: idx * 2});
          traverse(node.left, idx * 2);
      }
      if (node.right) {
          edges.push({from: idx, to: idx * 2 + 1});
          traverse(node.right, idx * 2 + 1);
      }
  }

  traverse(binaryTreeRoot, id);
  var data = {
      nodes: new vis.DataSet(nodes),
      edges: new vis.DataSet(edges)
  };

  var options = {};
  new vis.Network(container, data, options);
}

function binaryTreeSearchClosest(node, target) {
  let closest = { node: null, distance: Infinity };
  while (node) {
      let distance = Math.abs(node.value - target);
      if (distance < closest.distance) {
          closest = { node: node, distance: distance };
      }

      if (target < node.value) {
          node = node.left;
      } else if (target > node.value) {
          node = node.right;
      } else {
          break;
      }
  }
  return closest.node ? closest.node.value : 'Не найдено';
}

visualizeBinaryTree();
