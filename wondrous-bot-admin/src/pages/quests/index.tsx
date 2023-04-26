import PageHeader from 'components/PageHeader';
import QuestsList from 'components/QuestsList';
import { SharedSecondaryButton } from 'components/Shared/styles';
import { useNavigate } from 'react-router-dom';

const QuestsPage = () => {
  const navigate = useNavigate();

  const handleNavigationToNewQuest = () => navigate('/quests/create');
  
  return (
    <>
      <PageHeader
        title='44 Quests'
        withBackButton={false}
        renderActions={() => (
          <SharedSecondaryButton onClick={handleNavigationToNewQuest}>
            New Quest
          </SharedSecondaryButton>
        )}
      />
      <QuestsList />
    </>
  );
};

export default QuestsPage;
