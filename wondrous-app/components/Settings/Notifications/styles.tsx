import React from 'react';
import styled from 'styled-components';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import palette from 'theme/palette';
import { Button } from 'components/Common/button';
import typography from 'theme/typography';
import PlusIcon from 'components/Icons/plus';

export const ConnectDiscordButton = styled(Button)`
  && {
    max-width: 206px;
  }
`;

export const TableValueText = styled(Typography)`
  && {
    color: #c4c4c4;
    font-size: 16px;
    font-height: 22px;
  }
`;

export const DiscordCard = styled(Grid)`
  && {
    border-radius: 8px;
    padding: 8px;
    width: 100%;
  }
`;

export const DiscordCardElement = styled(Grid)`
  width: 50%;
`;
export const DiscordCardElementDiv = styled.div`
  padding: 12px;
`;

export const DiscordChannelInfoDiv = styled.div`
  display: flex;
  align-items: center;
`;

export const DiscordCardText = styled(Typography)`
  && {
    font-family: Space Grotesk;
    color: ${palette.white};
    font-size: 14px;
    margin-bottom: 8px;
  }
`;

export const UserDiscordNotificationSettingsDiv = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 4px;
  justify-content: space-between;
  && .MuiSwitch-root {
    padding: 8px;
    width: 62px;
  }
`;

export const UserDiscordNotificationSettingsText = styled(Typography)`
  && {
    font-family: Space Grotesk;
    color: ${palette.white};
    font-size: 20px;
    font-weight: bold;
  }
`;

export const NotificationSettingsHeader = styled(Typography)`
  && {
    font-family: Space Grotesk;
    color: ${palette.white};
    font-size: 28px;
    font-weight: bold;
  }
`;

export const NotificationSettingsHeaderText = styled(Typography)`
  && {
    font-family: Space Grotesk;
    color: ${palette.grey250};
    font-size: 14px;
    font-weight: 400;
    margin-top: 20px;
  }
`;

export const LoggedInDiscordUserText = styled(Typography)`
  && {
    color: ${palette.white};
    font-size: 16px;
    font-family: Space Grotesk;
  }
`;

export const DiscordLink = styled.a`
  color: ${palette.highlightBlue};
  text-decoration: none;
  :hover {
    text-decoration: underline;
  }
`;

export const UserDiscordNotificationSettingsContainer = styled.div`
  border-bottom: 1px solid #363636;
  padding-bottom: 20px;
`;

export const NotificationSettingsHeaderWrapper = styled.div`
  border-bottom: 1px solid #363636;
  padding-bottom: 20px;
  margin-bottom: 30px;
`;

export const NotificationSettingsCategoryLabel = styled.h3`
  color: ${palette.blue20};
  font-weight: 700;
`;

export const NotificationSettingLabel = styled.h4`
  color: ${palette.white};
  font-weight: 500;
  padding-left: 10px;
  display: inline-block;
  line-height: 4px;
`;

export const NotificationSettingListItem = styled.li`
  list-style: none;
`;

export const NotificationSettingsButtonsBlock = styled.div`
  display: flex;
  justify-content: end;
  padding: 30px 0px;
`;

export const AddServerButton = styled.button`
  color: ${palette.blue20};
  width: 100%;
  height: 36px;
  border-radius: 6px;
  border: 0;
  background-color: ${palette.grey920};
  font-family: ${typography.fontFamily};
  font-size: 14px;
  font-weight: 500;
  line-height: 16px;
  display: flex;
  justify-content: center;
  gap: 10px;
  align-items: center;
  cursor: pointer;
  &:hover {
    background-color: ${palette.grey950};
  }
`;

const PlusIconWrapper = styled.div`
  border: 1px solid ${palette.highlightBlue};
  height: 24px;
  width: 24px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 100%;
`;

export const AddServerPlusIcon = () => (
  <PlusIconWrapper>
    <PlusIcon fill={palette.highlightBlue} />
  </PlusIconWrapper>
);

export const RemoveDiscordServer = styled(AddServerButton)`
  && {
    width: fit-content;
  }
`;

const styles = {
  divider: {
    backgroundColor: palette.grey85,
    margin: '12px 0',
    discordConnection: {
      backgroundColor: palette.black90,
    },
  },
  connectDiscord: {
    backgroundColor: palette.black90,
    borderRadius: '6px',
    padding: '15px',
    gap: '10px',
    alignItems: 'center',
    flexWrap: 'nowrap',
  },
};

export default styles;
