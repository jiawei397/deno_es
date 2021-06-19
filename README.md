# deno_es

> **deno_es** is a **Elastic Search** database driver developed for deno

## Examples

```ts
import { Client } from "../mod.ts";
const client = new Client();
await client.connect("http://localhost:9200/");

const ajax = async () => {
  try {
    const count = await client.count({
      index: "myindex2",
      // method: "post",
    });
    console.log(count);
  } catch (error) {
    console.error(error);
  }
};

console.time("ajax");
// await Array.from(new Array(100)).map(ajax);
await ajax();
console.timeEnd("ajax");

```
