import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { SafeImage } from 'components/Common/Image';

import styles from './styles';

const OrgCard = ({ item }) => (
  <Box sx={styles.root}>
    <Box sx={styles.borderContainer}>
      <Box sx={styles.titleContainer}>
        <Box sx={styles.orgImageWrapper}>
          <SafeImage src={item.profilePicture} style={styles.orgImage} />
        </Box>

        <Typography sx={styles.title}>{item.name}</Typography>
      </Box>

      <Box my={2}>
        <Typography sx={styles.description}>{item.description}</Typography>
      </Box>
    </Box>
    <Box>
      <Box sx={styles.cardSection}>
        <Typography sx={styles.purpleText}>Roles:</Typography>
        <Box sx={styles.privacyChip}>{item.privacyLevel}</Box>
      </Box>
      <Box sx={styles.cardSection}>
        <Typography sx={styles.purpleText}>Tasks completed: </Typography>
        <Typography sx={styles.whiteText}>{item.tasksCompletedCount ?? 0}</Typography>
      </Box>
      <Box sx={styles.cardSection}>
        <Typography sx={styles.purpleText}>Pods joined: </Typography>
        <Typography sx={styles.whiteText}>{item.podCount}</Typography>
      </Box>
    </Box>
  </Box>
);
export default OrgCard;
