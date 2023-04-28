import { useQuery } from '@apollo/client';
import PageHeader from 'components/PageHeader';
import QuestsList from 'components/QuestsList';
import { SharedSecondaryButton } from 'components/Shared/styles';
import { GET_QUESTS_FOR_ORG } from 'graphql/queries';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import GlobalContext from 'utils/context/GlobalContext';

const QuestsPage = () => {
  const navigate = useNavigate();

  const handleNavigationToNewQuest = () => navigate('/quests/create');

  const { activeOrg } = useContext(GlobalContext);

  const { data, refetch, variables } = useQuery(GET_QUESTS_FOR_ORG, {
    variables: {
      notifyOnNetworkStatusChange: true,
      input: {
        orgId: activeOrg?.id,
        limit: 1000,
      },
    },
  });

  return (
    <>
      <PageHeader
        title={`${data?.getQuestsForOrg?.length || 0} Quests`}
        withBackButton={false}
        renderActions={() => (
          <SharedSecondaryButton onClick={handleNavigationToNewQuest}>
            New Quest
          </SharedSecondaryButton>
        )}
      />
      <QuestsList data={data?.getQuestsForOrg}/>
    </>
  );
};

export default QuestsPage;
