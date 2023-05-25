import { Box, Grid, Typography } from "@mui/material";
import { Label } from "components/QuestsList/styles";
import AccordionComponent from "components/Shared/Accordion";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { StyledContent, StyledLinkButton, StyledViewQuestResults } from "./styles";
import { useMemo } from "react";
import { SharedSecondaryButton } from "components/Shared/styles";
import { TYPES } from "utils/constants";
import SubmissionMedia from "components/Shared/SubmissionMedia";
import { useMutation } from "@apollo/client";
import { APPROVE_SUBMISSION, REJECT_SUBMISSION } from "graphql/mutations";
import useAlerts from "utils/hooks";
import { COUNTRIES, REGIONS } from "utils/countryList";

/*

  steps -> steps details from the quest ( type, order, prompt )
  stepsData -> steps details from the submission
  since stepsData doesn't contain the step type, we need to get it from steps
*/
const stepsNormalizr = (steps, stepsData) => {
  return stepsData?.map((stepData, idx) => {
    // normally it's the same as index, this is just a safety measure
    const step = steps.find((i) => i.order === stepData.order);
    return {
      ...stepData,
      type: step?.type,
      prompt: step?.prompt,
    };
  });
};

const TEXT_TYPES = [TYPES.TEXT_FIELD, TYPES.NUMBER];

const SELECT_TYPES = [TYPES.MULTI_QUIZ, TYPES.SINGLE_QUIZ];

const StepContent = ({ content, selectedValues, type, attachments, additionalData }) => {
  if (TEXT_TYPES.includes(type)) {
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
  if (type === TYPES.INTERESTS) {
    return (
      <Grid display="flex" gap="6px" alignItems="center">
        {additionalData?.interests?.map((value, idx) => (
          <StyledViewQuestResults>{value}</StyledViewQuestResults>
        ))}
      </Grid>
    );
  }
  if (type === TYPES.LOCATION) {
    const region = additionalData?.location?.[0];
    const country = additionalData?.location?.[1];

    const regionLabel = REGIONS.find((i) => i?.value === region)?.label;
    const countryLabel = COUNTRIES[region]?.find((i) => i.value === country)?.label;

    return (
      <Grid display="flex" gap="6px" alignItems="center">
        <StyledViewQuestResults>{regionLabel}:</StyledViewQuestResults>
        <StyledViewQuestResults>{countryLabel}</StyledViewQuestResults>
      </Grid>
    );
  }
  return null;
};

const StatusComponent = ({ approvedAt, rejectedAt, handleApprove, handleReject }) => {
  if (approvedAt) {
    return (
      <Label color="#00A343" fontFamily="Poppins" fontWeight={500} fontSize="12px" lineHeight="16px">
        Approved
      </Label>
    );
  }
  if (rejectedAt) {
    return (
      <Label color="#FF0000" fontFamily="Poppins" fontWeight={500} fontSize="12px" lineHeight="16px">
        Rejected
      </Label>
    );
  }
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

const StepPrompt = ({ prompt, type }) => {
  if (type === TYPES.LOCATION) {
    return "Location";
  }
  if (type === TYPES.INTERESTS) {
    return "Interests";
  }
  return prompt;
};
const QuestResultsCard = ({ submission }) => {
  const { setSnackbarAlertOpen, setSnackbarAlertMessage, setSnackbarAlertAnchorOrigin } = useAlerts();

  const steps = useMemo(() => {
    return stepsNormalizr(submission?.steps, submission?.stepsData);
  }, [submission?.steps, submission?.stepsData]);

  console.log(steps, " STEPS");
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
          <StyledViewQuestResults $isReward>
            Points: {submission?.pointReward}
            {/* {reward.value} {reward.type} */}
          </StyledViewQuestResults>
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
              Step {idx}
            </Label>
            <Typography fontFamily="Poppins" fontWeight={500} fontSize="14px" lineHeight="24px" color="black">
              <StepPrompt prompt={step.prompt} type={step.type} />
            </Typography>
            <StepContent
              content={step.content}
              selectedValues={step.selectedValues}
              type={step.type}
              attachments={step.attachments}
              additionalData={step.additionalData}
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
