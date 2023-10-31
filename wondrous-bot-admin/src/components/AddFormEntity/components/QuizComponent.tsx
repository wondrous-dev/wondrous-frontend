import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { Box, Grid, Typography } from "@mui/material";
import RewardModal, { useAddRewardModalState } from "components/CreateTemplate/RewardModal";
import SelectComponent from "components/Shared/Select";
import Switch from "components/Shared/Switch";
import ToggleComponent from "components/Shared/Toggle";
import { ButtonIconWrapper, ErrorText } from "components/Shared/styles";
import { useState } from "react";
import { ERRORS, ERRORS_LABELS, OPTION_TEXT_LIMIT, TYPES } from "utils/constants";
import TextField, { ResizeTextField } from "../../Shared/TextField";
import OptionRewards from "./OptionRewards";
import { IndexContainer, Label } from "./styles";
import ErrorField from "components/Shared/ErrorField";

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
  const rewardModalState = useAddRewardModalState();
  const { setIsRewardModalOpen } = rewardModalState;

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

  const { question, withCorrectAnswers, multiSelectValue, answers, withConditionalRewards } = value || {};

  const handleOnChange = (key, val) => {
    onChange({
      ...value,
      [key]: val,
    });
  };

  const handleAnswers = (answers) => handleOnChange("answers", answers);

  const handleAddOption = () => {
    handleAnswers([
      ...answers,
      { value: "", isCorrect: false, rewards: withConditionalRewards ? [{ type: null }] : [] },
    ]);
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
    setIsRewardModalOpen(true);
  };

  const handleRewardModalClose = () => {
    setRewardOptionId(null);
    setIsRewardModalOpen(false);
  };

  const onRewardsChange = (reward) => {
    const option = value?.answers?.[rewardOptionId];
    const optionRewards = option?.rewards?.filter((i) => i.type !== null) || [];
    const newOption = {
      ...option,
      rewards: [...optionRewards, reward],
    };
    const newAnswers = value?.answers?.map((item, idx) => {
      if (idx === rewardOptionId) {
        return newOption;
      }
      return item;
    });
    handleAnswers(newAnswers);
    handleRewardModalClose();
  };

  const handleRewardDelete = (rewardIdx, answerIdx) => {
    if (!value?.answers) return;

    const newAnswers = value.answers.map((item, idx) => {
      if (idx === answerIdx) {
        const updatedRewards = item.rewards?.filter((_, index) => index !== rewardIdx) || [];

        return {
          ...item,
          rewards: updatedRewards.length > 0 ? updatedRewards : [{ type: null }],
        };
      }
      return item;
    });

    const hasRewards = newAnswers.some((item) => (item.rewards?.length ?? 0) > 0);

    onChange({
      ...value,
      answers: newAnswers,
      withConditionalRewards: hasRewards,
    });
    setRewardOptionId(null);
  };

  const handleConditionalRewardsToggle = (toggleValue) => {
    const newAnswers = answers?.map((item) => ({
      ...item,
      rewards: toggleValue ? [{ type: null }] : [],
    }));

    onChange({
      ...value,
      withConditionalRewards: toggleValue,
      answers: newAnswers,
    });
  };

  return (
    <>
      <RewardModal
        rewardModalState={rewardModalState}
        handleRewardModalToggle={handleRewardModalClose}
        handleOnRewardAdd={onRewardsChange}
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
          <Grid display="flex" gap="24px">
            <Grid display="flex" gap="10px" alignItems="center">
              <Switch onChange={(value) => handleOnChange("withCorrectAnswers", value)} value={withCorrectAnswers} />
              <Label>Set correct answers</Label>
            </Grid>
            <Grid display="flex" gap="10px" alignItems="center">
              <Switch onChange={handleConditionalRewardsToggle} value={withConditionalRewards} />
              <Label>Conditional Rewards</Label>
            </Grid>
          </Grid>

          <Grid display="flex" gap="8px" flexDirection="column">
            {error?.options === ERRORS.MIN_OPTION_LENGTH ? (
              <ErrorField errorText={ERRORS_LABELS.MIN_OPTION_LENGTH} />
            ) : null}
            {answers?.map((answer, idx) => (
              <Grid display="flex" flexDirection="column" gap="10px">
                <Grid
                  display="flex"
                  alignItems="center"
                  gap="14px"
                  width="100%"
                  sx={{
                    flexWrap: {
                      xs: "wrap",
                      sm: "nowrap",
                    },
                  }}
                >
                  <IndexContainer>{idx + 1}.</IndexContainer>
                  <ResizeTextField
                    placeholder="Type an answer here"
                    value={answer.value}
                    error={error?.options?.[idx]?.text}
                    onChange={(value) => handleAnswerChange(idx, value)}
                    multiline={true}
                    inputProps={{
                      maxLength: OPTION_TEXT_LIMIT,
                    }}
                  />
                  {answers?.length > 1 ? (
                    <Box display="flex" gap="10px">
                      <ButtonIconWrapper onClick={() => handleRemoveOption(idx)} height="40px" width="40px">
                        <CloseIcon
                          sx={{
                            color: "black",
                          }}
                        />
                      </ButtonIconWrapper>
                      {/* <FileUpload onChange={(e) => handleAttachMedia(e, idx)} /> */}
                    </Box>
                  ) : null}
                  {withCorrectAnswers || withConditionalRewards ? (
                    <Box
                      display="flex"
                      gap="10px"
                      minWidth="30%"
                      sx={{
                        minWidth: {
                          xs: "100%",
                          sm: "auto",
                        },
                        paddingLeft: {
                          xs: "46px",
                          sm: "0",
                        },
                      }}
                    >
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
                    </Box>
                  ) : null}
                </Grid>
                <OptionRewards
                  rewards={answer.rewards}
                  id={idx}
                  handleAddReward={handleRewardsClick}
                  handleRewardDelete={(rewardIdx) => handleRewardDelete(rewardIdx, idx)}
                />
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
