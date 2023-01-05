import Grid from '@mui/material/Grid';
import { OrgProfilePicture } from 'components/Common/ProfilePictureHelpers';
import RolePill from 'components/Common/RolePill';
import CloseIcon from 'components/Icons/close.svg';
import { SmallDao2DaoIcon } from 'components/Icons/Dao2Dao';
import Link from 'next/link';
import palette from 'theme/palette';
import { ROLES } from 'utils/constants';
import { useBoards } from 'utils/hooks';

import { useCollaborationButtonProps, useGetOrgCollabsForOrg } from './helpers';
import SectionContent from './SectionContent';

const OrgWrapper = ({ username, profilePicture }) => (
  <Grid container item width="fit-content" sx={[{ '& a': { textDecoration: 'none' } }]}>
    <Link href={`/organization/${username}/home`}>
      <Grid container item width="fit-content" alignItems="center" color={palette.white} gap="6px">
        <OrgProfilePicture
          profilePicture={profilePicture}
          style={{ height: '24px', width: '24px', borderRadius: '24px' }}
        />
        {username}
      </Grid>
    </Link>
  </Grid>
);

const LeftComponent = ({ parentOrgName, childOrgName, parentOrgProfilePicture, childOrgProfilePicture }) => (
  <Grid container gap="12px" alignItems="center" fontWeight="600" color={palette.white}>
    <OrgWrapper username={parentOrgName} profilePicture={parentOrgProfilePicture} />
    <Grid
      container
      item
      height="16px"
      width="16px"
      borderRadius="16px"
      bgcolor={palette.black87}
      alignItems="center"
      justifyContent="center"
      sx={[
        {
          '& svg': {
            transform: 'scale(60%)',
            path: {
              fill: palette.white,
            },
          },
        },
      ]}
    >
      <CloseIcon />
    </Grid>
    <OrgWrapper username={childOrgName} profilePicture={childOrgProfilePicture} />
  </Grid>
);

const RightComponent = ({ parentOrgName }) => {
  const { orgBoard } = useBoards();
  const roleName = orgBoard.orgData.name === parentOrgName ? ROLES.OWNER : ROLES.CONTRIBUTOR;
  return (
    <Grid container>
      <RolePill roleName={roleName} />
    </Grid>
  );
};

const ProfileCollabSection = () => (
  <SectionContent
    HeaderTitleProps={{
      text: 'Collabs',
      IconComponent: () => <SmallDao2DaoIcon stroke={palette.white} />,
    }}
    CreateButtonProps={useCollaborationButtonProps()}
    backgroundImageUrl="/images/project/collab-empty-bg.svg"
    showAllUrl="collaborations"
    ListItemProps={{
      LeftComponent,
      RightComponent,
      onClick: ({ router, data: { username } }) => router.push(`/collaboration/${username}/boards`),
    }}
    data={useGetOrgCollabsForOrg()}
  />
);

export default ProfileCollabSection;
