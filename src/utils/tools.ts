import { v4 } from "../../deps.ts";

export function generateId() {
  return v4.generate();
}
