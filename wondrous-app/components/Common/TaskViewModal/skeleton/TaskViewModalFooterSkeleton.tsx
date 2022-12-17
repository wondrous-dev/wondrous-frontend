import React from 'react';
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';

import palette from 'theme/palette';

export const TaskViewModalFooterSkeleton = () => (
  <>
    <Skeleton width="245px" height="70px" sx={{ backgroundColor: palette.grey900, margin: 0 }} />
    <Skeleton
      width="99%"
      height="131px"
      style={{ borderRadius: '6px', marginTop: '-28px' }}
      sx={{ backgroundColor: palette.grey900 }}
    />
    <Skeleton width="45px" height="57px" sx={{ backgroundColor: palette.grey900, margin: '0 auto' }} />
    <Skeleton width="122px" height="31px" sx={{ backgroundColor: palette.grey900, margin: 'auto' }} />
  </>
);

export const TaskSkeletonFooterTitleDiv = () => (
  <Box display="flex" margin="0 0 0 24px">
    <Skeleton
      variant="rectangular"
      width="85px"
      height="25px"
      sx={{ backgroundColor: palette.grey900, margin: '0 12px 8px 0' }}
    />
    <Skeleton
      variant="rectangular"
      width="90px"
      height="25px"
      sx={{ backgroundColor: palette.grey900, margin: '0 10px 8px 9px' }}
    />
    <Skeleton
      variant="rectangular"
      width="64px"
      height="25px"
      sx={{ backgroundColor: palette.grey900, margin: '0 4px 8px 8px' }}
    />
    <Skeleton
      variant="circular"
      width="25px"
      height="25px"
      sx={{ backgroundColor: palette.grey900, margin: '0 12px 8px 0' }}
    />
    <Skeleton
      variant="rectangular"
      width="74px"
      height="25px"
      sx={{ backgroundColor: palette.grey900, margin: '0 4px 8px 11px' }}
    />
    <Skeleton
      variant="circular"
      width="25px"
      height="25px"
      sx={{ backgroundColor: palette.grey900, margin: '0 12px 8px 0' }}
    />
  </Box>
);
