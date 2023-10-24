import { useLazyQuery, useQuery } from "@apollo/client";
import { Box } from "@mui/material";
import { useTour } from "@reactour/tour";
import { useMe } from "components/Auth";
import PageHeader from "components/PageHeader";
import { PricingOptionsTitle, getPlan } from "components/Pricing/PricingOptionsListItem";
import QuestsList from "components/QuestsList";
import SelectComponent from "components/Shared/Select";
import { SharedSecondaryButton } from "components/Shared/styles";
import { GET_ORG_QUEST_STATS, GET_QUESTS_FOR_ORG } from "graphql/queries";
import { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { QUEST_STATUSES, TUTORIALS } from "utils/constants";
import GlobalContext from "utils/context/GlobalContext";
import { usePaywall, useSubscription } from "utils/hooks";

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
  const { setIsOpen, setMeta } = useTour();
  const { activeOrg } = useContext(GlobalContext);
  const navigate = useNavigate();
  const [statuses, setStatuses] = useState(QUEST_STATUSES.OPEN);
  const { user } = useMe() || {};
  const subscription = useSubscription();
  const { setPaywall, setPaywallMessage } = usePaywall();
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
      setPaywallMessage("You have reached the limit of quests for your current plan.");
    } else {
      navigate("/quests/create");
    }
  };

  const handleOnFetchCompleted = async (data) => {
    if (
      user &&
      !user?.completedQuestGuides?.includes(TUTORIALS.COMMUNITIES_QUESTS_PAGE_GUIDE) &&
      data?.getQuestsForOrg?.length
    ) {
      setIsOpen(true);
      const quest = data?.getQuestsForOrg[0];
      setMeta(quest?.id);
    }
    if (!data?.getQuestsForOrg?.length) {
      const variables: any = {
        input: {
          orgId: activeOrg?.id,
          limit: 1000,
          status: null,
        },
      };
      setStatuses(null);
      await refetch(variables);
    }
  };
  const { data, refetch } = useQuery(GET_QUESTS_FOR_ORG, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
    nextFetchPolicy: "cache-and-network",
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
              <SharedSecondaryButton onClick={handleNavigationToNewQuest}>New Quest</SharedSecondaryButton>
            </Box>
          </Box>
        )}
      />
      <QuestsList data={sortedData} 
      status={statuses}
      />
    </>
  );
};

export default QuestsPage;
