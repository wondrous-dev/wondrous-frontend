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
import { SafeImage } from 'components/Common/Image';
import styled from 'styled-components';
import palette from 'theme/palette';
import typography from 'theme/typography';
import { Button } from '../Common/button';
import { Discord } from '../Icons/discord';
import { Twitter } from '../Icons/twitter';

export const SettingsContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  min-height: 100vh;
  display: flex;
  background: #0f0f0f;
`;

export const SettingsSidebar = styled.div`
  background: ${({ theme }) => theme.palette.black92};
  flex-direction: column;
  gap: 28px;
  height: 100%;
  overflow-y: auto;
  padding: 24px;
  padding-top: 94px;
  position: fixed;
  width: 260px;
  display: flex;
  ${({ minimized }) => minimized && `left: -100%`};
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
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 20px;
  }
`;

export const SettingsSidebarTabsListItem = styled(ListItem)`
  && {
    width: 100%;
    height: 32px;
    padding: 1px;
    border-radius: 4px;
    background: transparent;
    background: ${({ active }) => active && 'linear-gradient(90.03deg, #00baff 0.03%, #7427ff 98.82%)'};
    cursor: pointer;
    :hover {
      background: #313131;
    }
  }
`;

export const ItemButtonInner = styled.div`
  border-radius: 3px;
  background: transparent;
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 9px;
  padding: 8px;
  padding-left: 0px;
  background: ${({ active }) => active && '#313131'};
  ${SettingsSidebarTabsListItem}:hover & {
    background: #313131;
  }
`;

export const SettingsSidebarTabsListItemIcon = styled.div`
  && {
    min-width: 0;
    width: 22px;
    height: 22px;
    background: #313131;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    svg {
      width: 12px;
      height: auto;
    }
  }
  & path {
    stroke: #ffffff;
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
    color: ${palette.white};
    text-decoration: none;
    font-size: 15px;
    font-weight: ${(props) => (props.active ? '600' : '400')};
  }
`;

export const SettingsContentBlock = styled.div`
  background-color: #0f0f0f;
  height: 100%;
  overflow-y: auto;
  padding-left: 380px;
  padding-top: 140px;
  padding-right: 120px;
  width: 100%;
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
    useNextImage={false}
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
export const ArchivedPodIndicatorText = styled(Typography)`
  && {
    font-family: 'Space Grotesk';
    font-size: 16px;
    font-weight: 400;
    color: ${palette.red200};
  }
`;

export const SettingsDaoPodIndicatorIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  background: ${({ color }) => color || '#0f0f0f'};
  width: 24px;
  height: 24px;
`;

// headerBlock.tsx styles
export const SettingsHeaderBlock = styled.div`
  position: relative;
  width: 100%;
  height: 70px;
  display: flex;
  align-items: center;
`;

export const SettingsHeaderContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 14px;
  flex: 1;
`;

export const SettingsHeaderTitle = styled.div`
  font-weight: 500;
  font-size: 28px;
  line-height: 36px;
  display: flex;
  align-items: center;
  color: #ffffff;
`;

export const SettingsHeaderText = styled(Typography)`
  && {
    width: 100%;
    font-size: 14px;
    letter-spacing: 0.01em;
    color: ${palette.grey250};
    display: flex;
    justify-content: space-between;
  }
`;

export const SettingsHeaderInviteButton = styled.button`
  display: flex;
  align-items: center;
  background: ${palette.highlightPurple};
  color: ${palette.white};
  font-size: 15px;
  font-weight: 700;
  line-height: 150%;
  padding: 10.5px 10px;
  outline: none;
  border: none;
  border-radius: 6px;
  cursor: pointer;
`;

export const SettingsHeaderInviteButtonIcon = styled.div`
  height: 25px;
  width: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #3d3d3d;
  border-radius: 1000px;
`;

export const SettingsHeaderActionText = styled(ButtonBase)`
  && {
    font-family: ${typography.fontFamily};
    font-size: 14px;
    line-height: 18px;
    letter-spacing: 0.01em;
    color: ${palette.highlightBlue};
  }
`;

// general settings styles
export const GeneralSettingsContainer = styled.div`
  height: 100%;
  width: 780px;
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
    color: ${palette.blue20};
    margin-bottom: 10px;
  }
`;

export const GeneralSettingsDAONameInput = styled(InputBase)`
  && {
    width: 100%;
    height: 40px;
    background: ${palette.black101};
    border-radius: 6px;

    font-size: 14px;
    line-height: 21px;
    letter-spacing: 0.01em;
    color: ${palette.white};
    padding: 10px 15px;
  }
`;

export const GeneralSettingsDAODescriptionBlock = styled.div`
  position: relative;
`;

export const GeneralSettingsDAODescriptionInputWrapper = styled.div`
  border: 1px solid pink;
  border: 1px solid #4b4b4b;
  border-radius: 6px;
`;

export const GeneralSettingsDAODescriptionInput = styled(GeneralSettingsDAONameInput)`
  && {
    height: 80px;
    font-size: 14px;
    line-height: 21px;
    letter-spacing: 0.01em;
    color: ${palette.white};
    padding: 10px 15px;
    border: none;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
  }
`;

export const GeneralSettingsDAODescriptionInputCounter = styled(Typography)`
  && {
    font-size: 12px;
    color: #7a7a7a;
    width: 100%;
    text-align: right;
    padding: 8px;
    background: ${palette.black101};
    border-bottom-left-radius: 6px;
    border-bottom-right-radius: 6px;
  }
`;

// socials block
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

export const GeneralSettingsSocialsInput = styled(GeneralSettingsDAONameInput)`
  && {
    color: ${palette.highlightBlue};
    font-weight: 500;
  }
`;

export const GeneralSettingsLinksInput = styled(GeneralSettingsSocialsInput)``;

// integrations block
export const GeneralSettingsIntegrationsBlock = styled.div`
  width: 100%;
  padding: 28px 0;
  border-bottom: 1px solid #363636;
`;

export const GeneralSettingsDiscordIcon = styled(Discord)`
  && {
    width: 27px;
    height: 20px;
    color: #00baff;
    margin-right: 12px;
  }
`;

export const GeneralSettingsTwitterIcon = styled(Twitter)`
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

export const GeneralSettingsVisibilityWrapper = styled.div`
  width: 100%;
  max-width: 380px;
  margin-top: 32px;
`;

// buttons block
export const GeneralSettingsButtonsBlock = styled.div`
  padding: 30px 0;
  display: flex;
`;

export const GeneralSettingsResetButton = styled(MuiButton)`
  && {
    width: 191px;
    height: 40px;
    background: #232323;
    border-radius: 234px;

    //text
    font-weight: 500;
    font-size: 16px;
    line-height: 150%;
    color: #ffffff;
    text-transform: none;
    font-family: Space Grotesk;
  }
`;

export const GeneralSettingsSaveChangesButton = styled(Button)`
  && {
    width: 191px;
    margin-left: 22px;
    height: 40px;
    font-family: Space Grotesk;
    min-height: 40px;
  }
`;

// imageUpload.tsx section
export const ImageUploadBlock = styled.div`
  width: 100%;
  padding: 30px 0;
  border-bottom: 1px solid #363636;
`;

export const ImageUploadRecommendText = styled(Typography)`
  && {
    font-size: 12px;
    line-height: 15px;
    color: ${palette.white};
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
  object-fit: contain;
`;

export const ImageUploadBlockRemoveButton = styled(MuiButton)`
  && {
    font-size: 12px;
    line-height: 15px;
    color: #cb3340;
    padding: 0 !important;
    min-width: 0 !important;
    text-decoration: underline;
  }
`;
export const CloseButton = styled.button`
  position: absolute;
  right: -8px;
  top: 12px;
  cursor: pointer;
  background: #1c1c1c;
  border-radius: 50%;
  display: flex;
  padding: 3px;
  border: 1px solid #363636;

  &:hover {
    background: #363636;
  }
`;

export const UploadedImage = styled.div`
  position: relative;
  width: fit-content;
`;

// LinkSquareIcon.tsx
export const LinkSquareIconWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background: #1c1c1c;
  border-radius: 3px;
  margin-right: 30px;
  padding: 10px;
`;

// InputField.tsx
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
    color: ${palette.blue20};
    margin-bottom: 8px;
  }
`;

export const LabelBlockText = styled(Typography)`
  && {
    color: ${palette.white};
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
