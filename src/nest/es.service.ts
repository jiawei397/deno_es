import { Client } from "../client.ts";
import { Inject, Injectable } from "../../deps.ts";
import { ES_KEY } from "./es.constant.ts";
import { ElasticSearchOptions } from "../types.ts";

@Injectable()
export class ElasticsearchService extends Client {
  constructor(@Inject(ES_KEY) options: ElasticSearchOptions) {
    super(options);
  }
}
