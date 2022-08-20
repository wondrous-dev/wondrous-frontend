import { ButtonBase, Menu, MenuItem, Typography } from '@mui/material';
import { SafeImage } from 'components/Common/Image';
import Arrow from 'components/Icons/arrow.svg';
import { DAOIcon } from 'components/Icons/dao';
import { useState } from 'react';
import styled from 'styled-components';

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
  background: #313131;
`;

const EntityMenu = ({ name, id, router, thumbnailPicture, profilePicture }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleOnClickNotifications = () => router.push(`/organization/settings/${id}/notifications`);
  return (
    <>
      <Button onClick={handleClick} open={open}>
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
            <NoLogoDAO />
          )}
        </ButtonIcon>
        <Text>{name}</Text>
        <ArrowIcon open={open} />
      </Button>
      <MenuStyled anchorEl={anchorEl} open={open} onClose={handleClose}>
        <Item onClick={handleOnClickNotifications}>Notification Settings</Item>
        {/* <Item>Leave Project</Item> NOTE: There's no endpoint for this yet. */}
      </MenuStyled>
    </>
  );
};

export default EntityMenu;
