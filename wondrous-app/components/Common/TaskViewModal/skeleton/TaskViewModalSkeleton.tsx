import React from 'react';
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';

import palette from 'theme/palette';

const TaskViewModalSkeleton = () => (
  <Box width="432px">
    {Array.from(new Array(2).keys()).map((index) => (
      <Box display="flex" key={`skeleton-${index}`}>
        <Skeleton variant="text" width="77px" height="36px" sx={{ backgroundColor: palette.grey900 }} />
        <Skeleton
          variant="text"
          width="312px"
          height="38px"
          sx={{ borderRadius: '300px', marginLeft: '43px', backgroundColor: palette.grey900 }}
        />
      </Box>
    ))}
    <Box display="flex">
      <Skeleton variant="text" width="77px" height="36px" sx={{ backgroundColor: palette.grey900 }} />
      <Skeleton
        variant="text"
        width="312px"
        height="38px"
        sx={{ borderRadius: '300px', marginLeft: '43px', backgroundColor: palette.grey900 }}
      />
    </Box>
    <Box display="flex">
      <Skeleton variant="text" width="77px" height="36px" sx={{ backgroundColor: palette.grey900 }} />
      <Skeleton
        variant="text"
        width="134px"
        height="34px"
        sx={{ borderRadius: '300px', marginLeft: '43px', backgroundColor: palette.grey900 }}
      />
    </Box>
    <Box display="flex">
      <Skeleton
        variant="text"
        width="77px"
        height="36px"
        sx={{ marginRight: '43px', backgroundColor: palette.grey900 }}
      />
      <Skeleton variant="circular" width="33px" height="33px" sx={{ backgroundColor: palette.grey900 }} />
      <Skeleton
        variant="text"
        width="146px"
        height="33px"
        sx={{ borderRadius: '146px', marginLeft: '8px', backgroundColor: palette.grey900 }}
      />
    </Box>
    <Box display="flex" marginTop="20px">
      <Skeleton variant="circular" width="33px" height="33px" sx={{ backgroundColor: palette.grey900 }} />
      <Skeleton
        variant="text"
        width="134px"
        height="34px"
        sx={{ borderRadius: '222px', marginLeft: '8px', backgroundColor: palette.grey900 }}
      />
    </Box>
  </Box>
);

export default TaskViewModalSkeleton;
