import { StatInfo } from "./types.ts";
import { ajax, Method } from "./utils/ajax.ts";

export class Indices {
  // TODO use options
  create(params: {
    index: string;
    body: any;
    method?: Method;
  }, options?: {
    ignore: number[];
  }) {
    const { index, method = "put", body } = params;
    const path = "/" + encodeURIComponent(index);
    return ajax<StatInfo>({
      url: path,
      method,
      data: body,
    });
  }

  stats(params: {
    index?: string;
    method?: Method;
    metric?: string;
  }): Promise<StatInfo> {
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
}
