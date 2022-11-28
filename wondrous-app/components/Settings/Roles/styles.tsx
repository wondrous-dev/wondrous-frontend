import React from 'react';
import styled from 'styled-components';
import { space } from 'styled-system';
import { InputBase, Switch, Typography } from '@mui/material';
import SnackbarComp from '@mui/material/Snackbar';

import { newDropdownStyles } from 'components/Common/DropdownSelect/styles';
import { BaseCard } from 'components/Common/card';
import { Button } from 'components/Common/button';
import Accordion from 'components/Common/Accordion';

import palette from 'theme/palette';
import typography from 'theme/typography';

export const RolesContainer = styled.div`
  width: 780px;

  ${newDropdownStyles}
`;

export const Box = styled.div`
  ${space}
`;

export const RolesInputsBlock = styled.div`
  padding: 30px 0 10px;
`;

export const RoleNameBlock = styled.div`
  width: 100%;
  height: 70px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  ${({ theme }) => theme.breakpoints.down('lg')} {
    height: 100%;
  }
`;

export const CreateRole = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

export const CreateRoleButton = styled(Button)`
  && {
    background: linear-gradient(
      270deg,
      ${palette.blue20} -5.62%,
      ${palette.highlightPurple} 45.92%,
      ${palette.highlightBlue} 103.12%
    );
    min-width: fit-content;
    padding: 1px;

    button {
      font-family: ${typography.fontFamily};
      font-weight: 600;
      padding: 9.5px 24px;
      min-width: min-content;
      ${({ theme }) => `
        background: ${theme.palette.background.default};
    `}
      transition: background 0.3s ease;

      &:hover {
        background: transparent;
      }
    }
  }
`;

export const DeleteButton = styled(Button)`
  && button {
    color: ${palette.red300};
    background: ${palette.grey950};
    font-family: ${typography.fontFamily};
    font-weight: 600;
    font-size: 16px;
    padding: 9px 24px;
    transition: background 0.3s ease;

    &:hover {
      background: ${palette.grey920};
    }
  }
`;

export const Permissions = styled.div`
  padding: 0 24px;
`;

export const RolePermissionsList = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 28px;
`;

export const Permission = styled.div`
  color: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: ${({ showBorder }) => (showBorder ? `1px solid ${palette.black91}` : 'none')};
`;

export const RoleTokenGatingWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 85px;

  &:not(:first-child) {
    border-top: 1px solid ${palette.black91};
  }
`;

export const PermissionTitle = styled.h5`
  color: ${palette.white};
  font-size: 16px;
  margin: 0;
  font-family: Space Grotesk;

  display: flex;
  align-items: center;
  gap: 10px;
`;

export const PermissionTitleLabel = styled(Typography)`
  && {
    font-size: 13px !important;
    font-weight: 600 !important;
    color: ${({ isInactive, isNone }) =>
      isInactive ? palette.red300 : isNone ? palette.grey250 : palette.green800} !important;
    background: ${({ isInactive, isNone }) =>
      isInactive ? palette.red850 : isNone ? palette.grey88 : palette.green720};
    padding: 4px;
    border-radius: 6px;
  }
`;

export const PermissionSubtitle = styled.div`
  font-size: 13px;
  color: #c4c4c4;
`;

export const PermissionFooter = styled.div`
  background: ${palette.black97};
  padding: 24px;
  display: flex;
  justify-content: flex-end;
  font-family: Space Grotesk;
`;

export const RoleNameInput = styled(InputBase)`
  && {
    width: 100%;
    background: ${palette.black101};
    color: ${palette.white};
    padding: 12px;
    border-radius: 6px;
    font-size: 15px;
    font-family: ${typography.fontFamily};
    max-height: 42px;

    input {
      padding: 0;
    }
  }
`;

export const LabelBlock = styled(Typography)`
  && {
    ${space};
    font-weight: 500;
    font-size: 14px;
    line-height: 18px;
    letter-spacing: 0.01em;
    color: ${palette.blue20};
    margin-bottom: 10px;
  }
`;

export const RoleAccordion = styled(Accordion)`
  && {
    border-radius: 6px;
    border: none !important;
    background: ${palette.black101};
    padding: 1px;
    opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
    transition: opacity 0.3s ease;
    margin-bottom: ${({ hasMarginBottom }) => (hasMarginBottom ? '28px' : '0')};

    p {
      color: ${palette.white};
      font-size: 15px;
      font-family: ${typography.fontFamily};
      font-weight: 400;
    }

    svg {
      background: ${palette.grey87};
      width: 24px;
      height: 24px;
      padding: 8.95px 6.5px;
      border-radius: 4px;
      stroke: ${palette.blue20};
    }
  }
`;

export const Snackbar = styled(SnackbarComp)`
  .MuiPaper-elevation {
    background: rgb(0, 67, 61);
    color: white;
  }
`;

export const Error = styled.h3`
  color: ${palette.red800};
  margin: 30px 0;
`;

export const TokenGatingButton = styled(CreateRoleButton)``;

export const ImportDiscordRoleButton = styled(CreateRoleButton)`
  && {
    width: fit-content;
    padding: 1px;
    margin-bottom: 28px;
    margin-top: 12px;

    button {
      padding: 8px 14px;
      ${({ theme }) => `
        background: ${theme.palette.background.default};
    `}
      transition: background 0.3s ease;
      display: flex;
      align-items: center;
      gap: 10px;

      &:hover {
        background: transparent;

        svg path {
          fill: ${palette.white};
        }
      }

      svg {
        margin-bottom: -2px;

        path {
          transition: fill 0.3s ease;
        }
      }
    }
  }
`;

export const TokenGatingButtonText = styled(Typography)`
  && {
    font-family: 'Space Grotesk';
    font-size: 15px;
    font-weight: 600;
    color: ${palette.white};
  }
`;

export const TitleLockIconWrapper = styled.div`
  display: flex;
  align-items: center;
  > * {
    margin-right: 10px;
  }

  svg {
    width: auto !important;
    height: auto !important;
    background: transparent !important;
  }
`;

export const TokenGatedRoleModal = styled(BaseCard)`
  width: 680px;
  position: absolute;
  left: 50%;
  top: 50%;
  height: 70%;
  transform: translate(-50%, -50%);
  overflow-y: scroll;
  z-index: 2100;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgb(20, 20, 20) !important;
  padding-bottom: 32px;
  &::-webkit-scrollbar {
    display: none;
    width: 0;
    height: 0;
  }
  /* Hide scrollbar for IE, Edge and Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
`;

export const DiscordRoleModal = styled(BaseCard)`
  width: 680px;
  position: absolute;
  left: 50%;
  top: 50%;
  height: 50%;
  transform: translate(-50%, -50%);
  overflow-y: scroll;
  z-index: 2100;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgb(20, 20, 20) !important;
  padding-bottom: 32px;
  &::-webkit-scrollbar {
    display: none;
    width: 0;
    height: 0;
  }
  /* Hide scrollbar for IE, Edge and Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
`;

export const TokenGatedRoleModalTitle = styled(Typography)`
  && {
    font-weight: 500;
    font-size: 18px;
    line-height: 18px;
    letter-spacing: 0.01em;
    color: #ccbbff;
  }
`;

export const DiscordElementWrapper = styled(Box)`
  && {
    background: ${palette.black90};
    border-radius: 6px;
    padding: 24px;
    margin-top: 10px;
    :hover {
      background: #474747 !important;
      cursor: pointer;
    }
  }
`;
