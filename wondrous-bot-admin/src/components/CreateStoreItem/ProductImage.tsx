import { Box, ButtonBase, Grid, ImageList, ImageListItem } from "@mui/material";
import DeleteIcon from "components/Icons/Delete";
import ImageUploadIcon from "components/Icons/ImageUploadIcon";
import ReplaceIcon from "components/Icons/ReplaceIcon";
import { Media } from "components/QuestSteps/Steps/Attachment";
import { Label } from "components/QuestsList/styles";
import SafeImage from "components/SafeImage";
import FileUpload from "components/Shared/FileUpload";
import { ButtonIconWrapper } from "components/Shared/styles";

const ProductImage = ({ setStoreItemData, storeItemData }) => {
  const handleAttachMedia = (e, idx = null) => {
    // when we have multiple media here then we need to replace by idx
    const file = e.target.files[0];
    const media = storeItemData?.media || [];
    // const newMedia = [...media, file];
    const newMedia = [file];
    setStoreItemData((prev) => ({
      ...prev,
      mediaUploads: newMedia,
    }));
  };

  const getAttachmentTitle = (file) => {
    if (file?.name?.length > 16) {
      return `${file.name.slice(0, 16)}...`;
    }
    return file.name;
  };

  const removeAttachment = (attachmentIdx) => {
    const mediaUploads = storeItemData?.media || [];
    const newMedia = mediaUploads?.filter((el, idx) => idx !== attachmentIdx);
    setStoreItemData((prev) => ({
      ...prev,
      mediaUploads: newMedia,
    }));
  };

  return (
    <ImageList sx={{ width: "fit-content", maxWidth: 500, height: "auto" }} cols={2} rowHeight={164}>
      {storeItemData?.mediaUploads?.map((attachment, attachmentIdx) => {
        return (
          <ImageListItem
            key={`attachment-${attachmentIdx}`}
            sx={{
              position: "relative",
              borderRadius: "6px",
              overflow: "hidden",
              display: "flex",
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
              <Media file={attachment} />
            )}
            <Box display="flex" gap="10px" alignItems="center">
              <ButtonIconWrapper onClick={() => removeAttachment(attachmentIdx)}>
                <DeleteIcon />
              </ButtonIconWrapper>
              <FileUpload
                onChange={(e) => handleAttachMedia(e, attachmentIdx)}
                accept={"image/*"}
                renderUploadComponent={({ handleAddMedia }) => (
                  <ButtonIconWrapper onClick={handleAddMedia}>
                    <ReplaceIcon />
                  </ButtonIconWrapper>
                )}
              />

              <Label fontSize="12px">{getAttachmentTitle(attachment)}</Label>
            </Box>
          </ImageListItem>
        );
      })}
      {storeItemData?.mediaUploads?.length < 1 && (
        <FileUpload
          onChange={(e) => handleAttachMedia(e)}
          accept={"image/*"}
          renderUploadComponent={({ handleAddMedia }) => (
            <ButtonBase onClick={handleAddMedia} sx={{ outline: "none" }}>
              <ImageUploadIcon />
            </ButtonBase>
          )}
        />
      )}
    </ImageList>
  );
};

export default ProductImage;
