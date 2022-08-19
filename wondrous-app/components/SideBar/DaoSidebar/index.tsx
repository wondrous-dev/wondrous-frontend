import useSideBar from 'hooks/useSideBar';
import styled from 'styled-components';

import List from './List';
import Options from './Options';

const Wrapper = styled.div`
  width: 260px;
  height: 100%;
  background: #232323;
  display: ${({ isActive }) => (isActive ? 'block' : 'none')};
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 28px;
  display: ${({ minimized }) => (minimized ? 'none' : 'block')};
`;

const DaoSidebarWrapper = styled.div`
  display: flex;
  height: 100%;
  min-height: 100vh;
  padding-top: 70px;
  transition: 0.3s;
  width: 100%;
`;

const DaoSidebar = ({ children }) => {
  const { orgsList, minimized } = useSideBar();
  const activeOrg = orgsList.find(({ isActive }) => isActive);
  if (!activeOrg) return null;
  const { isActive, username } = activeOrg;
  return (
    <DaoSidebarWrapper>
      <Wrapper isActive={isActive} minimized={minimized}>
        <Options />
        <List username={username} />
      </Wrapper>
      <div>{children}</div>
    </DaoSidebarWrapper>
  );
};

export default DaoSidebar;
