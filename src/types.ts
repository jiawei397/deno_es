import { Method } from "./utils/ajax.ts";

export interface StatInfo {
  _shards: {
    total: number;
    successful: number;
    failed: number;
  };
  _all: any;
  indices: {
    [x: string]: {
      uuid: string;
      primaries: any;
      total: any;
    };
  };
}

export interface Hit {
  _index: string;
  _type: string;
  _source: ObjectConstructor[];
  _id: string;
  _score: number;
}

export interface SearchInfo {
  took: number;
  timed_out: boolean;
  _shards: {
    total: number;
    failed: number;
    successful: number;
    skipped: number;
  };
  hits: {
    hits: Hit[];
    total: { value: number; relation: string };
    max_score: number;
  };
}

export interface CountInfo {
  count: number;
  _shards: {
    total: number;
    failed: number;
    successful: number;
    skipped: number;
  };
}

export interface CreatedInfo {
  _index: string;
  _type: string;
  _id: string;
  _version: number;
  result: string;
  _shards: { total: number; failed: number; successful: number };
  _seq_no: number;
  _primary_term: number;
}

export interface UpdatedInfo extends CreatedInfo {
}

export interface ReIndexInfo {
  took: number;
  timed_out: boolean;
  total: number;
  updated: number;
  created: number;
  deleted: number;
  batches: number;
  version_conflicts: number;
  noops: number;
  retries: { search: number; bulk: number };
  throttled_millis: number;
  requests_per_second: number;
  throttled_until_millis: number;
  failures: any[];
}

export interface DeleteIndexInfo {
  acknowledged: boolean;
}

export interface DeletedInfo extends CreatedInfo {
}

export interface DeleteByQueryInfo extends ReIndexInfo {
}

export interface BulkInfo {
  took: number;
  errors: boolean;
  items: {
    index: {
      result: string;
      _shards: any;
      _seq_no: number;
      _index: string;
      forced_refresh: boolean;
      _type: string;
      _id: string;
      _version: number;
      _primary_term: number;
      status: number;
    };
  }[];
}

export interface BulkParams {
  index?: string;
  method?: Method;
  body?: object;
  wait_for_active_shards?: string;
  refresh?: boolean | "wait_for";
  routing?: string;
  timeout?: string;
  _source?: string | string[];
  _source_excludes?: string | string[];
  _source_includes?: string | string[];
  pipeline?: string;
  require_alias?: boolean;
}
