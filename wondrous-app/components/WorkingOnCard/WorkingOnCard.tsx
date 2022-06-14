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
    </Box>
  );
};

export default WorkingOnCard;
