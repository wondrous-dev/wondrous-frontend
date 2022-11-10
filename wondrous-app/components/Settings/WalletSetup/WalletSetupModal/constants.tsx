import EthereumIcon from 'components/Icons/ethereum';
import { Metamask } from 'components/Icons/metamask';
import { DefaultWalletTypeIcon, GnosisWalletTypeIcon } from 'components/Icons/walletSetupModalIcons';

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

export const EMPTY_ERROR = {
  safeAddressError: null,
};

export const WALLET_ALREADY_EXISTS_ERROR_MESSAGE = 'wallet already exist';
