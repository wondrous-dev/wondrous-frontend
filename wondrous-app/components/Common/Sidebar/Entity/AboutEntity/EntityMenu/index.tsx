import { SafeImage } from 'components/Common/Image';
import { useState } from 'react';
import { useBoards } from 'utils/hooks';

import { ArrowIcon, Button, ButtonIcon, Item, MenuStyled, NoLogoDAO, NoLogoPod, Text } from './styles';

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
