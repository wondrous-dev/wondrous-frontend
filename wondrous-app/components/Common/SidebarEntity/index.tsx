import { useMemo, useRef } from 'react';
import { useRouter } from 'next/router';

import useSideBar from 'hooks/useSideBar';

import CollapseExpandButton from 'components/Common/SidebarCollapseButton';
import AboutEntity from 'components/Common/SidebarEntityAbout';
import List from 'components/Common/SidebarEntityList';
import RolesSidebar from 'components/Common/SidebarEntityRoles';
import CollabsSidebar from 'components/Common/SidebarEntityCollabs';
import { ChildrenWrapper, SidebarContent, SidebarWrapper, Wrapper } from 'components/Common/SidebarStyles';
import { useIsMobile, useOutsideAlerter } from 'utils/hooks';
import SidebarHomeProject from '../SidebarHomeProject';

const SIDEBAR_COMPONENTS = {
  collabs: () => <CollabsSidebar />,
  roles: () => <RolesSidebar />,
};

const EntitySidebar = ({ children }) => {
  const { minimized, setMinimized } = useSideBar();
  const { query } = useRouter();
  const isMobile = useIsMobile();
  const sidebarRef = useRef();

  useOutsideAlerter(sidebarRef, () => {
    if (isMobile && !minimized) {
      setMinimized(true);
    }
  });

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
        <SidebarHomeProject />
        <List />
      </>
    );
  }, [query.roles, query.collabs]);

  return (
    <Wrapper>
      <SidebarWrapper minimized={minimized} ref={sidebarRef}>
        <SidebarContent>
          <Sidebar />
        </SidebarContent>
        <CollapseExpandButton />
      </SidebarWrapper>
      <ChildrenWrapper minimized={minimized}>{children}</ChildrenWrapper>
    </Wrapper>
  );
};

export default EntitySidebar;
