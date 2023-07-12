import { Box, ButtonBase } from "@mui/material";
import ImageList from "@mui/material/ImageList/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import { Label } from "components/AddFormEntity/components/styles";
import DeleteIcon from "components/Icons/Delete";
import SafeImage from "components/SafeImage";
import FileUpload from "components/Shared/FileUpload";

const StepAttachments = ({ step, handleChange, removeMedia }) => {
  const handleAttachMedia = (e) => {
    const file = e.target.files[0];
    const media = step?.mediaUploads || [];
    const newMedia = [...media, file];
    handleChange(newMedia);
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
    if(mediaUploads[attachmentIdx]?.slug) {
      removeMedia(mediaUploads[attachmentIdx]?.slug);
    }
    handleChange(newMedia);
  };

  return (
    <>
      <FileUpload onChange={(e) => handleAttachMedia(e)} />

      {step?.mediaUploads?.length > 0 ? (
        <ImageList sx={{ width: 500, height: "auto" }} cols={3} rowHeight={164}>
          {step?.mediaUploads?.map((attachment, attachmentIdx) =>
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
                {attachment?.slug ? (
                  <SafeImage
                    style={{
                      height: "fit-content !important",
                    }}
                    src={attachment?.slug}
                  />
                ) : (
                  <img src={URL.createObjectURL(attachment)} />
                )}

                <Box display="flex" gap="10px" alignItems="center">
                  <ButtonBase onClick={() => removeAttachment(attachmentIdx)}>
                    <DeleteIcon stroke="red" />
                  </ButtonBase>
                  <Label>{getAttachmentTitle(attachment)}</Label>
                </Box>
              </ImageListItem>
            ) : null
          )}
        </ImageList>
      ) : null}
    </>
  );
};

export default StepAttachments;
