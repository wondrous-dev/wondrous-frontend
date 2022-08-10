import { PaddedParagraph } from 'components/Common/text';
import { Coinbase } from 'components/Icons/coinbase';
import WonderAbstractConnector from './AbstractConnector';

export default function CoinbaseConnector({
  text = 'Log in with Coinbase Wallet',
  style,
}: {
  text?: string;
  style?: any;
}) {
  return (
    <WonderAbstractConnector
      connectorName="walletLink"
      icon={<Coinbase />}
      buttonContent={<PaddedParagraph>{text}</PaddedParagraph>}
      style={style}
      showText={!!text}
    />
  );
}
