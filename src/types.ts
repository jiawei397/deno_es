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
