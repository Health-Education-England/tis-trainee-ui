import React, { useState } from "react";
import useAutocomplete from "@material-ui/lab/useAutocomplete";
import { makeStyles } from "@material-ui/core/styles";
import { connect, useField } from "formik";
import { KeyValue } from "../../models/KeyValue";
interface IProps {
  name: string;
  options: KeyValue[];
  label: string;
  id?: string;
  defaultValue?: any;
  onInputChange?: any;
  handleOpen?: any;
  inputValue?: string;
}
const useStyles = makeStyles(theme => ({
  wrapper: {
    position: "relative",
    width: "100%",
    marginBottom: "20px"
  },
  chevronDown: {
    backgroundPosition: "right center",
    backgroundRepeat: "no-repeat",
    background:
      "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAhUlEQVQ4T+3SMQrCUBCE4S+3EDyNR7EIWgtaWUqKeAElRRrPoafxGII8SCCErK9IF9xyd+dnmZ3CzCpm6i0Q0OKMd+DNGhds+/nYgyNKbCYgSfxCg2sESP0D9iPICk88UA2vi74whHwicQL9euOpuyTt3VBP+ZLLwb0T7aLA5QDZoP4BfAGA0hIRKj7iQAAAAABJRU5ErkJggg==)"
  },

  chevronUp: {
    backgroundPosition: "right center",
    backgroundRepeat: "no-repeat",
    background:
      "url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAg0lEQVQ4T+XSMQrCQBRF0ZNdCFlNlmIhSS9aWSZNsgHFwsptmNW4DEGEGQhDRpGU+eWHex88XmHhFQt5KxBcQkd1rqtvHRzRBPCMfk6SE+zxSa3wwgN3dKlkTjCFnwHY5CSp4IBdSI5wDC0x4oohPlPBDSek8FTSYpsT/D3MFSzxZydvcKYSEbowaRgAAAAASUVORK5CYII=)"
  },

  iconLabel: {
    width: "100%",
    display: "flex",
    alignItems: "inherit",
    justifyContent: "inherit"
  },
  iconRoot: {
    fill: "currentColor",
    width: "1em",
    height: "1em",
    display: "inline-block",
    fontSize: "1.5rem",
    transition: "fill 200ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
    flexShrink: 0,
    userSelect: "none"
  },
  listbox: {
    boxShadow: "0 .5rem 1rem rgba(0,0,0,.15)",
    width: "100%",
    margin: 0,
    padding: 0,
    zIndex: 1,
    position: "absolute",
    listStyle: "none",
    backgroundColor: theme.palette.background.paper,
    overflow: "auto",
    maxHeight: 300,
    border: "1px solid rgba(0,0,0,.25)",
    "& li": {
      padding: "2px 6px"
    },
    '& li[data-focus="true"]': {
      backgroundColor: "#4a8df6",
      color: "white",
      cursor: "pointer"
    },
    "& li:active": {
      backgroundColor: "#2977f5",
      color: "white"
    }
  }
}));

const Autocomplete: React.FC<IProps> = (props: IProps) => {
  const [field, { error }, helpers] = useField(props);
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const loading = open && props.options.length === 0 ? true : false;

  const {
    getRootProps,
    getInputLabelProps,
    getInputProps,
    getListboxProps,
    getOptionProps,
    groupedOptions
  } = useAutocomplete({
    id: props.id ? props.id : "defaultAutocompleteID",
    options: props.options.length
      ? [{ label: "", value: "" }, ...props.options]
      : [],
    inputValue: field.value ? field.value : "",
    getOptionLabel: (option: KeyValue) => option.label,
    getOptionSelected: (option, value) => option.value === value.value,
    onInputChange: (_, option, reason) => {
      if (reason === "reset") {
        helpers.setValue(option ? option : field.value);
      } else {
        helpers.setValue(option);
      }
    },
    onOpen: () => {
      setOpen(true);
      props.handleOpen && props.handleOpen();
      helpers.setValue("");
    },
    onClose: () => {
      setOpen(false);
    },
    open: open
  });

  return (
    <div className={classes.wrapper}>
      <div
        className={
          error
            ? "nhsuk-form-group nhsuk-form-group--error"
            : "nhsuk-form-group"
        }
        {...getRootProps()}
      >
        <label
          className="nhsuk-label"
          htmlFor="myAutoComplete"
          {...getInputLabelProps()}
        >
          {props.label}
        </label>
        {error && (
          <span className="nhsuk-error-message">
            <span className="nhsuk-u-visually-hidden">Error:</span> {error}
          </span>
        )}

        <input
          name={props.name}
          id={props.id ? props.id : props.name}
          className={
            open
              ? `${classes.chevronUp} nhsuk-input`
              : `${classes.chevronDown} nhsuk-input`
          }
          style={{ cursor: "context-menu" }}
          placeholder={loading ? "Loading..." : "Select / start typing..."}
          {...getInputProps()}
        />

        {groupedOptions.length > 0 ? (
          <ul className={classes.listbox} {...getListboxProps()}>
            {groupedOptions.map((option, index) => (
              <li {...getOptionProps({ option, index })}>{option.label}</li>
            ))}
          </ul>
        ) : null}
      </div>
    </div>
  );
};

export default connect(Autocomplete);
