import { useEffect, useState } from 'react';
import { Button } from '@components/Common/button';
import { CircularProgress } from '@material-ui/core';
import { useWonderWeb3 } from '@services/web3';
import { PaddedParagraph } from '@components/Common/text';
import connectors, { ConnectorName } from '@services/web3/connectors';

export interface WonderAbstractConnectorProps {
  connectorName: ConnectorName;
  buttonContent: React.ReactNode;
  icon?: React.ReactNode;
  style?: any;
}

export default function WonderAbstractConnector({
  connectorName,
  buttonContent,
  icon = null,
  style,
}: WonderAbstractConnectorProps) {
  const { connector, activateAndStore, error, isActivating, notSupportedChain, connecting } = useWonderWeb3();

  const disabled = !!isActivating || !!error || notSupportedChain || connecting;
  const currentConnector = connectors[connectorName];

  const content = () => {
    if (notSupportedChain)
      return (
        <>
          {icon}
          <PaddedParagraph padding="0 10px">Change the Network to Mainnet or Polygon</PaddedParagraph>
        </>
      );
    if (connecting && connector === currentConnector)
      return (
        <>
          <CircularProgress size={14} />
          <PaddedParagraph padding="0 10px">Continue on your wallet</PaddedParagraph>
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
    <Button style={style} disabled={disabled} onClick={() => activateAndStore(connectorName)}>
      {isActivating ? <CircularProgress /> : <>{content()}</>}
    </Button>
  );
}
