import Grid from '@mui/material/Grid';
import GroupIcon from 'components/Icons/Sidebar/group.svg';
import Tooltip from 'components/Tooltip';
import palette from 'theme/palette';
import { PRIVACY_LEVEL } from 'utils/constants';

const TaskCardPrivacy = ({ privacyLevel }) => {
  if (privacyLevel !== PRIVACY_LEVEL.public) {
    return (
      <Tooltip title="Members Only" placement="top">
        <Grid
          container
          width="28px"
          height="28px"
          alignItems="center"
          justifyContent="center"
          borderRadius="4px"
          bgcolor={palette.grey87}
          sx={[
            {
              '& svg': {
                path: { stroke: palette.blue20 },
              },
            },
          ]}
        >
          <GroupIcon />
        </Grid>
      </Tooltip>
    );
  }
  return null;
};

export default TaskCardPrivacy;
