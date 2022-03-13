import Image from 'next/image';
import React from 'react';

import Header from '../Header';
import SideBarComponent from '../SideBar';
import { Content, ContentContainer, HeaderImage, OverviewComponent } from './styles';

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

const tabsLinks = [
  {
    href: '/profile/boards',
    label: 'Boards',
  },
  {
    href: '/profile/activities',
    label: 'Activity',
  },
  {
    href: '/profile/about',
    label: 'About',
  },
];

const Wrapper = (props) => {
  const { data, children } = props;

  return (
    <>
      <Header />
      <SideBarComponent />
      <OverviewComponent>
        <HeaderImage>
          <Image alt="Background" src="/images/overview/background.png" layout="fill" objectFit="cover" quality={80} />
        </HeaderImage>
        <Content>
          <ContentContainer>{children}</ContentContainer>
        </Content>
      </OverviewComponent>
    </>
  );
};

export default Wrapper;
