import { Box, ButtonBase, CircularProgress, Grid, Typography } from "@mui/material";
import EmptyState from "components/EmptyState";
import { useEffect, useMemo, useState, useContext } from "react";
import GlobalContext from "utils/context/GlobalContext";
import { useInView } from "react-intersection-observer";
import { EMPTY_STATE_TYPES, QUEST_SUBMISSION_STATUS, TYPES } from "utils/constants";
import { format } from "date-fns";
import QuestResultsCard from "./QuestResultsCard";
import { FilterPill } from "./styles";
import { useLazyQuery, useMutation } from "@apollo/client";
import { EXPORT_QUEST_SUBMISSIONS, GET_QUEST_REFERRAL_LEADERBOARD } from "graphql/queries";
import { GET_CMTY_PAYMENT_COUNTS } from "graphql/queries";
import RedDot from "assets/redDot.svg";
import { useNavigate } from "react-router-dom";
import TableComponent from "components/TableComponent";
import { getBaseUrl } from "utils/common";
import { exportQuestSubmissionsToCsv } from "utils/exports";
import Spinner from "components/Shared/Spinner";

const QuestResults = ({ submissions, stats = {}, filter, handleFilterChange, fetchMore, hasMore, quest, loading }) => {
  const { ref, inView, entry } = useInView();
  const [exportQuestSubmissionData] = useLazyQuery(EXPORT_QUEST_SUBMISSIONS);
  const [exportQuestLoading, setExportQuestLoading] = useState(false);
  const { activeOrg } = useContext(GlobalContext);
  const [getCmtyPaymentCount, { data: paymentCountData }] = useLazyQuery(GET_CMTY_PAYMENT_COUNTS);
  const [getQuestReferralLeaderboard, { data: referralData }] = useLazyQuery(GET_QUEST_REFERRAL_LEADERBOARD);
  const navigate = useNavigate();
  useEffect(() => {
    if (inView && hasMore) {
      fetchMore();
    }
  }, [inView, hasMore, fetchMore]);
  const hasReferralStep = quest?.steps?.some((step) => step.type === TYPES.REFERRAL);
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

  useEffect(() => {
    if (hasReferralStep) {
      getQuestReferralLeaderboard({
        variables: {
          questId: quest?.id,
        },
      });
    }
  }, [hasReferralStep]);
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
  const referralHeaders = ["Name", "Referral Code", "Referrals Made"];
  const tableConfig = referralData?.getQuestReferralLeaderBoard.map((userReferral) => ({
    id: userReferral.referrerId,
    name: {
      component: "label",
      value: userReferral?.referrerDiscordUsername,
    },
    link: {
      component: "link",
      value: `${getBaseUrl()}/referral?referralCode=${userReferral?.referralCode}`,
      text: userReferral?.referralCode,
    },
    referralCount: {
      component: "label",
      value: userReferral?.referralCount,
    },
  }));
  return (
    <Grid
      display="flex"
      gap="24px"
      flexDirection="column"
      alignItems="flex-start"
      justifyContent="flex-start"
      width="100%"
    >
      {hasReferralStep ? (
        <>
          <TableComponent headers={referralHeaders} data={tableConfig} />
        </>
      ) : (
        <>
          <Typography fontFamily="Poppins" fontWeight={600} fontSize="18px" lineHeight="24px" color="black">
            {totalValue} submissions
          </Typography>
          <Grid display="flex" gap="14px" alignItems="center" width="100%">
            {Object.keys(filters).map((key, idx) => (
              <FilterPill
                type="button"
                key={key}
                $isActive={key === filter}
                onClick={() => handleFilterChange(filter, key)}
              >
                {filters[key].value} {filters[key].label}
              </FilterPill>
            ))}
            <div
              style={{
                flex: 1,
              }}
            />
            {exportQuestLoading ? (
              <CircularProgress />
            ) : (
              <FilterPill
                style={{
                  color: "#2a8d5c",
                }}
                onClick={() => {
                  exportQuestSubmissionsToCsv({
                    exportQuestSubmissionData,
                    questId: quest?.id,
                    loading: exportQuestLoading,
                    setLoading: setExportQuestLoading,
                  });
                }}
              >
                Export submissions to CSV
              </FilterPill>
            )}
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
          <Box width="100%" gap="14px" display="flex" alignItems="center" flexDirection="column">
            {submissions?.length ? (
              submissions?.map((submission, idx) => <QuestResultsCard submission={submission} key={idx} />)
            ) : loading ? null : (
              <EmptyState type={EMPTY_STATE_TYPES.SUBMISSIONS} />
            )}
            {loading && (
              <Spinner
                sx={{
                  marginTop: "24px",
                }}
                size={60}
              />
            )}
          </Box>
          {submissions?.length > 0 && !loading ? <Box ref={ref} height="1px" /> : null}
        </>
      )}
    </Grid>
  );
};

export default QuestResults;
