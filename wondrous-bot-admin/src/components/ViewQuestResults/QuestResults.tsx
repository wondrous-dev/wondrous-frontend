import { Box, Grid, Typography } from "@mui/material";
import EmptyState from "components/EmptyState";
import { useEffect, useMemo, useState } from "react";
import { useInView } from "react-intersection-observer";
import { EMPTY_STATE_TYPES, QUEST_SUBMISSION_STATUS } from "utils/constants";
import { format } from "date-fns";
import QuestResultsCard from "./QuestResultsCard";
import { FilterPill } from "./styles";
import { useLazyQuery, useMutation } from "@apollo/client";
import { EXPORT_QUEST_SUBMISSIONS } from "graphql/queries";

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

  const questSubmissions = questSubmissionData?.data?.exportQuestSubmissions;
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
    rows.push([
      [
        format(new Date(submission?.createdAt), "yyyy-MM-dd"),
        submitterDiscordHandle,
        submitterTwitterHandle,
        submitterWeb3Address,
        approvedAt,
        rejectedAt,
      ],
    ]);
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
  useEffect(() => {
    if (inView && hasMore) {
      fetchMore();
    }
  }, [inView, hasMore, fetchMore]);

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
