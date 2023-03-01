import { FileLoading } from 'components/Common/FileUpload/FileUpload';
import { MediaItem } from 'components/CreateEntity/MediaItem';
import { forwardRef, useMemo } from 'react';
import { transformMediaFormat } from 'utils/helpers';
import { handleAddFile } from 'utils/media';

import { CreateEntityAttachment, CreateEntityAttachmentIcon, MediaUploadDiv } from '../../styles';

const MediaUpload = forwardRef(
  (
    {
      mediaUploads,
      setMediaUploadsValue,
      existingTaskId,
      isProposal,
      fileUploadLoading,
      handleMedia,
      setFileUploadLoading,
      isMilestone,
    }: any,
    ref: any
  ) => {
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
        setMediaUploads: (mediaUploads) => setFileUploadLoading(mediaUploads),
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
          {mediaUploads?.length > 0 &&
            mediaUploads.map((mediaItem) => (
              <MediaItem
                key={mediaItem?.uploadSlug}
                mediaUploads={mediaUploads}
                setMediaUploads={(mediaUploads) => setMediaUploadsValue(mediaUploads)}
                mediaItem={mediaItem}
                removeMediaItem={() => handleMediaRemove(mediaItem)}
              />
            ))}
          <CreateEntityAttachment onClick={() => ref.current.click()}>
            <CreateEntityAttachmentIcon />
            Add Attachment
            {fileUploadLoading && <FileLoading />}
          </CreateEntityAttachment>
        </MediaUploadDiv>
        <input type="file" hidden ref={ref} onChange={handleMediaAdd} />
      </>
    );
  }
);

export default MediaUpload;
