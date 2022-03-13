import { Metamask } from '@components/Icons/metamask';
import { PaddedParagraph } from '@components/Common/text';
import WonderAbstractConnector from './AbstractConnector';
import { injected } from '@services/web3/connectors';

export default function MetaMaskConnector({ text = 'Log in with MetaMask' }: { text?: string }) {
  return (
    <WonderAbstractConnector
      connector={injected}
      icon={<Metamask height="18" width="17" />}
      buttonContent={<PaddedParagraph padding="0 10px">{text}</PaddedParagraph>}
    />
  );
}
