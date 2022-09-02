import { useQuery } from '@apollo/client';
import HeaderComponent from 'components/Header';
import SideBarComponent from 'components/SideBar';
import { GET_USER_ORGS, GET_USER_PERMISSION_CONTEXT } from 'graphql/queries';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { PAGES_WITH_NO_SIDEBAR, SIDEBAR_WIDTH } from 'utils/constants';
import { CreateEntityContext, SideBarContext } from 'utils/contexts';
import { toggleHtmlOverflow } from 'utils/helpers';
import { useIsMobile } from 'utils/hooks';
import { HOTKEYS } from 'utils/hotkeyHelper';
import { SectionWrapper } from './styles';

export default function SidebarLayout({ children }) {
  const isMobile = useIsMobile();
  const router = useRouter();
  useHotkeys(HOTKEYS.OPEN_DASHBOARD, () => {
    router.push(`/dashboard`);
  });

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
