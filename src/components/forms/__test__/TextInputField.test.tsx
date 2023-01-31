import React from "react";
import TextInputField from "../TextInputField";
import { shallow, mount } from "enzyme";
import { Formik, Form } from "formik";

describe("TextInputField", () => {
  it("renders without crashing", () => {
    shallow(<TextInputField name="TextInputField" label="Text Input Field" />);
  });

  it("should render input element and label", () => {
    const wrapper = mount(
      <Formik initialValues={null} onSubmit={() => {}}>
        {() => (
          <Form>
            <TextInputField name="TextInputField" label="Text Input Field" />
          </Form>
        )}
      </Formik>
    );

    expect(wrapper.find("label").first().text()).toBe("Text Input Field");

    expect(wrapper.find("input").length).toBe(1);
    expect(wrapper.find("textarea").length).toBe(0);
  });

  it("should render footer when footer property passed", () => {
    const wrapper = mount(
      <Formik initialValues={null} onSubmit={() => {}}>
        {() => (
          <Form>
            <TextInputField
              name="TextInputField"
              label="Text Input Field"
              footer="Footer label"
            />
          </Form>
        )}
      </Formik>
    );

    expect(wrapper.find("div").last().text()).toBe("Footer label");
  });

  it("should render textarea element when number of rows passed", () => {
    const wrapper = mount(
      <Formik initialValues={null} onSubmit={() => {}}>
        {() => (
          <Form>
            <TextInputField
              name="TextInputField"
              label="Text Input Field"
              rows={1}
            />
          </Form>
        )}
      </Formik>
    );

    expect(wrapper.find("label").first().text()).toBe("Text Input Field");

    expect(wrapper.find("textarea").length).toBe(1);
    expect(wrapper.find("input").length).toBe(0);
  });
});
