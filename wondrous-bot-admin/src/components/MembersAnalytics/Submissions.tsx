import { Box, Grid } from "@mui/material";
import { SecondaryAccordion, SubmissionComponent } from "./Common";
import { CardLabel } from "./styles";
import AutocompleteComponent from "components/AddFormEntity/components/AutocompleteComponent";
import { GET_QUESTS_FOR_ORG, GET_USER_QUEST_SUBMISSIONS } from "graphql/queries";
import { useLazyQuery } from "@apollo/client";
import { useContext, useEffect, useMemo, useState } from "react";
import GlobalContext from "utils/context/GlobalContext";
import { LIMIT, QUEST_STATUSES, QUEST_SUBMISSION_STATUS } from "utils/constants";
import { ListboxComponent } from "components/Shared/FetchMoreListbox";
import { FilterPill } from "components/ViewQuestResults/styles";

const Submissions = ({ user }) => {
  const { activeOrg } = useContext(GlobalContext);

  const [activeQuest, setActiveQuest] = useState(QUEST_SUBMISSION_STATUS.APPROVED);
  const [activeFilter, setActiveFilter] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [getQuestsForOrg, { data, fetchMore }] = useLazyQuery(GET_QUESTS_FOR_ORG, {
    notifyOnNetworkStatusChange: true,
  });

  const [getUserQuestSubmissions, { data: submissionsData, refetch }] = useLazyQuery(GET_USER_QUEST_SUBMISSIONS, {
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

  useEffect(() => {
    if (activeOrg?.id && user?.id) {
      getUserQuestSubmissions({
        variables: {
          cmtyUserId: user?.id,
          orgId: activeOrg?.id,
          limit: LIMIT,
          offset: 0,
          questId: activeQuest,
        },
      });
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

  const stats = {};
  const filters = {
    [QUEST_SUBMISSION_STATUS.APPROVED]: {
      label: "Approved",
      value: stats[QUEST_SUBMISSION_STATUS.APPROVED] || 0,
    },

    [QUEST_SUBMISSION_STATUS.IN_REVIEW]: {
      label: "Awaiting Approval",
      value: stats[QUEST_SUBMISSION_STATUS.IN_REVIEW] || 0,
    },

    [QUEST_SUBMISSION_STATUS.REJECTED]: {
      label: "Rejected",
      value: stats[QUEST_SUBMISSION_STATUS.REJECTED] || 0,
    },
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
            <FilterPill type="button" key={key} $isActive={key === activeFilter} onClick={() => {}}>
              {filters[key].value} {filters[key].label}
            </FilterPill>
          ))}
        </Box>
      </Box>
      <Box display="flex" flexDirection="column" gap="14px">
        {submissionsData?.getUserQuestSubmissions?.map((submission) => (
          <SubmissionComponent key={submission.id} submission={submission} />
        ))}
      </Box>
    </Grid>
  );
};

export default Submissions;
