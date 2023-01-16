import React, { useState } from 'react';
import Checkbox from 'components/Checkbox';
import { SubmitterWalletConnectContainer, SubmitterWalletConnectText } from '../styles';

const SubmitterWalletConnectSelector = (props) => {
  const { submitterWalletConnectSelected, setSubmitterWalletConnectSelected } = props;
  return (
    <SubmitterWalletConnectContainer>
      <Checkbox
        checked={!!submitterWalletConnectSelected}
        onChange={() => {
          if (setSubmitterWalletConnectSelected) {
            setSubmitterWalletConnectSelected(!submitterWalletConnectSelected);
          }
        }}
        inputProps={{ 'aria-label': 'controlled' }}
      />
      <SubmitterWalletConnectText>Require Wallets Connected</SubmitterWalletConnectText>
    </SubmitterWalletConnectContainer>
  );
};

export default SubmitterWalletConnectSelector;
