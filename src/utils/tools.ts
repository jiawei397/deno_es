import { v4 } from "../../deps.ts";

export function generateId() {
  return v4.generate();
}

class EventEmiter {
  private map = new Map();
  on(name: string, func: (...args: any[]) => Promise<any>) {
    this.map.set(name, func);
    return this;
  }

  un(name: string) {
    this.map.delete(name);
    return this;
  }

  trigger(name: string, ...args: any[]) {
    if (this.map.has(name)) {
      this.map.get(name)(...args);
    }
    return this;
  }
}

export const eventEmiter = new EventEmiter();
