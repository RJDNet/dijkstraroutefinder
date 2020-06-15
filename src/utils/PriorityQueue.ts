export default class PriorityQueue {
  private collection: Array<Array<string | number>>;

  constructor() {
    this.collection = [];
  }

  enqueue(element: [string, number]): void {
    if (this.isEmpty()) {
      this.collection.push(element);
    } else {
      let added = false;

      for (let i = 1; i <= this.collection.length; i++) {
        if (element[1] < this.collection[i - 1][1]) {
          this.collection.splice(i - 1, 0, element);
          added = true;
          break;
        }
      }
      if (!added) {
        this.collection.push(element);
      }
    }
  }

  dequeue(): (string | number)[] | undefined {
    let value = this.collection.shift();
    return value;
  }

  isEmpty(): Boolean {
    return (this.collection.length === 0);
  }

}