import { AjaxConfig, Ajax } from "../../deps.ts";
import { limit } from "./task.ts";

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
