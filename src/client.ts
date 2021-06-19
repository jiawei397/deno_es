import { assert, urlParse } from "../deps.ts";
import { Ajax, ajax, Method } from "./utils/ajax.ts";
import { generateId } from "./utils/tools.ts";

const DENO_DRIVER_VERSION = "0.0.1";

const type = "_doc";

export class Client {
  // cache db
  #dbCache = new Map();

  #connectionCache = new Map();

  db: string | undefined;

  private conn: Deno.Conn | undefined;

  public connectedCount = 0;

  connectDB(db: string) {
    this.db = db;
    Ajax.defaults.baseURL = db;
    const options = urlParse(db);
    return Deno.connect({
      hostname: options.hostname,
      port: Number(options.port),
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
      return promise.then((conn) => {
        this.conn = conn;
      });
    } catch (e) {
      throw new Error(`Connection failed: ${e.message || e}`);
    }
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
    return ajax({
      url: path,
      method,
      data,
    });
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
}
