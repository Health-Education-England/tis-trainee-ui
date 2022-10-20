import { Formik } from "formik";
import { Button } from "nhsuk-react-components";
import React, { useState } from "react";
import * as Yup from "yup";
import MultiChoiceInputField from "../MultiChoiceInputField";
import COJAug2022 from "./COJAug2022";
import { FormRUtilities } from "../../../utilities/FormRUtilities";

// TODO need logic to check if form is signed or not via programme mem field in state viewedCojProg
const isSigned = false;

// TODO need logic to check if viewed coj is sepcialty or foundation?
const isSpecialty = true;
const progType = isSpecialty
  ? "training number/contract "
  : "membership of the UK Foundation Programme";

// TODO get signed date from programme details to display correct COJ version
const COJversion: React.FC = () => {
  return <COJAug2022 isSpecialty={isSpecialty} />;
};

// TODO make generic print PDF section (see FormSavePDF comp)
const PrintPDF = () => {
  return (
    <Button data-cy="savePdfBtn" onClick={() => FormRUtilities.windowPrint()}>
      Save a copy as a PDF
    </Button>
  );
};

const COJDeclarationSection: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  return (
    <>
      <Formik
        initialValues={{
          decResp: "",
          decEmp: ""
        }}
        validationSchema={Yup.object({
          decResp: Yup.string().required("Please confirm your acceptance"),
          decEmp: Yup.string().required("Please confirm your acceptance")
        })}
        onSubmit={_values => {
          setIsSubmitting(false);
          console.log("coj signed btn clicked");
        }}
      >
        {({ handleSubmit }) => (
          <>
            <MultiChoiceInputField
              id="decResp"
              type="checkbox"
              name="decResp"
              items={[
                {
                  label: `I acknowledge the importance of these responsibilities and understand that they are requirements for maintaining my registration with the Postgraduate Dean. If I fail to meet them, I understand that my ${progType} may be withdrawn by the Postgraduate Dean.`,
                  value: true
                }
              ]}
            />
            <MultiChoiceInputField
              id="decEmp"
              type="checkbox"
              name="decEmp"
              items={[
                {
                  label:
                    "I understand that this document does not constitute an offer of employment.",
                  value: true
                }
              ]}
            />
            <Button
              onClick={(e: { preventDefault: () => void }) => {
                e.preventDefault();
                setIsSubmitting(true);
                handleSubmit();
              }}
              disabled={isSubmitting}
              data-cy="cogSignBtn"
            >
              Click to sign Conditions of Joining agreement
            </Button>
          </>
        )}
      </Formik>
    </>
  );
};

const COJView = () => {
  return (
    <>
      {isSigned && <PrintPDF />}
      <COJversion />
      {isSigned ? <PrintPDF /> : <COJDeclarationSection />}
    </>
  );
};

export default COJView;
