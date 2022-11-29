import Grid from '@mui/material/Grid';
import TaskCardStatus from 'components/Common/TaskCardStatus';
import palette from 'theme/palette';
import { ENTITIES_TYPES, TASK_STATUS_DONE } from 'utils/constants';
import FlagIcon from 'components/Icons/Sidebar/flag.svg';

import MilestoneProgress from './MilestoneProgress';
import { useEntityCreateButtonProps, useGetOrgEntity } from './helpers';

const LeftComponent = ({ title }) => (
  <Grid container gap="12px" alignItems="center" fontWeight="600" color={palette.white}>
    {title}
  </Grid>
);

const RightComponent = ({ type, orgId, status, id }) => (
  <Grid container>
    {status === TASK_STATUS_DONE ? (
      <TaskCardStatus type={type} orgId={orgId} status={status} style={{ background: '#343434' }} />
    ) : (
      <MilestoneProgress milestoneId={id} />
    )}
  </Grid>
);

const ListItemMilestone = { LeftComponent, RightComponent };

const useListMilestone = () => ({
  HeaderTitleProps: {
    text: 'Milestone',
    IconComponent: FlagIcon,
  },
  CreateButtonProps: useEntityCreateButtonProps(ENTITIES_TYPES.MILESTONE),
  backgroundImageUrl: '/images/project/milestone-empty-bg.svg',
  showAllUrl: 'boards?entity=milestone',
  ListItemProps: {
    LeftComponent,
    RightComponent,
    onClick: (router, { orgUsername, id }) =>
      router.push(`/organization/${orgUsername}/boards?task=${id}&view=grid&entity=milestone`),
  },
  data: useGetOrgEntity('milestone'),
});

export default useListMilestone;