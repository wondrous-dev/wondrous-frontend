import { Button } from 'components/Common/button';
import { CircularProgress } from '@mui/material';
import { useWonderWeb3 } from 'services/web3';
import { PaddedParagraph } from 'components/Common/text';
import connectors, { ConnectorName } from 'services/web3/connectors';

export interface WonderAbstractConnectorProps {
  connectorName: ConnectorName;
  buttonContent: React.ReactNode;
  icon?: React.ReactNode;
  style?: any;
  showText?: any;
}

export default function WonderAbstractConnector({
  connectorName,
  buttonContent,
  icon = null,
  style,
  showText,
}: WonderAbstractConnectorProps) {
  const { connector, activateAndStore, error, isActivating, notSupportedChain, connecting } = useWonderWeb3();

  const disabled = !!isActivating || !!error || notSupportedChain || connecting;
  const currentConnector = connectors[connectorName];

  const content = () => {
    if (notSupportedChain)
      return (
        <>
          {icon}
          {showText ? <PaddedParagraph padding="0 10px">Change to Mainnet or Supported Newtork</PaddedParagraph> : null}
        </>
      );
    if (connecting && connector === currentConnector)
      return (
        <>
          <CircularProgress style={{ borderRadius: '50%' }} />
          {showText ? <PaddedParagraph padding="0 10px">Continue on your wallet</PaddedParagraph> : null}
        </>
      );
    return (
      <>
        {icon}
        {buttonContent}
      </>
    );
  };

  return (
    <Button style={style} onClick={() => activateAndStore(connectorName)}>
      {isActivating ? <CircularProgress style={{ borderRadius: '50%' }} /> : <>{content()}</>}
    </Button>
  );
}
