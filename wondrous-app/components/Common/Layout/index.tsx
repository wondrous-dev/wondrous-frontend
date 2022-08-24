import React, { useState } from 'react';
import { SIDEBAR_WIDTH, PAGES_WITH_NO_SIDEBAR } from 'utils/constants';
import HeaderComponent from 'components/Header';
import SideBarComponent from 'components/SideBar';
import { toggleHtmlOverflow } from 'utils/helpers';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import { GET_NOTIFICATIONS, GET_USER_ORGS, GET_USER_PERMISSION_CONTEXT } from 'graphql/queries';
import { SideBarContext, GlobalContext } from 'utils/contexts';
import { useIsMobile } from 'utils/hooks';
import { LIMIT } from 'services/board';
import { SectionWrapper } from './styles';

export default function SidebarLayout({ children }) {
  const isMobile = useIsMobile();
  const router = useRouter();

  const { data: userPermissionsContext } = useQuery(GET_USER_PERMISSION_CONTEXT, {
    fetchPolicy: 'cache-and-network',
  });
  const {
    data: notifications,
    refetch,
    fetchMore: fetchMoreNotifications,
    loading: notificationsLoading,
  } = useQuery(GET_NOTIFICATIONS, {
    variables: {
      offset: 0,
      limit: LIMIT,
    },
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

  if (PAGES_WITH_NO_SIDEBAR.includes(router.pathname)) {
    return children;
  }

  const width = minimized || isMobile ? '0px' : SIDEBAR_WIDTH;

  return (
    <SideBarContext.Provider
      value={{
        minimized,
        setMinimized,
      }}
    >
      <SideBarComponent userOrgs={userOrgs} />
      <GlobalContext.Provider
        value={{
          isCreateEntityModalOpen: createFormModal,
          toggleCreateFormModal,
          userOrgs,
          userPermissionsContext: userPermissionsContext?.getUserPermissionContext
            ? JSON.parse(userPermissionsContext?.getUserPermissionContext)
            : null,
          notifications: notifications?.getNotifications,
          refetchNotifications: refetch,
          fetchMoreNotifications,
          notificationsLoading,
        }}
      >
        <HeaderComponent />
        <SectionWrapper style={{ width: `calc(100% - ${width})`, marginLeft: `${width}` }}>{children}</SectionWrapper>
      </GlobalContext.Provider>
    </SideBarContext.Provider>
  );
}
