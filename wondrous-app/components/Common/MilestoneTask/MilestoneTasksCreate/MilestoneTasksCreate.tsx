import {
  MilestonesTaskCreateButtonLabel,
  MilestonesTasksCreateButton,
  MilestonesTasksCreateButtonIcon,
  MilestonesTasksCreateButtonIconWrapper,
  MilestoneTasksCreateWrapper,
} from './styles';

const MilestoneTasksCreate = () => {
  return (
    <>
      <MilestoneTasksCreateWrapper>
        <MilestonesTasksCreateButton>
          <MilestonesTasksCreateButtonIconWrapper>
            <MilestonesTasksCreateButtonIcon />
          </MilestonesTasksCreateButtonIconWrapper>
          <MilestonesTaskCreateButtonLabel>Add task</MilestonesTaskCreateButtonLabel>
        </MilestonesTasksCreateButton>
      </MilestoneTasksCreateWrapper>
    </>
  );
};

export default MilestoneTasksCreate;
