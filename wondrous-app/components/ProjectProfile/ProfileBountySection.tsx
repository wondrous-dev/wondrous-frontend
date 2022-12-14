import Grid from '@mui/material/Grid';
import Compensation from 'components/Common/Compensation';
import StarIcon from 'components/Icons/Sidebar/star.svg';
import palette from 'theme/palette';
import { ENTITIES_TYPES } from 'utils/constants';
import { useTaskActions } from 'utils/hooks';

import { useEntityCreateButtonProps, useGetOrgEntity } from './helpers';
import SectionContent from './SectionContent';

const LeftComponent = ({ title }) => (
  <Grid container gap="12px" alignItems="center" fontWeight="600" color={palette.white}>
    {title}
  </Grid>
);

const RightComponent = ({ rewards }) => <Compensation rewards={rewards} />;

const ProfileBountySection = () => {
  const { openTaskViewModal } = useTaskActions();

  return (
    <SectionContent
      HeaderTitleProps={{
        text: 'Bounties',
        IconComponent: StarIcon,
      }}
      CreateButtonProps={useEntityCreateButtonProps(ENTITIES_TYPES.BOUNTY)}
      backgroundImageUrl="/images/project/bounty-empty-bg.svg"
      showAllUrl="boards?entity=bounty"
      ListItemProps={{
        LeftComponent,
        RightComponent,
        onClick: (router, { id }) => openTaskViewModal({ id }),
      }}
      data={useGetOrgEntity('bounty')}
    />
  );
};

export default ProfileBountySection;
