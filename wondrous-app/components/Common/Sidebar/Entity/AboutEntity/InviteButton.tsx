import { ButtonBase } from '@mui/material';
import { OrgInviteLinkModal } from 'components/Common/InviteLinkModal/OrgInviteLink';
import { useState } from 'react';
import styled from 'styled-components';

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
    background: #7427ff;
    border-radius: 6px;
    font-family: 'Space Grotesk';
    font-weight: 500;
    font-size: 14px;
    color: #ffffff;
    :hover {
      background: linear-gradient(90deg, #7427ff 2.68%, #00baff 100%);
      filter: drop-shadow(0px 6px 14px rgba(0, 0, 0, 0.5));
    }
  }
`;

const InviteButton = ({ orgId }) => {
  const [openInvite, setOpenInvite] = useState(false);
  const handleOnClickInvite = () => setOpenInvite(true);
  return (
    <>
      <OrgInviteLinkModal orgId={orgId} open={openInvite} onClose={() => setOpenInvite(false)} />
      <Invite onClick={handleOnClickInvite}>Invite</Invite>
    </>
  );
};

export default InviteButton;
