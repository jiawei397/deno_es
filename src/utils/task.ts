// deno-lint-ignore-file no-explicit-any
type TaskCallback = (arg: any) => any;
type TaskFunc = () => Promise<any>;

interface Task {
  func: TaskFunc;

  success: TaskCallback;
  error: TaskCallback;
}

const tasks: Task[] = [];

let currentTaskCount = 0;

export function limit<T>(func: TaskFunc, maxTaskCount: number): Promise<T> {
  return new Promise((resolve, reject) => {
    tasks.push({
      func,
      success: resolve,
      error: reject,
    });
    runTask(maxTaskCount);
  });
}

function runTask(maxTaskCount: number) {
  while (currentTaskCount < maxTaskCount) {
    const task = tasks.shift();
    if (!task) {
      break;
    }
    currentTaskCount++;
    Promise.resolve(task.func()).then((res) => {
      task.success(res);
    }, (err) => {
      task.error(err);
    }).finally(() => {
      currentTaskCount--;
      runTask(maxTaskCount);
    });
  }
}
