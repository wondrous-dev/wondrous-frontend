import EthereumIcon from 'components/Icons/ethereum';
import PolygonIcon from 'components/Icons/polygonMaticLogo.svg';
import ArbitrumIcon from 'components/Icons/arbitrum';
import Avalanche from 'components/Icons/Avalanche';
import Binance from 'components/Icons/binace';
import HarmonyIcon from 'components/Icons/harmony';
import BobaIcon from 'components/Icons/Boba';
import { Metamask } from 'components/Icons/metamask';
import { DefaultWalletTypeIcon, GnosisWalletTypeIcon } from 'components/Icons/walletSetupModalIcons';

const isInProduction = process.env.NEXT_PUBLIC_PRODUCTION;

export const DEFAULT_WALLET_TYPE = { label: 'Select Wallet Type', value: '', icon: <DefaultWalletTypeIcon /> };

export const WALLET_TYPE_OPTIONS = [
  { label: 'Gnosis multi-sig', value: 'gnosis', icon: <GnosisWalletTypeIcon /> },
  { label: 'Metamask', value: 'metamask', icon: <Metamask /> },
];

export const WALLET_TYPE = {
  GNOSIS: 'gnosis',
  METAMASK: 'metamask',
};

export const DEFAULT_WALLET_NETWORK = { label: 'Ethereum', value: 'ethereum', icon: <EthereumIcon /> };

export const WALLET_NETWORKS = [
  { label: 'Ethereum', value: 'ethereum', icon: <EthereumIcon /> },
  { label: 'Polygon', value: 'polygon', icon: <PolygonIcon /> },
  { label: 'Harmony', value: 'harmony', icon: <HarmonyIcon /> },
  { label: 'Boba', value: 'boba', icon: <BobaIcon /> },
  { label: 'Arbitrum', value: 'arbitrum', icon: <ArbitrumIcon /> },
  { label: 'BNB', value: 'bsc', icon: <Binance /> },
  { label: 'Avalanche', value: 'avalanche', icon: <Avalanche /> },
];

if (!isInProduction) {
  WALLET_NETWORKS.push({
    label: 'Ethereum Goerli',
    value: 'goerli',
    icon: <EthereumIcon />,
  });
}

export const EMPTY_ERROR = {
  safeAddressError: null,
};

export const WALLET_ALREADY_EXISTS_ERROR_MESSAGE = 'wallet already exist';
