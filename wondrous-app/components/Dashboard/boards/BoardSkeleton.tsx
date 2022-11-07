import React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';

import palette from 'theme/palette';

// Use this component to create a skeleton for the dashboard
const BoardSkeleton = () => (
  <Box px="50px" mt="250px">
    <Skeleton sx={{ bgcolor: palette.grey900, margin: '20px 0' }} variant="rectangular" width="50%" height={45} />
    <Grid container wrap="nowrap" gap="20px" columns={4}>
      {Array.from(new Array(4)).map((index) => (
        <Grid key={index} item sm={3}>
          <Skeleton sx={{ bgcolor: palette.grey900 }} variant="rectangular" width="100%" height={133} />
        </Grid>
      ))}
    </Grid>
  </Box>
);

export default BoardSkeleton;
