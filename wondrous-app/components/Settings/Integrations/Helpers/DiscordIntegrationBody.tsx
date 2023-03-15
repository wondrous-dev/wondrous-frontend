import { Grid, Typography } from '@mui/material';
import { ButtonIcon } from 'components/Common/SidebarItem/styles';
import NotificationsIcon from 'components/Icons/Sidebar/notifications.svg';
import { MiniHeaderButton } from 'components/organization/wrapper/styles';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import palette from 'theme/palette';
import typography from 'theme/typography';
import { DiscordIntegrationPanel, Label } from '../styles';
import ConnectionContext from './ConnectionContext';

const DiscordIntegrationsBody = () => {
  const router = useRouter();
  const { data, orgId, podId } = useContext(ConnectionContext);
  const { isActive } = data;

  if (!isActive) {
    return null;
  }
  const handleClick = () => {
    if (podId) {
      router.push(`/pod/settings/${podId}/notifications`, undefined, {
        shallow: true,
      });
    } else {
      router.push(`/organization/settings/${orgId}/notifications`, undefined, {
        shallow: true,
      });
    }
  };

  if (isActive) {
    return (
      <Grid display="flex" direction="column" gap="14px" alignItems="flex-start">
        <Label>This integration is managing</Label>

        <DiscordIntegrationPanel>
          <Grid display="flex" gap="8px" alignItems="center">
            <ButtonIcon>
              <NotificationsIcon />
            </ButtonIcon>
            <Typography
              color={palette.white}
              fontFamily={typography.fontFamily}
              fontSize="13px"
              fontWeight={500}
              lineHeight="16px"
            >
              Notifications
            </Typography>
          </Grid>
          <MiniHeaderButton reversed onClick={handleClick}>
            Go to Notification Settings
          </MiniHeaderButton>
        </DiscordIntegrationPanel>
      </Grid>
    );
  }
};

export default DiscordIntegrationsBody;
