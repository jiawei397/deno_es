# deno_es

> **deno_es** is a **Elastic Search** database driver developed for deno

## Examples

```ts
import { Client } from "../mod.ts";
const client = new Client();
await client.connect("http://localhost:9200/");

const count = async () => {
  try {
    const names = await client.count({
      index: "myindex2",
      method: "post",
    });
    console.log(names);
  } catch (error) {
    console.error(error);
  }
};

const create = async () => {
  try {
    const names = await client.create({
      index: "myindex2",
      id: 3,
      body: {
        title: "当时明月在",
        id: "6058046316761d2e8752aa4c",
      },
    });
    console.log(names);
  } catch (error) {
    console.error(error);
  }
};

console.time("ajax");
// await Array.from(new Array(100)).map(ajax);
await count();
await create();
console.timeEnd("ajax");

```
