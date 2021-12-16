// deno-lint-ignore-file no-unused-vars
import { Client } from "../mod.ts";
import Mock from "https://deno.land/x/deno_mock@v2.0.0/mod.ts";

const client = new Client();
await client.connect("http://elastic:369258@192.168.21.176:9200");

const count = async () => {
  try {
    const info = await client.count({
      index: "myindex",
      method: "post",
    });
    console.info("count", info);
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
    console.log("create success", info);
  } catch (error) {
    console.error("create error", error);
  }
};

const createIndex = async () => {
  try {
    const info = await client.indices.create({
      index: "myindex2",
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
    console.error("createIndex error", error);
  }
};

const update = async () => {
  try {
    const info = await client.update({
      index: "myindex",
      id: "6a1194e3-b8af-4f7b-9db2-f67c169b1860",
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

const updateMany = async () => {
  try {
    // const info = await client.updateByQuery({
    //   index: "myindex",
    //   body: {
    //     query: {
    //       match: {
    //         name: "Richard Hall",
    //       },
    //     },
    //     "script": {
    //       "source": 'ctx._source.message = "updated"',
    //     },
    //   },
    // });
    const info = await client.updateByQuery({
      index: "myindex",
      query: {
        name: "Richard Hall",
      },
      script: {
        source: 'ctx._source.message = "updated2"',
      },
    });
    console.log(info);
  } catch (error) {
    console.error(error);
  }
};

const index = async () => {
  try {
    const info = await client.index({
      index: "myindex",
      id: "AUA9wn0BCqCFQFsiKm3G", // if no id , it will create one
      body: {
        "title": "hello",
        "content": "world",
      },
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
      id: "hpes8XoBelbYB1VUf9YJ",
    });
    console.log("deleteById result", info);
  } catch (error) {
    console.error("deleteById", error);
  }
};

const deleteByIndex = async () => {
  try {
    const info = await client.deleteByIndex("myindex2");
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
              "query_string": { "default_field": "userId", "query": "41" },
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
    console.error("error", error);
  }
};

const stat = async () => {
  try {
    const info = await client.indices.stats({
      index: "myindex111",
    });
    console.log(info);
  } catch (error) {
    console.error(error);
    client.close();
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
            "title": "倚天",
          },
        },
      },
    });
    console.log(info.hits.hits);
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

// const command = async () => {
//   return await limit(async () => {
//     const time = 100 * Math.round(Math.random() * 10);
//     await delay(time);
//     return "abcd";
//   });
// };

// console.time("ajax");
// await Promise.all(Array.from(new Array(100)).map(command));
// await Promise.all(Array.from(new Array(10000)).map(count));

// await create();
// await count();
// await update();
// await createIndex();
// await reIndex();
// console.time("findById");
// await findById();
// console.timeEnd("findById");

// await updateMany();

await index();

// await deleteByIndex();

// await stat();

// await getAllIndices();

// await deleteById();
// await deleteByQuery();

// setTimeout(async () => {
//   await create();
// }, 1000);
// console.timeEnd("ajax");

// await search();
