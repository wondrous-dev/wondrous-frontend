import { InputUnstyled } from '@mui/base';
import { ButtonBase, Typography } from '@mui/material';
import { Button } from 'components/Common/button';
import { GradientHighlightHorizontal } from 'components/Common/gradients';
import CloseIcon from 'components/Icons/close.svg';
import styled from 'styled-components';

export const Wrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  height: 100%;
  background: url('/images/onboarding/background.png') no-repeat center center
    ${({ theme }) => theme.palette.background.default};
  display: flex;
  align-items: center;
  justify-content: center;
  background-size: cover;
  padding: 0 20px;

  @media (min-width: 641px) {
    padding: 0;
  }
`;

export const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 30px;
  width: 614px;
  min-height: 600px;
  background: #1d1d1d;
  border: 1px solid #424242;
  border-radius: 6px;
`;

export const HeaderWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

export const StepIndicatorWrapper = styled.div`
  display: flex;
  gap: 12px;
`;

export const StepIndicatorDone = styled.div`
  width: 12px;
  height: 12px;
  background: #00cd83;
  border: 2px solid #06ffa5;
  border-radius: 137.143px;
`;

export const StepIndicatorFilled = styled.div`
  width: 12px;
  height: 12px;
  background: ${({ theme }) => theme.palette.white};
  border: 2px solid ${({ theme }) => theme.palette.white};
  border-radius: 100px;
  filter: drop-shadow(0px 0px 2px ${({ theme }) => theme.palette.white});
`;

export const StepIndicatorEmpty = styled.div`
  width: 12px;
  height: 12px;
  border: 2px solid #474747;
  border-radius: 100px;
`;

export const CloseButton = styled(ButtonBase)`
  && {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 10px 9px;
    width: 32px;
    height: 32px;
    background: ${({ theme }) => theme.palette.background.default};
    border-radius: 6px;
  }
`;

export const CloseButtonIcon = styled(CloseIcon)`
  path {
    fill: ${({ theme }) => theme.palette.blue20};
  }
`;

export const Title = styled(Typography)`
  && {
    margin-top: 48px;
    font-family: 'Space Grotesk';
    font-style: normal;
    font-weight: 500;
    font-size: 28px;
    text-align: center;
    background: linear-gradient(
      89.17deg,
      ${({ theme }) => theme.palette.blue20} 37.43%,
      ${({ theme }) => theme.palette.highlightBlue} 105.62%
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }
`;

export const Subtitle = styled(Typography)`
  && {
    margin-top: 12px;
    font-family: 'Space Grotesk';
    font-style: normal;
    font-weight: 400;
    font-size: 15px;
    letter-spacing: 0.01em;
    color: ${({ theme }) => theme.palette.white};
    line-height: 26px;
  }
`;

export const ChildrenWrapper = styled.div`
  margin-top: 24px;
  display: flex;
  padding: 24px 0;
  border-top: 1px dashed ${({ theme }) => theme.palette.grey75};
  border-bottom: 1px dashed ${({ theme }) => theme.palette.grey75};
  width: 100%;
`;

export const FooterWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

export const ButtonWrapper = styled.div`
  margin-top: 24px;
  display: flex;
  align-items: center;
  gap: 24px;
`;

export const BackButton = styled(ButtonBase)`
  && {
    width: 40px;
    height: 40px;
    background: #232323;
    border: 0;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
`;

export const CancelButton = styled(ButtonBase)`
  && {
    display: flex;
    padding: 8px 24px;
    width: 84px;
    height: 40px;
    background: #474747;
    border-radius: 35px;
    color: ${({ theme }) => theme.palette.white};
    font-family: 'Space Grotesk';
    font-style: normal;
    font-weight: 600;
    font-size: 15px;
  }
`;

export const ContinueButton = styled(Button)`
  && {
    ${GradientHighlightHorizontal}
    height: 40px;
    > button {
      padding: 8px 24px;
      background: ${({ theme }) => theme.palette.background.default};
      border-radius: 35px;
      color: ${({ theme }) => theme.palette.white};
      font-family: 'Space Grotesk';
      font-style: normal;
      font-weight: 600;
      font-size: 15px;
    }
  }
`;

export const FieldLabel = styled(Typography)`
  && {
    color: #ccbbff;
    font-family: 'Space Grotesk';
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
  }
`;

export const FieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
`;

export const ChildrenFieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
`;

export const FieldInput = styled(InputUnstyled)`
  && {
    .MuiInput-input {
      background: #141414;
      border-radius: 6px;
      border-radius: 6px;
      border: none;
      color: ${({ theme }) => theme.palette.white};
      font-family: 'Space Grotesk';
      font-size: 15px;
      font-style: normal;
      font-weight: 400;
      height: 42px;
      padding: 12px;
      width: 100%;
      :focus-visible {
        outline: none;
      }
    }
  }
`;
