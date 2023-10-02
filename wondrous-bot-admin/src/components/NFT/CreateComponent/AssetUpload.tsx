import FileUpload from "components/Shared/FileUpload";
import { AssetDisclaimer, AssetPanelWrapper, Container } from "./styles";
import ImageIcon from "components/Icons/ImageIcon";
import { Box, Grid } from "@mui/material";
import VideoPlayer from "components/Shared/SubmissionMedia/VideoPlayer";
import { Filename } from "components/Shared/SubmissionMedia/styles";
import { ButtonIconWrapper, ErrorText } from "components/Shared/styles";
import ReplaceIcon from "components/Icons/ReplaceIcon";
import { Label } from "components/QuestsList/styles";
import { useMemo } from "react";
import * as yup from "yup";

const Asset = ({ file }) => {
  const url = useMemo(() => {
    if (file) {
      return URL.createObjectURL(file);
    }
    return null;
  }, [file]);

  if (file.type?.includes("image")) {
    return (
      <Box
        sx={{
          minWidth: "250px",
          height: "200px",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          borderRadius: "16px",
          backgroundImage: `url(${url})`,
        }}
      />
    );
  }
  if (file.type?.includes("video")) {
    return <VideoPlayer src={url} name={file?.name} style={{ width: "10%", height: "10%" }} />;
  }
  return <Filename>{file}</Filename>;
};

interface AssetUploadProps {
  error: string | undefined;
  value: File | null;
  onChange: (value: File | null) => void;
  limit: number;
  setError: (value: string | undefined) => void;
}

const AssetUpload = ({ value, onChange, error, limit, setError }: AssetUploadProps) => {
  const MAX_FILE_SIZE = useMemo(() => limit * 1024 * 1024, [limit]);

  const fileSchema = yup.object().shape({
    file: yup
      .mixed()
      .required("File is required")
      .test(
        "fileSize",
        `File size must be less than or equal to ${limit}MB`,
        (value: File | null) => value && value?.size <= MAX_FILE_SIZE
      ),
  });

  const handleAttachMedia = (e) => {
    const file = e.target.files[0];
    if (!(file instanceof File)) {
      console.error("Uploaded item is not a file");
      return;
    }

    fileSchema
      .validate({ file })
      .then(() => {
        onChange(file);
      })
      .catch((validationError) => {
        setError(validationError.message);
      });
  };

  return (
    <Grid display="flex" flexDirection="column" gap="14px">
      <Container>
        {value ? (
          <Box display="flex" gap="14px" flexDirection="column" justifyContent="center" alignItems="center">
            <Asset file={value} />
            <Box display="flex" gap="8px" alignItems="center">
              <FileUpload
                onChange={handleAttachMedia}
                accept="image/*,video/*,audio/*"
                renderUploadComponent={({ handleAddMedia }) => {
                  return (
                    <ButtonIconWrapper onClick={handleAddMedia}>
                      <ReplaceIcon />
                    </ButtonIconWrapper>
                  );
                }}
              />
              <Label fontSize="15px" fontWeight={500}>
                Replace
              </Label>
            </Box>
          </Box>
        ) : (
          <FileUpload
            onChange={handleAttachMedia}
            accept="image/*,video/*,audio/*"
            renderUploadComponent={({ handleAddMedia }) => {
              return (
                <Box
                  display="flex"
                  flexDirection="column"
                  gap="14px"
                  width="100%"
                  justifyContent="center"
                  alignItems="center"
                  height="100%"
                >
                  <AssetPanelWrapper onClick={handleAddMedia} type="button">
                    <ImageIcon />
                  </AssetPanelWrapper>
                </Box>
              );
            }}
          />
        )}
        {error ? <ErrorText>{error}</ErrorText> : null}
      </Container>
      <Container>
        <AssetDisclaimer>
          File types supported: <strong>JPG, PNG, GIF, SVG, MP4, WEBM</strong>
        </AssetDisclaimer>
        <AssetDisclaimer>
          Max size: <strong>{limit} MB</strong>
        </AssetDisclaimer>
      </Container>
    </Grid>
  );
};

export default AssetUpload;
