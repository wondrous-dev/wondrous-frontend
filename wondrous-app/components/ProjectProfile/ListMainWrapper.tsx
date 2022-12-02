import Grid from '@mui/material/Grid';

import ListBounty from './ListBounty';
import ListCollab from './ListCollab';
import ListDoc from './ListDoc';
import ListGrant from './ListGrant';
import ListMember from './ListMember';
import ListMilestone from './ListMilestone';
import ListProposal from './ListProposal';
import ListTask from './ListTask';

const ListMainWrapper = () => (
  <Grid
    container
    justifyContent="space-between"
    gap="24px"
    sx={{
      '& > *': {
        maxWidth: 'calc(50% - 12px)',
      },
    }}
  >
    <ListTask />
    <ListBounty />
    <ListMilestone />
    <ListProposal />
    <ListMember />
    <ListCollab />
    <ListGrant />
    <ListDoc />
  </Grid>
);

export default ListMainWrapper;
