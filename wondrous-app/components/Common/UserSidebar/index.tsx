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
import { ENTITIES_TYPES, ORG_MEMBERSHIP_REQUESTS, SPECIAL_ORGS } from 'utils/constants';
import { useSideBar } from 'utils/hooks';
import { UserProfilePicture } from '../ProfilePictureHelpers';
import SidebarEntityListMemoized from '../SidebarEntityList/SidebarEntityListMemoized';
import PodsIconButton from '../SidebarMainPods';

const useSidebarData = () => {
  const router = useRouter();
  const { setMinimized } = useSideBar();
  const { isMobileScreen } = useMediaQuery();
  const { data: userOrgs } = useQuery(GET_USER_ORGS);
  const onlyIsInSpecialOrg = userOrgs?.getUserOrgs?.length === 1 && userOrgs?.getUserOrgs[0]?.id in SPECIAL_ORGS;
  const onlyHasProposals =
    onlyIsInSpecialOrg &&
    SPECIAL_ORGS[userOrgs?.getUserOrgs[0]?.id]?.includes(ENTITIES_TYPES.PROPOSAL) &&
    !SPECIAL_ORGS[userOrgs?.getUserOrgs[0]?.id]?.includes(ENTITIES_TYPES.TASK);
  const handleOnClick = (link) => () => {
    router.push(link);
    if (isMobileScreen) {
      setMinimized(true);
    }
  };

  const user = useMe();
  const data = [
    {
      label: 'Explore',
      items: [
        {
          text: 'Explore Projects',
          Icon: ExplorePageMinimalIcon,
          link: '/explore',
        },
      ],
    },
    {
      label: 'My HQ',
      items: [
        {
          text: 'Mission Control',
          Icon: MissionControlSidebarIcon,
          link: '/mission-control',
        },
        {
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
      ],
    },
    {
      label: 'Workspaces',
      items: [
        {
          text: 'Contributor',
          Icon: ContributorIcon,
          check: onlyHasProposals
            ? () => router.pathname === '/dashboard/proposals'
            : () => router.pathname === '/dashboard',
          link: '/dashboard',
        },
        {
          text: 'Operator',
          Icon: OperatorIcon,
          check: () => router.pathname === '/dashboard/admin',
          link: `/dashboard/admin?boardType=${ORG_MEMBERSHIP_REQUESTS}`,
        },
      ],
    },
    {
      label: 'General',
      items: [
        {
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
        },
        {
          text: 'Settings',
          Icon: WrenchIcon,
          link: '/profile/settings',
        },
      ],
    },
  ];
  return { data, handleOnClick };
};

const UserSidebar = () => {
  const router = useRouter();
  const { minimized } = useSideBar();

  const { data, handleOnClick } = useSidebarData();

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
