import { useMe, withAuth } from 'components/Auth/withAuth';
import Item from 'components/Common/SidebarItem';
import { MissionControlSidebarIcon, ExplorePageMinimalIcon } from 'components/Icons/ExplorePageIcons';
import { ContributorIcon } from 'components/Icons/Sidebar/Contributor';
import OperatorIcon from 'components/Icons/Sidebar/Operator';
import PodIcon from 'components/Icons/Sidebar/pods.svg';
import WrenchIcon from 'components/Icons/wrench';
import useMediaQuery from 'hooks/useMediaQuery';
import { useRouter } from 'next/router';
import { GET_USER_ORGS } from 'graphql/queries';
import { useQuery } from '@apollo/client';
import { ORG_MEMBERSHIP_REQUESTS } from 'utils/constants';
import { useSideBar } from 'utils/hooks';
import { UserProfilePicture } from '../ProfilePictureHelpers';
import SidebarEntityListMemoized from '../SidebarEntityList/SidebarEntityListMemoized';
import PodsIconButton from '../SidebarMainPods';

const useSidebarData = () => {
  const router = useRouter();

  const { data: userOrgs } = useQuery(GET_USER_ORGS);
  const getUserOrgs = userOrgs?.getUserOrgs;
  const userHasOneOrg = getUserOrgs?.length === 1;
  const onlyHasProposals = userHasOneOrg && getUserOrgs[0]?.modules?.proposal && !getUserOrgs[0]?.modules?.task;
  const user = useMe();
  const data = {
    Explore: {
      label: 'Explore',
      items: {
        'Explore Projects': {
          text: 'Explore Projects',
          Icon: ExplorePageMinimalIcon,
          link: '/explore',
          active: true,
        },
      },
    },
    'My HQ': {
      label: 'My HQ',
      items: {
        'Mission Control': {
          text: 'Mission Control',
          Icon: MissionControlSidebarIcon,
          link: '/mission-control',
          active: true,
        },
        'My Profile': {
          text: 'My Profile',
          ignoreIconStyles: true,
          Icon: () => (
            <UserProfilePicture
              style={{
                height: '22px',
                width: '22px',
                marginRight: '0px',
                borderRadius: '13px',
              }}
              avatar={user?.profilePicture}
            />
          ),
          link: `/profile/${user?.username}/about`,
        },
      },
    },
    Workspaces: {
      label: 'Workspaces',
      items: {
        Contributor: {
          text: 'Contributor',
          Icon: ContributorIcon,
          check: onlyHasProposals
            ? () => router.pathname === '/dashboard/proposals'
            : () => router.pathname === '/dashboard',
          link: onlyHasProposals ? '/dashboard/proposals' : '/dashboard',
          active: true,
        },
        Operator: {
          text: 'Operator',
          Icon: OperatorIcon,
          check: () => router.pathname === '/dashboard/admin',
          link: `/dashboard/admin?boardType=${ORG_MEMBERSHIP_REQUESTS}`,
          active: true,
        },
      },
    },
    General: {
      label: 'General',
      items: {
        Pods: {
          text: 'Pods',
          Component: () => (
            <PodsIconButton
              renderIcon={({ setOpenPodModal, openPodModal }) => (
                <Item Icon={PodIcon} onClick={setOpenPodModal} isActive={openPodModal} text="Pods">
                  Pods
                </Item>
              )}
            />
          ),
          active: true,
        },
        Settings: {
          text: 'Settings',
          Icon: WrenchIcon,
          link: '/profile/settings',
          active: true,
        },
      },
    },
  };
  return data;
};

const useHandleOnClick = () => {
  const router = useRouter();
  const { setMinimized } = useSideBar();
  const { isMobileScreen } = useMediaQuery();
  const handleOnClick = (link) => () => {
    router.push(link);
    if (isMobileScreen) {
      setMinimized(true);
    }
  };
  return handleOnClick;
};

const UserSidebar = () => {
  const router = useRouter();
  const { minimized } = useSideBar();
  const handleOnClick = useHandleOnClick();
  const data = useSidebarData();
  return (
    <SidebarEntityListMemoized
      minimized={minimized}
      menuItems={data}
      handleOnClick={handleOnClick}
      urlPath={router.asPath}
    />
  );
};

export default withAuth(UserSidebar);
