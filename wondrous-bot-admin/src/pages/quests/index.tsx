import { useQuery } from "@apollo/client";
import { Box } from "@mui/material";
import { useTour } from "@reactour/tour";
import { useMe } from "components/Auth";
import PageHeader from "components/PageHeader";
import PageSpinner from "components/PageSpinner";
import { PricingOptionsTitle } from "components/Pricing/PricingOptionsListItem";
import QuestsList from "components/QuestsList";
import SelectComponent from "components/Shared/Select";
import { SharedSecondaryButton } from "components/Shared/styles";
import QuestsTutorial from "components/TutorialComponent/QuestsTutorial";
import { GET_ORG_QUEST_STATS, GET_QUESTS_FOR_ORG } from "graphql/queries";
import { useContext, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPlan } from "utils/common";
import { QUEST_STATUSES, TUTORIALS } from "utils/constants";
import GlobalContext from "utils/context/GlobalContext";
import { useSubscription, useSubscriptionPaywall } from "utils/hooks";

const INACTIVE_QUESTS = {
  type: QUEST_STATUSES.INACTIVE,
  substatuses: [QUEST_STATUSES.INACTIVE, QUEST_STATUSES.ARCHIVED, QUEST_STATUSES.MAX],
};

const SELECT_QUESTS_TYPE = [
  {
    label: "All Quests",
    value: null,
  },
  {
    label: "Active Quests",
    value: QUEST_STATUSES.OPEN,
  },
  {
    label: "Inactive Quests",
    value: INACTIVE_QUESTS.type,
  },
];

const QuestsPage = () => {
  const { activeOrg } = useContext(GlobalContext);
  const navigate = useNavigate();

  const [statuses, setStatuses] = useState(QUEST_STATUSES.OPEN);

  const subscription = useSubscription();
  const { setPaywall, setPaywallMessage } = useSubscriptionPaywall();
  const [isLoading, setIsLoading] = useState(true);

  const { data: getOrgQuestStatsData, loading } = useQuery(GET_ORG_QUEST_STATS, {
    notifyOnNetworkStatusChange: true,
    variables: {
      orgId: activeOrg?.id,
    },
    skip: !activeOrg?.id,
  });

  const { totalQuests } = getOrgQuestStatsData?.getOrgQuestStats || {};
  const plan = getPlan(subscription?.tier);
  const handleNavigationToNewQuest = () => {
    if (plan === PricingOptionsTitle.Basic && totalQuests >= 100) {
      setPaywall(true);
      return setPaywallMessage("You have reached the limit of quests for your current plan.");
    } else {
      navigate("/quests/create");
    }
  };

  const handleOnFetchCompleted = async (data) => {
    if (!data?.getQuestsForOrg?.length && statuses === QUEST_STATUSES.OPEN && isLoading) {
      const variables: any = {
        input: {
          orgId: activeOrg?.id,
          limit: 1000,
          status: null,
        },
      };
      setStatuses(null);
      return await refetch(variables);
    }
    setIsLoading(false);
  };

  const { data, refetch } = useQuery(GET_QUESTS_FOR_ORG, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "cache-and-network",
    nextFetchPolicy: "cache-first",
    skip: !activeOrg?.id,
    variables: {
      input: {
        orgId: activeOrg?.id,
        limit: 1000,
        status: QUEST_STATUSES.OPEN,
      },
    },
    onCompleted: (data) => handleOnFetchCompleted(data),
  });

  const handleChange = (value) => {
    const variables: any = {
      input: {
        orgId: activeOrg?.id,
        limit: 1000,
      },
    };
    if (value === INACTIVE_QUESTS.type) {
      variables.input.statuses = INACTIVE_QUESTS.substatuses;
    } else if (value) {
      variables.input.status = value;
    }
    setStatuses(value);
    refetch(variables);
  };

  const sortedData = useMemo(() => {
    return [...(data?.getQuestsForOrg || [])]?.sort((a, b) => {
      if (a.order !== null && b.order !== null) {
        return a.order - b.order;
      } else if (a.order !== null) {
        return 0;
      } else if (b.order !== null) {
        return -1;
      } else {
        return 0;
      }
    });
  }, [data?.getQuestsForOrg]);

  const questsLength = useMemo(() => data?.getQuestsForOrg?.length || 0, [data?.getQuestsForOrg?.length]);

  if (isLoading) return <PageSpinner />;

  return (
    <>
      <PageHeader
        title={`${questsLength || 0} Quests`}
        withBackButton={false}
        renderActions={() => (
          <Box display="flex" gap="10px" width="100%">
            <Box minWidth="150px">
              <SelectComponent
                onChange={handleChange}
                value={statuses}
                options={SELECT_QUESTS_TYPE}
                background="#C1B6F6"
              />
            </Box>
            <Box>
              <SharedSecondaryButton
                data-tour="quests-page-guide-new-quest-button"
                onClick={handleNavigationToNewQuest}
              >
                New Quest
              </SharedSecondaryButton>
            </Box>
          </Box>
        )}
      />
      {data ? <QuestsTutorial /> : null}
      <QuestsList data={sortedData} status={statuses} />
    </>
  );
};

export default QuestsPage;
