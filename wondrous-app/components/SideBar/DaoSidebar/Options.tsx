import { ButtonBase, Menu, MenuItem, Typography } from '@mui/material';
import PrivacyPublicIcon from 'components/Icons/privacyPublic.svg';
import PrivacyMembersIcon from 'components/Icons/privacyMembers.svg';
import { LockedIconOutline, LockIconOutline } from 'components/Icons/userpass';
import styled from 'styled-components';
import Tooltip from 'components/Tooltip';
import Arrow from 'components/Icons/arrow.svg';
import { useState } from 'react';

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  gap: 12px;
`;

const StatusWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const PrivacyIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  svg {
    width: 20px;
    height: 20px;
  }
`;

const Settings = styled(ButtonBase)`
  && {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 6px;
    width: 70px;
    height: 28px;
    background: #313131;
    border-radius: 6px;
    font-family: 'Space Grotesk';
    font-weight: 500;
    font-size: 14px;
    color: #ffffff;
    :hover {
      background: #707070;
      filter: drop-shadow(0px 6px 14px rgba(0, 0, 0, 0.5));
    }
  }
`;

const Invite = styled(ButtonBase)`
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
`;

const IconWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 6px;
  gap: 10px;
  width: 28px;
  height: 28px;
  background: #313131;
  border-radius: 4px;
  cursor: pointer;
  :hover {
    background: #707070;
    filter: drop-shadow(0px 7px 7px rgba(0, 0, 0, 0.5));
  }
`;

const ButtonIcon = styled.div`
  width: 28px;
  height: 28px;
  background: #474747;
  border-radius: 6px;
  background: red;
`;

const Text = styled(Typography)`
  && {
    font-family: 'Space Grotesk';
    font-weight: 500;
    font-size: 16px;
    line-height: 21px;
    display: flex;
    align-items: center;
    color: #ffffff;
  }
`;

const Button = styled(ButtonBase)`
  && {
    max-width: fit-content;
    padding: 2px;
    padding-right: 6px;
    height: 32px;
    cursor: pointer;
    border-radius: 6px;
    display: flex;
    align-items: center;
    gap: 10px;
    background: ${({ open }) => open && '#474747'};
    :hover {
      background: #474747;
    }
  }
`;

export const ArrowIcon = styled((props) => (
  <div {...props}>
    <Arrow />
  </div>
))`
  && {
    transform: rotate(${({ open }) => (open ? `-90` : `90`)}deg);
    display: flex;
    height: 32px;
    align-items: center;
    justify-content: center;
    svg {
      path {
        fill: #fff;
      }
    }
  }
`;

const OrgButton = () => (
  <Button disableRipple>
    <ButtonIcon />
    <Text>Radicle</Text>
    <ArrowIcon />
  </Button>
);

const MenuStyled = styled(Menu)`
  && {
    margin-top: 6px;
    .MuiMenu-paper {
      background-color: #444444;
    }
    .MuiList-root {
      background-color: #444444;
      min-width: 173px;
      border-radius: 6px;
      display: flex;
      flex-direction: column;
      gap: 4px;
      padding: 4px;
    }
  }
`;

const Item = styled(MenuItem)`
  && {
    font-family: 'Space Grotesk';
    font-weight: 500;
    font-size: 14px;
    color: #ffffff;
    background: #313131;
    border-radius: 2px;
    padding: 4px 9px;
    :hover {
      background: #707070;
    }
  }
`;

const MenuWrapper = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  return (
    <>
      <Button onClick={handleClick} open={open}>
        <ButtonIcon />
        <Text>Radicle</Text>
        <ArrowIcon />
      </Button>
      <MenuStyled anchorEl={anchorEl} open={open} onClose={handleClose}>
        <Item>Notification Settings</Item>
        <Item>Leave Project</Item>
      </MenuStyled>
    </>
  );
};

const Options = () => (
  <Wrapper>
    <MenuWrapper />
    <StatusWrapper>
      <Settings>Settings</Settings>
      <Tooltip title="Privacy" placement="top">
        <IconWrapper>
          <PrivacyIcon>
            {/* <PrivacyPublicIcon /> */}
            <PrivacyMembersIcon />
          </PrivacyIcon>
        </IconWrapper>
      </Tooltip>
      <Tooltip title="Token Gating" placement="top">
        <IconWrapper>
          {/* <LockIconOutline /> */}
          <LockedIconOutline />
        </IconWrapper>
      </Tooltip>
      <Invite>Invite</Invite>
    </StatusWrapper>
  </Wrapper>
);

export default Options;
