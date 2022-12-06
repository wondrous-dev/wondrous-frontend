import { useMe, withAuth } from 'components/Auth/withAuth';
import useSideBar from 'hooks/useSideBar';
import { useRouter } from 'next/router';
import React from 'react';
import { useIsMobile } from 'utils/hooks';

import SidebarMemo from './SidebarMemoized';

const SideBarComponent = () => {
  const isMobile = useIsMobile();
  const sidebar = useSideBar();
  const router = useRouter();
  const user = useMe();
  const { orgsList } = sidebar;

  return (
    <SidebarMemo
      user={user}
      orgsList={orgsList}
      isMobile={isMobile}
      sidebar={sidebar}
      handleProfileClick={() => router.push(`/profile/${user.username}/about`)}
      onLogoClick={() => router.push('/explore')}
    />
  );
};

export default withAuth(SideBarComponent);
