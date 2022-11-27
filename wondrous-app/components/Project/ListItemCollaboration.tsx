import { Grid } from '@mui/material';
import { OrgProfilePicture } from 'components/Common/ProfilePictureHelpers';
import SidebarTooltip from 'components/Common/SidebarMainTooltip';
import CloseIcon from 'components/Icons/close.svg';
import ListItemWrapper from 'components/Project/ListItemWrapper';
import Link from 'next/link';
import palette from 'theme/palette';

interface IListIemCollaboration {
  task;
}

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

const LeftComponent = ({ parentOrg, childOrg }) => (
  <Grid container gap="12px" alignItems="center" fontWeight="600" color={palette.white}>
    <OrgWrapper {...parentOrg} />
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
    <OrgWrapper {...childOrg} />
  </Grid>
);

const RightComponent = ({ date, type }) => null; // TODO: add collaboration role

const ListItemCollaboration = (props: IListIemCollaboration) => (
  <ListItemWrapper
    LeftComponent={LeftComponent}
    LeftComponentProps={props}
    RightComponent={RightComponent}
    RightComponentProps={props}
  />
);

export default ListItemCollaboration;
