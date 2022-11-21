import { useMutation } from '@apollo/client';
import { TaskMenu } from 'components/Common/TaskMenuStatus';
import TaskStatus from 'components/Icons/TaskStatus';
import { UPDATE_GRANT, UPDATE_GRANT_STATUS } from 'graphql/mutations/grant';
import { GRANTS_STATUSES, TASK_STATUS_DONE, TASK_STATUS_TODO } from 'utils/constants';
import { useTaskContext } from 'utils/hooks';

const STATUSES = [
  {
    id: GRANTS_STATUSES.OPEN,
    label: 'Open',
    icon: <TaskStatus status={TASK_STATUS_TODO} />,
  },
  {
    id: GRANTS_STATUSES.CLOSED,
    label: 'Completed',
    icon: <TaskStatus status={TASK_STATUS_DONE} />,
  },
];

const GrantMenuStatus = ({ currentStatus, canEdit }) => {
  const { grant } = useTaskContext();
  const status = STATUSES.find((s) => s.id === currentStatus);
  const [updateGrantStatus] = useMutation(UPDATE_GRANT_STATUS, {
    refetchQueries: ['getGrantOrgBoard', 'getGrantPodBoard', 'getGrantById'],
  });

  const handleOnChange = (status) =>
    updateGrantStatus({
      variables: {
        grantId: grant?.id,
        input: {
          newStatus: status,
        },
      },
    });

  return (
    <TaskMenu currentStatus={status} filterStatus={STATUSES} handleOnChange={handleOnChange} disableMenu={!canEdit} />
  );
};

export default GrantMenuStatus;
