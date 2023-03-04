import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Tooltip from '@mui/material/Tooltip';
import Link from 'next/link';
import palette from 'theme/palette';
import { AVATAR_LIST_OVERFLOW_MAX } from 'utils/constants';
import { SmallAvatar } from 'components/Common/AvatarList';

const avatarStyle = {
  borderRadius: '50%',
  border: `2px solid ${palette.grey85}`,
  cursor: 'pointer',
};

const avatarWidthHeight = 28;

const HeaderAvatars = ({ users, contributorCount, setMoreInfoModalOpen, setShowUsers }) => {
  const usersData = users.map(({ user }) => user);
  const moreUsersCount = contributorCount - AVATAR_LIST_OVERFLOW_MAX;
  return (
    <Grid
      container
      flexWrap="nowrap"
      width="fit-content"
      alignItems="center"
      bgcolor={palette.grey85}
      borderRadius="500px"
      paddingRight="8px"
      sx={{
        '& > div': {
          marginRight: '-8px',
        },
      }}
    >
      {usersData.slice(0, AVATAR_LIST_OVERFLOW_MAX).map((user) => (
        <Tooltip key={user.username} title={user.username} placement="top">
          <Box overflow="hidden" bgcolor={palette.grey910} borderRadius="50%">
            <Link href={`/profile/${user.username}/about`} passHref>
              <SmallAvatar
                imageWidth={avatarWidthHeight}
                imageHeight={avatarWidthHeight}
                key={user.id}
                initials={user.username?.substring(0, 2).toUpperCase()}
                avatar={{ url: user.profilePicture, color: palette.grey79 }}
                style={avatarStyle}
                border="none"
              />
            </Link>
          </Box>
        </Tooltip>
      ))}
      {moreUsersCount > 0 && (
        <Tooltip title="See all users" placement="top">
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            fontWeight="500"
            padding="1px"
            overflow="hidden"
            width={avatarWidthHeight}
            height={avatarWidthHeight}
            bgcolor={palette.grey79}
            color={palette.blue20}
            sx={avatarStyle}
            onClick={() => {
              setMoreInfoModalOpen(true);
              setShowUsers(true);
            }}
          >
            +{moreUsersCount}
          </Box>
        </Tooltip>
      )}
    </Grid>
  );
};

export default HeaderAvatars;
