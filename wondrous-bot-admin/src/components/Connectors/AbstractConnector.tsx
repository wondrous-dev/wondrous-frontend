/*
DEPRECATED
*/
import { ButtonBase, CircularProgress } from "@mui/material";
import useWonderWeb3 from "services/web3/useWonderWeb3";
import connectors, { ConnectorName } from "services/web3/connectors";
import { ErrorTypography, SuccessTypography } from "components/Login/styles";
import { RoundedSecondaryButton } from "components/Shared/styles";

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

  const currentConnector = connectors[connectorName];

  const content = () => {
    if (notSupportedChain)
      return (
        <>
          {icon}
          {showText ? <ErrorTypography padding="0 10px">Change to Mainnet or Supported Newtork</ErrorTypography> : null}
        </>
      );
    if (connecting && connector === currentConnector)
      return (
        <>
          <CircularProgress style={{ borderRadius: "50%" }} />
          {showText ? <SuccessTypography padding="0 10px">Continue on your wallet</SuccessTypography> : null}
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
    <ButtonBase style={style} onClick={() => activateAndStore(connectorName)}>
      {isActivating ? <CircularProgress style={{ borderRadius: "50%" }} /> : <>{content()}</>}
    </ButtonBase>
  );
}
