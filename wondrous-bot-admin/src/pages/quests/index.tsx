import { useLazyQuery, useQuery } from "@apollo/client";
import { Box } from "@mui/material";
import { useTour } from "@reactour/tour";
import { useMe } from "components/Auth";
import PageHeader from "components/PageHeader";
import QuestsList from "components/QuestsList";
import SelectComponent from "components/Shared/Select";
import { SharedSecondaryButton } from "components/Shared/styles";
import { GET_QUESTS_FOR_ORG } from "graphql/queries";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { QUEST_STATUSES, TUTORIALS } from "utils/constants";
import GlobalContext from "utils/context/GlobalContext";

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
  const navigate = useNavigate();
  const [statuses, setStatuses] = useState(QUEST_STATUSES.OPEN);
  const { user } = useMe() || {};
  const handleNavigationToNewQuest = () => navigate("/quests/create");

  const { activeOrg } = useContext(GlobalContext);

  const [getQuestsForOrg, { data, refetch }] = useLazyQuery(GET_QUESTS_FOR_ORG, {
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      if (
        user &&
        !user?.completedQuestGuides?.includes(TUTORIALS.COMMUNITIES_QUESTS_PAGE_GUIDE) &&
        data?.getQuestsForOrg?.length
      ) {
        setIsOpen(true);
        const quest = data?.getQuestsForOrg[0];
        setMeta(quest?.id);
      }
    },
  });

  const handleFetch = async () => {
    const { data } = await getQuestsForOrg({
      variables: {
        input: {
          orgId: activeOrg?.id,
          limit: 1000,
          status: QUEST_STATUSES.OPEN,
        },
      },
    });
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
  useEffect(() => {
    if (activeOrg?.id) {
      handleFetch();
    }
  }, [activeOrg?.id]);

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

  return (
    <>
      <PageHeader
        title={`${data?.getQuestsForOrg?.length || 0} Quests`}
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
      <QuestsList data={data?.getQuestsForOrg} />
    </>
  );
};

export default QuestsPage;
