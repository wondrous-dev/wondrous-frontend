import { getUserSigningMessage, linkWallet, useMe } from 'components/Auth/withAuth';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useWonderWeb3 } from 'services/web3';
import { WonderWeb3Context } from 'services/web3/context/WonderWeb3Context';
import useEagerConnect from 'services/web3/hooks/useEagerConnect';
import signedMessageIsString from 'services/web3/utils/signedMessageIsString';
import { SupportedChainType } from 'utils/web3Constants';
import { SnackbarAlertContext } from 'components/Common/SnackbarAlert';
import { Button, WalletAddress, WalletWrapper } from './styles';
import WalletModal from './WalletModal';

function Wallet({ isActive = true, handleClick = () => {} }) {
  const wonderWeb3 = useWonderWeb3();

  const { provider } = useContext(WonderWeb3Context);
  const { setSnackbarAlertMessage, setSnackbarAlertOpen } = useContext(SnackbarAlertContext);

  useEagerConnect();
  const [connected, setConnected] = useState(false);
  const [firstConnect, setFirstConnect] = useState(true);
  const [differentAccountError, setDifferentAccountError] = useState(null);
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [currency, setCurrency] = useState({
    balance: '0.000',
    symbol: 'WONDER',
  });
  const user = useMe();

  const connectWallet = useCallback(async () => {
    await wonderWeb3.onConnect();
    setFirstConnect(false);
  }, [wonderWeb3]);

  const linkUserWithWallet = useCallback(async () => {
    if (wonderWeb3.address && wonderWeb3.chain && !wonderWeb3.connecting) {
      const messageToSign = await getUserSigningMessage(wonderWeb3.address, SupportedChainType.ETH);

      if (messageToSign) {
        const signedMessage = await wonderWeb3.signMessage(messageToSign);
        if (signedMessageIsString(signedMessage)) {
          const result = await linkWallet(wonderWeb3.address, signedMessage, SupportedChainType.ETH);
          if (result === 'web3_address_already_exist') {
            setSnackbarAlertMessage('Wallet already connected to another account');
            setSnackbarAlertOpen(true);
          }
        }
      }
    }
  }, [wonderWeb3]);

  const displayCurrency = (currencyCode) => {
    if (wonderWeb3.assets[currencyCode]) {
      setCurrency({
        balance: wonderWeb3.assets[currencyCode].balance,
        symbol: wonderWeb3.assets[currencyCode].symbol,
      });
    }
  };

  useEffect(() => {
    if (user && user.activeEthAddress && !wonderWeb3.subscribed) {
      connectWallet();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  // Change Currency when the Chain changes
  useEffect(() => {
    if (wonderWeb3.assets) {
      displayCurrency(wonderWeb3.nativeTokenSymbol);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wonderWeb3.assets]);

  // Bind to the Web3 wallet to monitor changes (i.e user unlinks wallet)

  useEffect(() => {
    // Don't listen to anything before the connection to the
    // wallet is done.
    setDifferentAccountError(null);
    if (!wonderWeb3.connecting) {
      // Enable the wallet.
      if (wonderWeb3.address) {
        // Change the UI now.
        setConnected(true);
        if (
          user &&
          user.activeEthAddress &&
          wonderWeb3.toChecksumAddress(wonderWeb3.address) !== wonderWeb3.toChecksumAddress(user.activeEthAddress)
        ) {
          // Wallet has changed, and doesn't match user's registered
          // TODO should show a small message indicating that
          setDifferentAccountError(true);
        }
        if (user && !user.activeEthAddress && provider && wonderWeb3.isActivating && wonderWeb3.active) {
          // Link the wallet to the user.
          linkUserWithWallet();
        }
        // Wallet disabled.
      } else if (!firstConnect) {
        setConnected(false);

        // No wallet, maybe unlinked?
        if (!user?.email) {
          // Sign out, no other means of identification left
          // TODO: Email is not brought on the current Session
          //       management.
          // logout()
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wonderWeb3.address, provider, wonderWeb3.isActivating]);

  // potentially add || !user?.activeEthAddress
  if (!connected) {
    return (
      <WalletWrapper isActive={isActive}>
        <Button onClick={() => setWalletModalOpen(true)}>
          {!user?.activeEthAddress ? 'Link Wallet to Account' : 'Connect Wallet'}
        </Button>
        <WalletModal open={walletModalOpen} onClose={() => setWalletModalOpen(false)} />
      </WalletWrapper>
    );
  }
  if (wonderWeb3.notSupportedChain) {
    return <Button disabled>Chain Not Supported</Button>;
  }

  return (
    <WalletWrapper isActive={isActive} onClick={handleClick}>
      <WalletAddress>{wonderWeb3.wallet.addressTag || 'loading...'}</WalletAddress>
      {/* {differentAccountError && (
            <ErrorText
              style={{
                width: '120px',
                marginLeft: '8px',
              }}
            >
              Not linked wallet
            </ErrorText>
          )} */}
    </WalletWrapper>
  );
}

export default Wallet;
