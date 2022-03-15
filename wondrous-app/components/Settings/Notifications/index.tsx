import React, { useState } from 'react';

import { SettingsWrapper } from '../settingsWrapper';
import { NotificationOutlineSettings } from '../../Icons/notifications';
import { HeaderBlock } from '../headerBlock';
import { GeneralSettingsContainer, GeneralSettingsIntegrationsBlock, LabelBlock, LabelBlockText } from '../styles';
import Link from 'next/link';
import { HighlightBlue } from '../../../theme/colors';

const Notifications = ({ orgId }) => {
  return (
    <SettingsWrapper>
      <HeaderBlock
        icon={<NotificationOutlineSettings width="32" height="32" />}
        title="Notifications"
        description="Manage notifications"
      />
      <GeneralSettingsContainer></GeneralSettingsContainer>
      <GeneralSettingsIntegrationsBlock>
        <LabelBlock>Integrations</LabelBlock>
        <LabelBlockText>
          To post notifications in your Discord server, follow
          <Link href="/discord-notification-setup">
            <a
              target="_blank"
              style={{
                color: HighlightBlue,
                marginLeft: '4px',
              }}
            >
              these instructions
            </a>
          </Link>
        </LabelBlockText>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        ></div>
      </GeneralSettingsIntegrationsBlock>
    </SettingsWrapper>
  );
};

export default Notifications;
