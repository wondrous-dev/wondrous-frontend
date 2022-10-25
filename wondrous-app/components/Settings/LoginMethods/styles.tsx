import { Button } from 'components/Common/button';
import styled from 'styled-components';
import { Button as MuiButton } from '@mui/material';
import palette from 'theme/palette';
export const LogInMethodContainer = styled.div`
  width: 800px;

  @media (max-width: 1200px) {
    width: 600px;
  }
  @media (max-width: 950px) {
    width: 100%;
  }
`;

export const ContentContainer = styled.div`
  margin-top: 46px;
  width: 100%;
  padding-bottom: 70px;
`;

export const IndicatorContainer = styled.div`
  background: #250069;
  border: 1px solid #4f00de;
  border-radius: 6px;
  padding: 14px;
  width: 95%;
  display: flex;
  align-items: center;
  margin-top: 46px;
  p {
    font-weight: 600;
    font-size: 15px;
    line-height: 23px;
    margin: 0;
    margin-left: 12px;
    letter-spacing: 0.0025em;
    color: #ccbbff;
  }
`;

export const SectionContainer = styled.div`
  padding-bottom: 32px;
  width: 100%;
  border-bottom: 1px solid #232323;
  margin-bottom: 32px;
`;

export const StatusContainer = styled.span`
  padding: 4px;
  border-radius: 6px;
  font-weight: 400;
  font-size: 13px;
  line-height: 16px;
  background: ${({ status }) => (status === 'active' ? '#00311F' : '#371107')};
  color: ${({ status }) => (status === 'active' ? '#06FFA5' : '#F93701')};
`;

export const LoginTitleContainer = styled.div`
  display: flex;
  margin-bottom: 32px;
  align-items: center;
  p {
    font-weight: 500;
    font-size: 18px;
    line-height: 23px;
    color: #00baff;
    margin-right: 18px;
  }
`;

export const LogInMethodForm = styled.form`
  width: 100%;
`;

export const InputSection = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  label {
    font-size: 14px;
    line-height: 18px;
    color: #ccbbff;
    margin-bottom: 12px;
  }
  input {
    flex: 1;
    background: #1b1b1b;
    border-radius: 6px;
    padding: 12px;
    outline: none;
    border: none;
    font-weight: 400;
    height: 42px;
    font-size: 15px;
    color: #ffffff;
    line-height: 19px;
    &::placeholder {
      font-weight: 400;
      font-size: 15px;
      color: #ffffff;
      line-height: 19px;
    }
  }
`;

export const InputFlexSection = styled(InputSection)`
  && {
    display: flex;
    flex-direction: row;
    margin-top: 32px;
    align-items: flex-end;
  }
`;

export const ChangePasswordButton = styled(Button)`
  min-width: 165px;
  margin-left: 22px;
  box-sizing: content-box;
  font-size: 16px;
  button {
    background: #0f0f0f;
  }
`;

export const ConnectToWalletButton = styled(Button)`
  margin-right: 22px;
  box-sizing: content-box;
  font-size: 16px;

  button {
    padding: 9px 14px;
    background: #0f0f0f;
  }
`;
export const CancelSpan = styled.span`
  display: block;
  margin-left: 30px;
  font-size: 14px;
  cursor: pointer;
`;

export const ConnectToDiscordButton = styled(Button)`
  margin-right: 22px;
  box-sizing: content-box;
  font-size: 16px;
  border: 1px solid #7427ff;
  button {
    background: none;
    padding: 9px 14px;
  }

  svg {
    margin-right: 7px;
  }
`;

export const ButtonContainer = styled.div`
  display: flex;
  align-items: center;
`;

export const ReplaceWalletButton = styled(Button)`
  margin-right: 22px;
  box-sizing: content-box;
  font-size: 16px;

  svg {
    margin-right: 10px;
  }
  button {
    padding: 9px 14px;
    background: #313131;
    border-radius: 6px;
    display: flex;
  }
`;

export const ResetButton = styled(MuiButton)`
  && {
    width: 191px;
    height: 40px;
    background: #232323;
    border-radius: 234px;
    font-weight: 500;
    font-size: 16px;
    line-height: 150%;
    color: #ffffff;
    text-transform: none;
    font-family: Space Grotesk;
  }
`;

export const SaveChangesButton = styled(Button)`
  && {
    width: 191px;
    margin-left: 22px;
    height: 40px;
    font-family: Space Grotesk;
    min-height: 40px;
    button {
      background: #0f0f0f;
    }
  }
`;

export const ErrorContainer = styled.div`
  display: flex;
  align-items: center;
  margin-top: 20px;
  p {
    font-weight: 400;
    margin-left: 16px;
    font-size: 14px;
    line-height: 21px;
    color: #ffffff;
    letter-spacing: 0.01em;
  }
`;
