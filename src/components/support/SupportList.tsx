import { useEffect, useState } from "react";
import { ActionLink, Select } from "nhsuk-react-components";
import { localOfficeContacts } from "../../models/LocalOfficeContacts";

interface ISupportList {
  mappedContact: string | null | undefined;
}

const SupportList = ({ mappedContact }: ISupportList) => {
  const [linkContact, updateLinkContact] = useState(mappedContact);

  useEffect(() => {
    if (mappedContact) {
      updateLinkContact(mappedContact);
    }
  }, [mappedContact]);

  const handleChange = (event: any) => updateLinkContact(event.target.value);

  return (
    <>
      <div>
        {(() => {
          switch (linkContact) {
            case "":
              return null;
            case "PGMDE support portal":
              return (
                <ActionLink
                  data-jest="pgdmeLink"
                  href="https://lasepgmdesupport.hee.nhs.uk/support/tickets/new?form_7=true"
                >
                  PGMDE Support Portal
                </ActionLink>
              );
            default:
              return (
                <ActionLink
                  data-jest="loLink"
                  href={`mailto:${linkContact}?subject=Form R support query`}
                >
                  {linkContact}
                </ActionLink>
              );
          }
        })()}
      </div>

      <Select data-jest="contactList" onChange={handleChange}>
        <Select.Option value={mappedContact ? mappedContact : ""}>
          -- Choose an alternative contact --
        </Select.Option>
        {localOfficeContacts.map((contact, index) => (
          <Select.Option key={index} value={contact.contact}>
            {contact.abbrevName}
          </Select.Option>
        ))}
      </Select>
    </>
  );
};

export default SupportList;
