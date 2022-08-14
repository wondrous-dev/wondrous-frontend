import React, { useState } from 'react';
import { SIDEBAR_WIDTH, PAGES_WITH_NO_SIDEBAR } from 'utils/constants';
import HeaderComponent from 'components/Header';
import SideBarComponent from 'components/SideBar';
import { toggleHtmlOverflow } from 'utils/helpers';
import ChooseEntityToCreate from 'components/CreateEntity';
import { useRouter } from 'next/router';
import { useQuery } from '@apollo/client';
import { GET_USER_ORGS } from 'graphql/queries';
import { SideBarContext, CreateEntityContext } from 'utils/contexts';
import { useIsMobile } from 'utils/hooks';
import { SectionWrapper } from './styles';

export default function SidebarLayout({ children }) {
  const isMobile = useIsMobile();
  const router = useRouter();

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
        }}
      >
        <HeaderComponent />
        <SectionWrapper style={{ width: `calc(100% - ${width})`, marginLeft: `${width}` }}>{children}</SectionWrapper>
      </CreateEntityContext.Provider>
    </SideBarContext.Provider>
  );
}
