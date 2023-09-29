import Grid from "@mui/material/Grid";
import EmptyState from "components/EmptyState";
import FileUpload from "components/Shared/FileUpload";
import { Label } from "components/QuestsList/styles";
import ImageList from "@mui/material/ImageList/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import DeleteIcon from "components/Icons/Delete";

import AttachmentIcon from "components/Icons/Attachment";
import { ButtonIconWrapper, SharedSecondaryButton } from "components/Shared/styles";
import SafeImage from "components/SafeImage";
import { Box, ButtonBase } from "@mui/material";
import SubmissionMedia from "components/Shared/SubmissionMedia";
import { isVideo } from "utils/media";
import VideoPlayer from "components/Shared/SubmissionMedia/VideoPlayer";
import { Filename } from "components/Shared/SubmissionMedia/styles";

export const Media = ({ file }) => {
  console.log(file, 'FILE')
  if(file === 'string') {
    return <img src={file}/>
  }
  if (file.type?.includes("image")) {
    return <img src={URL.createObjectURL(file)} />;
  }
  if (file.type?.includes("video")) {
    return <VideoPlayer src={URL.createObjectURL(file)} name={file?.name} style={{ width: "10%", height: "10%" }} />;
  }
  return <Filename>{file}</Filename>;
};

export const AttachmentType = ({ step, onChange, value }) => {
  const handleAttachMedia = (e) => {
    const file = e.target.files[0];
    const media = value || [];
    const newMedia = [...media, file];
    onChange(newMedia);
  };

  const getAttachmentTitle = (file) => {
    if (file?.name?.length > 16) {
      return `${file.name.slice(0, 16)}...`;
    }
    return file.name;
  };

  const removeAttachment = (attachmentIdx) => {
    const mediaUploads = step?.mediaUploads || [];
    const newMedia = mediaUploads?.filter((el, idx) => idx !== attachmentIdx);
    onChange(newMedia);
  };

  return (
    <>
      <FileUpload
        onChange={(e) => handleAttachMedia(e)}
        accept={"image/*,video/*,application/pdf"}
        renderUploadComponent={({ handleAddMedia }) => {
          return (
            <ButtonBase onClick={handleAddMedia}>
              <Grid
                border="1px dotted black"
                height="100px"
                borderRadius="12px"
                width="100%"
                display="flex"
                justifyContent="center"
                alignItems="center"
                gap="24px"
                flexDirection="column"
              >
                <ButtonIconWrapper>
                  <AttachmentIcon />
                </ButtonIconWrapper>
                <Label color="black" fontSize="14px" fontWeight={500}>
                  Add attachments
                </Label>
              </Grid>
            </ButtonBase>
          );
        }}
      />
      {value?.length ? (
        <ImageList sx={{ width: 500, height: "auto" }} cols={3} rowHeight={164}>
          {value?.map((attachment, attachmentIdx) =>
            attachment ? (
              <ImageListItem
                key={`attachment-${attachmentIdx}`}
                sx={{
                  position: "relative",
                  borderRadius: "6px",
                  overflow: "hidden",
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px",
                  height: "fit-content !important",
                }}
              >
                <Media file={attachment} />

                <Box display="flex" gap="10px" alignItems="center">
                  <ButtonBase onClick={() => removeAttachment(attachmentIdx)}>
                    <DeleteIcon stroke="red" />
                  </ButtonBase>
                  <Label fontSize="12px">{getAttachmentTitle(attachment)}</Label>
                </Box>
              </ImageListItem>
            ) : null
          )}
        </ImageList>
      ) : null}
    </>
  );
};

export default AttachmentType;
