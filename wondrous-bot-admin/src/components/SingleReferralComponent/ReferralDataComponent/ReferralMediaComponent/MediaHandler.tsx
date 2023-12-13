import { Box, ButtonBase } from "@mui/material";
import FileUpload from "components/Shared/FileUpload";

import DeleteIcon from "components/Icons/Delete";
import ReplaceIcon from "components/Icons/ReplaceIcon";
import { ButtonIconWrapper } from "components/Shared/styles";
import ImageUploadIcon from "components/Icons/ImageUploadIcon";
import { Media } from "components/QuestSteps/Steps/Attachment";
import SafeImage from "components/SafeImage";

const MediaHandler = ({ media, onChange }) => {
  const handleAttachMedia = (e, idx = null) => {
    const file = e.target.files[0];
    const newMedia = [file];
    onChange(newMedia);
  };

  const removeAttachment = (attachmentIdx) => {
    const mediaUploads = media || [];
    const newMedia = mediaUploads?.filter((el, idx) => idx !== attachmentIdx);
    onChange(newMedia);
  };

  const mediaItem = media?.[0];
  return (
    <Box display="flex" gap="24px" alignItems="center">
      {!mediaItem ? (
        <FileUpload
          onChange={(e) => handleAttachMedia(e)}
          accept={"image/*"}
          renderUploadComponent={({ handleAddMedia }) => (
            <ButtonBase
              onClick={handleAddMedia}
              sx={{
                outline: "none",
                borderRadius: "12px",
                border: "1px solid #C0C0C0",
                minWidth: "342px",
                width: "40%",
                maxHeight: "87px",
                "&:focus": {
                  outline: "none",
                },
              }}
            >
              <ImageUploadIcon withWrapper={false} />
            </ButtonBase>
          )}
        />
      ) : null}
      {mediaItem ? (
        <Box borderRadius="12px" minWidth="342px" width="40%">
          {mediaItem?.slug ? (
            <SafeImage
              style={{
                height: "fit-content !important",
                maxWidth: "100%",
                borderRadius: "12px"
              }}
              src={mediaItem?.slug}
            />
          ) : (
            <Media
              file={mediaItem}
              mediaStyle={{
                maxWidth: "100%",
                height: "auto",
                borderRadius: "12px",
              }}
            />
          )}
        </Box>
      ) : null}
      <Box display="flex" gap="10px" alignItems="center">
        <ButtonIconWrapper onClick={() => removeAttachment(0)}>
          <DeleteIcon />
        </ButtonIconWrapper>
        <FileUpload
          onChange={(e) => handleAttachMedia(e, 0)}
          accept={"image/*"}
          renderUploadComponent={({ handleAddMedia }) => (
            <ButtonIconWrapper onClick={handleAddMedia}>
              <ReplaceIcon />
            </ButtonIconWrapper>
          )}
        />
      </Box>
    </Box>
  );
};

export default MediaHandler;
