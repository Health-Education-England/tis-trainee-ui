import {
  materialRenderers,
  materialCells
} from "@jsonforms/material-renderers";
import { JsonForms } from "@jsonforms/react";
import schema from "./schema.json";
import uischema from "./uischema.json";
import Data from "./Data";
import { Button } from "nhsuk-react-components";
import { useState } from "react";
import FormADeclarationControlTester from "./FormADeclarationControlTester";
import FormADeclarationControl from "./FormADeclarationControl";
import TextBoxControlTester from "./TextBoxControlTester";
import TextBoxControl from "./TextBoxControl";

//store of the initial data
const initialData = {
  name: "Send email to Adrian",
  description: "Confirm if you have passed the subject\nHereby ...",
  done: true,
  recurrence: "Daily",
  rating: 3
};

const TestForm = ({ mfa }: any) => {
  const [data, setData] = useState<any>(initialData);

  //allows the submit button to clear the data
  const clearData = () => {
    setData({});
  };

  //contains the default renderes and the custom renderes
  const renderers = [
    ...materialRenderers,
    //register custom renderers
    {
      tester: FormADeclarationControlTester,
      renderer: FormADeclarationControl
    }
  ];

  return (
    <div>
      <JsonForms
        schema={schema}
        uischema={uischema}
        data={Data}
        renderers={renderers}
        cells={materialCells}
        onChange={({ errors, data }) => setData(data)}
      />
      <Button onClick={clearData} color="primary">
        Submit
      </Button>
    </div>
  );
};

export default TestForm;
// function setData(data: any): void {
//   throw new Error("Function not implemented.");
// }
