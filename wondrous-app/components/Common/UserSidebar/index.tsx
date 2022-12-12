import { useMe } from 'components/Auth/withAuth';
import Item from 'components/Common/SidebarItem';
import CheckBoxIcon from 'components/Icons/Sidebar/checkBox.svg';
import GridViewIcon from 'components/Icons/Sidebar/gridView.svg';
import GroupIcon from 'components/Icons/Sidebar/group.svg';
import PodIcon from 'components/Icons/Sidebar/pods.svg';
import WrenchIcon from 'components/Icons/wrench';
import { useRouter } from 'next/router';
import { useSideBar } from 'utils/hooks';
import { UserProfilePictureGR15 } from '../ProfilePictureHelpers';
import SidebarEntityListMemoized from '../SidebarEntityList/SidebarEntityListMemoized';
import PodsIconButton from '../SidebarMainPods';

const useSidebarData = () => {
  const router = useRouter();
  const handleOnClick = (link) => () => router.push(link);

  const user = useMe();
  const data = [
    {
      label: 'My HQ',
      items: [
        {
          text: 'Mission Control',
          Icon: GridViewIcon,
          link: '/mission-control',
        },
        {
          text: 'My Profile',
          ignoreIconStyles: true,
          Icon: () => (
            <UserProfilePictureGR15
              style={{
                height: '22px',
                width: '22px',
                marginRight: '0px',
              }}
              avatar={user?.profilePicture}
              isGr15Contributor={user?.checkIsGr15Contributor?.isGr15Contributor}
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
          Icon: CheckBoxIcon,
          link: '/dashboard',
        },
        {
          text: 'Operator',
          Icon: GroupIcon,
          link: '/dashboard/admin',
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
                <Item Icon={PodIcon} onClick={setOpenPodModal} isActive={openPodModal} text='Pods'>
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

export default UserSidebar;
