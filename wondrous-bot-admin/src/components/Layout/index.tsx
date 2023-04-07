import Navbar from 'components/Navbar';
import { Outlet } from 'react-router';
import { Main } from './styles';

const Layout = () => {
  return (
    <>
      <Navbar />
      <Main>
        <Outlet />
      </Main>
    </>
  );
};

export default Layout;
