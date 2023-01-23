// TODO: Adrian - we probably don't need all this state

export const INITIAL_STATE = {
  selectedWallet: null,
  wrongChainError: null,
  notOwnerError: null,
  signingError: null,
  safeConnectionError: null,
  gnosisTransactionLoading: false,
  incompatibleWalletError: null,
  paymentPending: null,
  gnosisSafeTxRedirectLink: null,
  exploreRedirectUrl: null,
  safeTxHash: null,
  transactionHash: null,
};

export const ACTION_TYPES = {
  SET_SELECTED_WALLET: 'SELECTED_WALLET',
  SET_WRONG_CHAIN_ERROR: 'SET_WRONG_CHAIN_ERROR',
  SET_NOT_OWNER_ERROR: 'SET_NOT_OWNER_ERROR',
  SET_SIGNING_ERROR: 'SET_SIGNING_ERROR',
  SET_SAFE_CONNECTION_ERROR: 'SET_SAFE_CONNECTION_ERROR',
  SET_GNOSIS_TRANSACTION_LOADING: 'SET_GNOSIS_TRANSACTION_LOADING',
  SET_INCOMPATIBLE_WALLET_ERROR: 'SET_INCOMPATIBLE_WALLET_ERROR',
  SET_PAYMENT_PENDING: 'SET_PAYMENT_PENDING',
  SET_GNOSIS_SAFE_TX_REDIRECT_LINK: 'SET_GNOSIS_SAFE_TX_REDIRECT_LINK',
  SET_EXPLORE_REDIRECT_URL: 'SET_EXPLORE_REDIRECT_URL',
  SET_SAFE_TX_HASH: 'SET_SAFE_TX_HASH',
  SET_TRANSACTION_HASH: 'SET_TRANSACTION_HASH',
};

export const reducer = (state = INITIAL_STATE, { type, payload }) => {
  switch (type) {
    case ACTION_TYPES.SET_SELECTED_WALLET:
      return { ...state, selectedWallet: payload };
    default:
      return state;
  }
};
