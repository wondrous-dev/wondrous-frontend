import { FileLoading } from 'components/Common/FileUpload/FileUpload';
import { MediaItem } from 'components/CreateEntity/MediaItem';
import { forwardRef } from 'react';
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
    }: any,
    ref: any
  ) => (
    <>
      <MediaUploadDiv>
        {mediaUploads?.length > 0 &&
          mediaUploads.map((mediaItem) => (
            <MediaItem
              key={mediaItem?.uploadSlug}
              mediaUploads={mediaUploads}
              setMediaUploads={(mediaUploads) => setMediaUploadsValue(mediaUploads)}
              mediaItem={mediaItem}
              removeMediaItem={() => {
                if (existingTaskId) {
                  handleMedia().remove({
                    variables: {
                      ...(isProposal ? { proposalId: existingTaskId } : { taskId: existingTaskId }),
                      slug: mediaItem?.uploadSlug || mediaItem?.slug,
                    },
                  });
                }
              }}
            />
          ))}
        <CreateEntityAttachment onClick={() => ref.current.click()}>
          <CreateEntityAttachmentIcon />
          Add Attachment
          {fileUploadLoading && <FileLoading />}
        </CreateEntityAttachment>
      </MediaUploadDiv>
      <input
        type="file"
        hidden
        ref={ref}
        onChange={async (event) => {
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
                ...(isProposal ? { proposalId: existingTaskId } : { taskId: existingTaskId }),
                input: {
                  mediaUploads: [fileToAdd],
                },
              },
              onCompleted: (data) => {
                const task = data?.attachTaskMedia || data?.attachTaskProposalMedia;
                //   form.setFieldValue('mediaUploads', transformMediaFormat(task?.media));
                setMediaUploadsValue(transformMediaFormat(task?.media));
                setFileUploadLoading(false);
              },
            });
          }
        }}
      />
    </>
  )
);

export default MediaUpload;
