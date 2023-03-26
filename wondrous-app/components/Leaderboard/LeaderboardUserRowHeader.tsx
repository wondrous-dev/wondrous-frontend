import { useMemo } from 'react';
import Grid from '@mui/material/Grid';
import Link from 'next/link';
import { DefaultUserImage, SafeImage } from 'components/Common/Image';
import CheckBoxIcon from 'components/Icons/Sidebar/checkBox.svg';
import StarIcon from 'components/Icons/Sidebar/star.svg';
import { BOUNTY_TYPE, TASK_TYPE } from 'utils/constants';
import Typography from '@mui/material/Typography';
import palette from 'theme/palette';
import BottomArrowCaret from 'components/Icons/BottomArrowCaret';

import LeaderboardUserRowIcons from './LeaderboardUserRowIcons';

const UserRowPictureStyles = {
  width: '30px',
  height: '30px',
  borderRadius: '15px',
};

const UserRowInfo = ({ Icon = null, data = null, sx = null, usdPayout = null }) => (
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
      {Icon && <Icon />}
    </Grid>
    {typeof data === 'number' && (
      <Typography color={palette.white} fontSize="15px" fontWeight="500">
        {data}
        {!Icon && ` pts`}
      </Typography>
    )}
    {usdPayout !== null && (
      <Typography color={palette.green30} fontSize="15px" fontWeight="500">
        {usdPayout} USD
      </Typography>
    )}
  </Grid>
);

const LeaderboardUserRowHeader = ({ contributorTask, position, setClicked, clicked, usdPayout }) => {
  const { assigneeId, assigneeProfilePicture, assigneeUsername, numTasks, numBounties, totalPoints } =
    contributorTask || {};
  return (
    <Grid
      container
      onClick={() => setClicked(!clicked)}
      justifyContent="space-between"
      alignItems="center"
      paddingX="8px"
      borderRadius="6px 6px 0 0"
      height="44px"
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
            <Link href={`/profile/${assigneeUsername}/about`}>
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
            </Link>
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
        <UserRowInfo Icon={CheckBoxIcon} data={numTasks} />
        <UserRowInfo Icon={StarIcon} data={numBounties} />
        <UserRowInfo data={totalPoints} />
        <UserRowInfo usdPayout={usdPayout} />
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
