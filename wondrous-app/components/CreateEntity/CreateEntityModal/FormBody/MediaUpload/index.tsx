import { Grid } from '@mui/material';
import { useMutation } from '@apollo/client';
import { FileLoading } from 'components/Common/FileUpload/FileUpload';
import { MediaItem } from 'components/CreateEntity/MediaItem';
import PlusIcon from 'components/Icons/plus';
import AttachFileIcon from 'components/Icons/attachFile.svg';
import {
  ATTACH_MEDIA_TO_TASK,
  ATTACH_MEDIA_TO_TASK_PROPOSAL,
  ATTACH_MILESTONE_MEDIA,
  REMOVE_MEDIA_FROM_TASK,
  REMOVE_MEDIA_FROM_TASK_PROPOSAL,
  REMOVE_MILESTONE_MEDIA,
} from 'graphql/mutations';
import React, { forwardRef, useMemo, useRef } from 'react';
import palette from 'theme/palette';
import { ENTITIES_TYPES } from 'utils/constants';
import { transformMediaFormat } from 'utils/helpers';
import { handleAddFile } from 'utils/media';

import { CreateEntityAttachment, MediaUploadDiv } from '../../styles';

type MediaUploadProps = {
  mediaUploads: any;
  existingTaskId: string;
  setFileUploadLoading: React.Dispatch<React.SetStateAction<boolean>>;
  fileUploadLoading: boolean;
  isMilestone: boolean;
  isProposal: boolean;
  entityType: string;
  setMediaUploadsValue: (mediaUploads: Array<any>) => void | React.Dispatch<React.SetStateAction<boolean>>;
};

const MediaUpload = ({
  mediaUploads,
  setMediaUploadsValue,
  existingTaskId,
  isProposal,
  fileUploadLoading,
  setFileUploadLoading,
  isMilestone,
  entityType,
}: MediaUploadProps) => {
  const ref: any = useRef();
  const [attachMedia] = useMutation(ATTACH_MEDIA_TO_TASK);
  const [removeMedia] = useMutation(REMOVE_MEDIA_FROM_TASK);
  const [removeMilestoneMedia] = useMutation(REMOVE_MILESTONE_MEDIA);
  const [attachMilestoneMedia] = useMutation(ATTACH_MILESTONE_MEDIA);
  const [attachTaskProposalMedia] = useMutation(ATTACH_MEDIA_TO_TASK_PROPOSAL);
  const [removeTaskProposalMedia] = useMutation(REMOVE_MEDIA_FROM_TASK_PROPOSAL);

  const handleMedia = () => {
    if (entityType === ENTITIES_TYPES.PROPOSAL) {
      return {
        attach: attachTaskProposalMedia,
        remove: removeTaskProposalMedia,
      };
    }
    if (entityType === ENTITIES_TYPES.MILESTONE) {
      return {
        attach: attachMilestoneMedia,
        remove: removeMilestoneMedia,
      };
    }
    return { attach: attachMedia, remove: removeMedia };
  };

  const variables = useMemo(() => {
    if (!isProposal && !isMilestone) {
      return { taskId: existingTaskId };
    }
    if (isProposal) {
      return { proposalId: existingTaskId };
    }
    if (isMilestone) {
      return { milestoneId: existingTaskId };
    }
    return null;
  }, [existingTaskId, isProposal, isMilestone]);
  const handleMediaRemove = (mediaItem) => {
    if (existingTaskId) {
      handleMedia().remove({
        variables: {
          ...variables,
          slug: mediaItem?.uploadSlug || mediaItem?.slug,
        },
      });
    }
  };

  const handleMediaAdd = async (event) => {
    const fileToAdd = await handleAddFile({
      event,
      filePrefix: 'tmp/task/new/',
      mediaUploads,
      setMediaUploads: (uploads) => setMediaUploadsValue(uploads),
      setFileUploadLoading,
    });
    if (existingTaskId) {
      handleMedia().attach({
        variables: {
          ...variables,
          input: {
            mediaUploads: [fileToAdd],
          },
        },

        onCompleted: (data) => {
          const task = data?.attachTaskMedia || data?.attachTaskProposalMedia || data?.attachMilestoneMedia;
          //   form.setFieldValue('mediaUploads', transformMediaFormat(task?.media));
          setMediaUploadsValue(transformMediaFormat(task?.media));
          setFileUploadLoading(false);
        },
      });
    }
  };
  return (
    <>
      <MediaUploadDiv>
        <CreateEntityAttachment
          onClick={() => {
            ref.current.click();
          }}
        >
          {mediaUploads?.length ? (
            <PlusIcon fill={palette.blue20} />
          ) : (
            <Grid
              container
              gap="8px"
              width="fit-content"
              alignItems="center"
              sx={{
                '& svg': {
                  path: { stroke: palette.blue20 },
                },
              }}
            >
              <AttachFileIcon /> Attachment
            </Grid>
          )}
          {fileUploadLoading && <FileLoading />}
        </CreateEntityAttachment>
        {mediaUploads?.length > 0 &&
          mediaUploads.map((mediaItem) => (
            <MediaItem
              key={mediaItem?.uploadSlug}
              mediaUploads={mediaUploads}
              setMediaUploads={(uploads) => setMediaUploadsValue(uploads)}
              mediaItem={mediaItem}
              removeMediaItem={() => handleMediaRemove(mediaItem)}
            />
          ))}
      </MediaUploadDiv>
      <input type="file" hidden ref={ref} onChange={handleMediaAdd} />
    </>
  );
};

export default MediaUpload;
