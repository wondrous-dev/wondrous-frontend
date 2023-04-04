import Header from 'components/Header';
import { Outlet } from 'react-router';
import { Main } from './styles';

const Layout = () => {
  return (
    <>
      <Header />
      <Main>
        <Outlet />
      </Main>
    </>
  );
};

export default Layout;
