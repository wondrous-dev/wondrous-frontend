import React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';

import palette from 'theme/palette';

// Use this component to create a skeleton for the dashboard
const BoardSkeleton = () => {
  const styles = { bgcolor: palette.grey900 };

  return (
    <Box mt="30px">
      <Grid container wrap="nowrap" gap="20px" mt="10px" columns={4}>
        {Array.from(new Array(4)).map((index) => (
          <Grid item sm={3} key={index}>
            <Skeleton sx={styles} variant="rectangular" width="50%" height={30} />
          </Grid>
        ))}
      </Grid>

      <Grid container wrap="nowrap" gap="20px" mt="10px" columns={4}>
        {Array.from(new Array(4)).map((index) => (
          <Grid key={index} item sm={3}>
            <Skeleton sx={styles} variant="rectangular" width="100%" height={180} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default BoardSkeleton;
