import { SafeImage } from '@components/Common/Image';
import {
  Box,
  Button as MuiButton,
  ButtonBase,
  InputBase,
  List,
  ListItem,
  ListItemIcon,
  Typography,
} from '@mui/material';
import SnackbarComp from '@mui/material/Snackbar';
import styled from 'styled-components';
import { White } from '../../theme/colors';
import { Button } from '../Common/button';
import { Discord } from '../Icons/discord';

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
  }
`;

export const SettingsSidebarTabsListContainer = styled(List)`
  && {
    margin-top: 20px;
  }
  & > li {
    margin-top: 2px;
  }
`;

export const SettingsSidebarTabsListItem = styled(ListItem)`
  && {
    background: ${(props) => props.active && '#313131'};
    display: flex;
    align-items: center;
    justify-content: flex-start;
    border-radius: 4px;
    width: 100%;
    height: 40px;
    padding: 4px;
    :hover {
      cursor: pointer;
      background: linear-gradient(270deg, #262626 0%, #1c1c1c 100%);
      outline: 1px solid #313131;
    }
    > * {
      margin-left: 10px;
    }
    > :first-child {
      margin-left: 0;
    }
  }
`;

export const SettingsSidebarTabsListItemIcon = styled(ListItemIcon)`
  && {
    min-width: 0;
    width: 32px;
    height: 32px;
    background: #0f0f0f;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  & path {
    stroke: ${(props) => props.active && '#30c7ff'};
  }
  ${SettingsSidebarTabsListItem}:hover & {
    path {
      stroke: #30c7ff;
    }
  }
`;

export const SettingsSidebarTabsListItemText = styled(Typography)`
  && {
    font-family: 'Space Grotesk';
    color: ${White};
    text-decoration: none;
    font-size: 15px;
    font-weight: ${(props) => (props.active ? '600' : '400')};
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

export const SettingsDaoPodIndicator = styled(Box)`
  && {
    display: ${({ pod }) => (pod ? 'flex' : 'none')};
    background: #1c1c1c;
    max-width: fit-content;
    align-items: center;
    padding: 8px;
    border-radius: 4px;
    > * {
      margin-left: 12px;
    }
    > :first-child {
      margin-left: 0;
    }
    margin-bottom: 32px;
  }
`;

export const SettingsDaoPodIndicatorOrgProfile = styled((props) => (
  <SafeImage
    style={{
      width: '24px',
      height: '24px',
    }}
    {...props}
  />
))``;

export const SettingsDaoPodIndicatorText = styled(Typography)`
  && {
    font-family: 'Space Grotesk';
    font-size: 16px;
    font-weight: 400;
    color: #ffffff;
  }
`;

export const SettingsDaoPodIndicatorIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: ${({ color }) => (color ? color : '#0f0f0f')};
  width: 24px;
  height: 24px;
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
    font-family: Space Grotesk;
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
    font-size: 14px;
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
