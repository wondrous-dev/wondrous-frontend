import ScrollBarStyles from 'components/Common/ScrollbarStyles';
import useSideBar from 'hooks/useSideBar';
import styled from 'styled-components';

import AboutEntity from './AboutEntity';
import List from './List';

const Wrapper = styled.div`
  background: #232323;
  flex-direction: column;
  gap: 28px;
  height: 100%;
  overflow-y: auto;
  padding: 24px;
  position: fixed;
  width: 260px;
  display: flex;
  ${({ minimized }) => minimized && `left: -100%`};
  ${ScrollBarStyles}
`;

const DaoSidebarWrapper = styled.div`
  display: flex;
  width: 100%;
  position: relative;
`;

const ChildrenWrapper = styled.div`
  margin-left: ${({ minimized }) => (minimized ? '0px' : '280px')};
  width: 100%;
`;

const DaoSidebar = ({ children }) => {
  const { minimized } = useSideBar();
  return (
    <DaoSidebarWrapper>
      <Wrapper minimized={minimized}>
        <AboutEntity />
        <List />
      </Wrapper>
      <ChildrenWrapper minimized={minimized}>{children}</ChildrenWrapper>
    </DaoSidebarWrapper>
  );
};

export default DaoSidebar;
