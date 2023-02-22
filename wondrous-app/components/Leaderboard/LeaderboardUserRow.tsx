import Grid from '@mui/material/Grid';
import { DefaultUserImage, SafeImage } from 'components/Common/Image';
import CheckBoxIcon from 'components/Icons/Sidebar/checkBox.svg';
import StarIcon from 'components/Icons/Sidebar/star.svg';
import LeaderboardGoldIcon from 'components/Icons/leaderboardGold.svg';
import dynamic from 'next/dynamic';
import { useState } from 'react';
import { BOUNTY_TYPE, TASK_TYPE } from 'utils/constants';
import Typography from '@mui/material/Typography';
import palette from 'theme/palette';
import BottomArrowCaret from 'components/Icons/BottomArrowCaret';
import LeaderboardUserRowIcons from './LeaderboardUserRowIcons';

const LeaderboardUserRowTasks = dynamic(() => import('./LeaderboardUserRowTasks'), { ssr: false, suspense: false });

export const calculatePoints = (tasks) => {
  let points = 0;
  if (!tasks) {
    return points;
  }
  tasks.forEach((task) => {
    if (task?.points) {
      points += Number(task?.points);
    }
  });
  return points;
};
export const calculateCount = (tasks) => {
  let taskCount = 0;
  let bountyCount = 0;
  if (!tasks)
    return {
      taskCount,
      bountyCount,
    };

  tasks.forEach((task) => {
    if (task?.type === BOUNTY_TYPE) {
      bountyCount += 1;
    } else if (task?.type === TASK_TYPE) {
      taskCount += 1;
    }
  });
  return {
    taskCount,
    bountyCount,
  };
};

const UserRowPictureStyles = {
  width: '30px',
  height: '30px',
  borderRadius: '15px',
  marginRight: '8px',
};

const CaretStyle = {
  marginRight: '12px',
};

const UserRowInfo = ({ Icon, data = null, sx = null }) => (
  <Grid
    container
    padding="0 6px"
    borderRadius="4px"
    bgcolor={palette.grey95}
    alignItems="center"
    width="fit-content"
    gap="8px"
    height="22px"
    lineHeight="0px"
    minWidth="22px"
    justifyContent="center"
    sx={sx}
  >
    <Grid
      item
      container
      alignItems="center"
      justifyContent="center"
      width="fit-content"
      sx={{
        '& svg': {
          path: {
            stroke: palette.grey58,
          },
          rect: {
            stroke: palette.grey58,
          },
        },
      }}
    >
      <Icon />
    </Grid>
    {typeof data === 'number' && (
      <Typography color={palette.white} fontSize="15px" fontWeight="500">
        {data}
      </Typography>
    )}
  </Grid>
);

const LeaderboardUserRow = ({ contributorTask, position }) => {
  const [clicked, setClicked] = useState(false);
  const { assigneeId, assigneeProfilePicture, assigneeUsername } = contributorTask || {};
  const contributionCount = calculateCount(contributorTask?.tasks);
  const bountyCount = contributionCount?.bountyCount;
  const taskCount = contributionCount?.taskCount;

  return (
    <Grid
      container
      bgcolor={palette.grey910}
      border={`1px solid ${clicked ? palette.grey79 : 'transparent'}`}
      borderRadius="6px"
      minHeight="44px"
      gap="8px"
      sx={{
        '&:hover': {
          bgcolor: !clicked && palette.grey920,
          border: `1px solid ${palette.grey79}`,
        },
      }}
    >
      <Grid
        container
        onClick={() => setClicked(!clicked)}
        justifyContent="space-between"
        alignItems="center"
        bgcolor={clicked && palette.grey920}
        padding="8px"
        borderRadius="6px 6px 0 0"
        sx={{
          cursor: 'pointer',
        }}
      >
        <Grid item container width="fit-content" alignItems="center" gap="8px">
          <LeaderboardUserRowIcons index={position} />
          {assigneeId ? (
            <>
              {assigneeProfilePicture ? (
                <SafeImage
                  useNextImage={false}
                  src={assigneeProfilePicture}
                  style={UserRowPictureStyles}
                  alt="Assignee profile picture"
                />
              ) : (
                <DefaultUserImage style={UserRowPictureStyles} />
              )}
              <Typography color={palette.white} fontWeight="600" fontSize="14px">
                {assigneeUsername}
              </Typography>
            </>
          ) : (
            <Typography color={palette.white} fontWeight="600" fontSize="14px">
              No assignee
            </Typography>
          )}
        </Grid>
        <Grid item container width="fit-content" gap="14px">
          <UserRowInfo Icon={CheckBoxIcon} data={taskCount} />
          <UserRowInfo Icon={StarIcon} data={bountyCount} />
          <UserRowInfo
            Icon={BottomArrowCaret}
            sx={{
              transform: clicked && 'rotate(180deg)',
              bgcolor: clicked ? palette.grey920 : palette.grey95,
            }}
          />
        </Grid>
      </Grid>
      {clicked && <LeaderboardUserRowTasks contributorTask={contributorTask} />}
    </Grid>
  );
};

export default LeaderboardUserRow;
