import WonderAbstractConnector from '../AbstractConnector';
import Coinbase from 'components/Icons/Login/coinbase.svg';

export default function CoinbaseConnector({
  text = 'Log in with Coinbase Wallet',
  style,
}: {
  text?: string;
  style?: any;
}) {
  return (
    <WonderAbstractConnector
      connectorName='walletLink'
      icon={<img src={Coinbase} />}
      buttonContent={null}
      style={style}
      showText={!!text}
    />
  );
}
