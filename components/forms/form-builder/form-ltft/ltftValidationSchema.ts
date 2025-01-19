import * as yup from "yup";

const DiscussionsValidationSchema = yup.object().shape({
  name: yup.string().required("Name is required"),
  email: yup.string().required("Email is required"),
  role: yup.string().required("Role is required")
});

export const ltftValidationSchema = yup.object({
  forename: yup.string().required("Forename is required"),

  discussions: yup
    .array()
    .of(DiscussionsValidationSchema)
    .min(1, "At a minimum, your TPD discussion details are required")
});
