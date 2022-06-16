import Header from '../../../Header';
import { Main, Footer, Container } from './styles';
import SideBarComponent from '../../../SideBar';
import { SIDEBAR_WIDTH } from 'utils/constants';
import useSideBar from 'hooks/useSideBar';

const SIDEBAR_LIST_ITEMS = [
  {
    id: 1,
    icon: '/images/sidebar/first.png',
    path: '/',
  },
  {
    id: 2,
    icon: '/images/sidebar/second.png',
    path: '/',
  },
  {
    id: 3,
    icon: '/images/sidebar/third.png',
    path: '/',
  },
];

const AppLayout = ({ banner, children, ...props }) => {
  const { minimized } = useSideBar();

  return (
    <>
      <Header />
      <SideBarComponent />
      <Main
        style={{
          paddingLeft: minimized ? 0 : SIDEBAR_WIDTH,
        }}
      >
        {banner}
        <Container style={props?.containerStyle}>{children}</Container>
      </Main>
      <Footer />
    </>
  );
};

export default AppLayout;
