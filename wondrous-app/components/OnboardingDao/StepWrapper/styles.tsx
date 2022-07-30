import { InputUnstyled } from '@mui/base';
import { ButtonBase, Typography } from '@mui/material';
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

export const WrapperLoadingCircularProgress = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;
  align-items: center;
  justify-content: center;
`;

export const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 30px;
  width: 614px;
  min-height: 600px;
  background: ${({ theme }) => theme.palette.grey900};
  border: 1px solid ${({ theme }) => theme.palette.grey79};
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
  background: ${({ theme }) => theme.palette.green350};
  border: 2px solid ${({ theme }) => theme.palette.green30};
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
  border: 2px solid ${({ theme }) => theme.palette.grey78};
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
    font-family: ${({ theme }) => theme.typography.fontFamily};
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
    font-family: ${({ theme }) => theme.typography.fontFamily};
    font-style: normal;
    font-weight: 400;
    font-size: 15px;
    letter-spacing: 0.01em;
    color: ${({ theme }) => theme.palette.white};
    line-height: 26px;
  }
`;

export const ComponentWrapper = styled.div`
  margin-top: 24px;
  display: flex;
  padding: 24px 0;
  border-top: 1px dashed ${({ theme }) => theme.palette.grey75};
  border-bottom: 1px dashed ${({ theme }) => theme.palette.grey75};
  width: 100%;
  min-height: 288px;
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
    background: ${({ theme }) => theme.palette.black92};
    border: 0;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
`;

export const LaterButton = styled(ButtonBase)`
  && {
    display: flex;
    padding: 8px 24px;
    width: 84px;
    height: 40px;
    background: ${({ theme }) => theme.palette.grey78};
    border-radius: 35px;
    color: ${({ theme }) => theme.palette.white};
    font-family: ${({ theme }) => theme.typography.fontFamily};
    font-style: normal;
    font-weight: 600;
    font-size: 15px;
  }
`;

export const ContinueButton = styled(({ children, ...props }) => (
  <ButtonBase {...props}>
    <div>{children}</div>
  </ButtonBase>
))`
  && {
    align-items: center;
    background: ${({ theme }) =>
      `linear-gradient(270deg, ${theme.palette.blue20} -5.62%, ${theme.palette.highlightPurple} 45.92%, ${theme.palette.highlightBlue} 103.12%);`};
    border-radius: 35px;
    color: ${({ theme }) => theme.palette.white};
    display: flex;
    font-family: ${({ theme }) => theme.typography.fontFamily};
    font-size: 15px;
    font-weight: 600;
    height: 38px;
    justify-content: space-between;
    padding: 1px;
    text-align: center;
    width: fit-content;
    > div {
      align-items: center;
      background: ${({ theme }) => theme.palette.background.default};
      border-radius: inherit;
      display: flex;
      height: 100%;
      justify-content: center;
      width: 100%;
      padding: 8px 24px;
    }
  }
`;

export const FieldLabel = styled(Typography)`
  && {
    color: ${({ theme }) => theme.palette.blue20};
    font-family: ${({ theme }) => theme.typography.fontFamily};
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

export const ComponentFieldWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
`;

export const FieldInput = styled(InputUnstyled)`
  && {
    .MuiInput-input {
      background: ${({ theme }) => theme.palette.black97};
      border-radius: 6px;
      border-radius: 6px;
      border: none;
      color: ${({ theme }) => theme.palette.white};
      font-family: ${({ theme }) => theme.typography.fontFamily};
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

export const ButtonsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
`;

export const ImportButtonWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const ButtonCSVTemplate = styled(ButtonBase)`
  && {
    align-items: center;
    background: ${({ theme }) => theme.palette.grey87};
    border-radius: 6px;
    color: ${({ theme }) => theme.palette.white};
    display: flex;
    flex-direction: row;
    font-family: ${({ theme }) => theme.typography.fontFamily};
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    height: 38px;
    justify-content: center;
    padding: 10px;
    width: 113px;
  }
`;
