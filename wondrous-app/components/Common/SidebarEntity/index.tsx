import { useMemo, useState } from 'react';
import { useRouter } from 'next/router';

import useSideBar from 'hooks/useSideBar';

import CollapseExpandButton from 'components/Common/SidebarCollapseButton';
import AboutEntity from 'components/Common/SidebarEntityAbout';
import List from 'components/Common/SidebarEntityList';
import RolesSidebar from 'components/Common/SidebarEntityRoles';
import CollabsSidebar from 'components/Common/SidebarEntityCollabs';
import {
  ChildrenWrapper,
  SidebarContent,
  SidebarDrawerWrapper,
  SidebarWrapper,
  Wrapper,
} from 'components/Common/SidebarStyles';
import { useIsMobile } from 'utils/hooks';

const SIDEBAR_COMPONENTS = {
  collabs: () => <CollabsSidebar />,
  roles: () => <RolesSidebar />,
};

const EntitySidebar = ({ children }) => {
  const { minimized, openMobileOrgSidebar, setOpenMobileOrgSidebar } = useSideBar();
  const { query } = useRouter();
  const isMobile = useIsMobile();

  const Sidebar = useMemo(() => {
    if (query.roles) {
      return SIDEBAR_COMPONENTS.roles;
    }
    if (query.collabs) {
      return SIDEBAR_COMPONENTS.collabs;
    }

    return () => (
      <>
        <AboutEntity />
        <List />
      </>
    );
  }, [query.roles, query.collabs]);

  const handleCloseSidebar = () => setOpenMobileOrgSidebar(false);

  return (
    <Wrapper>
      {isMobile ? (
        <SidebarDrawerWrapper open={openMobileOrgSidebar} onClose={handleCloseSidebar}>
          <SidebarContent>
            <Sidebar />
          </SidebarContent>
          <CollapseExpandButton onClick={handleCloseSidebar} />
        </SidebarDrawerWrapper>
      ) : (
        <SidebarWrapper minimized={minimized}>
          <SidebarContent>
            <Sidebar />
          </SidebarContent>
          <CollapseExpandButton />
        </SidebarWrapper>
      )}
      <ChildrenWrapper minimized={minimized}>{children}</ChildrenWrapper>
    </Wrapper>
  );
};

export default EntitySidebar;
