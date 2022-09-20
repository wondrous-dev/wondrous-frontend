import { useMe } from 'components/Auth/withAuth';
import CoordinapeIntegrationForm from './CoordinapeIntegrationForm';
import { CoordinapePageWrapper } from './styles';

const CoordinapePage = () => {
  const user = useMe();

  return (
    <CoordinapePageWrapper>
      <CoordinapeIntegrationForm user={user} />
    </CoordinapePageWrapper>
  );
};

export default CoordinapePage;
