import { ErrorMessage } from "nhsuk-react-components";

interface ISupportMsg {
  personOwner: string | null | undefined;
  mappedContact: string | null | undefined;
}

const SupportMsg = (props: ISupportMsg) => {
  const { personOwner, mappedContact } = props;
  if (!mappedContact) {
    return (
      <div data-cy="matchErrorMsg">
        <ErrorMessage>
          {`Sorry but your contact ${personOwner} cannot be matched with a support contact. Please choose a contact from the list below (which will provide a new link)`}
        </ErrorMessage>
      </div>
    );
  } else {
    return (
      <div data-cy="successMsg">
        <p>{`According to our records, your contact is ${personOwner}.`}</p>
        <p>
          {
            "Please click on the link below or choose an alternative contact from the list."
          }
        </p>
      </div>
    );
  }
};

export default SupportMsg;