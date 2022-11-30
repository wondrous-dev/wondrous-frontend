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

const OrgWrapper = ({ username, profilePicture }) => (
  <Grid container item width="fit-content" sx={[{ '& a': { textDecoration: 'none' } }]}>
    <Link href={`/organization/${username}/boards`}>
      <Grid container item width="fit-content" alignItems="center" color="#fff" gap="6px">
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
      bgcolor="#292929"
      alignItems="center"
      justifyContent="center"
      sx={[
        {
          '& svg': {
            transform: 'scale(60%)',
            path: {
              fill: '#fff',
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

const useListCollab = () => ({
  HeaderTitleProps: {
    text: 'Collab',
    IconComponent: () => <SmallDao2DaoIcon stroke="#fff" />,
  },
  CreateButtonProps: useCollaborationButtonProps(),
  backgroundImageUrl: '/images/project/collab-empty-bg.svg',
  showAllUrl: 'project?collabs=true',
  ListItemProps: {
    LeftComponent,
    RightComponent,
    onClick: (router, { username }) => router.push(`/collaboration/${username}/boards`),
  },
  data: useGetOrgCollabsForOrg(),
});

export default useListCollab;
