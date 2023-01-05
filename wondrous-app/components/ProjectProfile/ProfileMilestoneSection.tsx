import Grid from '@mui/material/Grid';
import TaskCardStatus from 'components/Common/TaskCardStatus';
import FlagIcon from 'components/Icons/Sidebar/flag.svg';
import palette from 'theme/palette';
import { ENTITIES_TYPES, TASK_STATUS_DONE } from 'utils/constants';

import { useEntityCreateButtonProps, useGetEntity } from './helpers';
import SectionContent from './SectionContent';
import MilestoneProgress from './MilestoneProgress';

const LeftComponent = ({ title }) => (
  <Grid container gap="12px" alignItems="center" fontWeight="600" color={palette.white}>
    {title}
  </Grid>
);

const RightComponent = ({ type, orgId, status, id }) => (
  <Grid container>
    {status === TASK_STATUS_DONE ? (
      <TaskCardStatus type={type} orgId={orgId} status={status} style={{ background: palette.black81 }} />
    ) : (
      <MilestoneProgress milestoneId={id} />
    )}
  </Grid>
);

const ProfileMilestoneSection = () => (
  <SectionContent
    HeaderTitleProps={{
      text: 'Milestones',
      IconComponent: FlagIcon,
    }}
    CreateButtonProps={useEntityCreateButtonProps(ENTITIES_TYPES.MILESTONE)}
    backgroundImageUrl="/images/project/milestone-empty-bg.svg"
    showAllUrl="boards?entity=milestone"
    ListItemProps={{
      LeftComponent,
      RightComponent,
      onClick: ({ router, data: { id } }) =>
        router.push({ query: { ...router.query, task: id } }, undefined, { scroll: false }),
    }}
    data={useGetEntity('milestone')}
  />
);

export default ProfileMilestoneSection;
