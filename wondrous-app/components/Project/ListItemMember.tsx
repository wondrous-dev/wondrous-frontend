import Grid from '@mui/material/Grid';
import { UserProfilePicture } from 'components/Common/ProfilePictureHelpers';
import RolePill from 'components/Common/RolePill';
import ListItemWrapper from 'components/Project/ListItemWrapper';
import palette from 'theme/palette';

interface IListItemMember {
  member;
}

const LeftComponent = ({ user }) => {
  const { profilePicture, firstName, lastName } = user || {};
  return (
    <Grid container gap="12px" alignItems="center" fontWeight="600" color={palette.white}>
      <UserProfilePicture avatar={profilePicture} />
      {firstName} {lastName}
    </Grid>
  );
};

const RightComponent = ({ orgRoleName }) => (
  <Grid container>
    <RolePill
      onClick={() => null} // {() => setOpenCurrentRoleModal(true)}
      roleName={orgRoleName}
    />
  </Grid>
);

const ListItemMember = (props: IListItemMember) => (
  <ListItemWrapper
    LeftComponent={LeftComponent}
    LeftComponentProps={props}
    RightComponent={RightComponent}
    RightComponentProps={props}
  />
);

export default ListItemMember;
