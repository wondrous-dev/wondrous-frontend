import { Button } from 'components/Common/button';
import styled from 'styled-components';
import { Button as MuiButton, Typography } from '@mui/material';
import palette from 'theme/palette';

export const ContentContainer = styled.div`
  margin-top: 46px;
  width: 100%;
  padding-bottom: 70px;
`;

export const IndicatorText = styled(Typography)`
  && {
    font-family: Space Grotesk;
    font-style: normal;
    font-weight: 400;
    font-size: 14px;
    letter-spacing: 0.01em;
    color: ${palette.white};
    margin-left: 10px;
    margin-bottom: 5px;
  }
`;

// same as ClaimRoleWarningWrapper
export const IndicatorContainer = styled.div`
  background: ${palette.violet950};
  padding: 10px;
  display: flex;
  gap: 14px;
  flex-direction: column;
  align-items: flex-start;
  border-radius: 6px;
  border: 1px solid ${palette.violet100};
  margin-bottom: 10px;
  ${Button} {
    background: ${palette.background.default};
    position: relative;
    &::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(
        270deg,
        ${palette.blue20} -5.62%,
        ${palette.highlightPurple} 45.92%,
        ${palette.highlightBlue} 103.12%
      );
      mask: linear-gradient(${palette.white} 0 0) content-box, linear-gradient(${palette.white} 0 0);
      mask-composite: xor;
      padding: 1.8px;
      border-radius: 1000px;
    }
    &:hover {
      background: linear-gradient(
        270deg,
        ${palette.blue20} -5.62%,
        ${palette.highlightPurple} 45.92%,
        ${palette.highlightBlue} 103.12%
      );
    }
  }
`;

export const SectionContainer = styled.div`
  padding-bottom: 32px;
  width: 100%;
  border-bottom: 1px solid #232323;
  margin-bottom: 12px;
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
  margin-left: 10px;
  font-size: 14px;
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
