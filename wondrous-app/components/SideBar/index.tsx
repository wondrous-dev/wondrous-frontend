import React from 'react';

import { useMe, withAuth } from '../Auth/withAuth';
import useSideBar from 'hooks/useSideBar';
import { useRouter } from 'next/router';
import SidebarMemo from './SidebarMemo';
import { useIsMobile } from 'utils/hooks';

const SideBarComponent = ({ userOrgs }) => {
  const isMobile = useIsMobile();
  const sidebar = useSideBar();
  const router = useRouter();
  const user = useMe();

  const orgsList = (userOrgs?.getUserOrgs || []).map((item) => {
    const isActive = router.pathname === '/organization/[username]/boards' && router.query?.username === item.username;

    return { ...item, isActive };
  });

  return (
    <SidebarMemo
      user={user}
      orgsList={orgsList}
      isMobile={isMobile}
      sidebar={sidebar}
      handleProfileClick={() =>
        router.push(`/profile/${user.username}/about`, undefined, {
          shallow: true,
        })
      }
    />
  );
};

export default withAuth(SideBarComponent);
