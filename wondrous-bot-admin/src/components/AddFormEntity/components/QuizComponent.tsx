import { Box, Grid, Typography } from "@mui/material";
import { ButtonIconWrapper, ErrorText } from "components/Shared/styles";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import TextField from "../../Shared/TextField";
import { IndexContainer, Label } from "./styles";
import ToggleComponent from "components/Shared/Toggle";
import Switch from "components/Shared/Switch";
import SelectComponent from "components/Shared/Select";
import { ERRORS, ERRORS_LABELS, TYPES } from "utils/constants";
import CurrencyBitcoinIcon from "@mui/icons-material/CurrencyBitcoin";
import { useState } from "react";
import { RewardComponent, RewardsList } from "components/CreateTemplate/RewardComponent";

const CORRECT_ANSWERS_TYPES = {
  CORRECT: "correct",
  INCORRECT: "incorrect",
};
const CORRECT_ANSWERS_OPTIONS = [
  {
    label: "Correct",
    value: CORRECT_ANSWERS_TYPES.CORRECT,
  },
  {
    label: "Incorrect",
    value: CORRECT_ANSWERS_TYPES.INCORRECT,
  },
];

const QuizComponent = ({ onChange, value, stepType, error }) => {
  const [rewardOptionId, setRewardOptionId] = useState(null);

  const OPTIONS = [
    {
      label: "Multi Select",
      value: TYPES.MULTI_QUIZ,
    },
    {
      label: "Single Select",
      value: TYPES.SINGLE_QUIZ,
    },
  ];

  const { question, withCorrectAnswers, multiSelectValue, answers } = value || {};

  const handleOnChange = (key, val) => {
    onChange({
      ...value,
      [key]: val,
    });
  };

  const handleAnswers = (answers) => handleOnChange("answers", answers);

  const handleAddOption = () => {
    handleAnswers([...answers, { value: "", isCorrect: false }]);
  };

  const handleRemoveOption = (idx) => {
    if (answers.length === 1) return;
    const answersClone = [...answers];
    answersClone.splice(idx, 1);
    return handleAnswers(answersClone);
  };

  const handleAnswerChange = (idx, value) => {
    const answersClone = [...answers];
    answersClone[idx].value = value;
    handleAnswers(answersClone);
  };

  const handleRewardsClick = (idx) => {
    setRewardOptionId(idx);
  };

  const onRewardsChange = (rewards) => {
    const option = value?.answers?.[rewardOptionId];
    const newOption = {
      ...option,
      rewards,
    };
    const newAnswers = [...value?.answers, newOption];
    handleAnswers(newAnswers);
    setRewardOptionId(null);
  };
  
  return (
    <>
      <RewardComponent
        isRewardModalOpen={rewardOptionId !== null}
        displayRewards={false}
        rewards={[]}
        onRewardsChange={onRewardsChange}
        handleRewardsToggle={() => setRewardOptionId(null)}
      />
      <Grid container gap="24px" direction="column">
        <Grid item gap="14px" display="flex" flexDirection="column">
          <Label>Question/Prompt</Label>
          <TextField
            placeholder="Enter question here"
            value={question || ""}
            onChange={(value) => handleOnChange("question", value)}
            multiline={false}
            error={error?.prompt}
          />
        </Grid>
        <Grid item gap="14px" display="flex" flexDirection="column">
          <Typography fontFamily="Poppins" fontWeight={600} fontSize="13px" lineHeight="15px" color="#626262">
            Answers
          </Typography>
          <ToggleComponent
            options={OPTIONS}
            onChange={(value) => handleOnChange("multiSelectValue", value)}
            value={multiSelectValue}
          />
          <Grid display="flex" gap="10px" alignItems="center">
            <Switch onChange={(value) => handleOnChange("withCorrectAnswers", value)} value={withCorrectAnswers} />
            <Label>Set correct answers</Label>
          </Grid>
          <Grid display="flex" gap="8px" flexDirection="column">
            {error?.options === ERRORS.MIN_OPTION_LENGTH ? (
              <ErrorText>{ERRORS_LABELS.MIN_OPTION_LENGTH}</ErrorText>
            ) : null}
            {answers?.map((answer, idx) => (
              <Grid display="flex" flexDirection="column" gap="10px">
                <Grid display="flex" alignItems="center" gap="14px" width="100%">
                  <IndexContainer>{idx + 1}.</IndexContainer>
                  <TextField
                    placeholder="Type an answer here"
                    value={answer.value}
                    error={error?.options?.[idx]?.text}
                    onChange={(value) => handleAnswerChange(idx, value)}
                    multiline={false}
                  />
                  <Box display="flex" gap="10px">
                    {/* <FileUpload onChange={(e) => handleAttachMedia(e, idx)} /> */}
                    {answers.length > 1 ? (
                      <ButtonIconWrapper onClick={() => handleRemoveOption(idx)} height="40px" width="40px">
                        <CloseIcon
                          sx={{
                            color: "black",
                          }}
                        />
                      </ButtonIconWrapper>
                    ) : null}
                  </Box>
                  {withCorrectAnswers ? (
                    <Box minWidth="150px">
                      <SelectComponent
                        options={CORRECT_ANSWERS_OPTIONS}
                        value={answer.isCorrect ? CORRECT_ANSWERS_TYPES.CORRECT : CORRECT_ANSWERS_TYPES.INCORRECT}
                        onChange={(value) => {
                          const answersClone = [...answers];
                          answersClone[idx].isCorrect = value === CORRECT_ANSWERS_TYPES.CORRECT;
                          handleAnswers(answersClone);
                        }}
                      />
                    </Box>
                  ) : null}
                  <ButtonIconWrapper onClick={() => handleRewardsClick(idx)} height="40px" width="40px">
                    <CurrencyBitcoinIcon
                      sx={{
                        color: "black",
                      }}
                    />
                  </ButtonIconWrapper>
                </Grid>
              </Grid>
            ))}
            <Box display="flex" gap="10px" alignItems="center">
              <ButtonIconWrapper onClick={handleAddOption}>
                <AddIcon
                  sx={{
                    color: "black",
                  }}
                />
              </ButtonIconWrapper>
              <Label>Add Option</Label>
            </Box>
          </Grid>
        </Grid>
      </Grid>
    </>
  );
};

export default QuizComponent;
