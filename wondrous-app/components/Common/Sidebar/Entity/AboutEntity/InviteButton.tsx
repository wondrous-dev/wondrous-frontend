import { ButtonBase } from '@mui/material';
import { OrgInviteLinkModal } from 'components/Common/InviteLinkModal/OrgInviteLink';
import { PodInviteLinkModal } from 'components/Common/InviteLinkModal/podInviteLink';
import { useState } from 'react';
import styled from 'styled-components';
import { useOrgBoard } from 'utils/hooks';

const Invite = styled(ButtonBase)`
  && {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 10px 6px;
    width: 79px;
    height: 36px;
    background: #313131;
    border-radius: 216px;
    font-family: ${({ theme }) => theme.typography.fontFamily};
    font-weight: 500;
    font-size: 14px;
    color: ${({ theme }) => theme.palette.white};
    :hover {
      background: ${({ theme }) => theme.palette.grey58};
      filter: drop-shadow(0px 6px 14px rgba(0, 0, 0, 0.5));
    }
  }
`;

const InviteButton = ({ id, canManage }) => {
  const orgBoard = useOrgBoard();
  const [openInvite, setOpenInvite] = useState(false);
  const handleOnClickInvite = () => setOpenInvite(true);
  if (!canManage) return null;
  return (
    <>
      {orgBoard ? (
        <OrgInviteLinkModal orgId={id} open={openInvite} onClose={() => setOpenInvite(false)} />
      ) : (
        <PodInviteLinkModal podId={id} open={openInvite} onClose={() => setOpenInvite(false)} />
      )}
      <Invite onClick={handleOnClickInvite}>Invite</Invite>
    </>
  );
};

export default InviteButton;
