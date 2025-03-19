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
    while (curr.data != x || curr.left != null || curr.right != null) {
      if (curr.data > x) {
        curr = curr.left;
      } else {
        curr = curr.right;
      }
    }

    if (curr.data === x) {
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

    let array = [];
     function preOrder(queue) {

      console.log(queue);

      if (queue.length === 0) {
        return;
      }
      console.log(queue);
      let currentNode = queue;
     
      callback(currentNode);
      if(currentNode.left===null && currentNode.right===null) {
        return preOrder(queue);
      }
      if(currentNode.left!=null) {
        currentNode= currentNode.left;
        array.push(currentNode);
        return preOrder(queue);
      }
      if(currentNode.right!=null) {
        currentNode= currentNode.right;
        array.push(currentNode);
        return preOrder(queue);
      }

     }
     preOrder(root);
     console.log(this.evenCount);
  }
}

let exerciseArry = [
  1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 4564, 344, 55, 56, 344356, 54, 22,
  12, 324,
];

//let testEasy = [1, 7, 4, 23, 23, 8, 8];

const testClass = new Tree(exerciseArry, 0, exerciseArry.length - 1);
testClass.prettyPrint(testClass.root);
//const testEasyClass = new Tree(testEasy, 0, testEasy.length - 1);
testClass.insert(30);
testClass.prettyPrint(testClass.root);
testClass.insert(2);
testClass.prettyPrint(testClass.root);
testClass.delete(8);
testClass.prettyPrint(testClass.root);
testClass.find(2);
testClass.levelOrder(testClass.evenNumber.bind(testClass));
testClass.levelOrderIter(testClass.evenNumber.bind(testClass));
//testClass.levelOrderIter();
testClass.preOrder(testClass.evenNumber.bind(testClass));

