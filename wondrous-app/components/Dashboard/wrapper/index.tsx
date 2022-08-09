import React, { useState } from 'react';
import Image from 'next/image';
import ChooseEntityToCreate from 'components/CreateEntity';
import { Banner, Content, ContentContainer, OverviewComponent } from './styles';

function Wrapper(props) {
  const { children } = props;

  return (
    <OverviewComponent>
      <ChooseEntityToCreate />
      <Banner>
        <Image alt="Dashboard" src="/images/dashboard-banner.png" layout="fill" objectFit="cover" quality={80} />
      </Banner>
      <Content>
        <ContentContainer>{children}</ContentContainer>
      </Content>
    </OverviewComponent>
  );
}

export default Wrapper;
