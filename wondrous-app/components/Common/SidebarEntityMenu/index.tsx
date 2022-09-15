import { OrgProfilePicture } from 'components/Common/ProfilePictureHelpers';
import {
  ArrowIcon,
  Button,
  ButtonIcon,
  IconText,
  Item,
  MenuStyled,
  NoLogoPod,
  Text,
} from 'components/Common/SidebarEntityMenu/styles';
import { useRouter } from 'next/router';
import { useState } from 'react';
import palette from 'theme/palette';
import { useBoards } from 'utils/hooks';

const EntityMenu = ({ name, id, thumbnailPicture, profilePicture, canManage }) => {
  const { orgBoard } = useBoards();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const handleOnClickNotifications = () =>
    router.push(orgBoard ? `/organization/settings/${id}/notifications` : `/pod/settings/${id}/notifications`);
  return (
    <>
      <Button onClick={handleClick} open={open} disabled={!canManage}>
        <IconText>
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
        </IconText>
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
