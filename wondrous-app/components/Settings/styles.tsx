import React from 'react';
import styled from 'styled-components';
import SnackbarComp from '@mui/material/Snackbar';
import { Button as MuiButton, ButtonBase, InputBase, ListItemIcon, Typography } from '@material-ui/core';
import { ListItemButton } from '@mui/material';
import { Button } from '../Common/button';
import { LogoSquare } from '../Common/ci';
import LogoutIcon from '../Icons/logout';
import { GradientHighlightHorizontal } from '../Common/gradients';
import { Discord } from '../Icons/discord';
import { Black, White } from '../../theme/colors';

export const SettingsContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 100vh;
  display: flex;
  background: #0f0f0f;
`;

export const SettingsSidebar = styled.div`
  margin: 70px 0 0 80px;
  min-width: 350px;
  width: 350px;
  padding: 55px 20px 50px 35px;
  background: linear-gradient(180deg, #1e1e1e 0%, #141414 100%);
`;

export const SettingsSidebarContainer = styled.div`
  height: 670px;
  width: 100%;
`;

export const SettingsSidebarHeader = styled.div`
  height: 44px;
  width: 100%;
  display: flex;
  align-items: center;
`;

export const SettingsSidebarHeaderLogo = styled(LogoSquare)`
  && {
    width: 44px;
    height: 44px;
    margin-right: 15px;
  }
`;

export const SettingsSidebarHeaderTitle = styled(Typography)`
  && {
    font-weight: bold;
    font-size: 18px;
    line-height: 23px;
    color: #ffffff;
  }
`;

export const SettingsSidebarTabsSection = styled.div`
  height: 100%;
  padding-top: 50px;
`;

export const SettingsSidebarTabsSectionLabel = styled(Typography)`
  && {
    font-weight: 500;
    font-size: 14px;
    line-height: 18px;
    letter-spacing: 0.01em;
    color: #ccbbff;
    margin-bottom: 25px;
  }
`;

export const SettingsSidebarTabsListContainer = styled.div`
  height: 100%;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
`;

export const SettingsSidebarTabsListItemButtonWrapper = styled.div`
  width: 100%;
  padding: 2px;
  border-radius: 2px;
  background: ${(props) => (props.active ? GradientHighlightHorizontal : 'transparent')};
`;

export const SettingsSidebarTabsListItemButton = styled(ListItemButton)({
  '&.MuiListItemButton-root': {
    width: '100%',
    height: 45,
    borderRadius: 2,
    padding: 10,
    justifyContent: 'left',
  },

  '&.Mui-selected': {
    background: '#101010 !important',

    '&:hover': {
      background: '#101010 !impotrant',
    },
  },
});

export const SettingsSidebarTabsListItemIcon = styled(ListItemIcon)`
  && {
    width: 10px;
  }
`;

export const SettingsSidebarTabsListItemText = styled(Typography)`
  && {
    font-size: 15px;
    line-height: 19px;
    letter-spacing: 0.01em;
    color: #ffffff;
  }
`;

export const SettingsSidebarLogoutButton = styled(MuiButton)`
  && {
    width: 100%;
    height: 45px;
    border-radius: 2px;
    padding: 0;
    justify-content: left;

    &:hover {
      background: #101010;
    }
  }
`;

export const SettingsSidebarLogoutButtonIcon = styled(LogoutIcon)`
  && {
    margin-right: 15px;
  }
`;

export const SettingsSidebarLogoutButtonText = styled(SettingsSidebarTabsListItemText)`
  && {
    margin-left: 15px;
  }
`;

export const SettingsContentBlock = styled.div`
  width: 100%;
  height: 100%;
  padding: 140px 120px;
  background-color: #0f0f0f;
  overflow-y: auto;
  min-height: 100vh;
`;

//headerBlock.tsx styles
export const SettingsHeaderBlock = styled.div`
  position: relative;
  width: 100%;
  height: 70px;
  display: flex;
  align-items: center;
`;

export const SettingsHeaderContent = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-left: 27px;
`;

export const SettingsHeaderTitle = styled(Typography)`
  && {
    font-weight: 500;
    font-size: 28px;
    line-height: 36px;
    display: flex;
    align-items: center;
    color: #ffffff;
  }
`;

export const SettingsHeaderText = styled(Typography)`
  && {
    width: 100%;
    font-size: 15px;
    line-height: 19px;
    letter-spacing: 0.01em;
    color: #ffffff;
    display: flex;
    justify-content: space-between;
  }
`;

//general settings styles
export const GeneralSettingsContainer = styled.div`
  height: 100%;
  width: 555px;
`;

export const GeneralSettingsInputsBlock = styled.div`
  padding: 30px 0;
  border-bottom: 1px solid #363636;
`;

export const GeneralSettingsDAONameBlock = styled.div`
  width: 100%;
  height: 70px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  margin-bottom: 28px;
`;

export const LabelBlock = styled(Typography)`
  && {
    font-weight: 500;
    font-size: 14px;
    line-height: 18px;
    letter-spacing: 0.01em;
    color: #ccbbff;
    margin-bottom: 10px;
  }
`;

export const GeneralSettingsDAONameInput = styled(InputBase)`
  && {
    width: 100%;
    height: 40px;
    border: 1px solid #4b4b4b;
    border-radius: 6px;

    font-size: 14px;
    line-height: 21px;
    letter-spacing: 0.01em;
    color: #c4c4c4;
    padding: 10px 15px;
  }
`;

export const GeneralSettingsDAODescriptionBlock = styled.div`
  position: relative;
`;

export const GeneralSettingsDAODescriptionInput = styled(GeneralSettingsDAONameInput)`
  && {
    height: 80px;
    font-size: 14px;
    line-height: 21px;
    letter-spacing: 0.01em;
    color: #c4c4c4;
    padding: 10px 15px;
  }
`;

export const GeneralSettingsDAODescriptionInputCounter = styled(Typography)`
  && {
    position: absolute;
    bottom: 10px;
    right: 20px;

    font-size: 12px;
    line-height: 19px;
    letter-spacing: 0.01em;
    color: #7a7a7a;
  }
`;

//socials block
export const GeneralSettingsSocialsBlock = styled.div`
  padding: 30px 0 15px;
  border-bottom: 1px solid #363636;
`;

export const GeneralSettingsSocialsBlockWrapper = styled.div``;

export const GeneralSettingsSocialsBlockRow = styled.div`
  width: 100%;
  display: flex;
  margin-bottom: 15px;
`;

export const GeneralSettingsSocialsBlockRowLabel = styled.div`
  padding: 7px 12px;
  background-color: #1c1c1c;
  border-radius: 4px;

  //text
  font-size: 14px;
  line-height: 18px;
  letter-spacing: 0.01em;
  text-decoration-line: underline;
  color: #ccbbff;
  margin-right: 10px;
`;

//integrations block
export const GeneralSettingsIntegrationsBlock = styled.div`
  width: 100%;
  padding: 28px 0;
  border-bottom: 1px solid #363636;
`;

export const GeneralSettingsIntegrationsBlockButtonIcon = styled(Discord)`
  && {
    width: 27px;
    height: 20px;
    color: #00baff;
    margin-right: 12px;
  }
`;

export const GeneralSettingsIntegrationsBlockButton = styled(Button)`
  && {
    max-width: 206px;
  }
`;

//buttons block
export const GeneralSettingsButtonsBlock = styled.div`
  padding: 30px 0;
  display: flex;
`;

export const GeneralSettingsResetButton = styled(MuiButton)`
  && {
    width: 177px;
    //height: 40px;
    height: 50px;
    background: #232323;
    border-radius: 234px;

    //text
    font-weight: 500;
    font-size: 16px;
    line-height: 150%;
    color: #ffffff;
  }
`;

export const GeneralSettingsSaveChangesButton = styled(Button)`
  && {
    width: 160px;
    margin-left: 22px;
  }
`;

//imageUpload.tsx section
export const ImageUploadBlock = styled.div`
  width: 100%;
  padding: 30px 0;
  border-bottom: 1px solid #363636;
`;

export const ImageUploadRecommendText = styled(Typography)`
  && {
    font-size: 12px;
    line-height: 15px;
    color: #c4c4c4;
    margin-bottom: 6px;
  }
`;

export const ImageUploadBlockActivitySection = styled.div`
  display: flex;
  justify-content: left;
  flex-direction: column;
`;

export const ImageUploadBlockInputWrapper = styled.div``;

export const ImageUploadBlockInputButton = styled.input`
  position: absolute;
  color: deepskyblue;
  background-color: transparent;
  border-bottom: 1px solid deepskyblue;
  cursor: pointer;
  display: none;
`;

export const ImageUploadBlockInputLabel = styled.label`
  font-size: 14px;
  line-height: 19px;
  letter-spacing: 0.01em;
  text-decoration-line: underline;
  color: #00baff;
  cursor: pointer;
`;

export const ImageUploadBlockUploadedImg = styled.img`
  margin: 20px 0 10px;
  border-radius: 4px;
`;

export const ImageUploadBlockRemoveButton = styled(MuiButton)`
  && {
    font-size: 12px;
    line-height: 15px;
    color: #cb3340;
    width: 50px;
    padding: 0 !important;
    min-width: 0 !important;
  }
`;

//LinkSquareIcon.tsx
export const LinkSquareIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: #1c1c1c;
  border-radius: 3px;
  margin-right: 30px;
  padding: 10px;
`;

//InputField.tsx
export const LinkInputField = styled(InputBase)`
  && {
    width: 333px;
    height: 32px;
    border-radius: 6px;
    border: 1px solid #4b4b4b99;
    padding-left: 15px;

    //text
    font-weight: 500;
    font-size: 15px;
    line-height: 19px;
    letter-spacing: 0.01em;
    text-decoration-line: underline;
    color: #00baff;
  }
`;

export const Snackbar = styled(SnackbarComp)`
  .MuiPaper-elevation {
    background: rgb(0, 67, 61);
    color: white;
  }
`;

export const DiscordText = styled(Typography)`
  && {
    font-size: 16px;
    color: ${White};
    margin-bottom: 8px;
  }
`;

export const LabelBlockText = styled(Typography)`
  && {
    color: ${White};
    font-family: Space Grotesk;
    font-size: 14px;
    margin-bottom: 12px;
  }
`;

export const AddGuildButton = styled(ButtonBase)`
  && {
    background: #4b4b51;
    border-radius: 8px;
    width: 100%;
    padding: 8px;
    height: 40px;
    display: flex;
    align-items: center;
  }
`;
