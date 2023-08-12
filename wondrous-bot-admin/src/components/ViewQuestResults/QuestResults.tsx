import { Box, ButtonBase, Grid, Typography } from "@mui/material";
import EmptyState from "components/EmptyState";
import { useEffect, useMemo, useState, useContext } from "react";
import GlobalContext from "utils/context/GlobalContext";
import { useInView } from "react-intersection-observer";
import { EMPTY_STATE_TYPES, QUEST_SUBMISSION_STATUS, TYPES } from "utils/constants";
import { format } from "date-fns";
import QuestResultsCard from "./QuestResultsCard";
import { FilterPill } from "./styles";
import { useLazyQuery, useMutation } from "@apollo/client";
import { EXPORT_QUEST_SUBMISSIONS } from "graphql/queries";
import { GET_CMTY_PAYMENT_COUNTS } from "graphql/queries";
import RedDot from "assets/redDot.svg";
import { useNavigate } from "react-router-dom";
import { createFormatValue } from "csv42";

export const exportQuestSubmissionsToCsv = async ({ exportQuestSubmissionData, questId }) => {
  const headers = [
    "submissionCreatedAt",
    "submitterDiscordHandle",
    "submitterTwitterHandle",
    "submitterWeb3Address",
    "approvedAt",
    "rejectedAt",
  ];
  const formatNowTime = format(new Date(), "yyyy-MM-dd");
  const questSubmissionData = await exportQuestSubmissionData({
    variables: {
      questId,
    },
  });
  const questSubmissions = questSubmissionData?.data?.exportQuestSubmissions?.questSubmissions;
  const questSteps = questSubmissionData?.data?.exportQuestSubmissions?.questSteps;
  questSteps.forEach((questStep) => {
    const questStepType = questStep?.type;
    let questStepTypeString = questStepType?.split("_").join(" ");
    questStepTypeString = questStepTypeString.charAt(0).toUpperCase() + questStepTypeString.slice(1);
    if (questStepType === TYPES.RETWEET || questStepType === TYPES.LIKE_TWEET || questStepType === TYPES.REPLY_TWEET) {
      questStepTypeString = `${questStepTypeString} ${questStep?.additionalData?.tweetLink}`;
    } else if (questStepType === TYPES.FOLLOW_TWITTER) {
      questStepTypeString = `${questStepTypeString} ${questStep?.additionalData?.tweetHandle}`;
    } else if (questStepType === TYPES.TWEET_WITH_PHRASE) {
      questStepTypeString = `${questStepTypeString} ${questStep?.additionalData?.tweetPhrase}`;
    } else if (
      questStepType === TYPES.TEXT_FIELD ||
      questStepType === TYPES.MULTI_QUIZ ||
      questStepType === TYPES.SINGLE_QUIZ ||
      questStepType === TYPES.ATTACHMENTS ||
      questStepType === TYPES.NUMBER ||
      questStepType === TYPES.DATA_COLLECTION
    ) {
      questStepTypeString = `${questStepTypeString} - ${questStep?.prompt}`;
    } else if (questStepType === TYPES.DISCORD_EVENT_ATTENDANCE) {
      questStepTypeString = `${questStepTypeString} - ${questStep?.additionalData?.discordEventId}`;
    } else if (questStepType === TYPES.DISCORD_MESSAGE_IN_CHANNEL) {
      questStepTypeString = `${questStepTypeString} - #${questStep?.additionalData?.discordChannelName}`;
    } else if (questStepType === TYPES.SNAPSHOT_PROPOSAL_VOTE) {
      questStepTypeString = `${questStepTypeString} - ${questStep?.additionalData?.snapshotProposalLink}`;
    } else if (questStepType === TYPES.SNAPSHOT_SPACE_VOTE) {
      questStepTypeString = `${questStepTypeString} - Vote ${questStep?.additionalData?.snapshotVoteTimes} times ${questStep?.additionalData?.snapshotSpaceLink}`;
    } else if (questStepType === TYPES.VERIFY_TOKEN_HOLDING) {
      questStepTypeString = `${questStepTypeString} - ${questStep?.additionalData?.tokenAmount} ${questStep?.additionalData?.tokenName}`;
    } else if (questStepType === TYPES.LINK_CLICK) {
      questStepTypeString = `${questStepTypeString} - ${questStep?.additionalData?.linkClickUrl}`;
    } else if (questStepType === TYPES.LIKE_YT_VIDEO) {
      questStepTypeString = `${questStepTypeString} - ${questStep?.additionalData?.ytVideoLink}`;
    } else if (questStepType === TYPES.SUBSCRIBE_YT_CHANNEL) {
      questStepTypeString = `${questStepTypeString} - ${questStep?.additionalData?.ytChannelLink}`;
    }
    headers.push(`Step ${questStep?.order}: ${questStepTypeString}`);
  });
  const rows = [[headers]];
  if (!questSubmissions) {
    return;
  }
  questSubmissions.forEach((submission) => {
    let submitterDiscordHandle = submission?.creator?.discordUsername;
    if (submission?.creator?.discordDiscriminator) {
      submitterDiscordHandle = `${submitterDiscordHandle}#${submission?.creator?.discordDiscriminator}`;
    }
    const submitterTwitterHandle = submission?.creator?.twitterInfo?.twitterUsername;
    const submitterLevel = submission?.creator?.level;
    const submitterPoints = submission?.creator?.point;
    const submitterWeb3Address = submission?.creator?.web3Address;
    const approvedAt = submission?.approvedAt ? format(new Date(submission?.approvedAt), "yyyy-MM-dd") : "";
    const rejectedAt = submission?.rejectedAt ? format(new Date(submission?.rejectedAt), "yyyy-MM-dd") : "";
    const finalArr = [
      format(new Date(submission?.createdAt), "yyyy-MM-dd"),
      submitterDiscordHandle,
      submitterTwitterHandle,
      submitterWeb3Address,
      approvedAt,
      rejectedAt,
    ];

    if (submission?.stepsData) {
      submission?.stepsData?.forEach((submissionStep) => {
        const contentString = JSON.stringify({
          ...(submissionStep?.content && {
            answer: submissionStep?.content,
          }),
          ...(submissionStep?.skipped && {
            skipped: true,
          }),
          ...(!submissionStep.skipped && {
            verified: true,
          }),
          ...(submissionStep?.tweetId && {
            tweetId: submissionStep?.tweetId,
          }),
          ...(submissionStep?.txHash && {
            txHash: submissionStep?.txHash,
          }),
          ...(submissionStep?.selectedValues && {
            selectedValues: JSON.stringify(submissionStep?.selectedValues),
          }),
        });
        const finalContentString = `"${contentString.replace(/\"/g, '""')}"`;
        finalArr.push(finalContentString);
      });
    }
    rows.push(finalArr);
  });

  let csvContent = "data:text/csv;charset=utf-8,";
  rows.forEach((rowArray) => {
    const row = rowArray.join(",");
    csvContent += `${row}\r\n`;
  });

  let encodedUri = encodeURI(csvContent);
  encodedUri = encodedUri.replace(/#/g, "%23");
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `wonderverse_contributor_data_${formatNowTime}}.csv`);
  document.body.appendChild(link); // Required for FF
  link.click();
};

const QuestResults = ({ submissions, stats = {}, filter, handleFilterChange, fetchMore, hasMore, quest }) => {
  const { ref, inView, entry } = useInView();
  const [exportQuestSubmissionData] = useLazyQuery(EXPORT_QUEST_SUBMISSIONS);
  const { activeOrg } = useContext(GlobalContext);
  const [getCmtyPaymentCount, { data: paymentCountData }] = useLazyQuery(GET_CMTY_PAYMENT_COUNTS);
  const navigate = useNavigate();
  useEffect(() => {
    if (inView && hasMore) {
      fetchMore();
    }
  }, [inView, hasMore, fetchMore]);

  useEffect(() => {
    if (activeOrg?.id) {
      getCmtyPaymentCount({
        variables: {
          input: {
            orgId: activeOrg?.id,
            questId: quest?.id,
            paymentStatus: "unpaid",
          },
        },
      });
    }
  }, [activeOrg?.id]);

  const filters = {
    [QUEST_SUBMISSION_STATUS.IN_REVIEW]: {
      label: "Awaiting Approval",
      value: stats[QUEST_SUBMISSION_STATUS.IN_REVIEW] || 0,
    },

    [QUEST_SUBMISSION_STATUS.APPROVED]: {
      label: "Approved",
      value: stats[QUEST_SUBMISSION_STATUS.APPROVED] || 0,
    },
    [QUEST_SUBMISSION_STATUS.REJECTED]: {
      label: "Rejected",
      value: stats[QUEST_SUBMISSION_STATUS.REJECTED] || 0,
    },
  };

  const totalValue = useMemo(
    () => Object.values(filters).reduce((acc: Number, next) => (acc += next.value), 0),
    [stats]
  );
  const unpaidPaymentsCount = paymentCountData?.getCmtyPaymentsCountForOrg?.count || 0;

  return (
    <Grid
      display="flex"
      gap="24px"
      flexDirection="column"
      alignItems="flex-start"
      justifyContent="flex-start"
      width="100%"
    >
      <Typography fontFamily="Poppins" fontWeight={600} fontSize="18px" lineHeight="24px" color="black">
        {totalValue} submissions
      </Typography>
      <Grid display="flex" gap="14px" alignItems="center" width="100%">
        {Object.keys(filters).map((key, idx) => (
          <FilterPill type="button" key={key} $isActive={key === filter} onClick={() => handleFilterChange(key)}>
            {filters[key].value} {filters[key].label}
          </FilterPill>
        ))}
        <div
          style={{
            flex: 1,
          }}
        />
        <FilterPill
          style={{
            color: "#2a8d5c",
          }}
          onClick={() => {
            exportQuestSubmissionsToCsv({
              exportQuestSubmissionData,
              questId: quest?.id,
            });
          }}
        >
          Export submissions to CSV
        </FilterPill>
        {unpaidPaymentsCount > 0 && (
          <FilterPill
            type="button"
            key="unpaid"
            $isActive={false}
            onClick={() => navigate(`/quests/${quest.id}/payments`)}
          >
            <img
              style={{
                marginRight: "4px",
              }}
              src={RedDot}
            />
            {unpaidPaymentsCount} Awaiting Reward
          </FilterPill>
        )}
      </Grid>
      <Box ref={ref} width="100%" gap="14px" display="flex" alignItems="center" flexDirection="column">
        {submissions?.length ? (
          submissions?.map((submission, idx) => <QuestResultsCard submission={submission} key={idx} />)
        ) : (
          <EmptyState type={EMPTY_STATE_TYPES.SUBMISSIONS} />
        )}
      </Box>
    </Grid>
  );
};

export default QuestResults;
