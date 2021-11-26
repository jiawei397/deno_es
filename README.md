# deno_es

> **deno_es** is a **Elastic Search** database driver developed for Deno

## Examples

```ts
import { Client } from "https://deno.land/x/deno_es@v0.1.4/mod.ts";
import { v4 } from "https://deno.land/std@0.99.0/uuid/mod.ts";
import Mock from "https://deno.land/x/deno_mock@v2.0.0/mod.ts";

const client = new Client();
// await client.connect("http://elastic:pwd@localhost:9200/"); // with password
await client.connect("http://localhost:9200/");

const count = async () => {
  try {
    const info: any = await client.count({
      index: "myindex",
      method: "post",
    });
    console.info("count", info.count);
  } catch (error) {
    console.error(error);
  }
};

const create = async () => {
  try {
    // const id = v4.generate();
    const info = await client.create({
      index: "myindex",
      // id,
      body: Mock.mock({
        "email": "@EMAIL",
        "name": "@NAME",
      }),
    });
    console.log(info);
  } catch (error) {
    console.error(error);
  }
};

const update = async () => {
  try {
    const info = await client.update({
      index: "myindex",
      id: 1,
      body: Mock.mock({
        "email": "@EMAIL",
        "name": "@NAME",
      }),
    });
    console.log(info);
  } catch (error) {
    console.error(error);
  }
};

const deleteById = async () => {
  try {
    const info = await client.delete({
      index: "myindex",
      id: 1,
    });
    console.log(info);
  } catch (error) {
    console.error(error);
  }
};

const createIndex = async () => {
  try {
    const info = await client.indices.create({
      index: "myindex",
      // body: {},
      body: {
        "mappings": {
          "properties": {
            "message": {
              "type": "text",
            },
            "query": {
              "type": "percolator",
            },
          },
        },
      },
    });
    console.log("createIndex success", info);
  } catch (error) {
    console.error(error);
  }
};

const deleteByIndex = async () => {
  try {
    const info = await client.deleteByIndex("myindex");
    console.log(info);
  } catch (error) {
    console.error(error);
  }
};

const deleteByQuery = async () => {
  try {
    const info = await client.deleteByQuery({
      index: "myindex",
      body: {
        query: {
          "bool": {
            "must": [{
              "query_string": { "default_field": "email", "query": "@EMAIL" },
            }],
          },
        },
      },
    });
    console.log(info);
  } catch (error) {
    console.error(error);
  }
};

const reIndex = async () => {
  try {
    const info = await client.reindex({
      oldIndex: "myindex",
      newIndex: "myindex2",
    });
    console.log(info);
  } catch (error) {
    console.error(error);
  }
};

const stat = async () => {
  try {
    const info = await client.indices.stats({
      // index: "myindex",
    });
    console.log(info);
  } catch (error) {
    console.error(error);
  }
};

const getAllIndices = async () => {
  try {
    const info = await client.getAllIndices();
    console.log(info);
  } catch (error) {
    console.error(error);
  }
};

const search = async () => {
  try {
    const info = await client.search({
      index: "myindex",
      body: {
        "query": {
          // "match_phrase": {
          "match": {
            "title": "aa",
          },
        },
      },
    });
    console.log(info);
  } catch (error) {
    console.error(error);
  }
};

const findById = async () => {
  try {
    const info = await client.get({
      index: "myindex",
      id: "11",
    });
    console.log(info);
  } catch (error) {
    console.error(error);
  }
};
```

## TODO

- [ ] other API from [es](https://github.com/elastic/elasticsearch-js)
- [ ] use one tcp query, and now is using fetch everytime
