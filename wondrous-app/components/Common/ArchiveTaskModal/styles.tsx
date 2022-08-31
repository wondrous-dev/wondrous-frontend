import { Box, Button, Dialog, Divider, Typography } from '@mui/material';
import styled, { css } from 'styled-components';
import palette from 'theme/palette';
import { greyColors } from 'theme/colors';
import CloseModalIcon from 'components/Icons/closeModal';
import { Button as ButtonComponent } from '../button';

export const scrollBarStyles = css`
  :hover {
    &::-webkit-scrollbar {
      display: block;
    }
  }
  &::-webkit-scrollbar {
    display: none;
    position: absolute;
    z-index: 999;
    width: 20px;
    background: transparent;
    border-radius: 0 4px 4px 0;
    outline: none;
  }
  &::-webkit-scrollbar-track {
    background: #606060;
    background-clip: padding-box;
    border: 8px solid rgba(0, 0, 0, 0);
    border-radius: 50px;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 50px;
    border: 8px solid rgba(0, 0, 0, 0);
    background: #c4c4c4;
    background-clip: padding-box;
  }
`;

export const StyledDialog = styled(Dialog)`
  display: inline-block;
  flex-direction: column;
  border-radius: 6px;
  background-color: rgba(0, 0, 0, 0);
`;

export const StyledChildren = styled.div``;

export const StyledDialogTopBar = styled.div`
  flex-direction: row;
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 18px;
  padding-bottom: 16px;
  border-bottom: 0.5px dashed ${greyColors.grey75};
  ${(props) => props.style}
`;

export const StyledBox = styled(Box)`
  && {
    width: 488px;
    background: ${greyColors.grey100};
    border-radius: 6px;
    padding: 24px;
    ${scrollBarStyles}
  }
`;

export const StyledCloseButton = styled(CloseModalIcon)`
  transform: rotate(90deg);
  background: black;
  width: 32px;
  height: 32px;
  padding: 8px;
  border-radius: 6px;
  path {
    fill: ${greyColors.grey57};
  }
  :hover {
    background: rgba(122, 122, 122, 0.2);
  }
`;

export const StyledHeader = styled(Typography)`
  && {
    font-family: Space Grotesk;
    font-size: 20px;
    font-style: normal;
    font-weight: 700;
    text-align: left;
    color: #ffffff;
    margin-left: 24px;
    align-items: center;
    justify-content: center;
  }
`;

export const StyledDivider = styled(Divider)`
  && {
    background-color: #363636;
    width: 444px;
    height: 1px;
    margin: 0 auto;
    margin-top: 28px;
  }
`;

export const StyledBody = styled(Typography)`
  && {
    font-family: Space Grotesk;
    font-style: normal;
    font-weight: normal;
    font-size: 16px;
    letter-spacing: 0.01em;
    color: #c4c4c4;
    margin-top: 14px;
  }
`;

export const StyledWarningMessage = styled(Typography)`
  && {
    font-family: Space Grotesk;
    font-style: normal;
    font-weight: normal;
    font-size: 14px;
    letter-spacing: 0.01em;
    color: ${palette.red400};
    margin-left: 24px;
    margin-top: 14px;
  }
`;

export const StyledButtonsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  margin: 23px 24px 0;
`;

export const StyledCancelButton = styled(Button)`
  && {
    padding: 8px 30px;
    width: 107px;
    height: 39px;
    background: #232323;
    border-radius: 35px;
    display: flex;
    align-items: center;
    text-align: center;
    color: #ffffff;

    :hover {
      background: rgba(35, 35, 35, 0.5);
    }
  }
`;

export const StyledArchiveTaskButton = styled(ButtonComponent)`
  && {
    background: linear-gradient(270deg, #ccbbff -5.62%, #7427ff 45.92%, #00baff 103.12%);
    min-height: 0;
    min-width: 144px;
    height: 40px;
    display: flex;
    padding: 4px 2px;
    justify-content: space-between;
    align-items: center;
    text-align: center;
    color: #ffffff;
    opacity: 0.8;
    transition: opacity 0.25s;
    margin-left: 12px;

    button {
      padding: 4px 8px;
      background: rgba(20, 20, 20, 1);
      font-size: 15px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
    }

    :hover {
      opacity: 1;
    }
  }
`;

export const StyledArchivedLabel = styled(Typography)`
  && {
    margin-left: 6px;
    color: #fff;
    font-weight: 600;
    font-size: 15px;
    letter-spacing: -1%;
  }
`;
