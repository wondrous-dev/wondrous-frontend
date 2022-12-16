import { Button, Dialog, Typography } from '@mui/material';
import styled from 'styled-components';
import palette from 'theme/palette';

// eslint-disable-next-line import/prefer-default-export
export const Container = styled(Dialog)`
  .MuiDialog-paper {
    width: 600px;
    background-color: ${palette.grey920};
  }
`;

export const Header = styled.div`
  width: 100%;
  padding: 10px;
  background-color: ${palette.grey920};
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const Title = styled(Typography)`
  font-size: 18px;
  font-weight: 700;
  color: ${palette.white};
`;

export const CloseButton = styled.div`
  width: 32px;
  height: 32px;
  background-color: ${palette.grey910};
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

export const Content = styled.div`
  width: 100%;
  background-color: ${palette.grey900};
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
  background-color: ${palette.black97};
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
    background: ${palette.black92};
    border-radius: 234px;
    font-size: 16px;
    line-height: 150%;
    color: ${palette.white};
    text-transform: none;
  }
`;

export const RightToolButton = styled(Button)`
  && {
    height: 43px;
    min-width: 43px;
    padding: 0px;
    background: ${palette.black92};
    border-radius: 6px;
    font-size: 16px;
    line-height: 150%;
    color: ${palette.white};
    text-transform: none;
  }
`;

export const ToolButton = styled(Button)`
  && {
    height: 43px;
    padding: 0 14px;
    background: ${palette.black92};
    border-radius: 6px;
    font-size: 16px;
    line-height: 150%;
    color: ${palette.white};
    text-transform: none;
    gap: 10px;
  }
`;

export const ImageUploadRecommendText = styled(Typography)`
  && {
    font-size: 12px;
    line-height: 15px;
    color: ${palette.white};
    margin-bottom: 6px;
    text-align: lefts;
  }
`;
