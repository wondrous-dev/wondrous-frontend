import PropTypes from 'prop-types';
import Image from 'next/image';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

import TextLink from 'components/TextLink';
import PermissionTag from 'components/PermissionTag';

import { getIcon } from 'utils/medium';

import styles, { WhiteTypography, DescriptionTypography } from './ListItemStyles';

const ListItem = ({ title, description, media, url, icon, permission }) => (
  <Grid item xs={12}>
    <Box sx={styles.listItem}>
      <Box sx={styles.imageContainer}>
        <Image src={media} alt={`media for ${title}`} layout="fill" objectFit="cover" style={{ borderRadius: '3px' }} />
      </Box>
      <Box ml={1.75}>
        <WhiteTypography variant="subtitle1">{title}</WhiteTypography>
        <Box mt={1.5} />
        <DescriptionTypography>{description}</DescriptionTypography>
        <Box my={1.5} display="flex" alignItems="center">
          <Box>{getIcon(icon || url)}</Box>
          <TextLink href={url} label={null} />
        </Box>
        <PermissionTag>{permission}</PermissionTag>
      </Box>
    </Box>
  </Grid>
);

ListItem.propTypes = {};

export default ListItem;
