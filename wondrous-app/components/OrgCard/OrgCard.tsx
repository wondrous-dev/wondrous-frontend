import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { SafeImage } from 'components/Common/Image';
import { DAOIcon } from 'components/Icons/dao';
import { NoLogoDAO } from 'components/SideBar/styles';
import { format } from 'date-fns';

import styles from './styles';

const OrgCard = ({ item }) => {
  const org = item?.org;
  const role = item?.role;

  return (
    <Box sx={styles.root}>
      <Box sx={styles.borderContainer}>
        <Box sx={styles.titleContainer}>
          <Box sx={styles.orgImageWrapper}>
            {org?.profilePicture ? (
              <SafeImage src={org?.profilePicture} style={styles.orgImage} />
            ) : (
              <NoLogoDAO>
                <DAOIcon />
              </NoLogoDAO>
            )}
          </Box>

          <Typography style={styles.title}>{org.name}</Typography>
        </Box>

        <Box my={2}>
          <Typography style={styles.description}>{org.description}</Typography>
        </Box>
      </Box>
      <Box>
        <Box sx={styles.cardSection}>
          <Typography style={styles.purpleText}>Roles:</Typography>
          <Box sx={styles.privacyChip}>{role.name}</Box>
        </Box>
        <Box sx={styles.cardSection}>
          <Typography style={styles.purpleText}>Member Since: </Typography>
          <Typography style={styles.whiteText}>{format(new Date(item?.joinedAt), 'MMM d yyyy')}</Typography>
        </Box>
      </Box>
    </Box>
  );
};
export default OrgCard;
