import { Grid, Box } from "@mui/material";
import { CmtyActivityEmptyState, SharedShowMoreButton } from "../shared";
import { PanelCount, PanelTitle } from "../shared/styles";
import { GET_USER_QUEST_SUBMISSIONS } from "graphql/queries";
import { useLazyQuery } from "@apollo/client";
import SubmissionsList from "components/MembersAnalytics/Common/SubmissionsList";
import { useEffect, useState } from "react";
import { SubmissionEmptyIcon } from "components/Icons/SubmissionsEmptyIcon";
import { CmtyUserSubmissionsContainer } from "./styles";
import { ActivityPointsIcon } from "components/Icons/Rewards";

const LIMIT = 5;
const CmtyUserSubmissions = ({ count = 0, cmtyUserId, orgId }) => {
  const [hasMore, setHasMore] = useState(false);
  const [
    getUserQuestSubmissions,
    { data: submissionsData, refetch, loading: submissionsLoading, fetchMore: submissionsFetchMore },
  ] = useLazyQuery(GET_USER_QUEST_SUBMISSIONS, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
  });

  const handleFetch = async () => {
    const { data } = await getUserQuestSubmissions({
      variables: {
        limit: LIMIT,
        offset: 0,
        cmtyUserId,
        orgId,
      },
    });
    setHasMore(data?.getUserQuestSubmissions?.length >= LIMIT);
  };

  useEffect(() => {
    handleFetch();
  }, []);
  const handleShowMore = () => {
    submissionsFetchMore({
      variables: {
        limit: LIMIT,
        offset: submissionsData?.getUserQuestSubmissions?.length,
        cmtyUserId,
        orgId,
      },
    });
  };

  return (
    <CmtyUserSubmissionsContainer display="flex" flexDirection="column" gap="18px" width="100%">
      <Box display="flex" alignItems="center" gap="8px" justifyContent="flex-start">
        <PanelCount>
          <PanelTitle>{count || 0}</PanelTitle>
        </PanelCount>
        <PanelTitle>submissions</PanelTitle>
      </Box>
      <Box display="flex" justifyContent="center" alignItems="center" width="100%" height="100%">
        <SubmissionsList
          loading={submissionsLoading}
          data={submissionsData?.getUserQuestSubmissions}
          pointsIcon={() => <ActivityPointsIcon />}
          wrapperSx={{}}
          emptyState={() => <CmtyActivityEmptyState Image={SubmissionEmptyIcon} title="No submissions yet" />}
        />
      </Box>
      {hasMore && submissionsData?.getUserQuestSubmissions?.length >= LIMIT && (
        <SharedShowMoreButton onClick={handleShowMore} />
      )}
    </CmtyUserSubmissionsContainer>
  );
};

export default CmtyUserSubmissions;
