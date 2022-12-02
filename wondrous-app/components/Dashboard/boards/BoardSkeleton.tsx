import React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Skeleton from '@mui/material/Skeleton';

import palette from 'theme/palette';

// Use this component to create a skeleton for the dashboard
const BoardSkeleton = () => {
  const styles = { bgcolor: palette.grey900 };

  return (
    <Box px="50px" mt="160px">
      <Grid container wrap="nowrap" gap="20px" columns={4} my="20px">
        {Array.from(new Array(4)).map((index) => (
          <Skeleton key={`board-top-section-${index}`} sx={styles} variant="rectangular" width={80} height={45} />
        ))}
      </Grid>

      <Skeleton sx={{ bgcolor: palette.grey75 }} variant="rectangular" width="100%" height={3} />

      <Grid container wrap="nowrap" gap="20px" columns={4} my="20px">
        <Grid item sm={6}>
          <Skeleton sx={styles} variant="rectangular" width="100%" height={45} />
        </Grid>
        {Array.from(new Array(3)).map((val, index) => (
          <Grid item sm={2} key={`board-top-section2-${index}`}>
            <Skeleton sx={styles} variant="rectangular" width="100%" height={45} />
          </Grid>
        ))}
      </Grid>

      <Grid container wrap="nowrap" gap="20px" columns={4}>
        {Array.from(new Array(4)).map((val, index) => (
          <Grid key={`board-section-${index}`} item sm={3}>
            <Skeleton sx={styles} variant="rectangular" width="100%" height={180} />
          </Grid>
        ))}
      </Grid>
      <Grid container wrap="nowrap" gap="20px" mt="10px" columns={4}>
        {Array.from(new Array(4)).map((val, index) => (
          <Grid key={`board-section2-${index}`} item sm={3}>
            <Skeleton sx={styles} variant="rectangular" width="100%" height={180} />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default BoardSkeleton;
