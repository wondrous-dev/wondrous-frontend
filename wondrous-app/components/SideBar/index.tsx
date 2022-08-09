import React from 'react';
import { useRouter } from 'next/router';

import useSideBar from 'hooks/useSideBar';
import { useIsMobile } from 'utils/hooks';
import { useMe, withAuth } from 'components/Auth/withAuth';

import SidebarMemo from './SidebarMemo';

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
