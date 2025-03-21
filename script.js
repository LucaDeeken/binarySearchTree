class Node {
  constructor(data) {
    this.data = data;
    this.left = null;
    this.right = null;
  }
}

class Tree {
  constructor(arr) {
    this.status = false;
    this.root = this.buildTree(arr, 0, arr.length - 1);
    this.evenCount = 0;
    this.leafsArr = [];
    this.treeArr = [];
  }

  //takes inputArray and builds tree
  buildTree(arr, start, end) {
    if (this.status === false) {
      let set = [...new Set(arr)];
      arr = [...set];
      arr = this.mergeSort(arr);
      this.status = true;
      end = arr.length - 1;
    }
    if (start > end) {
      return null;
    }

    let mid = start + Math.floor((end - start) / 2);
    let root = new Node(arr[mid]);
    root.left = this.buildTree(arr, start, mid - 1);
    root.right = this.buildTree(arr, mid + 1, end);

    return root;
  }

  //outputs the tree into the console
  prettyPrint = (node, prefix = "", isLeft = true) => {
    if (node === null) {
      return;
    }
    if (node.right !== null) {
      this.prettyPrint(
        node.right,
        `${prefix}${isLeft ? "│   " : "    "}`,
        false
      );
    }
    console.log(`${prefix}${isLeft ? "└── " : "┌── "}${node.data}`);
    if (node.left !== null) {
      this.prettyPrint(node.left, `${prefix}${isLeft ? "    " : "│   "}`, true);
    }
  };

  //sorts the array
  mergeSort(array) {
    if (array.length <= 1) {
      return array;
    }

    const mid = Math.floor(array.length / 2);
    const left = array.slice(0, mid);
    const right = array.slice(mid);

    const sortedLeft = this.mergeSort(left);
    const sortedRight = this.mergeSort(right);

    return this.merge(sortedLeft, sortedRight);
  }
  merge(left, right) {
    let result = [];
    let i = 0,
      j = 0;

    while (i < left.length && j < right.length) {
      if (left[i] < right[j]) {
        result.push(left[i]);
        i++;
      } else {
        result.push(right[j]);
        j++;
      }
    }

    return result.concat(left.slice(i)).concat(right.slice(j));
  }

  //inserts node with inputValue
  insert(x) {
    let root = this.root;
    const temp = new Node(x);

    if (root === null) {
      return temp;
    }

    let parent = null;
    let curr = root;
    while (curr !== null) {
      parent = curr;
      if (curr.data > x) curr = curr.left;
      else if (curr.data < x) curr = curr.right;
      else return this.root;
    }

    if (parent.data > x) parent.left = temp;
    else parent.right = temp;

    return this.root;
  }

  //deletes node with inputValue
  delete(x) {
    let root = this.root;
    if (root === null) {
      return null;
    }
    let parent = null;
    let curr = root;

    while (curr.data != x) {
      if (curr.right != null || curr.left != null) {
        parent = curr;
      }
      if (curr.data > x) {
        curr = curr.left;
      } else if (curr.data < x) {
        curr = curr.right;
      }
    }
    let parentLeft = false;
    let tempParent = new Node(90);

    if (curr === root) {
      tempParent.left = root;
      parent = tempParent;
      tempParentStatus = true;
    }

    if (parent.left != null) {
      if (parent.left.data === x) {
        parentLeft = true;
      }
    }
    if (parent.right != null) {
      if (parent.right.data === x) {
        parentRight = true;
      }
    }

    if (curr.right === null && curr.left === null) {
      if (parentLeft) {
        parent.left = null;
      } else {
        parent.right = null;
      }
    } else if (
      (curr.right != null && curr.left === null) ||
      (curr.left != null && curr.right === null)
    ) {
      if (curr.right != null) {
        let rightChild = curr.right;
        if (parentLeft) {
          parent.left = rightChild;
        } else {
          parent.right = rightChild;
        }
      } else if (curr.left != null) {
        let leftChild = curr.left;
        if (parentLeft) {
          parent.left = leftChild;
        } else {
          parent.right = leftChild;
        }
      }
    } else {
      let toDelete = curr;
      let toDeleteParent = parent;
      parent = curr;
      curr = curr.right;

      while (curr.left != null) {
        parent = curr;
        curr = curr.left;
      }

      let herausgewühlt = curr;
      let parentHerausgewühlt = parent;

      if (herausgewühlt !== toDelete.right) {
        parentHerausgewühlt.left = herausgewühlt.right;
      }

      herausgewühlt.left = toDelete.left;
      if (herausgewühlt !== toDelete.right) {
        herausgewühlt.right = toDelete.right;
      }

      if (toDelete === this.root) {
        this.root = herausgewühlt;
      } else {
        if (toDeleteParent.left === toDelete) {
          toDeleteParent.left = herausgewühlt;
        } else {
          toDeleteParent.right = herausgewühlt;
        }
      }
    }
  }

  //returns node with inputValue
  find(x) {
    let root = this.root;
    if (root === null) {
      return null;
    }
    let curr = root;
    while (
      curr != null &&
      (curr.left != null || curr.right != null) &&
      curr.data != x
    ) {
      if (curr.data > x) {
        curr = curr.left;
      } else {
        curr = curr.right;
      }
    }

    if (curr === null) {
      return;
    } else if (curr.data === x) {
      return curr;
    } else {
      console.log("value wasn't found!");
      return;
    }
  }

  //traverses through the tree in breadth-first level order and returns the sum of all even numbers (recursiveFunction)
  levelOrder(callback) {
    if (typeof callback != "function") {
      throw new Error("You need to attach a callback-function!");
    }
    let root = this.root;
    this.evenCount = 0;
    if (root === null) {
      return null;
    }

    function queueWork(queue) {
      if (queue.length === 0) {
        return;
      }

      let currentNode = queue.shift();
      callback(currentNode);
      if (currentNode.left != null) {
        let currentNodeLeft = currentNode.left;
        queue.push(currentNodeLeft);
      }
      if (currentNode.right != null) {
        let currentNodeLeft = currentNode.right;
        queue.push(currentNodeLeft);
      }

      return queueWork(queue);
    }

    queueWork([this.root]);
    console.log(this.evenCount);
  }

  //traverses through the tree in breadth-first level order and returns the sum of all even numbers (iterativeFunction)
  levelOrderIter(callback) {
    if (typeof callback != "function") {
      throw new Error("You need to attach a callback-function!");
    }
    let root = this.root;
    this.evenCount = 0;
    if (root === null) {
      return null;
    }
    function queueWorkIter(queue) {
      while (queue.length != 0) {
        let currentNode = queue.shift();
        callback(currentNode);
        if (currentNode.left != null) {
          let currentNodeLeft = currentNode.left;
          queue.push(currentNodeLeft);
        }
        if (currentNode.right != null) {
          let currentNodeLeft = currentNode.right;
          queue.push(currentNodeLeft);
        }
      }
      return;
    }

    queueWorkIter([root]);
    console.log(this.evenCount);

    //outputs even numbers
  }
  evenNumber(node) {
    if (node.data % 2 === 0) {
      this.evenCount++;
    }
  }

  preOrder(callback) {
    if (typeof callback != "function") {
      throw new Error("You need to attach a callback-function!");
    }
    let root = this.root;
    this.evenCount = 0;

    if (root === null) {
      return null;
    }

    function preOrder(queue) {
      if (queue.length === 0) {
        return;
      }

      let currentNode = queue.shift();
      callback(currentNode);
      if (currentNode.left === null && currentNode.right === null) {
        return;
      }
      if (currentNode.left != null) {
        let PapaNode = currentNode;
        currentNode = currentNode.left;
        queue.push(currentNode);
        preOrder(queue);
        currentNode = PapaNode;
      }
      if (currentNode.right != null) {
        currentNode = currentNode.right;
        queue.push(currentNode);
        preOrder(queue);
      }
      return;
    }
    preOrder([root]);
    console.log(this.evenCount);
  }

  postOrder(callback) {
    if (typeof callback !== "function") {
      throw new Error("You need to attach a callback-function!");
    }
    this.evenCount = 0;
    function travelTree(node) {
      if (node === null) {
        return;
      }
      travelTree(node.left);
      travelTree(node.right);
      callback(node);
    }

    travelTree(this.root);
    console.log(this.evenCount);
  }

  inOrder(callback) {
    if (typeof callback !== "function") {
      throw new Error("You need to attach a callback-function!");
    }
    this.evenCount = 0;
    function travelTree(node) {
      if (node === null) {
        return;
      }
      travelTree(node.left);
      callback(node);
      travelTree(node.right);
    }

    travelTree(this.root);
    console.log(this.evenCount);
  }

  depth(x) {
    let root = this.root;
    if (root === null) {
      return null;
    }
    let height = 0;
    let curr = root;
    while (
      curr != null &&
      (curr.left != null || curr.right != null) &&
      curr.data != x
    ) {
      if (curr.data > x) {
        curr = curr.left;
        height++;
      } else {
        curr = curr.right;
        height++;
      }
    }

    if (curr === null) {
      return;
    } else if (curr.data === x) {
      return height;
    } else {
      console.log("value wasn't found!");
      return;
    }
  }

  height(x) {
    let value = this.find(x);
    if (typeof value === "undefined") {
      console.log("value wasn't found!");
      return;
    }

    function getHeight(value) {
      if (value === null) {
        return -1;
      }

      let goingLeft = getHeight(value.left);
      let goingRight = getHeight(value.right);

      return 1 + Math.max(goingLeft, goingRight);
    }
    console.log(getHeight(value));
  }

  getLeafs(node) {
    if (node.left === null && node.right === null) {
      this.leafsArr.push(node);
    }
    return this.leafsArr;
  }

  getTreeArray(node) {
    this.treeArr.push(node.data);

    return this.treeArr;
  }

  isBalanced() {
    let root = this.root;
    this.treeArr = [];

    const travelTree = (node) => {
      if (node === null) {
        return;
      }
      travelTree(node.left);
      travelTree(node.right);
      this.getLeafs(node);
    };
    travelTree(root);

    let balanceArr = [];
    let arrLength = this.leafsArr.length;
    for (let i = 0; i < arrLength; i++) {
      let node = this.leafsArr.shift();
      let x = node.data;
      let depthNum = this.depth(x);
      balanceArr.push(depthNum);
    }
    let firstIndex = balanceArr[0];
    for (let j = 0; j < balanceArr.length; j++) {
      let heightOfEle = balanceArr[j];
      let diff = firstIndex - heightOfEle;
      if (diff > 1 || diff < -1) {
        return false;
      }
    }
    return true;
  }

  rebalance() {
    this.treeArr = [];
    const travelTree = (node) => {
      if (node === null) {
        return;
      }
      travelTree(node.left);
      travelTree(node.right);
      this.getTreeArray(node);
    };
    travelTree(this.root);
    this.status=false;
    this.root = this.buildTree(this.treeArr, 0, this.treeArr.length - 1);
    return;
  }
}

let newArr = [];
function randomArr() {
  let newArr = [];
  for (let i = 0; i < 50; i++) {
    let randomNumber = Math.floor(Math.random() * 100);
    newArr.push(randomNumber);
  }
  return newArr;
}

let newArray = randomArr();

const testClass = new Tree(newArray, 0, newArray.length - 1);
console.log(testClass.isBalanced());
testClass.levelOrder(testClass.evenNumber.bind(testClass));
testClass.levelOrderIter(testClass.evenNumber.bind(testClass));
testClass.preOrder(testClass.evenNumber.bind(testClass));
testClass.postOrder(testClass.evenNumber.bind(testClass));
testClass.inOrder(testClass.evenNumber.bind(testClass));
testClass.prettyPrint(testClass.root);
testClass.insert(11);
testClass.insert(10);
testClass.insert(9);
testClass.insert(8);
testClass.insert(7);
testClass.insert(6);
testClass.insert(5);
testClass.insert(4);
testClass.insert(3);
testClass.insert(2);
testClass.insert(1);
console.log(testClass.isBalanced());
testClass.prettyPrint(testClass.root);
testClass.rebalance();
testClass.prettyPrint(testClass.root);
console.log(testClass.isBalanced());
testClass.prettyPrint(testClass.root);


