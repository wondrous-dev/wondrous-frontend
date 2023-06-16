import * as Yup from "yup";

const FIELDS = {
  EMAIL: "email",
  PASSWORD: "password",
  CONFIRM_PASSWORD: "confirmPassword",
};

const ERRORS = {
  EMAIL: "Email is required",
  PASSWORD: "Password is required",
  CONFIRM_PASSWORD: "Confirm password is required",
  PASSWORDS_NOT_MATCH: "Passwords do not match",
  INVALID_EMAIL: "Invalid email",
};

const validationSchema = Yup.object().shape({
  [FIELDS.EMAIL]: Yup.string().email(ERRORS.INVALID_EMAIL).required(ERRORS.EMAIL),
  [FIELDS.PASSWORD]: Yup.string().required(ERRORS.PASSWORD).min(8, "Password must be at least 8 characters"),
  [FIELDS.CONFIRM_PASSWORD]: Yup.string()
    .oneOf([Yup.ref(FIELDS.PASSWORD), null], ERRORS.PASSWORDS_NOT_MATCH)
    .required(ERRORS.CONFIRM_PASSWORD),
});

export const validate = async (values) => {
  return validationSchema.validate(values, { abortEarly: false });
};
