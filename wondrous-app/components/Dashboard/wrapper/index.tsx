import React from 'react';
import { Banner, Content, ContentContainer, OverviewComponent, DashboardHeader } from './styles';
import ChooseEntityToCreate from 'components/CreateEntity';

const CONFIG_MAP = {
  ADMIN: {
    label: 'My operator workspace',
    img: 'images/operator.png',
  },
  CONTRIBUTOR: {
    label: 'My contributor workspace',
    img: 'images/contrib.png',
  },
};

const Wrapper = (props) => {
  const { children, isAdmin } = props;

  const config = isAdmin ? CONFIG_MAP.ADMIN : CONFIG_MAP.CONTRIBUTOR;

  return (
    <>
      <OverviewComponent>
        <ChooseEntityToCreate />
        <Banner img={config.img}>
          <DashboardHeader>{config.label}</DashboardHeader>
        </Banner>
        <Content>
          <ContentContainer>{children}</ContentContainer>
        </Content>
      </OverviewComponent>
    </>
  );
};

export default Wrapper;
