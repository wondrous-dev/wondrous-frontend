import Grid from '@mui/material/Grid';
import TaskMenuStatus, { getStatusesNonProposalEntity, getStatusesProposal } from 'components/Common/TaskMenuStatus';
import EditIcon from 'components/Icons/editIcon';
import { useMemo } from 'react';
import palette from 'theme/palette';
import { useTaskContext } from 'utils/hooks';
import { TaskSectionLabel } from '../helpers';
import { TaskSectionDisplayDiv, TaskSectionInfoText, ViewFieldHoverWrapper, ViewFieldWrapper } from '../styles';
import { TaskFieldEditableContent } from './Shared';
import { IconWrapper } from './styles';

const EditContent = ({ isTaskProposal, toggleEditMode, fetchedTask, entityType }) => (
  <TaskMenuStatus
    task={fetchedTask}
    isTaskProposal={isTaskProposal}
    entityType={entityType}
    autoFocus
    onClose={toggleEditMode}
  />
);

export const ViewContent = ({ canEdit, toggleEditMode, currentStatus }) => (
  <ViewFieldHoverWrapper $canEdit={canEdit} onClick={toggleEditMode}>
    <ViewFieldWrapper>
      <TaskSectionInfoText>
        <Grid display="flex" gap="6px" alignItems="center" justifyContent="center">
          <IconWrapper
            style={{
              background: 'transparent',
              height: '18px',
              width: '18px',
            }}
          >
            {currentStatus?.icon}
          </IconWrapper>
          {currentStatus?.label ?? currentStatus?.name}
        </Grid>
      </TaskSectionInfoText>
    </ViewFieldWrapper>
    <EditIcon stroke={palette.grey58} className="edit-icon-field" />
  </ViewFieldHoverWrapper>
);

const StatusField = ({ shouldDisplay, canEdit, isTaskProposal, canArchive }) => {
  const { fetchedTask, entityType } = useTaskContext();

  const status = useMemo(() => {
    if (isTaskProposal) {
      return getStatusesProposal({ task: fetchedTask, entityType });
    }
    return getStatusesNonProposalEntity({ task: fetchedTask, entityType, canArchive });
  }, [fetchedTask, entityType, canArchive]);
  if (!shouldDisplay) return null;

  return (
    <TaskSectionDisplayDiv>
      <TaskSectionLabel>Status</TaskSectionLabel>
      <TaskFieldEditableContent
        viewContent={({ toggleEditMode }) => (
          <ViewContent currentStatus={status?.currentStatus} canEdit={canEdit} toggleEditMode={toggleEditMode} />
        )}
        editableContent={({ toggleEditMode }) => (
          <EditContent
            entityType={entityType}
            fetchedTask={fetchedTask}
            toggleEditMode={toggleEditMode}
            isTaskProposal={isTaskProposal}
          />
        )}
      />
    </TaskSectionDisplayDiv>
  );
};
export default StatusField;
