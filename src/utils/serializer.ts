import { SerializationError } from "./errors.ts";

interface SerializerOptions {
  disablePrototypePoisoningProtection: boolean | "proto" | "constructor";
}

const kJsonOptions = Symbol("secure json parse options");

export class Serializer {
  constructor(opts: SerializerOptions) {
    // const disable = opts.disablePrototypePoisoningProtection;
    // this[kJsonOptions] = {
    //   protoAction: disable === true || disable === "proto" ? "ignore" : "error",
    //   constructorAction: disable === true || disable === "constructor"
    //     ? "ignore"
    //     : "error",
    // };
  }

  serialize(object: any) {
    let json;
    try {
      json = JSON.stringify(object);
    } catch (err) {
      throw new SerializationError(err.message, object);
    }
    return json;
  }

  //   deserialize(json) {
  //     let object;
  //     try {
  //       object = sjson.parse(json, this[kJsonOptions]);
  //     } catch (err) {
  //       throw new DeserializationError(err.message, json);
  //     }
  //     return object;
  //   }

  ndserialize(array: any) {
    if (Array.isArray(array) === false) {
      throw new SerializationError("The argument provided is not an array");
    }
    let ndjson = "";
    for (let i = 0, len = array.length; i < len; i++) {
      if (typeof array[i] === "string") {
        ndjson += array[i] + "\n";
      } else {
        ndjson += this.serialize(array[i]) + "\n";
      }
    }
    return ndjson;
  }

  qserialize(object: any) {
    if (object == null) return "";
    if (typeof object === "string") return object;
    // arrays should be serialized as comma separated list
    const keys = Object.keys(object);
    for (let i = 0, len = keys.length; i < len; i++) {
      const key = keys[i];
      // elasticsearch will complain for keys without a value
      if (object[key] === undefined) {
        delete object[key];
      } else if (Array.isArray(object[key]) === true) {
        object[key] = object[key].join(",");
      }
    }
    return JSON.stringify(object);
  }
}

export const serializer = new Serializer({
  disablePrototypePoisoningProtection: true,
});
