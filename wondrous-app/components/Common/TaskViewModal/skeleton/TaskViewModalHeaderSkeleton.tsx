import React from 'react';
import Skeleton from '@mui/material/Skeleton';
import styled from 'styled-components';
import Grid from '@mui/material/Grid';

import palette from 'theme/palette';

const Container = styled.div`
  display: flex;
  padding: 12px;
  background: ${palette.grey920};
  height: 56px;
  align-items: center;
  position: relative;
`;

function TaskViewModalHeaderSkeleton() {
  return (
    <Container>
      <Grid display="flex" alignItems="center">
        <Skeleton
          variant="text"
          width="23px"
          height="40px"
          sx={{ backgroundColor: palette.grey900, marginRight: '4px' }}
        />
        <Skeleton variant="text" width="36px" height="40px" sx={{ backgroundColor: palette.grey900 }} />
      </Grid>
      <Grid display="flex" marginLeft="auto">
        {Array.from(new Array(4).keys()).map((index) => (
          <Skeleton
            key={`header-skeleton-${index}`}
            variant="text"
            width="32px"
            height="52px"
            sx={{ backgroundColor: palette.grey900, marginLeft: '12px' }}
          />
        ))}
      </Grid>
    </Container>
  );
}

export default TaskViewModalHeaderSkeleton;
