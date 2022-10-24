// import schema from "./schema.json";
// import uischema from "./uischema.json";
// import {
//   materialCells,
//   materialRenderers
// } from "@jsonforms/material-renderers";
// import { Button } from "@material-ui/core";
// import { useState } from "react";
// import { JsonForms } from "@jsonforms/react";

const initialData = {
  name: "Max Power",
  I_confirm_that: "I have been appointed to a programme leading to award of CCT"
};

// const ClearFormExample = () => {
//   const [data, setData] = useState(initialData);

//   return (
//     <div>
//       <JsonForms
//         schema={schema}
//         uischema={uischema}
//         data={data}
//         renderers={materialRenderers}
//         cells={materialCells}
//         onChange={({ data }) => setData(data)}
//       />
//       <Button color="primary">Clear form data</Button>
//     </div>
//   );
// };
export default initialData;
