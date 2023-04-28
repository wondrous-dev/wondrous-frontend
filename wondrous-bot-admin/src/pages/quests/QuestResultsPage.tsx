import { useQuery } from '@apollo/client';
import PageHeader from 'components/PageHeader';
import { SharedSecondaryButton } from 'components/Shared/styles';
import ViewQuestResults from 'components/ViewQuestResults';
import { GET_QUEST_BY_ID } from 'graphql/queries';
import { useNavigate, useParams } from 'react-router-dom';

const QuestResultsPage = () => {
  const navigate = useNavigate();

  let { id } = useParams();

  const handleNavigationToNewQuest = () => navigate('/quests/create');

  return (
    <>
      <PageHeader
        title='Member Quiz'
        withBackButton
        renderActions={() => (
          <SharedSecondaryButton onClick={handleNavigationToNewQuest}>
            New Quest
          </SharedSecondaryButton>
        )}
      />
      <ViewQuestResults questId={id}/>
    </>
  );
};

export default QuestResultsPage;
