import { v4 as uuidv4 } from "uuid";

/**
 * Global Unique Identifier, motivated from this StackOverFlow answer:
 * https://stackoverflow.com/questions/37144672/guid-uuid-type-in-typescript
 */
export class GUID {
  private uuid: string;

  constructor() {
    this.uuid = uuidv4();
  }

  toString(): string {
    return this.uuid;
  }
}
