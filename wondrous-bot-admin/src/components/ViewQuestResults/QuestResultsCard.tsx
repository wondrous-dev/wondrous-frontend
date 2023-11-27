import { Box, Grid, Typography } from "@mui/material";
import { Label } from "components/QuestsList/styles";
import AccordionComponent from "components/Shared/Accordion";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { StyledContent, StyledLinkButton, StyledViewQuestResults } from "./styles";
import { useMemo } from "react";
import { SharedSecondaryButton } from "components/Shared/styles";
import { DATA_COLLECTION_TYPES, INTERESTS, SKILLS, TYPES } from "utils/constants";
import SubmissionMedia from "components/Shared/SubmissionMedia";
import { useMutation } from "@apollo/client";
import { APPROVE_SUBMISSION, REJECT_SUBMISSION } from "graphql/mutations";
import useAlerts from "utils/hooks";
import { StyledCheckbox } from "components/PaymentLedger/styles";
import { CommonTypography, TextWrapper } from "components/MembersAnalytics/styles";
import { PointsIcon } from "components/Icons/Rewards";

/*

  steps -> steps details from the quest ( type, order, prompt )
  stepsData -> steps details from the submission
  since stepsData doesn't contain the step type, we need to get it from steps
*/
export const stepsNormalizr = (questSteps, submissionStepsData) => {
  // FIXME this is kind of messed up when we add delete or update steps
  return submissionStepsData?.map((stepData, idx) => {
    // normally it's the same as index, this is just a safety measure
    const step = questSteps.find((i) => i.id === stepData.stepId);
    return {
      ...stepData,
      type: step?.type,
      prompt: step?.prompt,
      questStepAdditionalData: step?.additionalData,
    };
  });
};

const TEXT_TYPES = [TYPES.TEXT_FIELD, TYPES.NUMBER];

const SELECT_TYPES = [TYPES.MULTI_QUIZ, TYPES.SINGLE_QUIZ];

export const StepContent = ({ content, selectedValues, type, attachments, additionalData }) => {
  if (type === TYPES.LINK_CLICK) {
    return (
      <StyledContent fontFamily="Poppins" fontWeight={500} fontSize="14px" lineHeight="24px" color="#767676">
        <StyledCheckbox checked />
        Verified URL visit
      </StyledContent>
    );
  }
  if (TEXT_TYPES.includes(type) || additionalData?.dataCollectionType === DATA_COLLECTION_TYPES.LOCATION) {
    return (
      <StyledContent fontFamily="Poppins" fontWeight={500} fontSize="14px" lineHeight="24px" color="#767676">
        {content}
      </StyledContent>
    );
  }

  if (SELECT_TYPES.includes(type)) {
    return (
      <Grid display="flex" gap="6px" alignItems="center">
        {selectedValues?.map((value, idx) => (
          <StyledContent>{value}</StyledContent>
        ))}
      </Grid>
    );
  }
  if (type === TYPES.ATTACHMENTS) {
    return <SubmissionMedia media={attachments} />;
  }
  if (type === TYPES.DATA_COLLECTION) {
    const isSkill = additionalData?.dataCollectionType === DATA_COLLECTION_TYPES.SKILLS;
    const isInterest = additionalData?.dataCollectionType === DATA_COLLECTION_TYPES.INTERESTS;
    return (
      <Grid display="flex" gap="6px" alignItems="center">
        {selectedValues?.map((option, idx) => {
          let label = option;
          if (isSkill) {
            label = SKILLS[option] || option;
          }
          if (isInterest) {
            label = INTERESTS[option] || option;
          }
          return <StyledViewQuestResults key={`${option}_${idx}`}>{label}</StyledViewQuestResults>;
        })}
      </Grid>
    );
  }
  return null;
};

export const StatusComponent = ({ approvedAt, rejectedAt, handleApprove = null, handleReject = null }) => {
  if (approvedAt) {
    return (
      <Box width="fit-content">
        <TextWrapper border="1px solid #2A8D5C" bgcolor="rgba(42, 141, 92, 0.20)">
          <CommonTypography>Approved</CommonTypography>
        </TextWrapper>
      </Box>
    );
  }
  if (rejectedAt) {
    return (
      <Box width="fit-content">
        <TextWrapper border="1px solid #ee4852" bgcolor="rgba(238, 72, 82, 0.2)">
          <CommonTypography>Rejected</CommonTypography>
        </TextWrapper>
      </Box>
    );
  }
  if (!handleApprove || !handleReject) return null;
  return (
    <Box display="flex" gap="6px">
      <SharedSecondaryButton borderRadius="6px" $reverse color="#ff0000" onClick={handleReject}>
        Reject
      </SharedSecondaryButton>
      <SharedSecondaryButton borderRadius="6px" onClick={handleApprove}>
        Approve
      </SharedSecondaryButton>
    </Box>
  );
};

const QuestResultsCard = ({ submission }) => {
  const { setSnackbarAlertOpen, setSnackbarAlertMessage, setSnackbarAlertAnchorOrigin } = useAlerts();

  const steps = useMemo(() => {
    return stepsNormalizr(submission?.steps, submission?.stepsData);
  }, [submission?.steps, submission?.stepsData]);

  const [approveQuestSubmission] = useMutation(APPROVE_SUBMISSION, {
    onCompleted: () => {
      setSnackbarAlertOpen(true);
      setSnackbarAlertMessage("Submission approved!");
    },
    refetchQueries: ["getQuestSubmissions", "getQuestSubmissionStats"],
  });

  const [rejectQuestSubmission] = useMutation(REJECT_SUBMISSION, {
    onCompleted: () => {
      setSnackbarAlertOpen(true);
      setSnackbarAlertMessage("Submission rejected!");
    },
    refetchQueries: ["getQuestSubmissions", "getQuestSubmissionStats"],
  });

  const handleApprove = () =>
    approveQuestSubmission({
      variables: {
        questSubmissionId: submission?.id,
      },
    });

  const handleReject = () =>
    rejectQuestSubmission({
      variables: {
        questSubmissionId: submission?.id,
      },
    });
  return (
    <AccordionComponent
      renderTitle={() => (
        <Typography fontFamily="Poppins" fontWeight={600} fontSize="13px" lineHeight="20px" color="black">
          {submission.user}
        </Typography>
      )}
    >
      <Grid bgcolor="white" gap="18px" padding="14px" display="flex" flexDirection="column">
        {/* 
        TODO: Uncomment when we have multiple rewards per quest
        {submission?.rewards?.map((reward, idx) => (
          <StyledViewQuestResults $isReward key={idx}>
            {reward.value} {reward.type}
          </StyledViewQuestResults>
        ))} */}
        <Grid display="flex" justifyContent="space-between">
          <Box
            display="flex"
            gap="6px"
            border="1px solid #AF9EFF"
            alignItems="center"
            justifyContent="center"
            padding="4px"
            borderRadius="6px"
          >
            <PointsIcon />
            <Typography fontWeight={500} fontFamily="Poppins" fontSize="14px" lineHeight="14px" color="black">
              {submission?.pointReward} Points
            </Typography>
          </Box>
          <StatusComponent
            handleApprove={handleApprove}
            handleReject={handleReject}
            approvedAt={submission?.approvedAt}
            rejectedAt={submission?.rejectedAt}
          />
        </Grid>

        {steps?.map((step, idx) => (
          <Grid
            display="flex"
            key={`step-${idx}`}
            flexDirection="column"
            gap="8px"
            alignItems="flex-start"
            justifyContent="flex-start"
          >
            <Label fontSize="12px" color="#2A8D5C" fontWeight={700}>
              Step {idx + 1}
            </Label>
            <Typography fontFamily="Poppins" fontWeight={500} fontSize="14px" lineHeight="24px" color="black">
              {step.prompt}
            </Typography>
            <StepContent
              content={step.content}
              selectedValues={step.selectedValues}
              type={step.type}
              attachments={step.attachments}
              additionalData={step.questStepAdditionalData}
            />
          </Grid>
        ))}
        <Grid display="flex" gap="24px" alignItems="center">
          {submission?.attachments?.map((attachment, idx) => (
            <Grid display="flex" gap="6px" alignItems="center" key={"attachment-" + idx}>
              <StyledLinkButton>
                <AttachFileIcon
                  sx={{
                    fontSize: "18px",
                    color: "white",
                  }}
                />
              </StyledLinkButton>
              <Typography fontFamily="Poppins" fontWeight={500} fontSize="14px" color="#000000">
                {attachment.title}
              </Typography>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </AccordionComponent>
  );
};

export default QuestResultsCard;
