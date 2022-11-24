import Grid from '@mui/material/Grid';
import { UserProfilePicture } from 'components/Common/ProfilePictureHelpers';
import TaskCardStatus from 'components/Common/TaskCardStatus';
import ListItemWrapper from 'components/Project/ListItemWrapper';
import palette from 'theme/palette';

interface IListItemProposal {
  proposal;
}

const LeftComponent = ({ title, creator }) => (
  <Grid container gap="12px" alignItems="center" fontWeight="600" color={palette.white}>
    <UserProfilePicture avatar={creator?.profilePicture} />
    {title}
  </Grid>
);

const RightComponent = ({ type, orgId, status }) => (
  <Grid container>
    <TaskCardStatus type={type} orgId={orgId} status={status} style={{ background: '#343434' }} />
  </Grid>
);

const ListItemProposal = (props: IListItemProposal) => (
  <ListItemWrapper
    LeftComponent={LeftComponent}
    LeftComponentProps={props}
    RightComponent={RightComponent}
    RightComponentProps={props}
  />
);

export default ListItemProposal;
