import Select from "react-select";

type AutocompleteSelectProps = {
  value: any;
  onChange: (
    field: string,
    value: any,
    shouldValidate?: boolean | undefined
  ) => void;
  error: any;
  options: any;
  name: string;
  label: string;
};

// TODO styling WIP

const colourStyles = {
  option: (baseStyles: any, { isFocused, isSelected }: any) => ({
    ...baseStyles,
    background: isFocused ? "#2D8CDC" : isSelected ? "none" : undefined,
    color: isFocused ? "white" : undefined,
    zIndex: 1,
    fontSize: "19px"
  }),
  control: (baseStyles: any, { isFocused }: any) => ({
    ...baseStyles,
    border: "2px solid #212b32",
    boxShadow: isFocused ? "inset 0 0 0 2px" : "none",
    outline: isFocused ? "4px solid #ffeb3b" : "none",
    outlineOffset: isFocused ? "0" : "0"
  }),
  singleValue: (baseStyles: any) => ({
    ...baseStyles,
    fontSize: "19px"
  })
};

export const AutocompleteSelect: React.FC<AutocompleteSelectProps> = ({
  value,
  onChange,
  error,
  options,
  name,
  label
}) => {
  const handleChange = (val: any) => {
    onChange(name, !!val ? val.label : "");
  };
  return (
    <div style={{ marginBottom: "20px" }}>
      <label
        style={{
          fontWeight: 400,
          fontSize: "1.1875rem",
          lineHeight: 1.5,
          display: "block",
          marginBottom: 4
        }}
        htmlFor="color"
      >
        {label}{" "}
      </label>
      <Select
        options={options}
        onChange={handleChange}
        value={value.label}
        isClearable
        defaultValue={{
          value: value,
          label: value
        }}
        placeholder="Select or start typing..."
        styles={colourStyles}
      />
      {!!error ? (
        <div style={{ color: "red", marginTop: "4px" }}>{error}</div>
      ) : null}
    </div>
  );
};
