import Navbar from 'components/Navbar';
import { Outlet } from 'react-router';
import { useLocation } from 'react-router-dom';
import { PAGES_WITHOUT_HEADER } from 'utils/constants';
import { Main } from './styles';

const Layout = () => {
  const location = useLocation();

  const isPageWithoutHeader = PAGES_WITHOUT_HEADER.includes(location.pathname);
  
  return (
    <>
      {isPageWithoutHeader ? null : <Navbar />}
      <Main $isPageWithoutHeader={isPageWithoutHeader}>
        <Outlet />
      </Main>
    </>
  );
};

export default Layout;
