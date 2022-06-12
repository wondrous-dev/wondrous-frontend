import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { SafeImage } from 'components/Common/Image';
import { DAOIcon } from 'components/Icons/dao';
import { NoLogoDAO } from 'components/SideBar/styles';
import { format } from 'date-fns';

import styles from './styles';

const OrgCard = ({ item }) => {
  const userOrg = item;
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

          <Typography sx={styles.title}>{org.name}</Typography>
        </Box>

        <Box my={2}>
          <Typography sx={styles.description}>{org.description}</Typography>
        </Box>
      </Box>
      <Box>
        <Box sx={styles.cardSection}>
          <Typography sx={styles.purpleText}>Roles:</Typography>
          <Box sx={styles.privacyChip}>{role.name}</Box>
        </Box>
        {/* <Box sx={styles.cardSection}>
          <Typography sx={styles.purpleText}>Tasks completed: </Typography>
          <Typography sx={styles.whiteText}>{0}</Typography>
        </Box> */}
        <Box sx={styles.cardSection}>
          <Typography sx={styles.purpleText}>Member Since: </Typography>
          <Typography sx={styles.whiteText}>{format(new Date(userOrg.joinedAt), 'MMM d yyyy')}</Typography>
        </Box>
      </Box>
    </Box>
  );
};
export default OrgCard;
