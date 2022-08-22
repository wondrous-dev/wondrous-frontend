import { ChildrenWrapper, SidebarWrapper, Wrapper } from 'components/Common/Sidebar/Common/styles';
import useSideBar from 'hooks/useSideBar';
import { useRouter } from 'next/router';

import AboutEntity from './AboutEntity';
import List from './List';
import RolesSidebar from './Role';

const EntitySidebar = ({ children }) => {
  const { minimized } = useSideBar();
  const { query } = useRouter();
  return (
    <Wrapper>
      <SidebarWrapper minimized={minimized}>
        {query.roles ? (
          <RolesSidebar />
        ) : (
          <>
            <AboutEntity />
            <List />
          </>
        )}
      </SidebarWrapper>
      <ChildrenWrapper minimized={minimized}>{children}</ChildrenWrapper>
    </Wrapper>
  );
};

export default EntitySidebar;
