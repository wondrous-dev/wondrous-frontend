import { Grid, Typography } from '@mui/material';
import PageHeader from 'components/PageHeader';
import QuestsList from 'components/QuestsList';
import { SharedButton } from 'components/Shared/styles';
import { Link } from 'react-router-dom';
import { pinkColors } from 'utils/theme/colors';

const QuestsPage = () => {
  return (
    <>
    <PageHeader 
      title="44 Quests"
      withBackButton={false}
    />
    <QuestsList />
    </>
  );
};

export default QuestsPage;
