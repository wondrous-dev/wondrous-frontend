import Image from 'next/image';
import { useEffect } from 'react';
import head from 'lodash/head';
import { useLazyQuery } from '@apollo/client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';

import { GET_PREVIEW_FILE } from 'graphql/queries/media';

import { SafeImage } from 'components/Common/Image';
import PodIcon from 'components/Icons/podIcon';
import { TaskCommentIcon } from 'components/Icons/taskComment';
import { SubtaskDarkIcon } from 'components/Icons/subtask';

import styles from './styles';

const TaskCompletedCard = ({ item }) => {
  const [getPreviewFile, { data }] = useLazyQuery(GET_PREVIEW_FILE, {
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    const mainImage = (head(item?.media) as any)?.slug;
    if (mainImage) {
      getPreviewFile({
        variables: {
          path: mainImage,
        },
      });
    }
  }, []);

  const reward = head(item?.rewards) as any;

  const mainImageUrl = data?.getPreviewFile?.url;
  return (
    <Box sx={styles.root}>
      <Box sx={styles.rowContainer}>
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

      {mainImageUrl && (
        <Box sx={styles.mainImageWrapper}>
          <Image src={mainImageUrl} alt="main task image" layout="fill" objectFit="cover" />
        </Box>
      )}

      {item?.podId && (
        <Box sx={styles.rowContainer}>
          <PodIcon color={item?.podColor} style={styles.orgImageWrapper} />

          <Chip label={item?.podName} sx={styles.roundedChip} />
        </Box>
      )}

      <Box sx={styles.rowContainer}>
        <Box sx={styles.rowContainer} mr={2.5}>
          <Box sx={styles.alignIcon}>
            <SubtaskDarkIcon fill="none" width="42" height="42" />
          </Box>
          <Typography sx={styles.whiteTextAligned}>{item?.totalSubtaskCount ?? 0} </Typography>
        </Box>

        <TaskCommentIcon />
        <Typography sx={styles.whiteText}>{item?.commentCount} </Typography>
      </Box>
    </Box>
  );
};

export default TaskCompletedCard;
