import React from 'react';
import Wallets from 'components/Settings/WalletSetup';
import { withAuth } from 'components/Auth/withAuth';

const WalletSettingPage = () => {
  return <Wallets />;
};

export default withAuth(WalletSettingPage);
