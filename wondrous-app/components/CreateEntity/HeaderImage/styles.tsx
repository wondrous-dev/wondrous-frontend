import React from 'react';
import styled from 'styled-components';
import Typography from '@mui/material/Typography';
import UploadImageIcon from '../../Icons/uploadImage';

export const CreateFormPickHeaderImageSection = styled.div`
  width: 100%;
  margin-bottom: 28px;
`;

export const CreateFormPickHeaderImageContainer = styled.div`
  width: 100%;
`;

export const CreateFormPickHeaderImage = styled.img`
  width: 100%;
  height: 90px;
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 12px;
`;

export const CreateFormPickHeaderImageUploadBlock = styled.div`
  position: relative;
  width: 100%;
  height: 72px;
  border: 1px dashed #393939;
  border-radius: 6px;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const CreateFormPickHeaderImageUploadBlockContainer = styled.div`
  width: 337px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const CreateFormPickHeaderImageUploadBlockIcon = styled(UploadImageIcon)`
  width: 35px;
  height: 35px;
`;

export const CreateFormPickHeaderImageTextBlock = styled.div`
  width: 280px;
  height: 44px;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
`;

export const CreateFormPickHeaderImageTextBlockTitle = styled(Typography)`
  && {
    font-weight: normal;
    font-size: 14px;
    line-height: 19px;
    letter-spacing: 0.01em;
    color: #c4c4c4;

    & span {
      font-weight: bold;
      text-decoration-line: underline;
      color: #00baff;
    }
  }
`;

export const CreateFormPickHeaderImageTextBlockSubTitle = styled(Typography)`
  && {
    font-weight: 500;
    font-size: 12px;
    line-height: 19px;
    letter-spacing: 0.01em;
    color: #6c6c6c;
  }
`;
