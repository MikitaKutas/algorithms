class BPlusTreeNode {
  constructor(isLeaf = false) {
      this.keys = [];
      this.children = [];
      this.isLeaf = isLeaf;
      this.parent = null;
  }
}

class BPlusTree {
  constructor(m) {
      this.m = m;
      this.root = new BPlusTreeNode(true); // Изначально корень - лист
  }

  // Методы для вставки, поиска, и визуализации будут здесь
  insert(key) {
      let root = this.root;
      if (root.keys.length === this.m - 1) {
          let newRoot = new BPlusTreeNode();
          this.root = newRoot;
          newRoot.children.push(root);
          root.parent = newRoot;
          this.splitChild(newRoot, 0);
          this.insertNonFull(this.root, key);
      } else {
          this.insertNonFull(root, key);
      }
  }

  insertNonFull(node, key) {
      let i = node.keys.length - 1;
      if (node.isLeaf) {
          node.keys.splice(this.findLocation(node.keys, key), 0, key);
      } else {
          while (i >= 0 && node.keys[i] > key) {
              i--;
          }
          i++;
          let child = node.children[i];
          if (child.keys.length === this.m - 1) {
              this.splitChild(node, i);
              if (key > node.keys[i]) {
                  i++;
              }
          }
          this.insertNonFull(node.children[i], key);
      }
  }

  splitChild(parent, index) {
      let child = parent.children[index];
      let newChild = new BPlusTreeNode(child.isLeaf);
      newChild.parent = parent;

      let median = Math.floor((this.m - 1) / 2);
      newChild.keys = child.keys.splice(median + 1);
      if (!child.isLeaf) {
          newChild.children = child.children.splice(median + 1);
      }

      parent.keys.splice(index, 0, child.keys.pop());
      parent.children.splice(index + 1, 0, newChild);
  }

  findLocation(keys, key) {
      let low = 0, high = keys.length - 1, mid;
      while (low <= high) {
          mid = Math.floor((low + high) / 2);
          if (keys[mid] === key) return mid;
          else if (keys[mid] < key) low = mid + 1;
          else high = mid - 1;
      }
      return low;
  }

  // Функция поиска по ключу здесь
  // Визуализация
}

// Инициализация и заполнение дерева
let bPlusTree = new BPlusTree(5);
for (let i = 0; i < 18; i++) {
  bPlusTree.insert(Math.floor(Math.random() * 161));
}

// Визуализация B+ дерева
function visualizeBPlusTree() {
  var container = document.getElementById('bplusTree');
  var nodes = [];
  var edges = [];
  var id = 1;

  function traverse(node, idx, parentId) {
      if (!node) return;
      var nodeId = idx;

      if (node.isLeaf) {
          node.keys.forEach(key => {
              nodes.push({ id: id++, label: String(key), shape: 'box', color: "#D2E5FF" });
              if (parentId !== undefined) {
                  edges.push({ from: parentId, to: id - 1 });
              }
          });
      } else {
          nodes.push({ id: nodeId, label: node.keys.join(","), shape: 'box', color: "#FFC107" });
          if (parentId !== undefined) {
              edges.push({ from: parentId, to: nodeId });
          }
          node.children.forEach((child, index) => {
              traverse(child, ++id, nodeId);
          });
      }
  }

  traverse(bPlusTree.root, id);
  var data = {
      nodes: new vis.DataSet(nodes),
      edges: new vis.DataSet(edges)
  };

  var options = {};
  new vis.Network(container, data, options);
}

visualizeBPlusTree();


function bPlusTreeSearchClosest(node, target) {
  while (!node.isLeaf) {
      let found = false;
      for (let i = 0; i < node.keys.length; i++) {
          if (target < node.keys[i]) {
              node = node.children[i];
              found = true;
              break;
          }
      }
      if (!found) {
          node = node.children[node.children.length - 1];
      }
  }
  // В листе ищем ближайший ключ
  let closestKey = node.keys[0];
  let minDistance = Math.abs(closestKey - target);
  node.keys.forEach(key => {
      let distance = Math.abs(key - target);
      if (distance < minDistance) {
          closestKey = key;
          minDistance = distance;
      }
  });
  return closestKey;
}


