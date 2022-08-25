import { useQuery } from '@apollo/client';
import HeaderComponent from 'components/Header';
import { SideBarComponent } from 'components/Common/Sidebar';
import { GET_USER_ORGS, GET_USER_PERMISSION_CONTEXT } from 'graphql/queries';
import { useRouter } from 'next/router';
import React, { useMemo, useState } from 'react';
import { PAGES_WITH_NO_SIDEBAR, SIDEBAR_WIDTH } from 'utils/constants';
import { CreateEntityContext, SideBarContext } from 'utils/contexts';
import { toggleHtmlOverflow } from 'utils/helpers';
import { useIsMobile } from 'utils/hooks';

import { SectionWrapper } from './styles';

const getOrgsList = (userOrgs, router) => {
  if (!userOrgs?.getUserOrgs) return [];
  const { getUserOrgs } = userOrgs;
  return getUserOrgs.map((item) => {
    const isActive = router.pathname.includes('/organization/[username]') && router.query?.username === item.username;
    return { ...item, isActive };
  });
};

export default function SidebarLayout({ children }) {
  const isMobile = useIsMobile();
  const router = useRouter();

  const { data: userPermissionsContext } = useQuery(GET_USER_PERMISSION_CONTEXT, {
    fetchPolicy: 'cache-and-network',
  });

  const [minimized, setMinimized] = useState(false);
  const { data: userOrgs } = useQuery(GET_USER_ORGS, {
    skip: isMobile || PAGES_WITH_NO_SIDEBAR.includes(router.pathname),
  });

  const [createFormModal, setCreateFormModal] = useState(false);

  const toggleCreateFormModal = () => {
    toggleHtmlOverflow();
    setCreateFormModal((prevState) => !prevState);
  };

  const orgsList = getOrgsList(userOrgs, router);
  const width = minimized || isMobile ? '0px' : SIDEBAR_WIDTH;
  const sidebarValue = useMemo(
    () => ({
      minimized,
      setMinimized,
      orgsList,
    }),
    [minimized, orgsList]
  );

  if (PAGES_WITH_NO_SIDEBAR.includes(router.pathname)) {
    return children;
  }
  return (
    <SideBarContext.Provider value={sidebarValue}>
      <SideBarComponent />
      <CreateEntityContext.Provider
        value={{
          isCreateEntityModalOpen: createFormModal,
          toggleCreateFormModal,
          userOrgs,
          userPermissionsContext: userPermissionsContext?.getUserPermissionContext
            ? JSON.parse(userPermissionsContext?.getUserPermissionContext)
            : null,
        }}
      >
        <HeaderComponent />
        <SectionWrapper style={{ width: `calc(100% - ${width})`, marginLeft: `${width}` }}>{children}</SectionWrapper>
      </CreateEntityContext.Provider>
    </SideBarContext.Provider>
  );
}
