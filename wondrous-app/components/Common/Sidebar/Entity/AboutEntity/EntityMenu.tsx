import { ButtonBase, Menu, MenuItem, Typography } from '@mui/material';
import { SafeImage } from 'components/Common/Image';
import PodsIcon from 'components/Common/Sidebar/Common/icons/pods.svg';
import Arrow from 'components/Icons/arrow.svg';
import { DAOIcon } from 'components/Icons/dao';
import { useState } from 'react';
import styled from 'styled-components';
import { useBoards } from 'utils/hooks';

const ButtonIcon = styled.div`
  width: 28px;
  height: 28px;
  background: ${({ theme }) => theme.palette.grey78};
  border-radius: 6px;
`;

const Text = styled(Typography)`
  && {
    font-family: ${({ theme }) => theme.typography.fontFamily};
    font-weight: 500;
    font-size: 16px;
    line-height: 21px;
    display: flex;
    align-items: center;
    color: ${({ theme }) => theme.palette.white};
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
    background: ${({ open, theme }) => open && `${theme.palette.grey78}`};
    :hover {
      background: ${({ theme }) => theme.palette.grey78};
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
        fill: ${({ theme }) => theme.palette.white};
      }
    }
  }
`;

const MenuStyled = styled(Menu)`
  && {
    margin-top: 6px;
    .MuiMenu-paper {
      background-color: ${({ theme }) => theme.palette.grey77};
    }
    .MuiList-root {
      background-color: ${({ theme }) => theme.palette.grey77};
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
    font-family: ${({ theme }) => theme.typography.fontFamily};
    font-weight: 500;
    font-size: 14px;
    color: ${({ theme }) => theme.palette.white};
    background: ${({ theme }) => theme.palette.grey87};
    border-radius: 2px;
    padding: 4px 9px;
    :hover {
      background: ${({ theme }) => theme.palette.grey58};
    }
  }
`;

export const NoLogoDAO = styled((props) => (
  <div {...props}>
    <DAOIcon
      stroke="#fff"
      encircled={false}
      style={{
        width: '28px',
        height: '28px',
      }}
    />
  </div>
))`
  display: flex;
  width: 28px;
  height: 28px;
  border-radius: 3px;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.palette.grey87};
`;

export const NoLogoPod = styled((props) => (
  <div {...props}>
    <PodsIcon />
  </div>
))`
  display: flex;
  width: 28px;
  height: 28px;
  border-radius: 3px;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.palette.grey87}; ;
`;

const EntityMenu = ({ name, id, router, thumbnailPicture, profilePicture, canManage }) => {
  const { orgBoard } = useBoards();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleOnClickNotifications = () =>
    router.push(orgBoard ? `/organization/settings/${id}/notifications` : `/pod/settings/${id}/notifications`);
  const NoLogo = orgBoard ? NoLogoDAO : NoLogoPod;
  return (
    <>
      <Button onClick={handleClick} open={open} disabled={!canManage}>
        <ButtonIcon>
          {thumbnailPicture || profilePicture ? (
            <SafeImage
              useNextImage={false}
              src={thumbnailPicture || profilePicture}
              width={28}
              height={28}
              objectFit="cover"
              style={{
                borderRadius: '2px',
              }}
            />
          ) : (
            <NoLogo />
          )}
        </ButtonIcon>
        <Text>{name}</Text>
        {canManage && <ArrowIcon open={open} />}
      </Button>
      <MenuStyled anchorEl={anchorEl} open={open} onClose={handleClose}>
        <Item onClick={handleOnClickNotifications}>Notification Settings</Item>
        {/* <Item>Leave Project</Item> NOTE: There's no endpoint for this yet. */}
      </MenuStyled>
    </>
  );
};

export default EntityMenu;
