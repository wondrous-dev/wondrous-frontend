import React, { useCallback, useState } from 'react';
import { DEFAULT_WALLET_NETWORK, DEFAULT_WALLET_TYPE, WALLET_NETWORKS, WALLET_TYPES } from './constants';
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
} from './styles';

export function WalletSetupModal(props) {
  const { open = true, handleClose = () => {} } = props;
  const [walletName, setWalletName] = useState('');
  const [walletType, setWalletType] = useState(DEFAULT_WALLET_TYPE);
  const [walletNetwork, setWalletNetwork] = useState(DEFAULT_WALLET_NETWORK);
  const [walletAddress, setWalletAddress] = useState('');
  const isExpandedViewVisible = walletName && walletType?.value;
  const isAddButtonDisabled = !walletName || !walletType?.value || !walletAddress;

  const handleWalletTypeChange = useCallback((ev) => {
    const selectedWalletType = WALLET_TYPES.find((walletType) => walletType.value === ev.target.value);
    setWalletType(selectedWalletType);
  }, []);

  const handleWalletNetworkChange = useCallback((ev) => {
    const selectedWalletNetwork = WALLET_NETWORKS.find((walletNetwork) => walletNetwork.value === ev.target.value);
    setWalletNetwork(selectedWalletNetwork);
  }, []);

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
    <WalletSetupModalWrapper open={open} onClose={handleClose}>
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
              {WALLET_TYPES.map((walletType) => (
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
            <WalletSetupModalInputWrapper>
              <WalletSetupModalLabel htmlFor="wallet-network">Network</WalletSetupModalLabel>
              <WalletSetupModalSelect
                id="wallet-network"
                value={walletNetwork}
                renderValue={renderWalletNetworkValue}
                onChange={handleWalletNetworkChange}
              >
                {WALLET_NETWORKS.map((walletNetwork) => (
                  <WalletSetupModalSelectMenuItem key={walletNetwork.value} value={walletNetwork.value}>
                    {walletNetwork.icon}
                    {walletNetwork.label}
                  </WalletSetupModalSelectMenuItem>
                ))}
              </WalletSetupModalSelect>
            </WalletSetupModalInputWrapper>
            <WalletSetupModalInputWrapper>
              <WalletSetupModalLabel for="wallet-address">Address</WalletSetupModalLabel>
              <WalletSetupModalInput
                placeholder="Enter Wallet Address"
                id="wallet-address"
                value={walletAddress}
                onChange={(ev) => setWalletAddress(ev.target.value)}
              />
            </WalletSetupModalInputWrapper>
          </WalletSetupModalBodyExpandedViewWrapper>
        </WalletSetupModalBody>

        <WalletSetupModalFooter>
          <WalletSetupModalFooterButton onClick={handleClose}>Cancel</WalletSetupModalFooterButton>
          <WalletSetupModalFooterButton isPrimary disabled={isAddButtonDisabled}>
            Add Wallet
          </WalletSetupModalFooterButton>
        </WalletSetupModalFooter>
      </WalletSetupModalCard>
    </WalletSetupModalWrapper>
  );
}
