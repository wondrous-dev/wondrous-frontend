import React, {useEffect} from 'react';

import MobileComingSoonModal from 'components/Onboarding/MobileComingSoonModal';
import ChooseEntityToCreate from 'components/CreateEntity';
import { useIsMobile } from 'utils/hooks';
import { Banner, Content, ContentContainer, OverviewComponent, DashboardHeader, BannerWrapper } from './styles';

const CONFIG_MAP = {
  ADMIN: {
    label: 'Your Operator Workspace',
    img: '/images/operator.png',
    gradient: 'linear-gradient(180deg, #00BAFF 0%, #F2C678 100%)',
  },
  CONTRIBUTOR: {
    label: 'Your Contributor Workspace',
    img: '/images/contrib.png',
    gradient: 'linear-gradient(180deg, #7427FF 0%, #F2C678 100%)',
  },
};

const Wrapper = (props) => {
  const { children, isAdmin } = props;
  const isMobile = useIsMobile();
  const config = isAdmin ? CONFIG_MAP.ADMIN : CONFIG_MAP.CONTRIBUTOR;

  return (
    <OverviewComponent>
      {isMobile ? <MobileComingSoonModal /> : null}
      <ChooseEntityToCreate />
      <BannerWrapper>
        <Banner src={config.img} />
        <DashboardHeader gradient={config.gradient}>{config.label}</DashboardHeader>
      </BannerWrapper>
      <Content>
        <ContentContainer>{children}</ContentContainer>
      </Content>
    </OverviewComponent>
  );
};

export default Wrapper;
