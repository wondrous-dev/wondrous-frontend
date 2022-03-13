import MetaMaskConnector from '@components/WalletConnectors/MetaMask';
import WalletConnectConnector from '@components/WalletConnectors/WallectConnect';
import Modal from '@mui/material/Modal';
import React from 'react';
import { InnerModal, Title, Wallet } from './styles';

export default function WalletModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="Select Wallet"
      aria-describedby="Modal to select the wallet to connect with."
    >
      <InnerModal>
        <Title>Select wallet to connect</Title>
        <Wallet>
          <MetaMaskConnector text="Connect with MetaMask" />
        </Wallet>
        <Wallet>
          <WalletConnectConnector text="Connect with WalletConnect" />
        </Wallet>
      </InnerModal>
    </Modal>
  );
}
