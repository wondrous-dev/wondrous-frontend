import { Grid } from '@mui/material';
import { UserProfilePicture } from 'components/Common/ProfilePictureHelpers';
import TaskCardDate from 'components/Common/TaskCardDate';
import ListItemWrapper from 'components/Project/ListItemWrapper';
import palette from 'theme/palette';
import { usePermissions } from 'utils/hooks';

interface IListItemTask {
  task;
}

const LeftComponent = ({ assigneeProfilePicture, title }) => (
  <Grid container gap="12px" alignItems="center" fontWeight="600" color={palette.white}>
    <UserProfilePicture avatar={assigneeProfilePicture} />
    {title}
  </Grid>
);

const RightComponent = ({ date, type }) => {
  const { canClaim } = usePermissions({ type });
  return (
    <Grid container>
      {/* {true && <p>claim</p>} */}
      <TaskCardDate date={date} />
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
