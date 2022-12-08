import { OrgProfilePicture, UserProfilePicture } from 'components/Common/ProfilePictureHelpers';
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
import { ExplorePageMinimalIcon } from 'components/Icons/ExplorePageIcons';
import WorkspacePicker from 'components/WorkspacePicker';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import palette from 'theme/palette';
import { useGlobalContext } from 'utils/hooks';
import {IconWrapper} from './styles'

const EntityMenu = ({ user, activePod = null }) => {
  // isUserBoard={isUserBoard}
  // activeOrg={activeOrg}
  // isOrgView={isOrg}
  // isExplore={isExplore}
  // user={user}
  const router = useRouter()
  const {orgsList} = useGlobalContext()

  const activeOrg = useMemo(() => orgsList.find((org) => org.isActive), [router.pathname, orgsList]);

  console.log(activeOrg, 'activeOrg');
  const orgOrPod = activeOrg || activePod || {};

  const { thumbnailPicture, profilePicture, name, id } = orgOrPod;

  const userProfilePicture = user?.profilePicture;

  console.log(router);

  const isExplore = useMemo(() => router.pathname.includes('/explore'), [router.pathname]);

  const isOrg = useMemo(() => router.pathname.includes('/organization'), [router.pathname]);

  const isUserBoard = useMemo(() => !isExplore && !activeOrg && !activePod, [router.pathname, isExplore, activeOrg, activePod]);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleOnClickNotifications = () =>
    router.push(isOrg ? `/organization/settings/${id}/notifications` : `/pod/settings/${id}/notifications`);

  let pageTitle = useMemo(() => {
    if (isExplore) {
      return 'Explore';
    }
    if (isUserBoard) {
      return 'My workspace';
    }
    if (isOrg) {
      return name;
    }
  }, [name, isExplore, isUserBoard, isOrg]);

  console.log(user, 'USEr12')
  return (
    <>
      <Button onClick={handleClick} open={open}>
        <IconText>
          <ButtonIcon isUserBoard={isUserBoard}>
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
            ) : null}
            {activePod ? <NoLogoPod /> : null}
            {isUserBoard ? (
              <UserProfilePicture
                avatar={user?.profilePicture}
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '100%'
                }}
              />
            ) : null}
            {isExplore ? <IconWrapper>
              
              <ExplorePageMinimalIcon /> </IconWrapper>: null}
            {/* {isOrg ? (
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
            )} */}
          </ButtonIcon>
          <Text>{pageTitle}</Text>
        </IconText>
        <ArrowIcon open={open} />
      </Button>
      <WorkspacePicker user={user} isUserBoard={isUserBoard} open={open} anchorEl={anchorEl} onClose={handleClose} />
    </>
  );
};

export default EntityMenu;
