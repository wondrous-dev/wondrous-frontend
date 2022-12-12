import { useMe } from 'components/Auth/withAuth';
import { OrgProfilePicture, UserProfilePicture } from 'components/Common/ProfilePictureHelpers';

import {
  ArrowIcon,
  Button,
  ButtonIcon,
  IconText,
  NoLogoPod,
  Text,
  IconWrapper,
} from 'components/Common/SidebarEntityMenu/styles';
import { ExplorePageMinimalIcon } from 'components/Icons/ExplorePageIcons';
import WorkspacePicker from 'components/WorkspacePicker';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import palette from 'theme/palette';
import { useGlobalContext } from 'utils/hooks';

const DropdownItem = ({ isOrg, thumbnailPicture, profilePicture, activePod, isExplore, userProfilePicture }) => {
  if (isOrg) {
    return (
      <OrgProfilePicture
        profilePicture={thumbnailPicture || profilePicture}
        style={{
          borderRadius: '3px',
          width: '28px',
          height: '28px',
          background: palette.grey87,
        }}
      />
    );
  }
  if (activePod) return <NoLogoPod />;
  if (isExplore) {
    return <IconWrapper>
      <ExplorePageMinimalIcon />
    </IconWrapper>;
  }
  return (
    <UserProfilePicture
      avatar={userProfilePicture}
      style={{
        width: '28px',
        height: '28px',
        borderRadius: '100%',
      }}
    />
  );
};

const EntityMenu = () => {
  const router = useRouter();
  const { orgsList, pageData } = useGlobalContext();
  const user = useMe();
  const activePod = useMemo(() => pageData?.pod, [pageData?.pod]);

  const activeOrg = useMemo(() => orgsList.find((org) => org.isActive), [router.pathname, orgsList]);

  const orgOrPod = activeOrg || activePod || {};

  const { thumbnailPicture, profilePicture, name, id } = orgOrPod;

  const isExplore = useMemo(() => router.pathname.includes('/explore'), [router.pathname]);

  const isOrg = useMemo(() => router.pathname.includes('/organization'), [router.pathname]);

  const isUserBoard = useMemo(
    () => !isExplore && !activeOrg && !activePod,
    [router.pathname, isExplore, activeOrg, activePod]
  );

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  console.log(isExplore, 'isExplore')
  
  let pageTitle = useMemo(() => {
    if (isExplore) {
      return 'Explore';
    }
    if (isUserBoard) {
      return 'My workspace';
    }
    return name
  }, [name, isExplore, isUserBoard, isOrg]);

  return (
    <>
      <Button onClick={handleClick} open={open}>
        <IconText>
          <ButtonIcon isUserBoard={isUserBoard}>
            <DropdownItem
              isOrg={isOrg}
              thumbnailPicture={thumbnailPicture}
              profilePicture={profilePicture}
              activePod={activePod}
              isExplore={isExplore}
              userProfilePicture={user?.profilePicture}
            />
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
