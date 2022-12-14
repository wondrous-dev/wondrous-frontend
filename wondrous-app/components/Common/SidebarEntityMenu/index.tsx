import { useMe } from 'components/Auth/withAuth';
import { OrgProfilePicture, UserProfilePicture } from 'components/Common/ProfilePictureHelpers';

import { ArrowIcon, Button, ButtonIcon, IconText, Text, IconWrapper } from 'components/Common/SidebarEntityMenu/styles';
import { ExplorePageMinimalIcon } from 'components/Icons/ExplorePageIcons';
import WorkspacePicker from 'components/WorkspacePicker';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import palette from 'theme/palette';
import { useGlobalContext } from 'utils/hooks';

const DropdownItem = ({ isOrgOrPod, thumbnailPicture, profilePicture, isExplore, userProfilePicture }) => {
  if (isOrgOrPod) {
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
  if (isExplore) {
    return (
      <IconWrapper>
        <ExplorePageMinimalIcon />
      </IconWrapper>
    );
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
  const activePodOrg = useMemo(() => pageData?.pod?.org, [pageData?.pod]);

  const activeOrg = useMemo(() => orgsList.find((org) => org.isActive), [router.pathname, orgsList]);

  const orgOrPod = activeOrg || activePodOrg || {};

  const { thumbnailPicture, profilePicture, name } = orgOrPod;

  const isExplore = useMemo(() => router.pathname.includes('/explore'), [router.pathname]);

  const isOrgOrPod = useMemo(
    () => router.pathname.includes('/organization') || router.pathname.includes('/pod'),
    [router.pathname]
  );

  const isUserBoard = useMemo(
    () => !isExplore && !activeOrg && !activePodOrg,
    [router.pathname, isExplore, activeOrg, activePodOrg]
  );

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const pageTitle = useMemo(() => {
    if (isExplore) {
      return 'Explore';
    }
    if (isUserBoard) {
      return 'My workspace';
    }
    return name;
  }, [name, isExplore, isUserBoard, isOrgOrPod]);

  return (
    <>
      <Button onClick={handleClick} open={open}>
        <IconText>
          <ButtonIcon isUserBoard={isUserBoard}>
            <DropdownItem
              isOrgOrPod={isOrgOrPod}
              thumbnailPicture={thumbnailPicture}
              profilePicture={profilePicture}
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
