import Header from '../../../Header';
import { Main, Footer, Container } from './styles';
import SideBarComponent from '../../../SideBar';
import { useState } from 'react';
import { SideBarContext } from 'utils/contexts';
import { SIDEBAR_WIDTH } from 'utils/constants';

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
  const [minimized, setMinimized] = useState(false);
  return (
    <>
      <Header />
      <SideBarContext.Provider
        value={{
          minimized,
          setMinimized,
        }}
      >
        <SideBarComponent />
        <Main
          style={{
            paddingLeft: minimized ? 0 : SIDEBAR_WIDTH,
          }}
        >
          {banner}
          <Container style={props?.containerStyle}>{children}</Container>
        </Main>
      </SideBarContext.Provider>
      <Footer />
    </>
  );
};

export default AppLayout;
