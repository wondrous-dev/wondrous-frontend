import { Metamask } from 'components/Icons/metamask';
import { PaddedParagraph } from 'components/Common/text';
import WonderAbstractConnector from './AbstractConnector';

export default function MetaMaskConnector({ text = 'Log in with MetaMask', style }: { text?: string; style?: any }) {
  return (
    <WonderAbstractConnector
      connectorName="injected"
      icon={<Metamask height="18" width="17" />}
      buttonContent={<PaddedParagraph padding="0 10px">{text}</PaddedParagraph>}
      style={style}
    />
  );
}
