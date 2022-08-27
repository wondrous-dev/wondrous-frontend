import { OrgProfilePicture } from 'components/Common/ProfilePictureHelpers';
import { useState } from 'react';
import palette from 'theme/palette';
import { useBoards } from 'utils/hooks';

import { ArrowIcon, Button, ButtonIcon, Item, MenuStyled, NoLogoPod, Text } from './styles';

const EntityMenu = ({ name, id, router, thumbnailPicture, profilePicture, canManage }) => {
  const { orgBoard } = useBoards();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleOnClickNotifications = () =>
    router.push(orgBoard ? `/organization/settings/${id}/notifications` : `/pod/settings/${id}/notifications`);
  return (
    <>
      <Button onClick={handleClick} open={open} disabled={!canManage}>
        <ButtonIcon>
          {orgBoard ? (
            <OrgProfilePicture
              profilePicture={thumbnailPicture || profilePicture}
              style={{
                borderRadius: '3px',
                width: '28px',
                height: '28px',
                background: palette.grey87,
              }}
            />
          ) : (
            <NoLogoPod />
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
