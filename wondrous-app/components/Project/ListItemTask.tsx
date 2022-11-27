import Grid from '@mui/material/Grid';
import { UserProfilePicture } from 'components/Common/ProfilePictureHelpers';
import TaskCardDate from 'components/Common/TaskCardDate';
import ListItemWrapper from 'components/Project/ListItemWrapper';
import palette from 'theme/palette';
import ApplyOrClaimButton from './ApplyOrClaimButton';

interface IListItemTask {
  task;
}

const LeftComponent = ({ assigneeProfilePicture, title }) => (
  <Grid container gap="12px" alignItems="center" fontWeight="600" color={palette.white}>
    <UserProfilePicture avatar={assigneeProfilePicture} />
    {title}
  </Grid>
);

const RightComponent = (props) => {
  const { date, type } = props;
  return (
    <Grid container item gap="12px">
      <TaskCardDate date={date} />
      <ApplyOrClaimButton type={type} task={props} />
    </Grid>
  );
};

const ListItemTask = (props: IListItemTask) => (
  <ListItemWrapper
    LeftComponent={LeftComponent}
    LeftComponentProps={props}
    RightComponent={RightComponent}
    RightComponentProps={props}
  />
);

export default ListItemTask;
