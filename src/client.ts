// deno-lint-ignore-file no-explicit-any
import { assert } from "../deps.ts";
import { Indices } from "./indices.ts";
import {
  BulkInfo,
  BulkParams,
  CountInfo,
  CountParams,
  CreatedInfo,
  CreateParams,
  DeleteByQueryInfo,
  DeleteByQueryParams,
  DeletedInfo,
  DeleteIndexInfo,
  DeleteParams,
  ExOptions,
  GetParams,
  GetResult,
  ReIndexInfo,
  ReIndexParams,
  SearchInfo,
  SearchParams,
  UpdatedInfo,
  UpdateParams,
} from "./types.ts";
import { Ajax, ajax, setMaxTaskCount } from "./utils/ajax.ts";
import { serializer } from "./utils/serializer.ts";
import { generateId } from "./utils/tools.ts";

const type = "_doc";

class BaseClient {
  // cache db
  #dbCache = new Map();

  #connectionCache = new Map();

  db: string | undefined;

  connectedCount = 0;

  connected = false;

  private async connectDB(db: string, maxTaskCount = 100) {
    this.db = db;
    Ajax.defaults.baseURL = db;
    setMaxTaskCount(maxTaskCount);
    const res = await fetch(db);
    if (res.ok) {
      this.connected = true;
      return res.json();
    }
    return await Promise.reject(res.json());
  }

  connect(db: string): Promise<any> {
    try {
      if (this.#connectionCache.has(db)) {
        return this.#connectionCache.get(db);
      }
      const promise = this.connectDB(db);
      this.connectedCount++;
      this.#connectionCache.set(db, promise);
      return promise;
    } catch (e) {
      throw new Error(`Connection failed: ${e.message || e}`);
    }
  }

  close() {
    this.#dbCache.clear();
    this.#connectionCache.clear();
    this.connectedCount = 0;
  }
}

export class Client extends BaseClient {
  indices = new Indices();

  count(params: CountParams, options?: ExOptions): Promise<CountInfo> {
    assert(this.connected);
    let path = "";

    let { index, body, method, ...otherParams } = params;

    if (index != null) {
      if (method == null) method = body == null ? "GET" : "POST";
      path = "/" + encodeURIComponent(index.toString()) + "/" + "_count";
    } else {
      if (method == null) method = body == null ? "GET" : "POST";
      path = "/" + "_count";
    }
    return ajax<CountInfo>({
      url: path,
      method: method!,
      data: body,
      query: otherParams as any,
      ignore: options?.ignore,
    });
  }

  /**
   * insert a document
   * @see {@link https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/7.x/api-reference.html#_create}
   */
  create(params: CreateParams, options?: ExOptions): Promise<CreatedInfo> {
    assert(this.connected);
    const {
      method = "PUT",
      body,
      id = generateId(),
      index,
      timeout,
      ...otherParams
    } = params;
    const path = "/" + encodeURIComponent(index) + "/" +
      encodeURIComponent(type) +
      "/" + encodeURIComponent(id!) + "/" + "_create";
    return ajax<CreatedInfo>({
      url: path,
      method,
      data: body,
      timeout,
      query: otherParams,
      ignore: options?.ignore,
    });
  }

  /**
   * update a document
   * @see {@link https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/7.x/api-reference.html#_update}
   */
  update(params: UpdateParams, options?: ExOptions): Promise<UpdatedInfo> {
    assert(this.connected);
    const {
      body,
      id,
      index,
      isOriginData,
      timeout,
      ...otherParams
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
      timeout,
      query: otherParams as any,
      ignore: options?.ignore,
    });
  }

  /**
   * delete
   * @see {@link https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/7.x/api-reference.html#_delete}
   */
  delete(params: DeleteParams): Promise<DeletedInfo> {
    assert(this.connected);
    const {
      id,
      index,
      timeout,
      ...otherParams
    } = params;
    const path = "/" + encodeURIComponent(index) + "/" +
      encodeURIComponent(type) +
      "/" + encodeURIComponent(id);
    return ajax<DeletedInfo>({
      url: path,
      method: "DELETE",
      timeout,
      query: otherParams,
    });
  }

  /**
   * Deletes documents that match the specified query.
   * @example
   * {
   *   "query": {
   *     "match": {
   *        "user.id": "elkbee"
   *      }
   *    }
   *  }
   * @see {@link https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/7.x/api-reference.html#_deletebyquery}
   */
  deleteByQuery(params: DeleteByQueryParams): Promise<DeleteByQueryInfo> {
    assert(this.connected);
    const {
      index,
      body,
      timeout,
      ...otherParams
    } = params;
    const path = "/" + encodeURIComponent(index.toString()) + "/" +
      "_delete_by_query";
    return ajax<DeleteByQueryInfo>({
      url: path,
      method: "POST",
      data: body,
      timeout,
      query: otherParams,
    });
  }

  deleteByIndex(index: string): Promise<DeleteIndexInfo> {
    assert(this.connected);
    return this.indices.delete({
      index,
    });
  }

  /**
   * The reindex API extracts the document source from the source index and indexes the documents into the destination index. You can copy all documents to the destination index, reindex a subset of the documents or update the source before to reindex it.
   */
  reindex(params: ReIndexParams): Promise<ReIndexInfo> {
    assert(this.connected);
    const {
      oldIndex,
      newIndex,
      timeout,
      ...otherParams
    } = params;
    const path = "/" + "_reindex";
    return ajax<ReIndexInfo>({
      url: path,
      method: "POST",
      timeout,
      data: {
        source: {
          index: oldIndex,
        },
        dest: {
          index: newIndex,
        },
      },
      query: otherParams,
    });
  }

  async getAllIndices(): Promise<string[]> {
    assert(this.connected);
    const result = await this.indices.stats({});
    return Object.keys(result.indices);
  }

  /**
   * search
   * @see {@link https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/7.x/api-reference.html#_search}
   */
  search(params: SearchParams): Promise<SearchInfo> {
    assert(this.connected);
    let { index, method, body, timeout, ...otherParams } = params;
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
      timeout,
      query: otherParams,
    });
  }

  /**
   * get by id
   */
  get(params: GetParams): Promise<GetResult> {
    assert(this.connected);
    let { index, id, method = "GET", timeout, ...otherParams } = params;
    assert(id, "id is need");
    let path = "/" + encodeURIComponent(index) + "/" + "_doc" + "/" +
      encodeURIComponent(id);
    return ajax<GetResult>({
      url: path,
      method,
      data: {},
      timeout,
      query: otherParams,
    });
  }

  /**
   * Performs multiple indexing or delete operations in a single API call. This reduces overhead and can greatly increase indexing speed.
   * @see {@link https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/7.x/bulk_examples.html}
   * @see {@link https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/7.x/api-reference.html#_bulk}
   */
  bulk(params: BulkParams): Promise<BulkInfo> {
    assert(this.connected);
    const { index, method = "post", body, timeout, ...otherParams } = params;
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
      timeout,
      query: otherParams,
    });
  }
}
