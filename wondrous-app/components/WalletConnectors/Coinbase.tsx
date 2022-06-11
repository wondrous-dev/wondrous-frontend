import { PaddedParagraph } from 'components/Common/text';
import WonderAbstractConnector from './AbstractConnector';
import { Coinbase } from 'components/Icons/coinbase';

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
      icon={<Coinbase/>}
      buttonContent={<PaddedParagraph padding="0 10px">{text}</PaddedParagraph>}
      style={style}
    />
  );
}
