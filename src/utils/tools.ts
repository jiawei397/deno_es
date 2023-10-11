// deno-lint-ignore-file no-explicit-any
export function generateId() {
  return crypto.randomUUID();
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
