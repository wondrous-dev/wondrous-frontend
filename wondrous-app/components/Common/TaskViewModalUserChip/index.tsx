import { Box, Grid } from '@mui/material';
import Image from 'next/image';
import palette from 'theme/palette';
import { SafeImage } from '../Image';
import DefaultUserImage from '../Image/DefaultUserImage';

const TaskViewModalUserChip = ({ user, handleRemove, canEdit = false }) => {
  const { username, profilePicture } = user;
  const image = profilePicture ? (
    <SafeImage src={profilePicture} width={24} height={24} style={{ borderRadius: '24px' }} />
  ) : (
    <DefaultUserImage width={24} height={24} />
  );
  return (
    <Grid
      item
      container
      justifyContent="space-between"
      alignItems="center"
      display="flex"
      width="100%"
      height="26px"
      gap="6px"
      borderRadius="900px"
      padding="1px"
      sx={{
        ...(canEdit && {
          background: palette.grey52,
          outline: `1px solid ${palette.grey79}`,
        }),
      }}
    >
      <Grid item container gap="6px" width="40%">
        <Box width="24px" height="24px">
          {image}
        </Box>
        <Box color={palette.white} fontWeight="500" fontSize="13px">
          {username}
        </Box>
      </Grid>
      {canEdit && (
        <Grid container item justifyContent="flex-end" width="40%">
          <Grid
            item
            container
            justifyContent="flex-end"
            onClick={handleRemove}
            width="24px"
            height="24px"
            paddingRight="12px"
            sx={{
              cursor: 'pointer',
            }}
          >
            <Image src="/images/icons/close.svg" alt="close icon" width={8} height={8} />
          </Grid>
        </Grid>
      )}
    </Grid>
  );
};

export default TaskViewModalUserChip;
