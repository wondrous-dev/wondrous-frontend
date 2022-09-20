import {
  Attachment,
  AttachmentIcon,
  AttachmentIconWrapper,
  CircularProgressWrapper,
  ClickToUpload,
  DropZone,
  Progress,
  Wrapper,
} from 'components/CreateEntityDragAndDrop/styles';
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { ENTITIES_TYPES } from 'utils/constants';
import { handleAddFiles } from 'utils/media';

const CreateEntityAttachments = ({ form, existingTaskId, handleMedia = () => null, entityType = '' }) => {
  const [fileUploading, setFileUploadLoading] = useState(false);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: async (files) => {
      const filesToAdd = await handleAddFiles({
        files,
        filePrefix: 'tmp/task/new/',
        mediaUploads: form.values.mediaUploads,
        setMediaUploads: (mediaUploads) => form.setFieldValue('mediaUploads', mediaUploads),
        setFileUploadLoading,
      });
      if (existingTaskId) {
        handleMedia().attach({
          variables: {
            ...(entityType === ENTITIES_TYPES.PROPOSAL ? { proposalId: existingTaskId } : { taskId: existingTaskId }),
            input: {
              mediaUploads: filesToAdd,
            },
          },
        });
      }
    },
  });

  return (
    <Wrapper {...getRootProps()} isDragActive={isDragActive}>
      <DropZone>
        {fileUploading ? (
          <Progress>
            <CircularProgressWrapper /> Uploading attachments...
          </Progress>
        ) : (
          <>
            <input {...getInputProps()} />
            <Attachment>
              <AttachmentIconWrapper>
                <AttachmentIcon />
              </AttachmentIconWrapper>
              {isDragActive ? (
                <div>Drop attachments here</div>
              ) : (
                <div>
                  <ClickToUpload>Upload attachments</ClickToUpload> or drag and drop here
                </div>
              )}
            </Attachment>
          </>
        )}
      </DropZone>
    </Wrapper>
  );
};

export default CreateEntityAttachments;
