import { withAuth } from 'components/Auth/withAuth';
import { CreateEntity } from 'components/CreateEntity';
import { useRouter } from 'next/router';
import { ENTITIES_TYPES } from 'utils/constants';

const NewTask = () => {
  const router = useRouter();
  const handleRouter = () => router.push('/dashboard');
  return (
    <CreateEntity
      entityType={ENTITIES_TYPES.TASK}
      isTaskProposal={false}
      cancel={handleRouter}
      handleClose={handleRouter}
      open
    />
  );
};

export default withAuth(NewTask);
