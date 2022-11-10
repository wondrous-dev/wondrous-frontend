import { useState, useEffect } from 'react';
import Wallet from 'components/Common/Wallet';
import { CHAIN_TO_CHAIN_DIPLAY_NAME } from 'utils/web3Constants';
import InfoIcon from 'components/Icons/infoIcon';
import { useWonderWeb3 } from 'services/web3';
import CloseModalIcon from 'components/Icons/closeModal';
import {
  ConnectWalletWidgetWrapper,
  ConnectWalletHeader,
  ConnectWalletHeaderLabel,
  ConnectWalletMessage,
  DismissButton,
  DismissButtonWrapper,
} from './styles';

const DISMISSED_VALUE = '0';

const LOCAL_STORAGE_KEY = 'wonder-address-widget';

const ConnectWallet = () => {
  const [isDismissed, setIsDismissed] = useState(true);
  const wonderWeb3 = useWonderWeb3();

  useEffect(() => {
    setIsDismissed(localStorage.getItem(LOCAL_STORAGE_KEY) === DISMISSED_VALUE);
  }, []);

  const dismissWidget = () => {
    setIsDismissed(true);
    localStorage.setItem(LOCAL_STORAGE_KEY, DISMISSED_VALUE);
  };

  if (isDismissed || wonderWeb3.address) return null;
  return (
    <ConnectWalletWidgetWrapper>
      <ConnectWalletHeader>
        <InfoIcon />
        <ConnectWalletHeaderLabel>
          {wonderWeb3.address
            ? `Connected to ${CHAIN_TO_CHAIN_DIPLAY_NAME[wonderWeb3.chain]} chain`
            : 'No wallet connected'}
        </ConnectWalletHeaderLabel>
        <DismissButtonWrapper>
          <DismissButton type="button" onClick={dismissWidget}>
            <CloseModalIcon />
          </DismissButton>
        </DismissButtonWrapper>
      </ConnectWalletHeader>
      <ConnectWalletMessage>
        {wonderWeb3?.address
          ? `Address: ${wonderWeb3?.address}`
          : 'You must have your wallet connected to send and receive payments.'}
      </ConnectWalletMessage>
      {!wonderWeb3.address && <Wallet />}
    </ConnectWalletWidgetWrapper>
  );
};

export default ConnectWallet;
