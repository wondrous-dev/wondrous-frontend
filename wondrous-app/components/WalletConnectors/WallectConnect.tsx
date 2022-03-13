import { PaddedParagraph } from '@components/Common/text';
import WonderAbstractConnector from './AbstractConnector';
import { WalletConnect } from '@components/Icons/walletconnect';
import { walletConnect } from '@services/web3/connectors';

export default function WalletConnectConnector({ text = 'Log in with WalletConnect' }: { text?: string }) {
  return (
    <WonderAbstractConnector
      connector={walletConnect}
      icon={<WalletConnect height="18" width="17" />}
      buttonContent={<PaddedParagraph padding="0 10px">{text}</PaddedParagraph>}
    />
  );
}
