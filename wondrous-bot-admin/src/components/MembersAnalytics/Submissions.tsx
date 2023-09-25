import { Box, Grid } from "@mui/material";
import { CardLabel } from "./styles";
import AutocompleteComponent from "components/AddFormEntity/components/AutocompleteComponent";
import { GET_QUESTS_FOR_ORG, GET_QUEST_SUBMISSION_STATS, GET_USER_QUEST_SUBMISSIONS } from "graphql/queries";
import { useLazyQuery } from "@apollo/client";
import { useContext, useEffect, useMemo, useState } from "react";
import GlobalContext from "utils/context/GlobalContext";
import { LIMIT, QUEST_STATUSES, QUEST_SUBMISSION_STATUS } from "utils/constants";
import { ListboxComponent } from "components/Shared/FetchMoreListbox";
import { FilterPill } from "components/ViewQuestResults/styles";
import SubmissionsList, { SubmissionComponent } from "./Common/SubmissionsList";

const Submissions = ({ user }) => {
  const { activeOrg } = useContext(GlobalContext);

  const [activeQuest, setActiveQuest] = useState(null);
  const [activeFilter, setActiveFilter] = useState(QUEST_SUBMISSION_STATUS.APPROVED);
  const [hasMore, setHasMore] = useState(false);
  const [hasMoreSubmissions, setHasMoreSubmissions] = useState(false);
  const [getQuestsForOrg, { data, fetchMore }] = useLazyQuery(GET_QUESTS_FOR_ORG, {
    notifyOnNetworkStatusChange: true,
  });

  const [getQuestSubmissionStats, { data: submissionStats }] = useLazyQuery(GET_QUEST_SUBMISSION_STATS);

  const [
    getUserQuestSubmissions,
    { data: submissionsData, refetch, loading: submissionsLoading, fetchMore: submissionsFetchMore },
  ] = useLazyQuery(GET_USER_QUEST_SUBMISSIONS, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
  });

  useEffect(() => {
    if (activeOrg?.id) {
      getQuestsForOrg({
        variables: {
          input: {
            orgId: activeOrg?.id,
            limit: LIMIT,
            status: QUEST_STATUSES.OPEN,
            offset: 0,
          },
        },
      }).then(({ data }) => {
        if (data?.getQuestsForOrg?.length >= LIMIT) {
          setHasMore(true);
        }
      });
    }
  }, [activeOrg?.id]);

  const initFetch = async () => {
    const { data } = await getUserQuestSubmissions({
      variables: {
        cmtyUserId: user?.id,
        orgId: activeOrg?.id,
        limit: LIMIT,
        offset: 0,
        questId: activeQuest,
      },
    });
    const {data: statsData} = await getQuestSubmissionStats({
      variables: {
        questId: activeQuest,
        cmtyUserId: user?.id,
        orgId: activeOrg?.id,
      }
    });
    if (data?.getUserQuestSubmissions?.length >= LIMIT) {
      setHasMoreSubmissions(true);
    }

  };
  useEffect(() => {
    if (activeOrg?.id && user?.id) {
      initFetch();
    }
  }, [user?.id, activeOrg?.id]);

  const options = useMemo(() => {
    if (!data) return [];
    return data?.getQuestsForOrg?.map((quest) => ({
      label: quest.title,
      value: quest.id,
    }));
  }, [data]);

  const handleFetchMore = async () => {
    if (!data?.getQuestsForOrg?.length || !hasMore) return;
    const { data: fetchMoreData } = await fetchMore({
      variables: {
        input: {
          orgId: activeOrg?.id,
          limit: LIMIT,
          status: QUEST_STATUSES.OPEN,
          offset: data?.getQuestsForOrg?.length || 0,
        },
      },
    });
    setHasMore(fetchMoreData?.getQuestsForOrg?.length === LIMIT);
  };

  const handleFetchMoreSubmissions = async () => {
    if (!hasMoreSubmissions) return;
    const { data: fetchMoreData } = await submissionsFetchMore({
      variables: {
        cmtyUserId: user?.id,
        orgId: activeOrg?.id,
        limit: LIMIT,
        offset: submissionsData?.getUserQuestSubmissions?.length || 0,
        questId: activeQuest,
      },
    });
    setHasMoreSubmissions(fetchMoreData?.getUserQuestSubmissions?.length === LIMIT);
  };

  const handleChange = (questId) => {
    setActiveQuest(questId);
    refetch({
      cmtyUserId: user?.id,
      orgId: activeOrg?.id,
      limit: LIMIT,
      offset: 0,
      questId: questId,
    });
  };

  const filters = {
    [QUEST_SUBMISSION_STATUS.APPROVED]: {
      label: "Approved",
      value: submissionStats?.getQuestSubmissionStats[QUEST_SUBMISSION_STATUS.APPROVED] || 0,
    },

    [QUEST_SUBMISSION_STATUS.IN_REVIEW]: {
      label: "Awaiting Approval",
      value: submissionStats?.getQuestSubmissionStats[QUEST_SUBMISSION_STATUS.IN_REVIEW] || 0,
    },

    [QUEST_SUBMISSION_STATUS.REJECTED]: {
      label: "Rejected",
      value: submissionStats?.getQuestSubmissionStats[QUEST_SUBMISSION_STATUS.REJECTED] || 0,
    },
  };

  const handleFilterChange = async (value) => {
    setActiveFilter(value);
    const {data} = await refetch({
      status: value,
    })
    if (data?.getUserQuestSubmissions?.length >= LIMIT) {
      setHasMoreSubmissions(true);
    }
  };

  return (
    <Grid gap="24px" display="flex" flexDirection="column">
      <CardLabel>6 submissions</CardLabel>
      <Box display="flex" flexDirection="column" gap="14px">
        <Box maxWidth="267px">
          <AutocompleteComponent
            bgColor="#E8E8E8"
            autocompletProps={{
              ListboxComponent: ListboxComponent,
            }}
            listBoxProps={{
              handleFetchMore,
              hasMore,
            }}
            fullWidth
            options={options || []}
            onChange={handleChange}
            value={activeQuest}
            inputProps={{ placeholder: "Filter by quest" }}
          />
        </Box>
        <Box display="flex" gap="14px" alignItems="center" width="100%">
          {Object.keys(filters).map((key, idx) => (
            <FilterPill type="button" key={key} $isActive={key === activeFilter} onClick={() => handleFilterChange(key)}>
              {filters[key].value} {filters[key].label}
            </FilterPill>
          ))}
        </Box>
      </Box>
      <SubmissionsList
        loading={submissionsLoading}
        data={submissionsData?.getUserQuestSubmissions}
        fetchMore={handleFetchMoreSubmissions}
        hasMore={hasMoreSubmissions}
      />
    </Grid>
  );
};

export default Submissions;
