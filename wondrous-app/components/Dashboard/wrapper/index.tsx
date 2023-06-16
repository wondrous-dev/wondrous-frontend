import { useQuery } from '@apollo/client';
import { ErrorText } from 'components/Common';
import ChooseEntityToCreate from 'components/CreateEntity';
import { GET_USER_ORGS } from 'graphql/queries';
import useQueryModules from 'hooks/modules/useQueryModules';
import { Banner, BannerWrapper, Content, ContentContainer, DashboardHeader, OverviewComponent } from './styles';

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
  const getUserOrgs = userOrgs?.getUserOrgs;
  const modules = useQueryModules({ orgId: getUserOrgs?.[0]?.id });
  const hasNoWorkSection =
    getUserOrgs?.length === 1 && modules?.task && modules?.bounty && modules?.proposal && modules?.pod;
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
