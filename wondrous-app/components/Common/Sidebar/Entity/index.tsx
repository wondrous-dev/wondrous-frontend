import { ChildrenWrapper, SidebarWrapper, Wrapper } from 'components/Common/Sidebar/Common/styles';
import useSideBar from 'hooks/useSideBar';

import AboutEntity from './AboutEntity';
import List from './List';

const EntitySidebar = ({ children }) => {
  const { minimized } = useSideBar();
  return (
    <Wrapper>
      <SidebarWrapper minimized={minimized}>
        <AboutEntity />
        <List />
      </SidebarWrapper>
      <ChildrenWrapper minimized={minimized}>{children}</ChildrenWrapper>
    </Wrapper>
  );
};

export default EntitySidebar;
