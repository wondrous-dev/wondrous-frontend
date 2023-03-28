import { useMe } from 'components/Auth/withAuth';
import { OrgProfilePicture, UserProfilePicture } from 'components/Common/ProfilePictureHelpers';

import { ArrowIcon, Button, ButtonIcon, IconText, Text, IconWrapper } from 'components/Common/SidebarEntityMenu/styles';
import { ExplorePageMinimalIcon } from 'components/Icons/ExplorePageIcons';
import WorkspacePicker from 'components/WorkspacePicker';
import { useRouter } from 'next/router';
import { memo, useMemo, useState } from 'react';
import palette from 'theme/palette';
import { useGlobalContext } from 'utils/hooks';

const DropdownItem = ({ isOrgOrPod, thumbnailPicture, profilePicture, isExplore, userProfilePicture, isUserBoard }) => {
  if (isOrgOrPod) {
    return (
      <ButtonIcon isUserBoard={isUserBoard}>
        <OrgProfilePicture
          profilePicture={thumbnailPicture || profilePicture}
          style={{
            borderRadius: '3px',
            width: '28px',
            height: '28px',
            background: palette.grey87,
          }}
        />
      </ButtonIcon>
    );
  }
  if (isExplore) {
    return (
      <ButtonIcon isUserBoard={isUserBoard}>
        <IconWrapper>
          <ExplorePageMinimalIcon />
        </IconWrapper>
      </ButtonIcon>
    );
  }
  if (isUserBoard) {
    return (
      <ButtonIcon isUserBoard={isUserBoard}>
        <UserProfilePicture
          avatar={userProfilePicture}
          style={{
            width: '28px',
            height: '28px',
            borderRadius: '100%',
          }}
        />
      </ButtonIcon>
    );
  }
  return null;
};

const MY_WORKSPACES = [
  '/mission-control',
  '/dashboard/admin',
  '/dashboard/bounties',
  '/dashboard',
  '/dashboard/proposals',
  '/profile/[username]/about',
  '/profile/settings',
  '/profile/login-methods',
  '/profile/notifications',
];

const EntityMenu = ({ pageData }) => {
  const router = useRouter();
  const user = useMe();
  console.log(pageData, 'apgeData');
  const activePodOrg = useMemo(() => pageData?.pod?.org, [pageData?.pod]);

  const activeOrg = pageData?.orgData;

  const orgOrPod = activeOrg || activePodOrg || {};

  const { thumbnailPicture, profilePicture, name } = orgOrPod;

  const isExplore = useMemo(() => router.pathname.includes('/explore'), [router.pathname]);

  const isOrgOrPod = useMemo(
    () => router.pathname.includes('/organization') || router.pathname.includes('/pod'),
    [router.pathname]
  );

  const isUserBoard = useMemo(() => {
    if (router.pathname === `/profile/[username]/about` && router.query?.username !== user?.username) return false;

    return MY_WORKSPACES.includes(router.pathname);
  }, [router.pathname, user]);

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
    if (name) {
      return name;
    }
    return 'Select workspace';
  }, [name, isExplore, isUserBoard, isOrgOrPod]);

  return (
    <>
      <Button onClick={handleClick} open={open} id="tour-header-project-navigation">
        <IconText>
          <DropdownItem
            isOrgOrPod={isOrgOrPod}
            thumbnailPicture={thumbnailPicture}
            profilePicture={profilePicture}
            isExplore={isExplore}
            isUserBoard={isUserBoard}
            userProfilePicture={user?.profilePicture}
          />

          <Text>{pageTitle}</Text>
        </IconText>
        <ArrowIcon open={open} />
      </Button>
      <WorkspacePicker user={user} isUserBoard={isUserBoard} open={open} anchorEl={anchorEl} onClose={handleClose} />
    </>
  );
};

const EntityMenuMemo = memo(
  EntityMenu,
  (prevProps, nextProps) =>
    JSON.stringify(prevProps.pageData?.pod) === JSON.stringify(nextProps.pageData?.pod) &&
    JSON.stringify(prevProps.pageData?.orgData) === JSON.stringify(nextProps.pageData?.orgData)
);

const EntityMenuWrapper = () => {
  const { pageData } = useGlobalContext();
  return <EntityMenuMemo pageData={pageData} />;
};

export default EntityMenuWrapper;
