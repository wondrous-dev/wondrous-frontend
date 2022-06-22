import React from 'react';
import { useRouter } from 'next/router';
import SideBarComponent from 'components/SideBar';
import HeaderComponent from 'components/Header';
import { SettingsContainer } from 'components/Settings/styles';
import DiscordNotificationSetup from 'components/DiscordNotificationSetup';

const DiscordNotificationSetupPage = () => {
  const router = useRouter();
  const { orgUsername } = router.query;
  return (
    <>
      <HeaderComponent />
      <SideBarComponent />
      <SettingsContainer
        style={{
          flexDirection: 'column',
          paddingTop: '120px',
          paddingLeft: '200px',
          paddingBottom: '100px',
        }}
      >
        <DiscordNotificationSetup orgUsername={orgUsername} />
      </SettingsContainer>
    </>
  );
};

export default DiscordNotificationSetupPage;
