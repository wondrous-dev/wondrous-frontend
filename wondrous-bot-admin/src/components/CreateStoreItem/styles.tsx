import { Box } from "@mui/material";
import { ImageUploadBlockActivitySection } from "components/ImageUpload/styles";
import styled from "styled-components";

export const ImageUploadWrapper = styled(Box)`
  && {
    background: #e8e8e8;
    border-radius: 6px;
    width: auto;
    max-width: 120px;
    height: 120px;
    display: flex;
    justify-content: center;
    align-items: center;
    ${ImageUploadBlockActivitySection} {
      align-items: center;
      justify-content: center;
    }
  }
`;
