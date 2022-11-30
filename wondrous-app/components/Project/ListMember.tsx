import Grid from '@mui/material/Grid';
import { UserProfilePicture } from 'components/Common/ProfilePictureHelpers';
import RolePill from 'components/Common/RolePill';
import GroupIcon from 'components/Icons/Sidebar/group.svg';
import { useRouter } from 'next/router';
import palette from 'theme/palette';
import { useGetOrgUsers } from './helpers';

const LeftComponent = ({ user }) => {
  const { profilePicture, firstName, lastName } = user || {};
  return (
    <Grid container gap="12px" alignItems="center" fontWeight="600" color={palette.white}>
      <UserProfilePicture avatar={profilePicture} />
      {firstName} {lastName}
    </Grid>
  );
};

const RightComponent = ({ role }) => (
  <Grid container>
    <RolePill roleName={role.name} />
  </Grid>
);

const useListMember = () => ({
  HeaderTitleProps: {
    text: 'Member',
    IconComponent: GroupIcon,
  },
  backgroundImageUrl: '/images/project/collab-empty-bg.svg',
  showAllUrl: 'members',
  ListItemProps: {
    LeftComponent,
    RightComponent,
    onClick: (router, { user }) => router.push(`/profile/${user.username}/about`),
  },
  data: useGetOrgUsers(),
});

export default useListMember;
