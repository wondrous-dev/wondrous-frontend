import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';

import { getIcon } from 'utils/medium';

import TextLink from 'components/TextLink';
import PermissionTag from 'components/PermissionTag';

import styles, { WhiteTypography, DescriptionTypography } from './GridItemStyles';
import Image from 'next/image';

const GridItem = ({ title, description, media, url, icon, permission }) => (
  <Grid item sm={4}>
    <Box sx={styles.gridItem}>
      <WhiteTypography variant="subtitle1">{title}</WhiteTypography>
      <Box mt={1.5} />
      <DescriptionTypography sx={styles.description}>{description}</DescriptionTypography>
      <Box flex={1} />
      <Box my={1.5} display="flex" alignItems="center">
        <Box>{getIcon(icon)}</Box>
        <TextLink href={url} label={null} />
      </Box>
      <Box sx={styles.imageContainer}>
        <Image src={media} alt={`media for ${title}`} layout="fill" objectFit="cover" style={{ borderRadius: '3px' }} />
      </Box>
      <Box mt={1.75} />
      <PermissionTag>{permission}</PermissionTag>
    </Box>
  </Grid>
);

GridItem.propTypes = {};

export default GridItem;
