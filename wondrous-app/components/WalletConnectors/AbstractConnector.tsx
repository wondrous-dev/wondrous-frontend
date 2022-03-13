import { useEffect, useState } from 'react';
import { AbstractConnector } from '@web3-react/abstract-connector';
import { Button } from '@components/Common/button';
import useInjectedProviderListener from '@services/web3/hooks/useInjectedProviderListener';
import { CircularProgress } from '@material-ui/core';
import useWeb3 from '@services/web3/hooks/useWeb3';
import { useWonderWeb3 } from '@services/web3';
import { PaddedParagraph } from '@components/Common/text';

export interface WonderAbstractConnectorProps {
  connector: AbstractConnector;
  buttonContent: React.ReactNode;
  icon?: React.ReactNode;
}

export default function WonderAbstractConnector({
  connector: currentConnector,
  buttonContent,
  icon = null,
}: WonderAbstractConnectorProps) {
  const { connector, activate, error, isActivating, notSupportedChain, connecting } = useWonderWeb3();

  const connected = currentConnector === connector;

  const disabled = !!isActivating || !!error || notSupportedChain || connecting;

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
    <Button disabled={disabled} onClick={() => activate(currentConnector)}>
      {isActivating ? <CircularProgress /> : <>{content()}</>}
    </Button>
  );
}
