import { Client } from "../mod.ts";
import { v4 } from "https://deno.land/std@0.99.0/uuid/mod.ts";
import Mock from "https://deno.land/x/deno_mock@v2.0.0/mod.ts";
import { delay } from "../deps.ts";
import { limit } from "../src/utils/task.ts";

const client = new Client();
await client.connect("http://localhost:9200/");

const count = async () => {
  try {
    const info: any = await client.count({
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
    const id = v4.generate();
    const info = await client.create({
      index: "myindex",
      id,
      data: Mock.mock({
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
      data: Mock.mock({
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
      data: {
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
    console.error("error", error);
  }
};

const stat = async () => {
  try {
    const info = await client.indicesStats({
      // index: "myindex",
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
      data: {
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
// await reIndex();
// await deleteByIndex();

// await stat();

// await getAllIndices();

// await deleteById();
await deleteByQuery();

// setTimeout(async () => {
//   await create();
// }, 1000);
// console.timeEnd("ajax");

// await search();
