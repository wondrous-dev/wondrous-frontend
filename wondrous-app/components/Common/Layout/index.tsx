import React, { useState, useEffect } from 'react';
import { SIDEBAR_WIDTH } from 'utils/constants';
import useSideBar from 'hooks/useSideBar';
import HeaderComponent from 'components/Header';
import SideBarComponent from 'components/SideBar';
import { toggleHtmlOverflow } from 'utils/helpers';
import ChooseEntityToCreate from 'components/CreateEntity';
import { useRouter } from 'next/router';
import { SectionWrapper } from './styles';
import { useQuery } from '@apollo/client';
import { GET_USER_ORGS } from 'graphql/queries';
import { SideBarContext } from 'utils/contexts';
import { useIsMobile } from 'utils/hooks';

const PAGES_WITH_NO_SIDEBAR = ['/', '/forgot-password', '/signup', '/login'];

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
    <>
      <SideBarContext.Provider
        value={{
          minimized,
          setMinimized,
        }}
      >
        <HeaderComponent openCreateFormModal={toggleCreateFormModal} />
        <ChooseEntityToCreate open={createFormModal} toggleOpen={toggleCreateFormModal} />
        <SideBarComponent userOrgs={userOrgs} />
        <SectionWrapper style={{ width: `calc(100% - ${width})`, marginLeft: `${width}` }}>{children}</SectionWrapper>
      </SideBarContext.Provider>
    </>
  );
}
