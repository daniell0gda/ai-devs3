import type {PageLink} from './model.ts';

export function* fifoQueue(): Generator<string | undefined> {
  const queue: string[] = [];


  while (true) {
    const command = yield;
    if (command && command.action === 'add') {

      console.log(
        'adding ',
        command.value
      );
      if (!queue.some(value => value != command.value)) {
        queue.push(command.value);
      }

    } else if (command && command.action === 'dequeue') {
      let shifted = queue.shift();
      yield shifted; // Remove and return the first element
    } else if (command && command.action === 'peek') {
      yield queue[0]; // Return the first element without removing it
    } else if (command && command.action === 'clear') {
      queue.length = 0; // Clear the queue
    } else if (command && command.action === 'all') {
      yield queue.join('\n')
    }
  }
}


export class Queue {
  private items: PageLink[] = [];
  private alreadyUsed: PageLink[] = [];

  add(item: PageLink): void {

    if (!this.items.some(value => value.url == item.url)) {
      this.items.push(item);
    }
  }

  dequeue(): PageLink | undefined {

    console.log('in queue', this.items.length)
    let toBeReturned: PageLink | undefined = undefined;
    do {
      let item = this.items.shift(); // Removes and returns the first element

      if (item && this.alreadyUsed.some(usedLink => usedLink.url == item.url)) {
        continue;
      }

      if (item) {
        this.alreadyUsed.push(item);
        toBeReturned = item;
      }

      break;

    }
    while (this.items.length > 0)

    return toBeReturned;
  }

  peek(): PageLink | undefined {
    return this.items[0]; // Returns the first element without removing it
  }

  size(): number {
    return this.items.length; // Returns the number of elements in the queue
  }

  isEmpty(): boolean {
    return this.items.length === 0; // Checks if the queue is empty
  }
}
