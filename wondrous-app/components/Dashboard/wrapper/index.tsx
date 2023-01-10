import React, { useEffect } from 'react';

import ChooseEntityToCreate from 'components/CreateEntity';
import { useIsMobile } from 'utils/hooks';
import { GET_USER_ORGS } from 'graphql/queries';
import { MERIT_CIRCLE_ID } from 'utils/constants';
import { useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
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
  const router = useRouter();
  const config = isAdmin ? CONFIG_MAP.ADMIN : CONFIG_MAP.CONTRIBUTOR;
  const { data: userOrgs } = useQuery(GET_USER_ORGS);
  const onlyHasMeritCircle = userOrgs?.getUserOrgs?.length === 1 && userOrgs?.getUserOrgs[0]?.id === MERIT_CIRCLE_ID;

  useEffect(() => {
    if (onlyHasMeritCircle && !isAdmin) {
      router.push('/dashboard/proposals');
    }
  }, [onlyHasMeritCircle, isAdmin]);
  return (
    <OverviewComponent>
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
