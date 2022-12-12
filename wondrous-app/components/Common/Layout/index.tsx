import React, { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@apollo/client';
import { GET_NOTIFICATIONS, GET_USER_ORGS, GET_USER_PERMISSION_CONTEXT } from 'graphql/queries';
import { GlobalContext, PageDataContext, SideBarContext } from 'utils/contexts';
import { LIMIT } from 'services/board';
import { PAGES_WITH_NO_SIDEBAR, SIDEBAR_WIDTH } from 'utils/constants';
import SideBarComponent from 'components/Common/SidebarMain';
import HeaderComponent from 'components/Header';
import { useRouter } from 'next/router';
import { useHotkeys } from 'react-hotkeys-hook';
import { toggleHtmlOverflow } from 'utils/helpers';
import { useIsMobile } from 'utils/hooks';

import { HOTKEYS } from 'utils/hotkeyHelper';
import Spotlight from 'components/Spotlight';
import { BackdropComponent, SectionWrapper } from './styles';
import UserSidebar from '../UserSidebar';
import EntitySidebar from '../SidebarEntity';
import useMediaQuery from 'hooks/useMediaQuery';

const getOrgsList = (userOrgs, router) => {
  if (!userOrgs?.getUserOrgs) return [];
  const { getUserOrgs } = userOrgs;
  return getUserOrgs.map((item) => ({
    ...item,
    isActive:
      router.pathname.includes('/organization/') &&
      (router.query?.username === item.username || router.query?.orgId === item.id),
  }));
};

const PAGES_WITH_USER_SIDEBAR = [
  '/mission-control',
  '/dashboard/admin',
  '/dashboard/bounties',
  '/dashboard',
  '/dashboard/proposals',
  '/profile/[username]/about',
];

const SectionContainer = ({ children }: any) => {
  const router = useRouter();

  const isPageWithUserSidebar = useMemo(() => PAGES_WITH_USER_SIDEBAR.includes(router.pathname), [router.pathname]);

  if (isPageWithUserSidebar) {
    return (
      <SectionWrapper>
        <EntitySidebar renderSidebar={UserSidebar}>{children}</EntitySidebar>
      </SectionWrapper>
    );
  }
  return <SectionWrapper>{children}</SectionWrapper>;
};
export default function SidebarLayout({ children }) {
  const {isMobileScreen : isMobile} = useMediaQuery();
  const router = useRouter();
  const [pageData, setPageData] = useState({});
  const [isSpotlightOpen, setIsSpotlightOpen] = useState(false);
  useHotkeys(HOTKEYS.OPEN_DASHBOARD, () => {
    // should this be here?
    router.push(`/dashboard`, undefined, {
      shallow: true,
    });
  });

  const { data: userPermissionsContext } = useQuery(GET_USER_PERMISSION_CONTEXT, {
    fetchPolicy: 'cache-and-network',
    skip: PAGES_WITH_NO_SIDEBAR.includes(router.pathname),
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
    fetchPolicy: 'cache-and-network',
    skip: PAGES_WITH_NO_SIDEBAR.includes(router.pathname),
  });
  const [minimized, setMinimized] = useState(true);
  const { data: userOrgs } = useQuery(GET_USER_ORGS, {
    skip: PAGES_WITH_NO_SIDEBAR.includes(router.pathname),
    variables: {
      excludeSharedOrgs: true,
    },
  });
  
  useEffect(() => {
    setMinimized(isMobile)
  }, [isMobile])

  const [createFormModal, setCreateFormModal] = useState(false);

  const toggleCreateFormModal = () => {
    toggleHtmlOverflow();
    setCreateFormModal((prevState) => !prevState);
  };

  const orgsList = getOrgsList(userOrgs, router);
  const sidebarValue = useMemo(
    () => ({
      minimized,
      setMinimized,
      orgsList,
    }),
    [minimized, orgsList]
  );

  const pageDataValues = useMemo(() => ({ setPageData }), [setPageData]);

  if (PAGES_WITH_NO_SIDEBAR.includes(router.pathname)) {
    return children;
  }

  const toggleSpotlight = () => {
    setIsSpotlightOpen((prev) => !prev);
    if (!minimized && isMobile) {
      setMinimized(true);
    }
  };

  return (
    <SideBarContext.Provider value={sidebarValue}>
      {/* <SideBarComponent userOrgs={userOrgs} /> */}
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
          toggleSpotlight,
          pageData,
          setPageData,
          orgsList,
        }}
      >
        <HeaderComponent />
        {!minimized && isMobile && <BackdropComponent open onClick={() => setMinimized(true)} />}
        {isSpotlightOpen ? <Spotlight onClose={toggleSpotlight} /> : null}
        <PageDataContext.Provider value={pageDataValues}>
          <SectionContainer>
            {children}
          </SectionContainer>

        </PageDataContext.Provider>
      </GlobalContext.Provider>
    </SideBarContext.Provider>
  );
}
