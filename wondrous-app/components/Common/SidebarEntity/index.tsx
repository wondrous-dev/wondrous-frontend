import CollapseExpandButton from 'components/Common/SidebarCollapseButton';
import AboutEntity from 'components/Common/SidebarEntityAbout';
import List from 'components/Common/SidebarEntityList';
import RolesSidebar from 'components/Common/SidebarEntityRoles';
import { ChildrenWrapper, SidebarContent, SidebarWrapper, Wrapper } from 'components/Common/SidebarStyles';
import useSideBar from 'hooks/useSideBar';
import { useRouter } from 'next/router';

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
