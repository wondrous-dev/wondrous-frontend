import Grid from '@mui/material/Grid';
import { OrgProfilePicture } from 'components/Common/ProfilePictureHelpers';
import CloseIcon from 'components/Icons/close.svg';
import { SmallDao2DaoIcon } from 'components/Icons/Dao2Dao';
import Link from 'next/link';
import palette from 'theme/palette';

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

const LeftComponent = ({ username, parentOrgProfilePicture, childOrgProfilePicture }) => (
  <Grid container gap="12px" alignItems="center" fontWeight="600" color={palette.white}>
    <OrgWrapper username={username} profilePicture={parentOrgProfilePicture} />
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
    <OrgWrapper username="" profilePicture={childOrgProfilePicture} />
  </Grid>
);

const RightComponent = ({ date, type }) => null; // TODO: add collaboration role

const useListCollab = () => ({
  HeaderTitleProps: {
    text: 'Collab',
    IconComponent: () => <SmallDao2DaoIcon stroke="#fff" />,
  },
  CreateButtonProps: useCollaborationButtonProps(),
  backgroundImageUrl: '/images/project/collab-empty-bg.svg',
  showAllUrl: 'project?collabs=true',
  ListItemComponents: { LeftComponent, RightComponent },
  data: useGetOrgCollabsForOrg(),
});

export default useListCollab;
