import { Method } from "../deps.ts";

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
  timeout?: number;
  _source?: string | string[];
  _source_excludes?: string | string[];
  _source_includes?: string | string[];
  pipeline?: string;
  require_alias?: boolean;
}

export interface ReIndexParams {
  oldIndex: string | number;
  newIndex: string | number;
  refresh?: boolean;
  timeout?: number;
  wait_for_active_shards?: string;
  wait_for_completion?: boolean;
  requests_per_second?: number;
  scroll?: string;
  slices?: number | string;
  max_docs?: number;
  body?: object;
}

export interface SearchParams {
  method?: Method;
  index: string;
  analyzer?: string;
  analyze_wildcard?: boolean;
  ccs_minimize_roundtrips?: boolean;
  default_operator?: "AND" | "OR";
  df?: string;
  explain?: boolean;
  stored_fields?: string | string[];
  docvalue_fields?: string | string[];
  from?: number;
  ignore_unavailable?: boolean;
  ignore_throttled?: boolean;
  allow_no_indices?: boolean;
  expand_wildcards?: "open" | "closed" | "hidden" | "none" | "all";
  lenient?: boolean;
  preference?: string;
  q?: string;
  routing?: string | string[];
  scroll?: string;
  search_type?: "query_then_fetch" | "dfs_query_then_fetch";
  size?: number;
  sort?: string | string[];
  _source?: string | string[];
  _source_excludes?: string | string[];
  _source_includes?: string | string[];
  terminate_after?: number;
  stats?: string | string[];
  suggest_field?: string;
  suggest_mode?: "missing" | "popular" | "always";
  suggest_size?: number;
  suggest_text?: string;
  timeout?: number;
  track_scores?: boolean;
  track_total_hits?: boolean;
  allow_partial_search_results?: boolean;
  typed_keys?: boolean;
  version?: boolean;
  seq_no_primary_term?: boolean;
  request_cache?: boolean;
  batched_reduce_size?: number;
  max_concurrent_shard_requests?: number;
  pre_filter_shard_size?: number;
  rest_total_hits_as_int?: boolean;
  min_compatible_shard_node?: string;
  body: object;
}

export interface DeleteParams {
  id: string | number;
  index: string;
  wait_for_active_shards?: string;
  refresh?: "true" | "false" | "wait_for";
  routing?: string;
  timeout?: number;
  if_seq_no?: number;
  if_primary_term?: number;
  version?: number;
  version_type?: "internal" | "external" | "external_gte" | "force";
}

interface IDeleteByQueryParams {
  analyzer: string;
  analyze_wildcard: boolean;
  default_operator: "AND" | "OR";
  df: string;
  from: number;
  ignore_unavailable: boolean;
  allow_no_indices: boolean;
  conflicts: "abort" | "proceed";
  expand_wildcards: "open" | "closed" | "hidden" | "none" | "all";
  lenient: boolean;
  preference: string;
  q: string;
  routing: string | string[];
  scroll: string;
  search_type: "query_then_fetch" | "dfs_query_then_fetch";
  search_timeout: string;
  size: number;
  max_docs: number;
  sort: string | string[];
  _source: string | string[];
  _source_excludes: string | string[];
  _source_includes: string | string[];
  terminate_after: number;
  stats: string | string[];
  version: boolean;
  request_cache: boolean;
  refresh: boolean;
  timeout: number;
  wait_for_active_shards: string;
  scroll_size: number;
  wait_for_completion: boolean;
  requests_per_second: number;
  slices: number | string;
}
export type DeleteByQueryParams = {
  index: string | string[];
  body: object;
} & Partial<IDeleteByQueryParams>;

export interface ExOptions {
  ignore: number[];
}

export interface IndicesCreateParams {
  index: string;
  body: object;
  method?: Method;
  include_type_name?: boolean;
  wait_for_active_shards?: string;
  timeout?: number;
  master_timeout?: number;
}

export interface IndicesStatsParams {
  method?: Method;
  timeout?: number;
  index?: string | string[];
  metric?: string | string[];
  completion_fields?: string | string[];
  fielddata_fields?: string | string[];
  fields?: string | string[];
  groups?: string | string[];
  level?: "cluster" | "indices" | "shards";
  include_segment_file_sizes?: boolean;
  include_unloaded_segments?: boolean;
  expand_wildcards?: "open" | "closed" | "hidden" | "none" | "all";
  forbid_closed_indices?: boolean;
}

interface ICountParams {
  ignore_unavailable: boolean;
  ignore_throttled: boolean;
  allow_no_indices: boolean;
  expand_wildcards: "open" | "closed" | "hidden" | "none" | "all";
  min_score: number;
  preference: string;
  routing: string | string[];
  q: string;
  analyzer: string;
  analyze_wildcard: boolean;
  default_operator: "AND" | "OR";
  df: string;
  lenient: boolean;
  terminate_after: number;
}
export type CountParams = {
  index: string | string[];
  body?: object;
  method?: Method;
} & Partial<ICountParams>;

export interface CreateParams {
  method?: Method;
  id: string;
  index: string;
  body: object;
  wait_for_active_shards?: string;
  refresh?: "true" | "false" | "wait_for";
  routing?: string;
  timeout?: number;
  version?: number;
  version_type?: "internal" | "external" | "external_gte";
  pipeline?: string;
}

interface IUpdateParams {
  wait_for_active_shards: string;
  _source: string | string[];
  _source_excludes: string | string[];
  _source_includes: string | string[];
  lang: string;
  refresh: "true" | "false" | "wait_for";
  retry_on_conflict: number;
  routing: string;
  timeout: number;
  if_seq_no: number;
  if_primary_term: number;
  require_alias: boolean;
}

export type UpdateParams = {
  id: string | number;
  index: string;
  body: object;
  isOriginData?: boolean;
} & Partial<IUpdateParams>;

export interface DeleteIndexParams {
  index: string | string[];
  timeout?: number;
  master_timeout?: number;
  ignore_unavailable?: boolean;
  allow_no_indices?: boolean;
  expand_wildcards?: "open" | "closed" | "hidden" | "none" | "all";
}
