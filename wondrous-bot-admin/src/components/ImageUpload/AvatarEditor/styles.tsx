import { Button, Dialog, Typography } from '@mui/material';
import styled from 'styled-components';

// eslint-disable-next-line import/prefer-default-export
export const Container = styled(Dialog)`
  .MuiDialog-paper {
    width: 600px;
  }
`;

export const Header = styled.div`
  width: 100%;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const Title = styled(Typography)`
  font-size: 18px;
  font-weight: 700;
`;

export const CloseButton = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

export const Content = styled.div`
  width: 100%;
  padding: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const RecomendationContainer = styled.div`
  width: 100%;
  margin-top: 12px;
`;

export const Footer = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 24px;
  padding: 24px;
`;

export const ToolButtonsContainer = styled.div`
  margin-top: 12px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const LeftButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const RightButtons = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const CancelButton = styled(Button)`
  && {
    height: 43px;
    padding: 0 14px;
    border-radius: 234px;
    font-size: 16px;
    line-height: 150%;
    text-transform: none;
  }
`;

export const RightToolButton = styled(Button)`
  && {
    height: 43px;
    min-width: 43px;
    padding: 0px;
    border-radius: 6px;
    font-size: 16px;
    line-height: 150%;
    text-transform: none;
  }
`;

export const ToolButton = styled(Button)`
  && {
    height: 43px;
    padding: 0 14px;
    border-radius: 6px;
    font-size: 16px;
    line-height: 150%;
    text-transform: none;
    gap: 10px;
  }
`;

export const ImageUploadRecommendText = styled(Typography)`
  && {
    font-size: 12px;
    line-height: 15px;
    margin-bottom: 6px;
    text-align: lefts;
  }
`;
