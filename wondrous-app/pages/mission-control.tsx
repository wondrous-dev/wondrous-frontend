import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';
import React from 'react';

import lazy from 'utils/enhancements/lazy';
import palette from '../theme/palette';

const MissionControlSkeleton = () => (
    <Grid container wrap="nowrap" gap="20px" columns={3}>
      {Array.from(new Array(2)).map((index) => (
        <Grid key={index} item sm={5}>
          <Box mt="80px" width="100%">
            <Skeleton sx={{ bgcolor: palette.grey900 }} variant="rectangular" width="100%" height={500} />
          </Box>
        </Grid>
      ))}
      <Grid item sm={2}>
        <Skeleton sx={{ bgcolor: palette.grey900 }} variant="rectangular" width="100%" height="100vh" />
      </Grid>
    </Grid>
);

const MissionControl = lazy(() => import('./mission-control.lazy'), MissionControlSkeleton);

const MissionControlPage = (props) => <MissionControl {...props} />;

export default MissionControlPage;
