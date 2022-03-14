import { PaddedParagraph } from '@components/Common/text';
import WonderAbstractConnector from './AbstractConnector';
import { WalletConnect } from '@components/Icons/walletconnect';

export default function WalletConnectConnector({ text = 'Log in with WalletConnect' }: { text?: string }) {
  return (
    <WonderAbstractConnector
      connectorName="walletConnect"
      icon={<WalletConnect height="18" width="17" />}
      buttonContent={<PaddedParagraph padding="0 10px">{text}</PaddedParagraph>}
    />
  );
}
