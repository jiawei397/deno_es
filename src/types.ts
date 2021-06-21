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
