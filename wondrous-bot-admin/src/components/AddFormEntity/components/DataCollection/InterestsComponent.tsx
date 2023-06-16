import { useMemo } from "react";
import { INTERESTS } from "utils/constants";
import OptionsSelect from "./OptionsSelect";

const InterestsComponent = ({ handleOnChange, options, error }) => {
  const autocompleteOptions = useMemo(
    () =>
      Object.keys(INTERESTS)
        .sort()
        .map((interest) => ({
          value: interest,
          label: INTERESTS[interest],
        })),
    []
  );
  return (
    <OptionsSelect
      handleOnChange={handleOnChange}
      autoCompleteOptions={autocompleteOptions}
      options={options}
      error={error}
      label={"Interests"}
    />
  );
};

export default InterestsComponent;
