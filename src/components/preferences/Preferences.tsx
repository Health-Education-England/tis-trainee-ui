import { Button, Card, Fieldset, Label } from "nhsuk-react-components";
import { useEffect } from "react";
import MultiChoiceInputField from "../forms/MultiChoiceInputField";
import { Form, Formik } from "formik";
import ScrollTo from "../forms/ScrollTo";
import { Auth } from "@aws-amplify/auth";
import { addNotification } from "../../redux/slices/notificationsSlice";
import { useAppDispatch } from "../../redux/hooks/hooks";
import history from "../navigation/history";

const Preferences = () => {
  const dispatch = useAppDispatch();

  const submitCakePreferences = async (v: {
    cheesecake: any;
    victoriaSponge: any;
  }) => {
    const checkedUser = await Auth.currentAuthenticatedUser();
    const result = await Auth.updateUserAttributes(checkedUser, {
      "custom:cheesecake": `${v.cheesecake.toString()}`,
      "custom:victoriaSponge": `${v.victoriaSponge.toString()}`
    });
    if (result === "SUCCESS") {
      history.push("/profile");
      dispatch(
        addNotification({
          type: "Success",
          text: "- Your cake preferences have been noted. We'll be in touch!"
        })
      );
    } else {
      dispatch(
        addNotification({
          type: "Error",
          text: "- Oops! Somthing went wrong there. Please try again."
        })
      );
    }
  };
  return (
    <Formik
      initialValues={{ cheesecake: "false", victoriaSponge: "false" }}
      onSubmit={values => submitCakePreferences(values)}
    >
      {() => (
        <Form>
          <ScrollTo />
          <Fieldset>
            <Fieldset.Legend isPageHeading style={{ color: "#005EB8" }}>
              Want to eat more cake in 2023?
            </Fieldset.Legend>
            <Label>
              <h4>
                Thank you for using TIS Self-Service. We hope you are having a
                good experience!
              </h4>
              <p>
                We'd love to hear your cake preferences - not to make TIS
                Self-Service better but because we are really nosey.
              </p>
            </Label>
            <Card feature>
              <Card.Content>
                <Card.Heading>
                  Please tick (more than one if you want) to let us know your
                  cake of choice
                </Card.Heading>
                <MultiChoiceInputField
                  id="cheesecake"
                  type="checkbox"
                  name="cheesecake"
                  hint=""
                  items={[
                    {
                      label: "Cheese cake",
                      value: true
                    }
                  ]}
                />
                <MultiChoiceInputField
                  id="victoriaSponge"
                  type="checkbox"
                  name="victoriaSponge"
                  hint=""
                  items={[
                    {
                      label: "Victoria sponge",
                      value: true
                    }
                  ]}
                />
              </Card.Content>
            </Card>
          </Fieldset>
          <Button>Submit your cake preferences</Button>
        </Form>
      )}
    </Formik>
  );
};

export default Preferences;
