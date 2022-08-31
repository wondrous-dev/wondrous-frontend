import CollapseExpandButton from 'components/Common/SidebarCollapseButton';
import RolesSidebar from 'components/Common/SidebarEntityRoles';
import { ChildrenWrapper, SidebarContent, SidebarWrapper, Wrapper } from 'components/Common/SidebarStyles';
import useSideBar from 'hooks/useSideBar';
import { useRouter } from 'next/router';

import AboutEntity from './AboutEntity';
import List from './List';

const EntitySidebar = ({ children }) => {
  const { minimized } = useSideBar();
  const { query } = useRouter();
  return (
    <Wrapper>
      <SidebarWrapper minimized={minimized}>
        <SidebarContent>
          {query.roles ? (
            <RolesSidebar />
          ) : (
            <>
              <AboutEntity />
              <List />
            </>
          )}
        </SidebarContent>
        <CollapseExpandButton />
      </SidebarWrapper>
      <ChildrenWrapper minimized={minimized}>{children}</ChildrenWrapper>
    </Wrapper>
  );
};

export default EntitySidebar;
