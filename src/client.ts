import { assert, urlParse } from "../deps.ts";
import { StatInfo } from "./types.ts";
import { Ajax, ajax, Method } from "./utils/ajax.ts";
import { eventEmiter, generateId } from "./utils/tools.ts";

const DENO_DRIVER_VERSION = "0.0.1";

const type = "_doc";

interface Task {
  id: number;
  func: () => Promise<any>;
}

export class Client {
  // cache db
  #dbCache = new Map();

  #connectionCache = new Map();

  db: string | undefined;

  private conn: Deno.Conn | undefined;

  tasks: Task[] = [];

  connectedCount = 0;

  requestId = 0;
  currentTaskCount = 0;

  private connectDB(db: string) {
    this.db = db;
    Ajax.defaults.baseURL = db;
    const options = urlParse(db);
    return Deno.connect({
      hostname: options.hostname,
      port: Number(options.port),
    }).then((conn) => {
      this.conn = conn;
    });
  }

  connect(
    cacheKey: string,
  ): Promise<any> {
    try {
      if (this.#connectionCache.has(cacheKey)) {
        return this.#connectionCache.get(cacheKey);
      }
      const promise = this.connectDB(cacheKey);
      this.connectedCount++;
      this.#connectionCache.set(cacheKey, promise);
      return promise;
    } catch (e) {
      throw new Error(`Connection failed: ${e.message || e}`);
    }
  }

  close() {
    if (this.conn) {
      this.conn.close();
    }
    this.#dbCache.clear();
    this.#connectionCache.clear();
    this.connectedCount = 0;
  }

  get version() {
    return DENO_DRIVER_VERSION;
  }

  count(options: {
    method?: Method;
    data?: string;
    index: string;
  }) {
    assert(this.conn);
    let path = "";

    let { index, data, method } = options;

    if (index != null) {
      if (method == null) method = data == null ? "GET" : "POST";
      path = "/" + encodeURIComponent(index) + "/" + "_count";
    } else {
      if (method == null) method = data == null ? "GET" : "POST";
      path = "/" + "_count";
    } // build request object
    return this.command(() => {
      return ajax({
        url: path,
        method: method!,
        data,
        cacheTimeout: 0,
        // keepalive: false,
      });
    });
  }

  command(func: any) {
    this.tasks.push({
      id: ++this.requestId,
      func,
    });

    const id = this.requestId;
    // console.log(this.requestId);
    return new Promise((resolve) => {
      eventEmiter.on("task" + id, (res) => {
        // console.log(res + id);
        resolve(res);
        return res;
      });
      this.runTask();
    });
  }

  runTask() {
    while (this.currentTaskCount < 10) {
      const task = this.tasks.shift();
      if (!task) {
        break;
      }
      const id = task.id;
      this.currentTaskCount++;
      Promise.resolve(task.func()).then((res) => {
        eventEmiter.trigger("task" + id, res);
        this.currentTaskCount--;
        this.runTask();
      });
    }
  }

  create(params: {
    method?: Method;
    data: any;
    id: string | number;
    index: string;
  }) {
    let {
      method = "PUT",
      data,
      id,
      index,
    } = params;
    if (!id) {
      id = generateId();
    }
    const path = "/" + encodeURIComponent(index) + "/" +
      encodeURIComponent(type) +
      "/" + encodeURIComponent(id) + "/" + "_create";
    return ajax({
      url: path,
      method,
      data,
    });
  }

  update(params: {
    index: string;
    id: string | number;
    data: any;
    isOriginData?: boolean;
  }) {
    const {
      data,
      id,
      index,
      isOriginData,
    } = params;
    const path = "/" + encodeURIComponent(index) + "/" +
      encodeURIComponent(type) +
      "/" + encodeURIComponent(id) + "/" + "_update";
    return ajax({
      url: path,
      method: "POST",
      data: isOriginData ? data : {
        doc: data,
      },
    });
  }

  delete(params: {
    index: string;
    id: string | number;
  }) {
    const {
      id,
      index,
    } = params;
    const path = "/" + encodeURIComponent(index) + "/" +
      encodeURIComponent(type) +
      "/" + encodeURIComponent(id);
    return ajax({
      url: path,
      method: "DELETE",
    });
  }

  deleteByQuery(params: {
    index: string;
    data: any;
  }) {
    const {
      index,
      data,
    } = params;
    const path = "/" + encodeURIComponent(index) + "/" + "_delete_by_query";
    return ajax({
      url: path,
      method: "POST",
      data,
    });
  }

  deleteByIndex(index: string) {
    const path = "/" + encodeURIComponent(index);
    return ajax({
      url: path,
      method: "delete",
    });
  }

  reindex(params: {
    oldIndex: string | number;
    newIndex: string | number;
  }) {
    const {
      oldIndex,
      newIndex,
    } = params;
    const path = "/" + "_reindex";
    return ajax({
      url: path,
      method: "POST",
      data: {
        source: {
          index: oldIndex,
        },
        dest: {
          index: newIndex,
        },
      },
    });
  }

  indicesStats(params: {
    index?: string;
    method?: Method;
    metric?: string;
  }) {
    const { index, method = "get", metric } = params;
    let path = "";

    if (index != null && metric != null) {
      path = "/" + encodeURIComponent(index) + "/" + "_stats" + "/" +
        encodeURIComponent(metric);
    } else if (metric != null) {
      path = "/" + "_stats" + "/" + encodeURIComponent(metric);
    } else if (index != null) {
      path = "/" + encodeURIComponent(index) + "/" + "_stats";
    } else {
      path = "/" + "_stats";
    } // build request object
    return ajax<StatInfo>({
      url: path,
      method,
    });
  }

  async getAllIndices(): Promise<string[]> {
    const result = await this.indicesStats({});
    return Object.keys(result.indices);
  }
}
