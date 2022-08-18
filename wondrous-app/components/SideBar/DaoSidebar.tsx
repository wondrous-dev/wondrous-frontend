import useSideBar from 'hooks/useSideBar';
import styled from 'styled-components';

const Wrapper = styled.div`
  width: 260px;
  height: 100%;
  background: #232323;
  display: ${({ isActive }) => (isActive ? 'block' : 'none')};
`;

const DaoSidebar = () => {
  const { orgsList } = useSideBar();
  const activeOrg = orgsList.find(({ isActive }) => isActive);
  if (!activeOrg) return null;
  const { isActive } = activeOrg;
  return <Wrapper isActive={isActive} />;
};

export default DaoSidebar;
