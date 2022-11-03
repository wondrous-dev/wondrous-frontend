import { useEffect } from 'react';
import { useLazyQuery } from '@apollo/client';
import Image from 'next/legacy/image';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import TextLink from 'components/TextLink';
import PermissionTag from 'components/PermissionTag';

import { getIcon } from 'utils/medium';
import { GET_PREVIEW_FILE } from 'graphql/queries';

import styles, { WhiteTypography, DescriptionTypography } from './DocumentListItemStyles';

function DocumentListItem({ title, description, media, url, icon, permission, onClick }) {
  const [getPreviewFile, { data, loading }] = useLazyQuery(GET_PREVIEW_FILE, {
    fetchPolicy: 'network-only',
  });

  const imgUrl = data?.getPreviewFile?.url;

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
    <Grid
      item
      xs={6}
      onClick={onClick}
      style={{
        cursor: 'pointer',
      }}
    >
      <Box sx={styles.listItem}>
        <Box sx={styles.imageContainer}>
          {imgUrl && <Image src={imgUrl} alt={`media for ${title}`} layout="fill" objectFit="cover" />}
        </Box>
        <Box
          ml={1.75}
          style={{
            width: 'calc(100% - 228px)',
          }}
        >
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
}

export default DocumentListItem;
