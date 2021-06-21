// 限流

type TaskCallback = (arg: any) => any;
type TaskFunc = () => Promise<any>;

interface Task {
  func: TaskFunc;

  success: TaskCallback;
  error: TaskCallback;
}

const tasks: Task[] = [];

let currentTaskCount = 0;

const maxTaskCount = 100; // 允许最大请求的fetch数量

export function limit<T>(func: TaskFunc): Promise<T> {
  return new Promise((resolve, reject) => {
    tasks.push({
      func,
      success: resolve,
      error: reject,
    });
    runTask();
  });
}

function runTask() {
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
      runTask();
    });
  }
}
