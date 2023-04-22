// import { Metamask } from 'components/Icons/metamask';
import Metamask from 'components/Icons/Login/metamask.svg';
import { SuccessTypography } from 'components/Login/styles';
import WonderAbstractConnector from '../AbstractConnector';

export default function MetaMaskConnector({
  text = 'Log in with MetaMask',
  style,
}: {
  text?: string;
  style?: any;
}) {
  return (
    <WonderAbstractConnector
      connectorName='injected'
      icon={<img src={Metamask}/>}
      showText={false}
      buttonContent={null}
      style={style}
    />
  );
}
