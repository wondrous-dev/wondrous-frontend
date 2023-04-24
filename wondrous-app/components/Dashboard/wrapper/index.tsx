import React, { useEffect } from 'react';

import ChooseEntityToCreate from 'components/CreateEntity';
import { useIsMobile } from 'utils/hooks';
import { GET_USER_ORGS } from 'graphql/queries';
import { ENTITIES_TYPES, SPECIAL_ORGS } from 'utils/constants';
import { useQuery } from '@apollo/client';
import { ErrorText } from 'components/Common';
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
  const config = isAdmin ? CONFIG_MAP.ADMIN : CONFIG_MAP.CONTRIBUTOR;
  const { data: userOrgs } = useQuery(GET_USER_ORGS);
  const isOnlyInSpecialOrg = userOrgs?.getUserOrgs?.length === 1 && userOrgs?.getUserOrgs[0]?.id in SPECIAL_ORGS;
  const hasNoWorkSection =
    isOnlyInSpecialOrg &&
    !(
      SPECIAL_ORGS[userOrgs?.getUserOrgs[0]?.id]?.includes(ENTITIES_TYPES.TASK) ||
      SPECIAL_ORGS[userOrgs?.getUserOrgs[0]?.id]?.includes(ENTITIES_TYPES.BOUNTY) ||
      SPECIAL_ORGS[userOrgs?.getUserOrgs[0]?.id]?.includes(ENTITIES_TYPES.PROPOSAL) ||
      SPECIAL_ORGS[userOrgs?.getUserOrgs[0]?.id]?.includes(ENTITIES_TYPES.MILESTONE)
    );
  return (
    <OverviewComponent>
      <ChooseEntityToCreate />
      <BannerWrapper>
        <Banner src={config.img} />
        <DashboardHeader gradient={config.gradient}>{config.label}</DashboardHeader>
      </BannerWrapper>
      {hasNoWorkSection && (
        <ErrorText
          style={{
            marginLeft: '32px',
            marginTop: '8px',
          }}
        >
          This organization has only enabled certain functionality. To create tasks, milestones, bounties and proposals
          please join another organization as well.
        </ErrorText>
      )}
      <Content>
        <ContentContainer>{children}</ContentContainer>
      </Content>
    </OverviewComponent>
  );
};

export default Wrapper;
