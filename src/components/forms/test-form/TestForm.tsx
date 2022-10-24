import {
  materialRenderers,
  materialCells
} from "@jsonforms/material-renderers";
import { JsonForms } from "@jsonforms/react";
import schema from "./schema.json";
import uischema from "./uischema.json";
import Data from "./Data";

const TestForm = ({ mfa }: any) => {
  return (
    <JsonForms
      schema={schema}
      uischema={uischema}
      data={Data}
      renderers={materialRenderers}
      cells={materialCells}
      //onChange={({ errors, data }) => setData(data)}
    />
  );
};
export default TestForm;
// function setData(data: any): void {
//   throw new Error("Function not implemented.");
// }
