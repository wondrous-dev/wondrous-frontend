import { useIsOrgUsernameTaken } from "utils/hooks";
import * as Yup from "yup";

const FIELDS = {
  NAME: "name",
  USERNAME: "username",
};

export const useSchema = () => {
  const usernameRegex = /^(?=[a-z0-9._]{5,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/; // https://stackoverflow.com/questions/12018245/regular-expression-to-validate-username

  const handleIsOrgUsernameTaken = useIsOrgUsernameTaken();
  const validationSchema = Yup.object().shape({
    [FIELDS.NAME]: Yup.string().required("Name is required"),
    [FIELDS.USERNAME]: Yup.string()
      .required("Username is required")
      .matches(
        usernameRegex,
        "Usernames should be between 5 and 15 characters long and contain only lowercase letters, numbers, and underscores."
      )
      .test("is-taken", "This username is taken", handleIsOrgUsernameTaken),
  });
  return validationSchema
//   return validationSchema.validate(values, { abortEarly: false });
  
};
