import React from 'react';
import { useRouter } from 'next/router';

import useSideBar from 'hooks/useSideBar';
import { useIsMobile } from 'utils/hooks';
import { useMe, withAuth } from 'components/Auth/withAuth';

import SidebarMemo from './SidebarMemo';

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
    />
  );
};

export default withAuth(SideBarComponent);
