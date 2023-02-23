import Grid from '@mui/material/Grid';
import { DefaultUserImage, SafeImage } from 'components/Common/Image';
import CheckBoxIcon from 'components/Icons/Sidebar/checkBox.svg';
import StarIcon from 'components/Icons/Sidebar/star.svg';
import { BOUNTY_TYPE, TASK_TYPE } from 'utils/constants';
import Typography from '@mui/material/Typography';
import palette from 'theme/palette';
import BottomArrowCaret from 'components/Icons/BottomArrowCaret';
import { useRouter } from 'next/router';

import LeaderboardUserRowIcons from './LeaderboardUserRowIcons';

const calculateCount = (tasks) => {
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
};

const UserRowInfo = ({ Icon, data = null, sx = null }) => (
  <Grid
    container
    padding="0 6px"
    borderRadius="4px"
    alignItems="center"
    width="fit-content"
    gap="6px"
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

const LeaderboardUserRowHeader = ({ contributorTask, position, setClicked, clicked }) => {
  const router = useRouter();
  const { assigneeId, assigneeProfilePicture, assigneeUsername } = contributorTask || {};
  const contributionCount = calculateCount(contributorTask?.tasks);
  const bountyCount = contributionCount?.bountyCount;
  const taskCount = contributionCount?.taskCount;
  const handleUserProfileOnClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/profile/${assigneeUsername}/about`);
  };
  return (
    <Grid
      container
      onClick={() => setClicked(!clicked)}
      justifyContent="space-between"
      alignItems="center"
      padding="8px"
      borderRadius="6px 6px 0 0"
      sx={{
        cursor: 'pointer',
      }}
    >
      <Grid item container width="fit-content" alignItems="center" gap="8px" color={palette.white}>
        <LeaderboardUserRowIcons index={position} />
        <Grid
          container
          item
          alignItems="center"
          width="fit-content"
          gap="8px"
          onClick={handleUserProfileOnClick}
          sx={{
            '&:hover': {
              color: palette.blue20,
            },
            '&:hover div': {
              outline: `1px solid ${palette.blue20}`,
            },
          }}
        >
          {assigneeId && (
            <Grid
              container
              item
              alignItems="center"
              justifyContent="center"
              width="fit-content"
              borderRadius="500px"
              padding="2px"
            >
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
            </Grid>
          )}

          <Typography
            fontWeight="600"
            fontSize="14px"
            sx={{
              color: 'inherit',
            }}
          >
            {assigneeId ? assigneeUsername : 'No assignee'}
          </Typography>
        </Grid>
      </Grid>
      <Grid item container width="fit-content" gap="14px">
        <UserRowInfo Icon={CheckBoxIcon} data={taskCount} />
        <UserRowInfo Icon={StarIcon} data={bountyCount} />
        <UserRowInfo
          Icon={BottomArrowCaret}
          sx={{
            transform: clicked && 'rotate(180deg)',
            bgcolor: 'rgba(49, 49, 49, 0.3)',
            '&:hover': {
              bgcolor: palette.grey85,
            },
          }}
        />
      </Grid>
    </Grid>
  );
};

export default LeaderboardUserRowHeader;
