import React from 'react';
import { Banner, Content, ContentContainer, OverviewComponent, DashboardHeader } from './styles';
import ChooseEntityToCreate from 'components/CreateEntity';

const Wrapper = (props) => {
  const { children } = props;

  return (
    <>
      <OverviewComponent>
        <ChooseEntityToCreate />
        <Banner>
          <DashboardHeader>My contributor workspace</DashboardHeader>
        </Banner>
        <Content>
          <ContentContainer>{children}</ContentContainer>
        </Content>
      </OverviewComponent>
    </>
  );
};

export default Wrapper;
