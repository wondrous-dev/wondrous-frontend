import { Box, Grid, Typography } from "@mui/material";
import { StyledCheckbox } from "components/PaymentLedger/styles";
import { ErrorText } from "components/Shared/styles";
import { useMemo, useState } from "react";
import { TYPES } from "utils/constants";
import { useTakeQuest } from "utils/hooks";

export const OptionSelect = ({ step, onChange, value }) => {

  const {errors} = useTakeQuest();

  const opacity = step.type === TYPES.SINGLE_QUIZ && value && value.length > 0 ? 0.3 : 1;
  
  const correctValues = step?.options?.filter((option) => option.correct).map((option) => option.text);

  const allCorrect = useMemo(() => {
    if (correctValues && correctValues.length > 0) {
      if (step?.type === TYPES.MULTI_QUIZ) {
        return (
          correctValues.every((correctValue) => value?.includes(correctValue)) &&
          value?.length === correctValues.length
        );
      }
      return step?.type === TYPES.SINGLE_QUIZ ? correctValues.includes(value?.[0]) : null;
    }
    return step?.type === TYPES.MULTI_QUIZ ? value?.length > 0 : null;
  }, [correctValues, value, step.type]);
  

  const isCorrect = correctValues && correctValues.length > 0 ? allCorrect : null;

  const handleCheckboxChange = (e, text) => {
    let updatedValuesSet = new Set(value || []);

    if (e.target.checked) {
        updatedValuesSet.add(text);
    } else {
        updatedValuesSet.delete(text);
    }

    const updatedValuesArray = [...updatedValuesSet];

    if (step.type === TYPES.SINGLE_QUIZ) {
        return onChange(e.target.checked ? [text] : []);
    }

    return onChange(updatedValuesArray);
};

  const sortedOptions = useMemo(() => step?.options?.sort((a, b) => a.position - b.position), [step?.options]);


  return (
    <Grid display="flex" flexDirection="column" gap="14px">
      {sortedOptions.map((option, idx) => {
        return (
          <Box
            padding="8px 12px"
            borderRadius="6px"
            bgcolor="#E8E8E8"
            border="1px solid black"
            display="flex"
            alignItems="center"
            gap="12px"
            sx={{
              opacity:
                (step.type === TYPES.SINGLE_QUIZ && value?.includes(option.text)) || step.type !== TYPES.SINGLE_QUIZ
                  ? 1
                  : opacity,
            }}
          >
            <StyledCheckbox
              bgcolor={"#2A8D5C"}
              height="22px"
              width="22px"
              defaultChecked={value?.includes(option.text)}
              disabled={step.type === TYPES.SINGLE_QUIZ && value?.length > 0 && !value.includes(option.text)}
              onChange={(e) => handleCheckboxChange(e, option.text)}
              />
            <Typography fontFamily="Poppins" fontSize="16px" fontWeight={500} lineHeight="24px" color="#1D1D1D">
              {option.text}
            </Typography>
          </Box>
        );
      })}
      {errors[step.id] ? <ErrorText>{errors[step.id]}</ErrorText> : null}
      {/* {isCorrect !== null &&
        !!value?.length &&
        (isCorrect ? null : <ErrorText>Please select only the correct options</ErrorText>)} */}
    </Grid>
  );
};

export default OptionSelect;
