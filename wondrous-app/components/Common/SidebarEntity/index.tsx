import CollapseExpandButton from 'components/Common/SidebarCollapseButton';
import AboutEntity from 'components/Common/SidebarEntityAbout';
import List from 'components/Common/SidebarEntityList';
import RolesSidebar from 'components/Common/SidebarEntityRoles';
import CollabsSidebar from 'components/Common/SidebarEntityCollabs';
import { ChildrenWrapper, SidebarContent, SidebarWrapper, Wrapper } from 'components/Common/SidebarStyles';
import useSideBar from 'hooks/useSideBar';
import { useRouter } from 'next/router';

const SIDEBAR_COMPONENTS = {
  collabs: () => <CollabsSidebar />,
  roles: () => <RolesSidebar />,
};

const EntitySidebar = ({ children }) => {
  const { minimized } = useSideBar();
  const { query } = useRouter();

  let Sidebar = () => (
    <>
      <AboutEntity />
      <List />
    </>
  );

  if (query.roles) Sidebar = SIDEBAR_COMPONENTS.roles;
  if (query.collabs) Sidebar = SIDEBAR_COMPONENTS.collabs;

  return (
    <Wrapper>
      <SidebarWrapper minimized={minimized}>
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
