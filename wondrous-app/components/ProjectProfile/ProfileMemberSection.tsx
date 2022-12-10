import Grid from '@mui/material/Grid';
import { UserProfilePicture } from 'components/Common/ProfilePictureHelpers';
import RolePill from 'components/Common/RolePill';
import GroupIcon from 'components/Icons/Sidebar/group.svg';
import palette from 'theme/palette';
import { useGetOrgUsers } from './helpers';
import SectionContent from './SectionContent';

const LeftComponent = ({ user }) => {
  const { profilePicture, username } = user || {};
  return (
    <Grid container gap="12px" alignItems="center" fontWeight="600" color={palette.white}>
      <UserProfilePicture avatar={profilePicture} />
      {username}
    </Grid>
  );
};

const RightComponent = ({ role }) => (
  <Grid container>
    <RolePill roleName={role.name} />
  </Grid>
);

const ProfileMemberSection = () => (
  <SectionContent
    HeaderTitleProps={{
      text: 'Member',
      IconComponent: GroupIcon,
    }}
    backgroundImageUrl="/images/project/collab-empty-bg.svg"
    showAllUrl="members"
    ListItemProps={{
      LeftComponent,
      RightComponent,
      onClick: (router, { user }) => router.push(`/profile/${user.username}/about`),
    }}
    data={useGetOrgUsers()}
  />
);

export default ProfileMemberSection;
