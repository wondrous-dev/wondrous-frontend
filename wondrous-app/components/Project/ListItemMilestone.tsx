import { Grid } from '@mui/material';
import TaskCardStatus from 'components/Common/TaskCardStatus';
import ListItemWrapper from 'components/Project/ListItemWrapper';
import palette from 'theme/palette';
import { TASK_STATUS_DONE } from 'utils/constants';

import MilestoneProgress from './MilestoneProgress';

interface IListItemMilestone {
  bounty;
}

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

const ListItemMilestone = (props: IListItemMilestone) => (
  <ListItemWrapper
    LeftComponent={LeftComponent}
    LeftComponentProps={props}
    RightComponent={RightComponent}
    RightComponentProps={props}
  />
);

export default ListItemMilestone;
