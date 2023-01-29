import Grid from '@mui/material/Grid';
import { filterUserOptions, useGetMilestones } from 'components/CreateEntity/CreateEntityModal/Helpers';
import MilestoneSearch from 'components/CreateEntity/CreateEntityModal/MilestoneSearch';
import EditIcon from 'components/Icons/editIcon';
import { useRouter } from 'next/router';
import palette from 'theme/palette';
import { TaskSectionImageContent, TaskSectionLabel } from '../helpers';
import {
  TaskSectionDisplayDiv,
  TaskSectionInfoMilestoneIcon,
  TaskSectionInfoTextMilestone,
  ViewFieldWrapper,
} from '../styles';
import { TaskFieldEditableContent } from './Shared';
import { IconWrapper } from './styles';

const MilestoneFieldContent = ({ milestoneId, getTaskById, milestoneTitle, canEdit, toggleEditMode }) => {
  const router = useRouter();
  return (
    <ViewFieldWrapper canEdit={canEdit} onClick={toggleEditMode}>
      <Grid display="flex" gap="6px" alignItems="center" justifyContent="center">
        <IconWrapper>
          <TaskSectionInfoMilestoneIcon />
        </IconWrapper>
        <TaskSectionInfoTextMilestone
          onClick={() => {
            if (milestoneId) {
              router.query.task = milestoneId;
              router.push(router);
              getTaskById({
                variables: {
                  taskId: milestoneId,
                },
              });
            }
          }}
        >
          {milestoneTitle}
        </TaskSectionInfoTextMilestone>
      </Grid>
      <EditIcon stroke={palette.grey58} className="edit-icon-field" />
    </ViewFieldWrapper>
  );
};

const EditMode = ({ orgId, podId, milestoneId, toggleEditMode }) => {
  const milestonesData = useGetMilestones(orgId, podId);

  return (
    <MilestoneSearch
      autoFocus
      options={filterUserOptions(milestonesData)}
      value={milestoneId}
      onChange={(milestoneId) => {
        console.log('on change');
      }}
      handleClose={() => {
        toggleEditMode();
        console.log(' on close, delete here');
      }}
    />
  );
};

// TODO: IMPLEMENT API

const MilestoneField = ({
  shouldDisplay,
  milestoneId,
  getTaskById,
  milestoneTitle,
  canEdit,
  isSubtask,
  orgId,
  podId,
}) => {
  if (!shouldDisplay) return null;
  const onClose = () => {
    console.log('on close IMPLEMENT API');
  };
  return (
    <TaskSectionDisplayDiv>
      <TaskSectionLabel>Milestone</TaskSectionLabel>
      <TaskFieldEditableContent
        ViewContent={({ toggleEditMode }) => (
          <MilestoneFieldContent
            milestoneId={milestoneId}
            getTaskById={getTaskById}
            milestoneTitle={milestoneTitle}
            toggleEditMode={toggleEditMode}
            canEdit={canEdit && !isSubtask}
          />
        )}
        EditableContent={({ toggleEditMode }) => (
          <EditMode orgId={orgId} podId={podId} milestoneId={milestoneId} toggleEditMode={toggleEditMode} />
        )}
      />
    </TaskSectionDisplayDiv>
  );
};

export default MilestoneField;
