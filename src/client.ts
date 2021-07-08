import { assert, urlParse } from "../deps.ts";
import { Indices } from "./indices.ts";
import {
  BulkInfo,
  CountInfo,
  CreatedInfo,
  DeleteByQueryInfo,
  DeletedInfo,
  DeleteIndexInfo,
  ReIndexInfo,
  SearchInfo,
  UpdatedInfo,
} from "./types.ts";
import { Ajax, ajax, Method } from "./utils/ajax.ts";
import { serializer } from "./utils/serializer.ts";
import { generateId } from "./utils/tools.ts";

const DENO_DRIVER_VERSION = "0.0.3";

const type = "_doc";

class BaseClient {
  // cache db
  #dbCache = new Map();

  #connectionCache = new Map();

  db: string | undefined;

  protected conn: Deno.Conn | undefined;

  connectedCount = 0;

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
}

export class Client extends BaseClient {
  indices = new Indices();

  count(options: {
    method?: Method;
    body?: string;
    index: string;
  }): Promise<CountInfo> {
    assert(this.conn);
    let path = "";

    let { index, body, method } = options;

    if (index != null) {
      if (method == null) method = body == null ? "GET" : "POST";
      path = "/" + encodeURIComponent(index) + "/" + "_count";
    } else {
      if (method == null) method = body == null ? "GET" : "POST";
      path = "/" + "_count";
    }
    return ajax<CountInfo>({
      url: path,
      method: method!,
      data: body,
    });
  }

  create(params: {
    method?: Method;
    body: any;
    id: string | number;
    index: string;
  }): Promise<CreatedInfo> {
    assert(this.conn);
    let {
      method = "PUT",
      body,
      id,
      index,
    } = params;
    if (!id) {
      id = generateId();
    }
    const path = "/" + encodeURIComponent(index) + "/" +
      encodeURIComponent(type) +
      "/" + encodeURIComponent(id) + "/" + "_create";
    return ajax<CreatedInfo>({
      url: path,
      method,
      data: body,
    });
  }

  update(params: {
    index: string;
    id: string | number;
    body: any;
    isOriginData?: boolean;
  }): Promise<UpdatedInfo> {
    assert(this.conn);
    const {
      body,
      id,
      index,
      isOriginData,
    } = params;
    const path = "/" + encodeURIComponent(index) + "/" +
      encodeURIComponent(type) +
      "/" + encodeURIComponent(id) + "/" + "_update";
    return ajax<UpdatedInfo>({
      url: path,
      method: "POST",
      data: isOriginData ? body : {
        doc: body,
      },
    });
  }

  delete(params: {
    index: string;
    id: string | number;
  }): Promise<DeletedInfo> {
    assert(this.conn);
    const {
      id,
      index,
    } = params;
    const path = "/" + encodeURIComponent(index) + "/" +
      encodeURIComponent(type) +
      "/" + encodeURIComponent(id);
    return ajax<DeletedInfo>({
      url: path,
      method: "DELETE",
    });
  }

  deleteByQuery(params: {
    index: string;
    body: any;
  }): Promise<DeleteByQueryInfo> {
    assert(this.conn);
    const {
      index,
      body,
    } = params;
    const path = "/" + encodeURIComponent(index) + "/" + "_delete_by_query";
    return ajax<DeleteByQueryInfo>({
      url: path,
      method: "POST",
      data: body,
    });
  }

  deleteByIndex(index: string): Promise<DeleteIndexInfo> {
    assert(this.conn);
    const path = "/" + encodeURIComponent(index);
    return ajax<DeleteIndexInfo>({
      url: path,
      method: "delete",
    });
  }

  reindex(params: {
    oldIndex: string | number;
    newIndex: string | number;
  }): Promise<ReIndexInfo> {
    assert(this.conn);
    const {
      oldIndex,
      newIndex,
    } = params;
    const path = "/" + "_reindex";
    return ajax<ReIndexInfo>({
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

  async getAllIndices(): Promise<string[]> {
    assert(this.conn);
    const result = await this.indices.stats({});
    return Object.keys(result.indices);
  }

  search(params: {
    index?: string;
    method?: Method;
    body?: any;
  }): Promise<SearchInfo> {
    assert(this.conn);
    let { index, method, body } = params;
    let path = "";
    if ((index) != null) {
      if (method == null) method = body == null ? "GET" : "POST";
      path = "/" + encodeURIComponent(index) + "/" + "_search";
    } else {
      if (method == null) method = body == null ? "GET" : "POST";
      path = "/" + "_search";
    }
    return ajax<SearchInfo>({
      url: path,
      method,
      data: body,
    });
  }

  /**
   * https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/7.x/bulk_examples.html
   */
  bulk(params: {
    index?: string;
    method?: Method;
    body?: any;
    refresh?: boolean;
  }): Promise<BulkInfo> {
    assert(this.conn);
    const { index, method = "post", body, refresh } = params; // TODO use refesh
    let path = "";
    if (index != null) {
      path = "/" + encodeURIComponent(index) + "/" + encodeURIComponent(type) +
        "/" + "_bulk";
    } else {
      path = "/" + "_bulk";
    }
    return ajax<BulkInfo>({
      url: path,
      method,
      data: serializer.ndserialize(body),
      query: refresh !== undefined ? { refresh } : undefined,
    });
  }
}
