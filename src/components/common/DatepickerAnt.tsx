import { useField, useFormikContext } from "formik";
import { DatePicker, Space } from "antd";
import dayjs from "dayjs";

export const DatepickerAnt = ({ ...props }: any) => {
  const { setFieldValue } = useFormikContext();
  const [field] = useField(props);
  return (
    <Space direction="vertical">
      <DatePicker
        onChange={val => {
          setFieldValue(field.name, val);
        }}
        defaultValue={dayjs(props.value)}
      />
    </Space>
  );
};
