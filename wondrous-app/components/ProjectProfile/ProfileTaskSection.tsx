import Grid from '@mui/material/Grid';
import { UserProfilePicture } from 'components/Common/ProfilePictureHelpers';
import TaskCardDate from 'components/Common/TaskCardDate';
import CheckBoxIcon from 'components/Icons/Sidebar/checkBox.svg';
import palette from 'theme/palette';
import { ENTITIES_TYPES } from 'utils/constants';
import ApplyOrClaimButton from './ApplyOrClaimButton';
import { useEntityCreateButtonProps, useGetProjectPageTasks } from './helpers';
import SectionContent from './SectionContent';
import { ProfileGrid } from './styles';

const LeftComponent = ({ assigneeProfilePicture, title, assigneeId }) => (
  <ProfileGrid container gap="12px" alignItems="center" fontWeight="600" color={palette.white}>
    {assigneeId ? <UserProfilePicture avatar={assigneeProfilePicture} /> : null}
    {title}
  </ProfileGrid>
);

const RightComponent = (props) => {
  const { dueDate } = props;
  return (
    <Grid container item gap="12px">
      <TaskCardDate date={dueDate} />
      <ApplyOrClaimButton task={props} />
    </Grid>
  );
};

const ProfileTaskSection = () => (
  <SectionContent
    HeaderTitleProps={{
      text: 'Tasks',
      IconComponent: CheckBoxIcon,
    }}
    CreateButtonProps={useEntityCreateButtonProps(ENTITIES_TYPES.TASK)}
    backgroundImageUrl="/images/project/task-empty-bg.svg"
    showAllUrl="boards?entity=task"
    ListItemProps={{
      LeftComponent,
      RightComponent,
      onClick: ({ router, data: { id } }) =>
        router.push({ query: { ...router.query, task: id } }, undefined, { scroll: false }),
    }}
    data={useGetProjectPageTasks()}
  />
);

export default ProfileTaskSection;
