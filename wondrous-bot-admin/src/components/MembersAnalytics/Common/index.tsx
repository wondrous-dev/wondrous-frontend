import { Box, ButtonBase, Grid, Typography } from "@mui/material";
import { CommonTypography, TextWrapper } from "../styles";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import useAlerts from "utils/hooks";
import { ButtonIconWrapper } from "components/Shared/styles";
import CopyIcon from "components/Icons/copy";
import { ConnectDiscordIcon, ShapedHexagonWrapper } from "components/Icons/Discord";
import { IconWrapper } from "components/TableComponent/styles";
import { Label } from "components/QuestsList/styles";
import { useMemo } from "react";
import AttachFileIcon from "@mui/icons-material/AttachFile";

import AccordionComponent from "components/Shared/Accordion";
import { StatusComponent, StepContent, stepsNormalizr } from "components/ViewQuestResults/QuestResultsCard";
import { StyledViewQuestResults, StyledLinkButton } from "components/ViewQuestResults/styles";
import { SecondaryPointsIcon } from "components/Icons/Rewards";

export const NameComponent = ({ name }) => {
  return (
    <TextWrapper>
      <CommonTypography color="black" fontFamily="Poppins" fontSize="13px" fontWeight="600">
        {name}
      </CommonTypography>
    </TextWrapper>
  );
};

export const AddressComponent = ({ address }) => {
  const { setSnackbarAlertMessage, setSnackbarAlertOpen } = useAlerts();

  const handleClick = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(address);
    setSnackbarAlertMessage("Address copied to clipboard");
    setSnackbarAlertOpen(true);
  };

  if (!address) {
    return <CommonTypography>User did not connect wallet</CommonTypography>;
  }

  return (
    <Box display="flex" gap="7px" alignItems="center">
      <TextWrapper>
        <CommonTypography>{`${address.slice(0, 6)}...${address.slice(
          address.length - 4,
          address.length
        )}`}</CommonTypography>
      </TextWrapper>
      <ButtonIconWrapper
        onClick={handleClick}
        sx={{
          "&:focus": {
            outline: "none",
          },
        }}
      >
        <CopyIcon color="black" />
      </ButtonIconWrapper>{" "}
    </Box>
  );
};

export const XpComponent = ({ level, xp }) => {
  return (
    <Box display="flex" gap="11px" alignItems="center">
      <Box
        display="flex"
        gap="10px"
        alignItems="center"
        position="relative"
        justifyContent="center"
        sx={{
          "&:hover #display-edit-icon": {
            visibility: "visible",
          },
        }}
      >
        <Box position="relative" width="fit-content" display="flex" justifyContent="center" alignItems="center">
          <ShapedHexagonWrapper fill="#84BCFF" />
          <Typography
            fontFamily="Poppins"
            fontWeight={700}
            fontSize="13px"
            lineHeight="17px"
            position="absolute"
            color="black"
          >
            {level}
          </Typography>
        </Box>
      </Box>
      <CommonTypography>{xp} XP</CommonTypography>
    </Box>
  );
};

export const IntegrationsComponent = ({ user, type }) => {
  const data = useMemo(() => {
    if (type === "discord") {
      return {
        username: user?.discordUsername,
        link: `https://discord.com/users/${user?.discordId}`,
      };
    }
    if (type === "twitter") {
      return {
        username: user?.twitterInfo?.twitterUsername ? `@${user?.twitterInfo?.twitterUsername}` : null,
        link: `https://x.com/${user?.twitterInfo?.twitterUsername}`,
      };
    }
    if (type === "telegram") {
      return {
        username: user?.telegramUsername,
        link: `https://t.me/${user?.telegramUsername}`,
      };
    }
  }, [user, type]);

  return (
    <ButtonBase onClick={() => window.open(data?.link)} disabled={!data?.username}>
      <TextWrapper
        {...(data?.username
          ? {
              border: "1px solid #2A8D5C",
              bgcolor: "rgba(42, 141, 92, 0.20)",
            }
          : {})}
      >
        <CommonTypography color={data?.username ? "#000" : "#626262"}>
          {data?.username || "not yet collected"}
        </CommonTypography>
      </TextWrapper>
    </ButtonBase>
  );
};

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
          {/* <StyledViewQuestResults $isReward>Points: {submission?.quest?.pointReward}</StyledViewQuestResults> */}
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
