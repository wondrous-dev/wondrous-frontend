import Grid from '@mui/material/Grid';
import { UserProfilePicture } from 'components/Common/ProfilePictureHelpers';
import TaskCardDate from 'components/Common/TaskCardDate';
import CheckBoxIcon from 'components/Icons/Sidebar/checkBox.svg';
import palette from 'theme/palette';
import { ENTITIES_TYPES } from 'utils/constants';
import ApplyOrClaimButton from './ApplyOrClaimButton';
import { useEntityCreateButtonProps, useGetOrgEntity } from './helpers';

const LeftComponent = ({ assigneeProfilePicture, title, assigneeId }) => (
  <Grid container gap="12px" alignItems="center" fontWeight="600" color={palette.white}>
    {assigneeId ? <UserProfilePicture avatar={assigneeProfilePicture} /> : null}
    {title}
  </Grid>
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

const useListTaskProps = () => ({
  HeaderTitleProps: {
    text: 'Task',
    IconComponent: CheckBoxIcon,
  },
  CreateButtonProps: useEntityCreateButtonProps(ENTITIES_TYPES.TASK),
  backgroundImageUrl: '/images/project/task-empty-bg.svg',
  showAllUrl: 'boards?entity=task',
  ListItemProps: {
    LeftComponent,
    RightComponent,
    onClick: (router, { orgUsername, id }) =>
      router.push(`/organization/${orgUsername}/boards?task=${id}&view=grid&entity=task`),
  },
  data: useGetOrgEntity('task'),
});

export default useListTaskProps;
