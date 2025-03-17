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
  }

  buildTree(arr, start, end) {
    if (this.status === false) {
      let set = [...new Set(arr)];
      arr = [...set];
      console.log(arr);
      arr = this.mergeSort(arr);
      console.log(arr);
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

  insert(x) {
    let root = this.root;
    const temp = new Node(x);

    // If tree is empty
    if (root === null) {
      return temp;
    }

    // Find the node who is going to have
    // the new node temp as its child
    let parent = null;
    let curr = root;
    while (curr !== null) {
      parent = curr;
      if (curr.data > x) curr = curr.left;
      else if (curr.data < x) curr = curr.right;
      else return this.root; // Key already exists
    }

    // If x is smaller, make it left
    // child, else right child
    if (parent.data > x) parent.left = temp;
    else parent.right = temp;

    return this.root;
  }

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
    console.log(parent);
    let parentLeft = false;
    let parentRight = false;

    if(parent.left!=null) {
      if (parent.left.data === x) {
        parentLeft = true;
      } 
    }
    if(parent.right!=null) {
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
      curr = curr.right;
      while (curr.left != null) {
        parent = curr;
        curr = curr.left;
      }
      //childFirstRight = curr.right;
    }
    if (parentLeft) {
      parent.left = curr;
    } else {
      parent.right = curr;
    }
    console.log(curr);
  }
}

let exerciseArry = [1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324];

//let testEasy = [1, 7, 4, 23, 23, 8, 8];

const testClass = new Tree(exerciseArry, 0, exerciseArry.length - 1);
testClass.prettyPrint(testClass.root);
//const testEasyClass = new Tree(testEasy, 0, testEasy.length - 1);
testClass.insert(30);
testClass.prettyPrint(testClass.root);
testClass.insert(2);
testClass.prettyPrint(testClass.root);
testClass.delete(67);
testClass.prettyPrint(testClass.root);
