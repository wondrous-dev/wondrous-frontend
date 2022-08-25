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
    padding: 6px;
    gap: 10px;
    width: 51px;
    height: 28px;
    background: ${({ theme }) => theme.palette.highlightPurple};
    border-radius: 6px;
    font-family: ${({ theme }) => theme.typography.fontFamily};
    font-weight: 500;
    font-size: 14px;
    color: ${({ theme }) => theme.palette.white};
    :hover {
      background: ${({ theme }) =>
        `linear-gradient(90deg, ${theme.palette.highlightBlue} 2.68%, ${theme.palette.highlightPurple} 100%)`};
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
