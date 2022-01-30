import { KeyValue } from "./KeyValue";

export interface DesignatedBodyKeyValue extends KeyValue {
  type?: null | string;
  internal?: boolean;
}
