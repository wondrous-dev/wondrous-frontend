import { Box, CircularProgress, Grid } from "@mui/material";
import { CardLabel } from "./styles";
import { useLazyQuery } from "@apollo/client";
import { GET_ONBOARDING_QUEST_SUBMISSIONS } from "graphql/queries";
import { useContext, useEffect, useState } from "react";
import GlobalContext from "utils/context/GlobalContext";
import SubmissionsList, { SubmissionComponent } from "./Common/SubmissionsList";
import { LIMIT } from "utils/constants";

const OnboardingSubmissions = ({ user }) => {
  const [hasMore, setHasMore] = useState(false);

  const { activeOrg } = useContext(GlobalContext);
  const [getOnboardingQuestSubmissions, { data, loading, fetchMore }] = useLazyQuery(GET_ONBOARDING_QUEST_SUBMISSIONS, {
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
  });

  useEffect(() => {
    if (user?.id && activeOrg?.id) {
      getOnboardingQuestSubmissions({
        variables: {
          cmtyUserId: user?.id,
          orgId: activeOrg?.id,
          limit: LIMIT,
          offset: 0,
        },
      }).then(({data}) => {
        if(data?.getQuestSubmissionsOnboarding?.length >= LIMIT) {
          setHasMore(true)
        }
      });
    }
  }, [user?.id, activeOrg?.id]);

  const handleFetchMore = async () => {
    if (!hasMore) return;
    const { data: fetchMoreData } = await fetchMore({
      variables: {
        cmtyUserId: user?.id,
        orgId: activeOrg?.id,
        limit: LIMIT,
        offset: data?.getQuestSubmissionsOnboarding?.length || 0,
      },
    });
    setHasMore(fetchMoreData?.getQuestSubmissionsOnboarding?.length === LIMIT);
  };
  return (
    <Grid gap="24px" display="flex" flexDirection="column">
      <CardLabel>Onboarding Submissions</CardLabel>

      <SubmissionsList
        loading={loading}
        data={data?.getQuestSubmissionsOnboarding}
        fetchMore={handleFetchMore}
        hasMore={hasMore}
      />
    </Grid>
  );
};

export default OnboardingSubmissions;
