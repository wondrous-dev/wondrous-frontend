import { Divider, FormControlLabel, TextField, Typography } from '@mui/material';
import styled from 'styled-components';
import AndroidSwitch from 'components/Common/AndroidSwitch';
import typography from 'theme/typography';
import palette from 'theme/palette';

export const StyledDivider = styled(Divider)`
  && {
    background: #363636;
    height: 1px;
    border-radius: 6px;
    width: 630px;
    margin-top: 20px;
    margin-bottom: 20px;
  }
`;

export const InviteThruLinkTextField = styled(TextField)`
  background: #0f0f0f;
  border-radius: 6px 0 0 6px;
  height: 40px;
  width: 351px;
  padding: 0;

  .MuiInputBase-input {
    color: #c4c4c4;
    font-size: 14px;
  }
  .MuiInputBase-input-label {
    color: #c4c4c4;
    font-size: 14px;
  }
  .MuiOutlinedInput-input {
    padding: 11px 15px;
  }
`;

export const LinkSwitch = styled(({ ...props }) => (
  <FormControlLabel {...props} control={<AndroidSwitch />} label={props.label} />
))`
  .MuiTypography-body1 {
    color: #ccbbff;
    font-size: 14px;
  }
`;

export const LinkInviteContainer = styled.div`
  width: 100%;
  margin-bottom: 15px;
  display: flex;
  justify-content: space-between;
  gap: 12px;
`;

export const DisplaySearchedUserContainer = styled.div`
  background: #1d1d1d;
  border: 1px solid #424242;
  border-radius: 6px;
  width: 60%;
  z-index: 2;
  position: absolute;
  max-height: 400px;
  overflow-y: auto;
  -ms-overflow-style: none;

  ${({ theme }) => theme.breakpoints.down('sm')} {
    width: 50%;
  }

  &::-webkit-scrollbar-track {
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    background: #606060;
  }

  &::-webkit-scrollbar {
    height: 0;
    width: 10px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    background: #c4c4c4;
  }
`;

export const DisplaySearchedUser = styled.div`
  display: flex;
  background: #121212;
  border-radius: 4px;
  cursor: pointer;
  padding: ${(props) => (props.type === 'email' ? '15px' : '8px')};
  align-items: center;
  margin-bottom: 8px;

  p {
    margin: 0;
    color: #ffffff;
    font-weight: 600;
    font-size: 16px;
    line-height: 16px;
    margin-left: 14px;
  }

  &:last-child {
    margin-bottom: 0;
  }

  &:hover {
    background: linear-gradient(269.74deg, #232323 8.24%, #161616 72.13%);
  }
`;

export const CopyContainer = styled.div`
  border-radius: 6px;
  border: 1px solid ${palette.black101};
  font-family: ${typography.fontFamily};
  min-width: 100px;
  height: 40px;

  background: ${palette.grey85};
  padding: 7px 0px 7px 5px;
  border-color: ${(props) => (props.hasAddressBeenCopied ? palette.green800 : 'transparent')};
  display: flex;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  transition: border-color 0.2s ease-in-out;

  :hover {
    border: 1px solid ${palette.grey79};
  }
  ${({ theme }) => theme.breakpoints.down('sm')} {
    min-width: 20px;
  }
`;

export const CopyTypography = styled(Typography)`
  && {
    color: ${palette.white};
    font-family: ${typography.fontFamily};
    font-size: 13px;
    font-weight: 400;
    transition: all 0.2s ease-in-out;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
  }
`;

export const UserBox = styled.div`
  width: 100%;
  height: auto;
  max-height: 400px;
`;

export const UsersDetailsBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
  height: auto;
  max-height: 330px;
  overflow-y: auto;
  padding-right: 6px;

  &::-webkit-scrollbar-track {
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    background: #606060;
  }

  &::-webkit-scrollbar {
    height: 0;
    width: 6px;
  }

  &::-webkit-scrollbar-thumb {
    border-radius: 10px;
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    background: #c4c4c4;
  }
`;

export const InvitedText = styled.p`
  width: 100%;
  color: #7a7a7a;
  font-weight: 400;
  font-size: 14px;
  margin-bottom: 12px;
`;

export const IndividualUserBox = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const NameContainer = styled.div`
  display: flex;
  align-items: center;

  p {
    font-weight: 600;
    font-size: 16px;
    margin-left: 14px;
    line-height: 16px;
    color: #ffffff;
  }
`;

export const DeleteBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 28px;
  height: 28px;
  cursor: pointer;
`;

export const EmailInput = styled(TextField)`
  && {
    height: 40px;
    width: 100%;
    background: #0f0f0f;
    border-radius: 4px;
    font-family: 'Space Grotesk';
    font-style: normal;
    font-weight: 400;
    font-size: 15px;
    line-height: 19px;
    letter-spacing: 0.01em;

    .MuiInputBase-input {
      color: #c4c4c4;
      height: 20px;
      padding: 10px 15px;
    }
  }
`;
