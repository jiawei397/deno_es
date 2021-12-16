import { AjaxConfig, BaseAjax } from "../../deps.ts";
import { limit } from "./task.ts";

export class Ajax extends BaseAjax {
  /**
   * 处理错误请求
   */
  protected handleErrorResponse(response: Response) {
    console.error(
      `HTTP error, status = ${response.status}, statusText = ${response.statusText}`,
    );
    if (response.status === 401) { //权限问题
      this.stopAjax();
      this.abortAll();
      // toLogin();
    }
  }
}

const instance = new Ajax();

let maxTaskCount = 100;

export const ajax = <T>(config: AjaxConfig) => {
  return limit<T>(() => {
    return instance.ajax(config);
  }, maxTaskCount);
};

export function setMaxTaskCount(count: number) {
  maxTaskCount = count;
}
