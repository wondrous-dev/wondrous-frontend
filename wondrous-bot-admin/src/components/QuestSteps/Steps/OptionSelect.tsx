import { Box, Grid, Typography } from "@mui/material";
import { StyledCheckbox } from "components/PaymentLedger/styles";
import { ErrorText } from "components/Shared/styles";
import { useMemo } from "react";
import { TYPES } from "utils/constants";

export const OptionSelect = ({ step, onChange, value, setIsActionDisabled, isActionDisabled }) => {
  console.log(value, 'VALUE')
  const opacity = useMemo(() => {
    if (step.type === TYPES.SINGLE_QUIZ && value && value.length > 0) {
      return 0.3;
    }
    return 1;
  }, [value, step.type]);

  const correctValues = step?.options?.filter((option) => option.correct).map((option) => option.text);

  const allCorrect = useMemo(() => {
    if (correctValues && correctValues.length > 0) {
      if (step?.type === TYPES.SINGLE_QUIZ) {
        return correctValues.includes(value?.[0]);
      } else {
        return (
          correctValues.every((correctValue) => value?.includes(correctValue)) && value?.length === correctValues.length
        );
      }
    } else {
      return null;
    }
  }, [correctValues, value, step.type]);

  const isCorrect = useMemo(() => {
    if (correctValues && correctValues.length > 0) {
      if (!allCorrect && !isActionDisabled) {
        setIsActionDisabled(true);
      }
      if (allCorrect && isActionDisabled) {
        setIsActionDisabled(false);
      }
      return allCorrect;
    } else return null;
  }, [correctValues, value, allCorrect]);

  const handleCheckboxChange = (e, text) => {
    if (step.type === TYPES.SINGLE_QUIZ && value?.includes(text)) {
      return onChange([]);
    }

    if (step.type === TYPES.SINGLE_QUIZ) {
      return onChange(e.target.checked ? [text] : []);
    }

    let defaultValues = value || [];
    const values = e.target.checked ? [...defaultValues, text] : defaultValues?.filter((i) => i !== text);
    return onChange(values);
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
              checked={value?.includes(option.text)}
              disabled={step.type === TYPES.SINGLE_QUIZ && value?.length > 0 && !value.includes(option.text)}
              onChange={(e) => handleCheckboxChange(e, option.text)}
            />
            <Typography fontFamily="Poppins" fontSize="16px" fontWeight={500} lineHeight="24px" color="#1D1D1D">
              {option.text}
            </Typography>
          </Box>
        );
      })}
      {isCorrect !== null &&
        !!value?.length &&
        (isCorrect ? null : <ErrorText>Please select only the correct options</ErrorText>)}
    </Grid>
  );
};

export default OptionSelect;
