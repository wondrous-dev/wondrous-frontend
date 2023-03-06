import { useMutation } from '@apollo/client';
import { TaskMenu } from 'components/Common/TaskMenuStatus';
import { TaskFieldEditableContent } from 'components/Common/TaskViewModal/Fields/Shared';
import { ViewContent } from 'components/Common/TaskViewModal/Fields/StatusField';
import { GrantStatusActiveIcon, GrantStatusCompleted } from 'components/Icons/GrantStatusIcons';
import { UPDATE_GRANT_STATUS } from 'graphql/mutations/grant';
import { GRANTS_STATUSES } from 'utils/constants';
import { useTaskContext } from 'utils/hooks';

const STATUSES = [
  {
    id: GRANTS_STATUSES.OPEN,
    label: 'Active',
    icon: <GrantStatusActiveIcon />,
  },
  {
    id: GRANTS_STATUSES.CLOSED,
    label: 'Completed',
    icon: <GrantStatusCompleted />,
  },
];

const GrantMenuStatus = ({ currentStatus, canEdit }) => {
  const { grant } = useTaskContext();
  const status = STATUSES.find((s) => s.id === currentStatus);
  const [updateGrantStatus] = useMutation(UPDATE_GRANT_STATUS);

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
    <TaskFieldEditableContent
      viewContent={({ toggleEditMode }) => (
        <ViewContent currentStatus={status} canEdit={canEdit} toggleEditMode={toggleEditMode} />
      )}
      editableContent={({ toggleEditMode }) => (
        <TaskMenu
          currentStatus={status}
          autoFocus
          onClose={toggleEditMode}
          filterStatus={STATUSES}
          handleOnChange={handleOnChange}
          disableMenu={!canEdit}
        />
      )}
    />
  );
};

export default GrantMenuStatus;
