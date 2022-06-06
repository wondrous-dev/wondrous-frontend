import head from 'lodash/head';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';

import { SafeImage } from 'components/Common/Image';
import PodIcon from 'components/Icons/podIcon';
import { TaskCommentIcon } from 'components/Icons/taskComment';
import { SubtaskDarkIcon } from 'components/Icons/subtask';

import styles from './styles';

const WorkingOnCard = ({ item }) => {
  const reward = head(item?.rewards) as any;

  return (
    <Box sx={styles.root}>
      <Box sx={styles.rowContainer}>
        <SafeImage src={item?.orgProfilePicture} style={styles.orgImageWrapper} />
        <SafeImage src={item?.assigneeProfilePicture} style={styles.orgImageWrapper} />

        <Chip label={item?.privacyLevel} sx={styles.privacyChip} />
        <Box flex={1} />
        {reward && (
          <Chip
            label={
              <Box sx={styles.rowContainer}>
                <SafeImage src={reward?.icon} style={styles.rewardIcon} />
                {reward?.rewardAmount}
              </Box>
            }
            sx={styles.roundedChip}
          />
        )}
      </Box>

      <Box my={2}>
        <Typography sx={styles.title}>{item?.title}</Typography>
      </Box>

      <Box my={2}>
        <Typography sx={styles.description}>{item?.description}</Typography>
      </Box>

      {item?.podId && (
        <Box sx={styles.rowContainer} my={3}>
          <PodIcon color={item?.podColor} style={styles.orgImageWrapper} />

          <Chip label={item?.podName} sx={styles.roundedChip} />
        </Box>
      )}

      <Box sx={styles.rowContainer}>
        <TaskCommentIcon />
        <Typography sx={styles.whiteText}>{item?.commentCount} </Typography>
      </Box>
    </Box>
  );
};

export default WorkingOnCard;
