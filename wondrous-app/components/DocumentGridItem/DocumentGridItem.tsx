import { useEffect } from 'react';
import Image from 'next/legacy/image';
import { useLazyQuery } from '@apollo/client';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import { getIcon } from 'utils/medium';
import { GET_PREVIEW_FILE } from 'graphql/queries';

import TextLink from 'components/TextLink';
import PermissionTag from 'components/PermissionTag';

import styles, { WhiteTypography, DescriptionTypography } from './DocumentGridItemStyles';

function DocumentGridItem({ title, description, media, url, icon, permission, onItemClick }) {
  const [getPreviewFile, { data }] = useLazyQuery(GET_PREVIEW_FILE, {
    fetchPolicy: 'network-only',
  });

  const imgUrl = media ? data?.getPreviewFile?.url : null;

  useEffect(() => {
    if (media) {
      getPreviewFile({
        variables: {
          path: media,
        },
      });
    }
  }, [imgUrl, media]);

  return (
    <Grid item sm={4} onClick={onItemClick}>
      <Box sx={styles.gridItem}>
        <WhiteTypography variant="subtitle1">{title}</WhiteTypography>
        <Box mt={1.5} />
        <DescriptionTypography sx={styles.description}>{description}</DescriptionTypography>
        <Box flex={1} />
        <Box my={1.5} display="flex" alignItems="center">
          <Box>{getIcon(icon || url)}</Box>
          <TextLink href={url} label={null} />
        </Box>
        <Box sx={styles.imageContainer}>
          {imgUrl && <Image src={imgUrl} alt={`media for ${title}`} layout="fill" objectFit="cover" />}
        </Box>
        <Box mt={1.75} />
        <PermissionTag>{permission}</PermissionTag>
      </Box>
    </Grid>
  );
}

export default DocumentGridItem;
