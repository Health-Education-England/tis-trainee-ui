import React from "react";
import SelectInputField from "../SelectInputField";
import { shallow, mount } from "enzyme";
import { Formik, Form } from "formik";
import { KeyValue } from "../../../models/KeyValue";
import { Select } from "nhsuk-react-components";

const options: KeyValue[] = [
  { label: "Label1", value: "Value1" },
  { label: "Label2", value: "Value2" }
];

const getComponent = (options: KeyValue[], footer = null) => (
  <Formik initialValues={null} onSubmit={() => {}}>
    {() => (
      <Form>
        <SelectInputField
          name="selectInputField"
          label="Select input field"
          options={options}
          footer={footer}
        />
      </Form>
    )}
  </Formik>
);

describe("SelectInputField", () => {
  it("renders without crashing", () => {
    shallow(
      <SelectInputField name="selectInputField" label="Select input field" />
    );
  });

  it("should only have default option when no options passed", () => {
    const wrapper = mount(getComponent([]));

    expect(wrapper.find(Select)).toHaveLength(1);
    expect(wrapper.find("option").length).toBe(1);
    expect(wrapper.find("label").first().text()).toBe("Select input field");
  });

  it("should have options along with default option when options passed", () => {
    const wrapper = mount(getComponent(options));

    expect(wrapper.find("option").length).toBe(3);
  });

  it("should render footer when footer property passed", () => {
    const wrapper = mount(getComponent(options, "Footer label"));

    expect(wrapper.find("div").last().text()).toBe("Footer label");
  });
});
