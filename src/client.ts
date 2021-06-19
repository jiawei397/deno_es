import { assert, urlParse } from "../deps.ts";
import { Ajax, ajax, Method } from "./utils/ajax.ts";

const DENO_DRIVER_VERSION = "0.0.1";

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
    body?: string;
    index: string;
  }) {
    assert(this.conn);
    let path = "";

    let { index, body, method } = options;

    if (index != null) {
      if (method == null) method = body == null ? "GET" : "POST";
      path = "/" + encodeURIComponent(index) + "/" + "_count";
    } else {
      if (method == null) method = body == null ? "GET" : "POST";
      path = "/" + "_count";
    } // build request object
    return ajax({
      url: path,
      method,
      data: body,
    });
  }

  create(params: {
    method?: Method;
    body: any;
    id: string | number;
    index: string;
  }) {
    let {
      method = "PUT",
      body,
      id,
      index,
    } = params;
    let path = "";

    if (index != null && id != null) {
      const type = "_doc";
      path = "/" + encodeURIComponent(index) + "/" + encodeURIComponent(type) +
        "/" + encodeURIComponent(id) + "/" + "_create";
    } else {
      path = "/" + encodeURIComponent(index) + "/" + "_create" + "/" +
        encodeURIComponent(id);
    } // build request object
    return ajax({
      url: path,
      method,
      data: body,
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
