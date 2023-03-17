import Grid from '@mui/material/Grid';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import palette from 'theme/palette';

import LeaderboardUserRowHeader from './LeaderboardUserRowHeader';

const LeaderboardUserRowTasks = dynamic(() => import('./LeaderboardUserRowTasks'), { ssr: false, suspense: false });

const LeaderboardUserRow = ({ contributorTask, position }) => {
  const [clicked, setClicked] = useState(false);
  return (
    <Grid
      container
      bgcolor={clicked ? palette.grey900 : palette.grey910}
      border={`1px solid ${clicked ? palette.grey85 : 'transparent'}`}
      borderRadius="6px"
      minHeight="44px"
      sx={{
        '&:hover': {
          bgcolor: palette.grey900,
          border: `1px solid ${palette.grey85}`,
        },
      }}
    >
      <LeaderboardUserRowHeader
        contributorTask={contributorTask}
        position={position}
        clicked={clicked}
        setClicked={setClicked}
      />
      {clicked && <LeaderboardUserRowTasks contributorTask={contributorTask} />}
    </Grid>
  );
};

export default LeaderboardUserRow;
