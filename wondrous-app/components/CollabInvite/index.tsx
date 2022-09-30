import { Typography, Grid } from '@mui/material';
import { Modal } from 'components/Modal';
import CollabDetails, { MODAL_TYPE, Heading } from 'components/CreateCollaborationModal/ViewCollab/CollabDetails';
import CollabActions from 'components/CollabInvite/CollabOrgsSelect';
import palette from 'theme/palette';
import { ActionButton } from 'components/Common/Task/styles';
import Link from 'next/link';
import { useMe } from 'components/Auth/withAuth';

const InvalidToken = () => {
  const user = useMe();
  let href = '/login';
  let buttonTitle = 'Log in';

  if (user) {
    href = '/mission-control';
    buttonTitle = 'Go to mission control';
  }

  return (
    <Grid container display="flex" alignItems="center" direction="column" justifyContent="center" gap="10px">
      <Heading />
      <Typography sx={{ fontSize: '14px' }} color={palette.grey250}>
        This invite is invalid or has expired. Please contact the person who sent you the invite.
      </Typography>
      <Link href={href}>
        <ActionButton>{buttonTitle}</ActionButton>
      </Link>
    </Grid>
  );
};
export default function CollabInvite({ orgRequestInfo = null }) {
  return (
    <Modal open maxWidth={560} title="Collaboration request">
      {orgRequestInfo?.getOrgCollabRequestByToken ? (
        <>
          <CollabDetails type={MODAL_TYPE.ACTION} request={orgRequestInfo?.getOrgCollabRequestByToken} />
          <CollabActions requestOrg={orgRequestInfo?.getOrgCollabRequestByToken?.initiatorOrg} />
        </>
      ) : (
        <InvalidToken />
      )}
    </Modal>
  );
}
