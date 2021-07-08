import {
  DeleteIndexInfo,
  DeleteIndexParams,
  ExOptions,
  IndicesCreateParams,
  IndicesStatsParams,
  StatInfo,
} from "./types.ts";
import { ajax } from "./utils/ajax.ts";

export class Indices {
  create(params: IndicesCreateParams, options?: ExOptions) {
    const { index, method = "put", body, timeout, ...otherParams } = params;
    const path = "/" + encodeURIComponent(index);
    return ajax<StatInfo>({
      url: path,
      method,
      data: body,
      timeout,
      query: otherParams,
      ignore: options?.ignore,
    });
  }

  /**
   * Returns statistics for one or more indices. For data streams, the API retrieves statistics for the stream’s backing indices.
   *
   * curl -X GET "localhost:9200/my-index-000001/_stats?pretty"
   *
   * @see {@link https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/7.x/api-reference.html#_indices_stats}
   */
  stats(params: IndicesStatsParams, options?: ExOptions): Promise<StatInfo> {
    const { index, method = "get", metric, timeout, ...otherParams } = params;
    let path = "";

    if (index != null && metric != null) {
      path = "/" + encodeURIComponent(index.toString()) + "/" + "_stats" + "/" +
        encodeURIComponent(metric.toString());
    } else if (metric != null) {
      path = "/" + "_stats" + "/" + encodeURIComponent(metric.toString());
    } else if (index != null) {
      path = "/" + encodeURIComponent(index.toString()) + "/" + "_stats";
    } else {
      path = "/" + "_stats";
    } // build request object
    return ajax<StatInfo>({
      url: path,
      method,
      timeout,
      query: otherParams,
      ignore: options?.ignore,
    });
  }

  /**
   * delete by index
   * @see {@link https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/7.x/api-reference.html#_indices_delete}
   */
  delete(
    params: DeleteIndexParams,
    options?: ExOptions,
  ): Promise<DeleteIndexInfo> {
    const { index, timeout, ...otherParams } = params;
    const path = "/" + encodeURIComponent(index.toString());
    return ajax<DeleteIndexInfo>({
      url: path,
      method: "delete",
      query: otherParams,
      timeout,
      ignore: options?.ignore,
    });
  }
}
