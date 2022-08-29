import { ChildrenWrapper, SidebarContent, SidebarWrapper, Wrapper } from 'components/Common/Sidebar/Common/styles';
import useSideBar from 'hooks/useSideBar';
import { useRouter } from 'next/router';
import CollapseExpandButton from '../Common/CollapseButton';

import AboutEntity from './AboutEntity';
import List from './List';
import RolesSidebar from './Role';

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
