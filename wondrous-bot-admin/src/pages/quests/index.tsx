import { useQuery } from '@apollo/client';
import { Box } from '@mui/material';
import PageHeader from 'components/PageHeader';
import QuestsList from 'components/QuestsList';
import SelectComponent from 'components/Shared/Select';
import { SharedSecondaryButton } from 'components/Shared/styles';
import { GET_QUESTS_FOR_ORG } from 'graphql/queries';
import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QUEST_STATUSES } from 'utils/constants';
import GlobalContext from 'utils/context/GlobalContext';


const INACTIVE_QUESTS = {
  type: QUEST_STATUSES.INACTIVE,
  substatuses: [QUEST_STATUSES.INACTIVE, QUEST_STATUSES.ARCHIVED, QUEST_STATUSES.MAX]
};

const SELECT_QUESTS_TYPE = [
  {
    label: 'All Quests',
    value: null
  },
  {
    label: 'Active Quests',
    value: QUEST_STATUSES.OPEN,
  },
  {
    label: 'Inactive Quests',
    value: INACTIVE_QUESTS.type,
  },
];

const QuestsPage = () => {
  const navigate = useNavigate();
  const [statuses, setStatuses] = useState(null);

  const handleNavigationToNewQuest = () => navigate('/quests/create');

  const { activeOrg } = useContext(GlobalContext);

  

  const { data, refetch } = useQuery(GET_QUESTS_FOR_ORG, {
    variables: {
      notifyOnNetworkStatusChange: true,
      input: {
        orgId: activeOrg?.id,
        limit: 1000,
      },
    },
  });
  
  const handleChange = (value) => {
    const variables:any = {
      input: {
        orgId: activeOrg?.id,
        limit: 1000,
      }
    }
    if(value === INACTIVE_QUESTS.type) {
      variables.input.statuses = INACTIVE_QUESTS.substatuses;
    }
    else if(value) {
      variables.input.status = value;
    }
    setStatuses(value);
    refetch(variables);
  }
  
  return (
    <>
      <PageHeader
        title={`${data?.getQuestsForOrg?.length || 0} Quests`}
        withBackButton={false}
        renderActions={() => (
          <Box display="flex" gap="10px" width="100%">
            <Box minWidth="150px">
            <SelectComponent onChange={handleChange} value={statuses}     
            options={SELECT_QUESTS_TYPE}
            background='#C1B6F6'
            
            />
            </Box>
            <Box>
            <SharedSecondaryButton onClick={handleNavigationToNewQuest}>
            New Quest
          </SharedSecondaryButton>
            </Box>
          </Box>
        )}
      />
      <QuestsList data={data?.getQuestsForOrg}/>
    </>
  );
};

export default QuestsPage;
