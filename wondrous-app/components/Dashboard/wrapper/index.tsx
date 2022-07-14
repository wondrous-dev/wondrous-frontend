import React, { useState } from 'react';
import Image from 'next/image';
import { Banner, Content, ContentContainer, OverviewComponent } from './styles';

const Wrapper = (props) => {
  const { children } = props;

  return (
    <>
      <OverviewComponent>
        <Banner>
          <Image alt="Dashboard" src="/images/dashboard-banner.png" layout="fill" objectFit="cover" quality={80} />
        </Banner>
        <Content>
          <ContentContainer>{children}</ContentContainer>
        </Content>
      </OverviewComponent>
    </>
  );
};

export default Wrapper;
