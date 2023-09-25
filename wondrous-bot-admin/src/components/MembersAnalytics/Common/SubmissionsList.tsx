import { Grid, Typography, Box, CircularProgress } from "@mui/material";
import { SecondaryPointsIcon } from "components/Icons/Rewards";
import { stepsNormalizr, StatusComponent, StepContent } from "components/ViewQuestResults/QuestResultsCard";
import { StyledLinkButton } from "components/ViewQuestResults/styles";
import { Label } from "components/QuestsList/styles";
import { useEffect, useMemo } from "react";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { TextWrapper, CommonTypography } from "../styles";
import AccordionComponent from "components/Shared/Accordion";
import { useInView } from "react-intersection-observer";
import EmptyState from "components/EmptyState";
import { EMPTY_STATE_TYPES } from "utils/constants";

export const SecondaryAccordion = ({ children, renderTitle = null, questName }) => {
  return (
    <AccordionComponent
      summaryProps={{
        bgColor: "#EBE7FF",
      }}
      renderTitle={
        renderTitle
          ? renderTitle()
          : () => (
              <Typography fontFamily="Poppins" fontWeight={500} fontSize="13px" lineHeight="20px" color="black">
                Submission to: <strong>{questName}</strong>
              </Typography>
            )
      }
    >
      {children}
    </AccordionComponent>
  );
};

export const SubmissionComponent = ({ submission }) => {
  const steps = useMemo(() => {
    return stepsNormalizr(submission?.quest?.steps, submission?.stepsData);
  }, [submission]);

  return (
    <SecondaryAccordion questName={submission?.quest?.title || "Quest"}>
      <Grid bgcolor="white" gap="18px" padding="14px" display="flex" flexDirection="column">
        <Grid display="flex" gap="24px">
          <TextWrapper gap="10px" padding="0px 8px">
            <SecondaryPointsIcon />
            <CommonTypography fontSize="14px">{submission?.quest?.pointReward} Points</CommonTypography>
          </TextWrapper>

          <StatusComponent approvedAt={submission?.approvedAt} rejectedAt={submission?.rejectedAt} />
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
    </SecondaryAccordion>
  );
};

const SubmissionsList = ({ loading, data = [], fetchMore, hasMore }) => {
  const [ref, inView] = useInView({});

  useEffect(() => {
    console.log(inView && hasMore);
    if (inView && hasMore) {
      fetchMore();
    }
  }, [hasMore, inView]);

  return (
    <Box maxHeight="400px" overflow="scroll">
      {loading ? (
        <CircularProgress
          sx={{
            color: "#2A8D5C",
            animationDuration: "10000ms",
          }}
        />
      ) : (
        <Box height="100%" display="flex" flexDirection="column" gap="14px">
          {data.map((submission) => (
            <SubmissionComponent key={submission.id} submission={submission} />
          ))}
          {!data?.length && !loading && (
            <EmptyState
              type={EMPTY_STATE_TYPES.PAYMENTS}
              labelColor="black"
              sx={{
                border: "1px solid black",
              }}
            />
          )}
          <div ref={ref} style={{ height: "1px", display: "block" }} />
        </Box>
      )}
    </Box>
  );
};

export default SubmissionsList;
