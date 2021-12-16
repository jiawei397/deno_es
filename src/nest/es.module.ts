import { ES_KEY } from "./es.constant.ts";
import { ElasticsearchService } from "./es.service.ts";
import { ElasticSearchOptions } from "../types.ts";
import { DynamicModule } from "../../deps.ts";

export class ElasticsearchModule {
  static forRoot(options: ElasticSearchOptions): DynamicModule {
    return {
      module: ElasticsearchModule,
      providers: [{
        provide: ES_KEY,
        useValue: options,
      }, ElasticsearchService],
    };
  }
}
