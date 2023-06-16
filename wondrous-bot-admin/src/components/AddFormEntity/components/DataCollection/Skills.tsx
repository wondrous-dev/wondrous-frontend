import { useMemo } from "react";
import { SKILLS } from "utils/constants";
import OptionsSelect from "./OptionsSelect";

const SkillsComponent = ({ handleOnChange, options, error }) => {
  const autocompleteOptions = useMemo(
    () =>
      Object.keys(SKILLS)
        .sort()
        .map((skill) => ({
          value: skill,
          label: SKILLS[skill],
        })),
    []
  );
  return (
    <OptionsSelect
      handleOnChange={handleOnChange}
      autoCompleteOptions={autocompleteOptions}
      options={options}
      error={error}
      label={"Skills"}
    />
  );
};

export default SkillsComponent;
