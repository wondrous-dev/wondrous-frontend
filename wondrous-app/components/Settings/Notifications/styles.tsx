import React from 'react';
import styled from 'styled-components';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import Checkbox from '@mui/material/Checkbox';
import palette from 'theme/palette';
import { Button } from '../../Common/button';

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
    background: #3f3f45;
    border-radius: 8px;
    margin: 24px 0 0;
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
  },
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

export const ExplanationText = styled(Typography)`
  && {
    color: rgba(196, 196, 196, 1);
    font-size: 14px;
    line-height: 20px;
    margin-top: 8px;
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

export const DiscordIntegrationStyle = {
  fontWeight: 500,
  fontSize: '24px',
  marginBottom: '10px',
  backgroundImage: `linear-gradient(270deg, ${palette.blue20} -5.62%, ${palette.highlightPurple} 45.92%, ${palette.highlightBlue} 103.12%)`,
  color: 'transparent',
  backgroundClip: 'text',
};

export const GuildNameStyle = {
  color: palette.white,
  fontWeight: 500,
  background: `linear-gradient(266.31deg,${palette.highlightPurple} 1.4%,${palette.orange90} 119.61%)`,
  borderRadius: '6px',
  height: 'fit-content',
  marginLeft: '10px',
};

const styles = {
  divider: {
    backgroundColor: palette.grey85,
    margin: '12px 0'
  },
  discordConnection: {
    backgroundColor: palette.black90,
  },
};

export default styles;
