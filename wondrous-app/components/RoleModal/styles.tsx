import { Typography, Dialog, TextareaAutosize, Checkbox } from '@mui/material';
import React from 'react';
import styled from 'styled-components';
import palette from 'theme/palette';
import { blackColors, blueColors, greyColors, highlightBlue, highlightPurple, violetColors } from 'theme/colors';
import CloseModalIcon from 'components/Icons/closeModal';
import CheckMarkIcon from 'components/Icons/checkMark';
import CloseModalIconRed from 'components/Icons/closeModalRed';
import { ChevronLeft } from '@mui/icons-material';
import SuccessRole from 'components/Icons/successRole';
import { LockedIconOutline, LockIconOutline } from 'components/Icons/userpass';

export const RequestModalHorizontalAlign = styled.div`
  flex-direction: 'row';
  display: flex;
  align-items: center;
`;

export const RequestModalTokenGatingLockBackground = styled.div`
  background-color: ${greyColors.grey920};
  border-radius: 4px;
  padding: 4px;
  justify-content: center;
  align-items: center;
  width: 24px;
  height: 24px;
  display: flex;
`;

export const RequestModalTokenGatingSubtitle = styled.div`
  && {
    font-size: 14px;
    font-weight: 500;
    font-family: 'Space Grotesk';
    color: ${(props) => props.color};
  }
`;

export const RequestModalLockedIconOutline = styled(LockedIconOutline)`
  width: 16px;
  height: 16px;
`;

export const SuccessLockedIconOutline = styled(LockIconOutline)`
  width: 16px;
  height: 16px;
`;

export const RequestModalContainer = styled(Dialog)`
  width: 100%;
  max-width: none;
  display: inline-block;
  flex-direction: column;
  border-radius: 6px;
  background-color: rgba(0, 0, 0, 0);
`;

export const RequestModalTitleBar = styled.div`
  flex-direction: row;
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background-color: ${greyColors.grey920};

  border-bottom: 0.5px dashed ${greyColors.grey75};
  ${(props) => props.style}
`;

export const RequestModalHelperDiv = styled.div`
  width: 100%;
`;
export const RequestModalHelperContainer = styled.div`
  flex-direction: row;
  display: flex;
`;
export const RequestMiddleContainer = styled.div`
  padding: 24px;
`;

export const RequestLightBoxContainer = styled.div`
  background-color: ${blackColors.black92};
  padding: 14px;
  margin-bottom: 18px;
`;

export const RequestModalNoRolesContainer = styled.div`
  width: 100%;
  flex-direction: column;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const RequestModalNoRolesSubtitle = styled(Typography)`
  && {
    font-size: 14px;
    font-weight: 500;
    font-family: 'Space Grotesk';
    color: ${greyColors.grey57};
    margin-bottom: 12px;
  }
`;

export const RequestModalCheckPillCombo = styled.div`
  flex-direction: row;
  display: flex;
  align-items: center;
  margin-bottom: 14px;
  border-bottom: 0.5px ${greyColors.grey75};
`;

export const RequestModalCheckbox = styled((props) => (
  <Checkbox
    disabled={props.disabled}
    checked={props.checked}
    sx={{
      padding: 0,
      margin: 0,
      marginRight: '8px',
      color: highlightPurple,
      '&.Mui-checked': {
        color: highlightPurple,
      },
    }}
  />
))``;

export const RequestModalRolesAbilityContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: center;
  align-self: center;
  flex: 1;
  margin-top: 14px;
  background-color: ${blackColors.black92};
`;

export const RequestModalRolesSuccessIcon = styled(SuccessRole)`
  align-self: center;
  width: 100%;
  display: flex;
`;

export const RequestModalSuccessContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: center;
  align-items: center;
  align-self: center;
  flex: 1;
  margin-top: 18px;
`;

export const RequestModalSubtitle = styled(Typography)`
  && {
    font-weight: bold;
    font-size: 24px;
    line-height: 23px;
    color: white;
    background: -webkit-linear-gradient(
      180deg,
      ${blueColors.blue20} -5.62%,
      ${highlightPurple} 45.92%,
      ${highlightBlue} 103.12%
    );
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    margin-right: 12px;
  }
`;

export const RequestModalTextareaWrapper = styled.div`
  margin-top: 42px;
  color: ${greyColors.grey250};
  background: ${greyColors.grey910};
  border-radius: 6px;
  padding: 15px 18px;
`;

export const RequestModalRolesSubtitle = styled(Typography)`
  && {
    font-size: 14px;
    font-weight: 500;
    font-family: 'Space Grotesk';
    color: ${blueColors.blue20};
    margin-bottom: 12px;
  }
`;

export const RequestModalTextarea = styled(TextareaAutosize)`
  color: ${greyColors.grey250};
  border-radius: 6px;
  background: ${greyColors.grey910};
  width: 100%;
  font-family: 'Space Grotesk';
  font-size: 14px;
  font-weight: 400;
  border: none;
  resize: none;

  &:focus {
    outline: none;
  }
`;

export const RequestModalRolesAbilityColumns = styled.div`
  display: inline-block;
  flex-direction: column;
  flex: 1;
  justify-content: flex-start;
`;

export const RequestModalShowRole = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${greyColors.grey920};
  margin: 8px;
  margin-top: 18px;
  border-radius: 8px;
  padding: 12px;
`;

export const RequestModalRolesAbilityRows = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: flex-start;
  margin-bottom: 12px;
`;

export const RequestModalRolesAbilityCheckIcon = styled(CheckMarkIcon)`
  width: 24px;
  height: 24px;
  padding: 2px;
  background-color: ${greyColors.grey78};
  border-radius: 4px;
  margin-right: 16px;
`;

export const RequestModalRolesAbilityCloseIcon = styled(CloseModalIconRed)`
  width: 24px;
  height: 24px;
  background-color: ${greyColors.grey78};
  border-radius: 4px;
  margin-right: 16px;
`;

export const RequestModalRolesAbilityText = styled(Typography)`
  && {
    font-family: 'Space Grotesk';
    font-size: 15px;
    font-weight: 700;
    color: ${palette.white};
    white-space: nowrap;
  }
`;

export const RequestModalButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: flex-end;
  align-items: center;
  background: ${palette.black97};
  padding: 24px;
`;

export const RequestModalTitle = styled(Typography)`
  && {
    font-family: 'Space Grotesk';
    font-size: 24px;
    font-weight: 700;
    color: ${palette.white};
    white-space: nowrap;
  }
`;

export const RequestModalCloseIcon = styled(CloseModalIcon)`
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

export const RequestModalBackButton = styled(ChevronLeft)`
  background: black;
  width: 32px;
  height: 32px;
  padding: 8px;
  border-radius: 6px;
  margin-right: 12px;
  path {
    fill: white;
  }
  :hover {
    background: rgba(122, 122, 122, 0.2);
  }
`;

export const RequestModalBox = styled.div`
  && {
    background-color: ${greyColors.grey98};
  }
`;
