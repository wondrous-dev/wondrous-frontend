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
import WorkspacePicker from 'components/WorkspacePicker';
import { useRouter } from 'next/router';
import { useState } from 'react';
import palette from 'theme/palette';
import { useBoards, useSideBar } from 'utils/hooks';

const EntityMenu = ({ name, id, thumbnailPicture, profilePicture, canManage, isOrgView  = false}) => {
  const { orgBoard } = useBoards();
  const router = useRouter();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const { minimized } = useSideBar();

  const isOrg = orgBoard || isOrgView
  const handleOnClickNotifications = () =>
    router.push(isOrg ? `/organization/settings/${id}/notifications` : `/pod/settings/${id}/notifications`);

  return (
    <>
      <Button onClick={handleClick} open={open} disabled={!canManage}>
        <IconText>
          <ButtonIcon>
            {isOrg ? (
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
          {!minimized ? <Text>{name}</Text> : null}
        </IconText>
        {canManage && !minimized && <ArrowIcon open={open} />}
      </Button>
              <WorkspacePicker open={open} anchorEl={anchorEl} onClose={handleClose}             
              />
    </>
  );
};

export default EntityMenu;
