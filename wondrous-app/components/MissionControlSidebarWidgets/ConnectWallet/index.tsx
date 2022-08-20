import Wallet, { CHAIN_TOOLTIP } from 'components/Common/Wallet';
import InfoIcon from 'components/Icons/infoIcon';
import { useWonderWeb3 } from 'services/web3';
import {
  ConnectWalletWidgetWrapper,
  ConnectWalletHeader,
  ConnectWalletHeaderLabel,
  ConnectWalletMessage,
} from './styles';

const ConnectWallet = () => {
  const wonderWeb3 = useWonderWeb3();

  return (
    <ConnectWalletWidgetWrapper>
      <ConnectWalletHeader>
        <InfoIcon />
        <ConnectWalletHeaderLabel>
          {wonderWeb3.address ? `Connected to ${CHAIN_TOOLTIP[wonderWeb3.chain]} chain` : 'No wallet connected'}
        </ConnectWalletHeaderLabel>
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
