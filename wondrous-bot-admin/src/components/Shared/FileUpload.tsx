import AttachmentIcon from "components/Icons/Attachment";
import { useRef } from "react";
import { ButtonIconWrapper } from "./styles";

const FileUpload = ({ onChange, renderUploadComponent = null, accept = "image/*" }) => {
  const inputRef = useRef(null);

  const handleAddMedia = () => inputRef.current.click();

  return (
    <>
      <input
        type="file"
        ref={(input) => {
          inputRef.current = input;
        }}
        onChange={onChange}
        style={{ display: "none" }}
        accept={accept}
      />
      {renderUploadComponent ? (
        renderUploadComponent({ handleAddMedia })
      ) : (
        <ButtonIconWrapper onClick={() => handleAddMedia()}>
          <AttachmentIcon />
        </ButtonIconWrapper>
      )}
    </>
  );
};

export default FileUpload;
