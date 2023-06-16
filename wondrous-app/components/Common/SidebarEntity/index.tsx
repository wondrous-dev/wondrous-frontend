import CollapseExpandButton from 'components/Common/SidebarCollapseButton';
import AboutEntity from 'components/Common/SidebarEntityAbout';
import SidebarEntityList from 'components/Common/SidebarEntityList';
import { ChildrenWrapper, SidebarContent, SidebarWrapper, Wrapper } from 'components/Common/SidebarStyles';
import useMediaQuery from 'hooks/useMediaQuery';
import useSideBar from 'hooks/useSideBar';

const EntitySidebar = ({ children, renderSidebar = null }) => {
  const { minimized } = useSideBar();
  const { isMobileScreen } = useMediaQuery();

  return (
    <Wrapper>
      <SidebarWrapper minimized={minimized}>
        {isMobileScreen ? <AboutEntity /> : null}
        <SidebarContent>{renderSidebar ? renderSidebar() : <SidebarEntityList />}</SidebarContent>
        <CollapseExpandButton />
      </SidebarWrapper>
      <ChildrenWrapper minimized={minimized}>{children}</ChildrenWrapper>
    </Wrapper>
  );
};

export default EntitySidebar;
