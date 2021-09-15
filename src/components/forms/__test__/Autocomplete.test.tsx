import React from "react";
import Autocomplete from "../Autocomplete";
import { shallow, mount } from "enzyme";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { KeyValue } from "../../../models/KeyValue";
import { act } from "react-test-renderer";
const options: KeyValue[] = [
  { label: "Item 1", value: "Item 1" },
  { label: "Item 2", value: "Item 2" },
  { label: "Item 3333", value: "Item 3333" },
  { label: "Item 4", value: "Item 4" }
];

const getComponent = (
  options: KeyValue[],
  initialValue: {} = {},
  inputValue: string = ""
) => (
  <Formik
    validationSchema={Yup.object().shape({
      autocompleteComp: Yup.string().required("Required").min(4)
    })}
    initialValues={initialValue}
    onSubmit={() => {}}
  >
    {({ values, errors, setFieldValue }) => (
      <Form>
        <Autocomplete
          label="Autocomplete component"
          name="autocompleteComp"
          id="autocompleteComp"
          options={options}
          width="50%"
          inputValue={inputValue}
        />
      </Form>
    )}
  </Formik>
);

const waitForComponentToPaint = async wrapper => {
  await act(async () => {
    await new Promise(resolve => setTimeout(resolve));
    wrapper.update();
  });
};

describe("Autocomplete component", () => {
  it("renders without crashing", () => {
    shallow(
      <Autocomplete
        options={options}
        name="Autocomplete"
        label="Autocomplete"
      />
    );
  });

  it("should display value as selected when passed in form data", () => {
    const wrapper = mount(
      getComponent(options, { autocompleteComp: "Item 2" })
    );

    expect(wrapper.find("input")).toHaveLength(1);
    expect(wrapper.find("input").props().value).toBe("Item 2");
  });

  it("should display no value when not in form data", () => {
    const wrapper = mount(getComponent(options));
    expect(wrapper.find("input")).toHaveLength(1);
    expect(wrapper.find("input").props().value).toBe("");
  });

  it("should display unordered list as a drop down when input value set", async () => {
    const wrapper = mount(getComponent(options));
    wrapper.find("input").simulate("change", { target: { value: "Item" } });
    await waitForComponentToPaint(wrapper);
    expect(wrapper.find("ul")).toHaveLength(1);
  });

  it("should display 4 items that match when value set to 'Item'", async () => {
    const wrapper = mount(getComponent(options, {}, "Item"));
    wrapper.find("input").simulate("change");
    await waitForComponentToPaint(wrapper);
    expect(wrapper.find("li")).toHaveLength(4);
  });

  it("should display 1 item that match when value set to 'Item 3'", async () => {
    const wrapper = mount(getComponent(options, {}, "Item 3"));
    wrapper.find("input").simulate("change");
    await waitForComponentToPaint(wrapper);

    expect(wrapper.find("li")).toHaveLength(1);
  });

  it("should NOT display error when rendered with initial value.", async () => {
    const wrapper = mount(
      getComponent(options, { autocompleteComp: "Item 2" })
    );
    await waitForComponentToPaint(wrapper);
    expect(wrapper.find(".nhsuk-error-message")).toHaveLength(0);
  });

  it("should display error when validation criteria not met", async () => {
    const wrapper = mount(getComponent(options, {}, "I"));
    wrapper.find("input").simulate("change");
    await waitForComponentToPaint(wrapper);
    expect(wrapper.find(".nhsuk-error-message")).toHaveLength(1);
  });

  it("should not display error when validation criteria met", async () => {
    const wrapper = mount(getComponent(options, {}, "I"));
    await waitForComponentToPaint(wrapper);
    // This opens drop down menu
    wrapper.find("input").simulate("change");
    wrapper.find("li").first().simulate("click");
    await waitForComponentToPaint(wrapper);
    expect(wrapper.find(".nhsuk-error-message")).toHaveLength(0);

    //const wrapper = mount(getComponent(options, {}));
    // No inputChange event fires. No error

    // const wrapper = mount(getComponent(options, { autocompleteComp: "Item 2" }));
    // Reason:reset Event:null option:  field:Item 2 len:1
    // Input value = Item 2. No error

    //     wrapper
    //       .find("input")
    //       .simulate("change", { target: { label: "Item 1", value: "Item 1" } });
    //     await waitForComponentToPaint(wrapper);
    // //Reason:input Event:[object Object] option: Item 1 field:Item 2 len:1

    // wrapper.find("input").simulate("click");
    // await waitForComponentToPaint(wrapper);
    console.log(wrapper.debug());

    // console.log(wrapper.debug());
    // wrapper.find("li").first().simulate("click");
    // await waitForComponentToPaint(wrapper);

    // wrapper.find("input").simulate("change");
    // await waitForComponentToPaint(wrapper);

    // expect(wrapper.find(".nhsuk-error-message")).toHaveLength(0);
  });
});
