import React, { useCallback, useContext, useEffect, useState } from 'react';
import SafeServiceClient from '@gnosis.pm/safe-service-client';
import { useMutation } from '@apollo/client';
import * as Sentry from '@sentry/nextjs';
import { useWonderWeb3 } from 'services/web3';
import { SnackbarAlertContext } from 'components/Common/SnackbarAlert';
import useAlerts from 'hooks/useAlerts';
import { CREATE_ORG_WALLET, CREATE_POD_WALLET } from 'graphql/mutations';
import { CHAIN_VALUE_TO_GNOSIS_TX_SERVICE_URL, CHAIN_SELECT_OPTIONS } from 'utils/web3Constants';
import {
  DEFAULT_WALLET_NETWORK,
  DEFAULT_WALLET_TYPE,
  EMPTY_ERROR,
  WALLET_ALREADY_EXISTS_ERROR_MESSAGE,
  WALLET_TYPE_OPTIONS,
  WALLET_TYPE,
} from 'components/Settings/WalletSetup/WalletSetupModal/constants';
import {
  WalletSetupModalBody,
  WalletSetupModalBodyExpandedViewInvisibleState,
  WalletSetupModalBodyExpandedViewWrapper,
  WalletSetupModalBodySeperator,
  WalletSetupModalCard,
  WalletSetupModalFooter,
  WalletSetupModalFooterButton,
  WalletSetupModalHeader,
  WalletSetupModalHeaderCloseModalIcon,
  WalletSetupModalHeaderText,
  WalletSetupModalInput,
  WalletSetupModalSelect,
  WalletSetupModalInputWrapper,
  WalletSetupModalLabel,
  WalletSetupModalWrapper,
  WalletSetupModalSelectMenuItem,
  WalletSetupModalSelectValueDisplay,
  WalletSetupModalSelectValueDisplayText,
  WalletSetupModalError,
} from './styles';

interface IWalletSetupModalProps {
  isOpen: boolean;
  handleClose: () => void;
  userMetamaskAddress?: string;
  orgId?: string;
  podId?: string;
}

function WalletSetupModal(props: IWalletSetupModalProps) {
  const { isOpen = false, handleClose = () => {}, userMetamaskAddress, orgId, podId } = props;

  const [addWalletLoading, setAddWalletLoading] = useState(false);
  const [walletName, setWalletName] = useState('');
  const [walletType, setWalletType] = useState(DEFAULT_WALLET_TYPE);
  const [walletNetwork, setWalletNetwork] = useState(DEFAULT_WALLET_NETWORK);
  const [walletAddress, setWalletAddress] = useState('');
  const [errors, setErrors] = useState(EMPTY_ERROR);

  const wonderWeb3 = useWonderWeb3();
  const { showError } = useAlerts();
  const { setSnackbarAlertMessage, setSnackbarAlertOpen, setSnackbarAlertSeverity } = useContext(SnackbarAlertContext);

  const showSuccessToast = (message: string) => {
    setSnackbarAlertSeverity('success');
    setSnackbarAlertMessage(message);
    setSnackbarAlertOpen(true);
  };

  const [createOrgWallet] = useMutation(CREATE_ORG_WALLET, {
    onCompleted: (_) => {
      showSuccessToast('Wallet added successfully');
      resetStates();
      handleClose();
    },
    onError: (e) => {
      const errorMessageFromGql = e.graphQLErrors[0]?.extensions?.message;
      if (errorMessageFromGql === WALLET_ALREADY_EXISTS_ERROR_MESSAGE) {
        showError('A Wallet already exists with this address. Please try again with a different address.', true);
      } else {
        showError('We faced some error while creating your wallet. Please try again later.', true);
      }
      console.log(e);
      Sentry.captureException(e);
    },
    refetchQueries: ['getOrgWallet'],
  });

  const [createPodWallet] = useMutation(CREATE_POD_WALLET, {
    onCompleted: (_) => {
      showSuccessToast('Wallet added successfully');
      resetStates();
      handleClose();
    },
    onError: (e) => {
      const errorMessageFromGql = e.graphQLErrors[0]?.extensions?.message;
      if (errorMessageFromGql === WALLET_ALREADY_EXISTS_ERROR_MESSAGE) {
        showError('A Wallet already exists with this address. Please try again with a different address.', true);
      } else {
        showError('We faced some error while creating your wallet. Please try again later.', true);
      }
      console.log(e);
      Sentry.captureException(e);
    },
    refetchQueries: ['getPodWallet'],
  });

  const isExpandedViewVisible = walletName && walletType?.value;
  const isAddButtonDisabled = !walletName || !walletType?.value || !walletAddress;
  const isOrgWalletSetupPage = !!orgId;

  const resetStates = useCallback(() => {
    setWalletName('');
    setWalletType(DEFAULT_WALLET_TYPE);
    setWalletNetwork(DEFAULT_WALLET_NETWORK);
    setWalletAddress('');
    setErrors(EMPTY_ERROR);
  }, []);

  // reset field values on close
  useEffect(() => {
    if (!isOpen) {
      resetStates();
    }
  }, [isOpen]);

  useEffect(() => {
    if (walletType?.value === WALLET_TYPE.METAMASK && !walletAddress) {
      setWalletAddress(userMetamaskAddress || '');
    }
  }, [walletType?.value]);

  const handleWalletTypeChange = useCallback(
    (ev) => {
      const selectedWalletType = WALLET_TYPE_OPTIONS.find((walletType) => walletType.value === ev.target.value);
      setWalletType(selectedWalletType);
    },
    [WALLET_TYPE_OPTIONS]
  );

  const handleWalletNetworkChange = useCallback(
    (ev) => {
      const selectedWalletNetwork = CHAIN_SELECT_OPTIONS.find(
        (walletNetwork) => walletNetwork.value === ev.target.value
      );
      setWalletNetwork(selectedWalletNetwork);
    },
    [CHAIN_SELECT_OPTIONS]
  );

  const handleAddOrgWallet = useCallback(
    (payloadWithoutId) => {
      const payload = { ...payloadWithoutId, orgId };
      createOrgWallet({ variables: { input: payload } });
    },
    [orgId]
  );
  const handleAddPodWallet = useCallback(
    (payloadWithoutId) => {
      const payload = { ...payloadWithoutId, podId };
      createPodWallet({ variables: { input: payload } });
    },
    [podId]
  );
  const handleAddWalletError = useCallback(async () => {
    let newError = EMPTY_ERROR;
    const safeServiceUrl = CHAIN_VALUE_TO_GNOSIS_TX_SERVICE_URL[walletNetwork?.value];
    const safeService = new SafeServiceClient(safeServiceUrl);
    let checksumAddress: string;
    // validating if the address is valid
    try {
      checksumAddress = wonderWeb3.toChecksumAddress(walletAddress);
    } catch (e) {
      newError = { ...newError, safeAddressError: 'Must be valid EVM address' };
      setErrors((_) => newError);
    }
    if (newError.safeAddressError) return true;

    if (walletType?.value === WALLET_TYPE.GNOSIS) {
      // validating if the address is already registered
      try {
        await safeService.getSafeInfo(checksumAddress);
      } catch (e) {
        if (String(e).includes('Not Found')) {
          newError = { ...newError, safeAddressError: `Safe address not deployed on ${walletType?.label}` };
        } else {
          const errorMessage = 'unknown gnosis network error';
          newError = { ...newError, safeAddressError: errorMessage };
        }
        setErrors((_) => newError);
      }
    }

    return !!newError?.safeAddressError;
  }, [walletAddress, walletNetwork, walletType]);

  const handleAddWallet = useCallback(async () => {
    setAddWalletLoading(true);
    const hasError = await handleAddWalletError();
    if (hasError) return;

    setErrors((_) => EMPTY_ERROR);

    const payload = {
      name: walletName,
      address: walletAddress,
      type: walletType?.value,
      chain: walletType?.value === WALLET_TYPE.METAMASK ? null : walletNetwork?.value,
    };

    if (isOrgWalletSetupPage) {
      handleAddOrgWallet(payload);
    } else {
      handleAddPodWallet(payload);
    }
    setAddWalletLoading(false);
  }, [walletName, walletType?.value, walletNetwork?.value, walletAddress, isOrgWalletSetupPage]);

  const renderWalletTypeValue = () => (
    <WalletSetupModalSelectValueDisplay>
      {walletType?.icon}
      <WalletSetupModalSelectValueDisplayText isActive={!!walletType?.value}>
        {walletType?.label}
      </WalletSetupModalSelectValueDisplayText>
    </WalletSetupModalSelectValueDisplay>
  );

  const renderWalletNetworkValue = () => (
    <WalletSetupModalSelectValueDisplay>
      {walletNetwork?.icon}
      <WalletSetupModalSelectValueDisplayText isActive={!!walletNetwork?.value}>
        {walletNetwork?.label}
      </WalletSetupModalSelectValueDisplayText>
    </WalletSetupModalSelectValueDisplay>
  );

  return (
    <WalletSetupModalWrapper open={isOpen} onClose={handleClose} closeAfterTransition>
      <WalletSetupModalCard>
        <WalletSetupModalHeader>
          <WalletSetupModalHeaderText>Add New Wallet</WalletSetupModalHeaderText>
          <WalletSetupModalHeaderCloseModalIcon onClick={handleClose} />
        </WalletSetupModalHeader>
        <WalletSetupModalBody>
          <WalletSetupModalInputWrapper>
            <WalletSetupModalLabel htmlFor="wallet-name">Name</WalletSetupModalLabel>
            <WalletSetupModalInput
              placeholder="Give your wallet a name"
              id="wallet-name"
              value={walletName}
              onChange={(ev) => setWalletName(ev.target.value)}
            />
          </WalletSetupModalInputWrapper>
          <WalletSetupModalInputWrapper>
            <WalletSetupModalLabel htmlFor="wallet-type">Wallet type</WalletSetupModalLabel>
            <WalletSetupModalSelect
              id="wallet-type"
              value={walletType}
              renderValue={renderWalletTypeValue}
              onChange={handleWalletTypeChange}
            >
              {WALLET_TYPE_OPTIONS.map((walletType) => (
                <WalletSetupModalSelectMenuItem key={walletType.value} value={walletType.value}>
                  {walletType.icon}
                  {walletType.label}
                </WalletSetupModalSelectMenuItem>
              ))}
            </WalletSetupModalSelect>
          </WalletSetupModalInputWrapper>
          <WalletSetupModalBodyExpandedViewWrapper
            expanded={isExpandedViewVisible}
            TransitionProps={{ unmountOnExit: true }}
          >
            <WalletSetupModalBodyExpandedViewInvisibleState />
            <WalletSetupModalBodySeperator />
            {walletType?.value !== WALLET_TYPE.METAMASK && (
              <WalletSetupModalInputWrapper>
                <WalletSetupModalLabel htmlFor="wallet-network">Network</WalletSetupModalLabel>
                <WalletSetupModalSelect
                  id="wallet-network"
                  value={walletNetwork}
                  renderValue={renderWalletNetworkValue}
                  onChange={handleWalletNetworkChange}
                >
                  {CHAIN_SELECT_OPTIONS.map((walletNetwork) => (
                    <WalletSetupModalSelectMenuItem key={walletNetwork.value} value={walletNetwork.value}>
                      {walletNetwork.icon}
                      {walletNetwork.label}
                    </WalletSetupModalSelectMenuItem>
                  ))}
                </WalletSetupModalSelect>
              </WalletSetupModalInputWrapper>
            )}
            <WalletSetupModalInputWrapper>
              <WalletSetupModalLabel for="wallet-address">Address</WalletSetupModalLabel>
              <WalletSetupModalInput
                placeholder="Enter Wallet Address"
                id="wallet-address"
                value={walletAddress}
                onChange={(ev) => setWalletAddress(ev.target.value)}
              />
              {!!errors.safeAddressError && (
                <WalletSetupModalError key={errors?.safeAddressError}>{errors.safeAddressError}</WalletSetupModalError>
              )}
            </WalletSetupModalInputWrapper>
          </WalletSetupModalBodyExpandedViewWrapper>
        </WalletSetupModalBody>
        <WalletSetupModalFooter>
          <WalletSetupModalFooterButton onClick={handleClose}>Cancel</WalletSetupModalFooterButton>
          <WalletSetupModalFooterButton isPrimary disabled={isAddButtonDisabled} onClick={handleAddWallet}>
            Add Wallet
          </WalletSetupModalFooterButton>
        </WalletSetupModalFooter>
      </WalletSetupModalCard>
    </WalletSetupModalWrapper>
  );
}

export default WalletSetupModal;
