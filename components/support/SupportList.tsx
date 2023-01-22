import { useEffect, useState } from "react";
import { ActionLink, Select } from "nhsuk-react-components";
import { localOfficeContacts } from "../../models/LocalOfficeContacts";

interface ISupportList {
  mappedContact: string | null | undefined;
  emailIds: string;
}

const SupportList = ({ mappedContact, emailIds }: ISupportList) => {
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
                  data-cy="pgdmeLink"
                  href="https://lasepgmdesupport.hee.nhs.uk/support/tickets/new?form_7=true"
                >
                  PGMDE Support Portal
                </ActionLink>
              );
            default:
              return (
                <ActionLink
                  data-cy="loLink"
                  href={`mailto:${linkContact}?subject=Form R support query (${emailIds})`}
                >
                  {linkContact}
                </ActionLink>
              );
          }
        })()}
      </div>

      <Select data-cy="contactList" onChange={handleChange}>
        <Select.Option value={mappedContact ? mappedContact : ""}>
          -- Choose an alternative contact --
        </Select.Option>
        {localOfficeContacts.map((contact, _index) => (
          <Select.Option key={contact.name} value={contact.contact}>
            {contact.abbrevName}
          </Select.Option>
        ))}
      </Select>
    </>
  );
};

export default SupportList;
