import { Box, ButtonBase, Grid, Typography } from "@mui/material";
import { StyledCheckbox } from "components/PaymentLedger/styles";
import { ErrorText } from "components/Shared/styles";
import { useMemo, useRef, useState } from "react";
import { TYPES } from "utils/constants";
import { useTakeQuest } from "utils/hooks";
import CheckboxOption from "components/QuestSteps/Checkbox";

export const OptionSelect = ({ step, onChange, value }) => {
  const { errors } = useTakeQuest();

  const handleCheckboxChange = (e, position) => {
    let updatedValuesSet = new Set(value || []);

    if (e.target.checked) {
      updatedValuesSet.add(position);
    } else {
      updatedValuesSet.delete(position);
    }

    const updatedValuesArray = [...updatedValuesSet];

    if (step.type === TYPES.SINGLE_QUIZ) {
      return onChange(e.target.checked ? [position] : []);
    }

    return onChange(updatedValuesArray);
  };

  const sortedOptions = useMemo(() => step?.options?.sort((a, b) => a.position - b.position), [step?.options]);

  const opacity = step.type === TYPES.SINGLE_QUIZ && value && value.length > 0 ? 0.3 : 1;

  return (
    <Grid display="flex" flexDirection="column" gap="14px">
      {sortedOptions?.map((option, idx) => {
        return (
          <CheckboxOption
            option={option}
            disabled={step.type === TYPES.SINGLE_QUIZ && value?.length > 0 && !value.includes(option.position)}
            buttonSx={{
              opacity:
                (step.type === TYPES.SINGLE_QUIZ && value?.includes(option.position)) || step.type !== TYPES.SINGLE_QUIZ
                  ? 1
                  : opacity,
            }}
            key={`checkbox-${idx}`}
            value={value}
            checkboxProps={{
              checked: value?.includes(option.position),
            }}
            handleCheckboxChange={(e) => handleCheckboxChange(e, option.position)}
          />
        );
      })}
      {errors[step.id] ? <ErrorText>{errors[step.id]}</ErrorText> : null}
    </Grid>
  );
};

export default OptionSelect;
