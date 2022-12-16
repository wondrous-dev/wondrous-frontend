import { getUserSigningMessage, linkWallet, useMe } from 'components/Auth/withAuth';
import { FilterCheckbox } from 'components/Common/Filter/styles';
import Arbitrum from 'components/Icons/arbitrum';
import Binance from 'components/Icons/binace';
import Boba from 'components/Icons/Boba';
import Ethereum from 'components/Icons/ethereum';
import Avalanche from 'components/Icons/Avalanche';
import Harmony from 'components/Icons/harmony';
import { Matic } from 'components/Icons/matic';
import { ChevronFilled } from 'components/Icons/sections';
import { USDCoin } from 'components/Icons/USDCoin';
import { WonderCoin } from 'components/Icons/wonderCoin';
import Tooltip from 'components/Tooltip';
import React, { useCallback, useContext, useEffect, useState } from 'react';
import { useWonderWeb3 } from 'services/web3';
import { WonderWeb3Context } from 'services/web3/context/WonderWeb3Context';
import useEagerConnect from 'services/web3/hooks/useEagerConnect';
import signedMessageIsString from 'services/web3/utils/signedMessageIsString';
import { SupportedChainType, CHAIN_TO_CHAIN_DIPLAY_NAME, CHAIN_LOGO, CURRENCY_SYMBOL } from 'utils/web3Constants';
import { SnackbarAlertContext } from 'components/Common/SnackbarAlert';
import {
  BalanceMenu,
  Button,
  ChainWrapper,
  CurrencyName,
  CurrencySelectorItem,
  CurrencySymbol,
  CurrencyWrapper,
  WalletAddress,
  WalletWrapper,
  WonderBalance,
} from './styles';
import WalletModal from './WalletModal';

const CurrencyDropdownItem = ({ currency, selected, displayCurrency }) => {
  if (currency in CURRENCY_SYMBOL) {
    const currencyIcon = CURRENCY_SYMBOL[currency];
    return (
      <CurrencySelectorItem
        selected={selected}
        key={`wallet-currency-${currency}`}
        onClick={() => displayCurrency(currency)}
      >
        <CurrencyWrapper>
          <CurrencySymbol>{currencyIcon}</CurrencySymbol>
          <CurrencyName>{currency}</CurrencyName>
        </CurrencyWrapper>
        <FilterCheckbox checked={selected} />
      </CurrencySelectorItem>
    );
  }
  return null;
};

const Balance = ({ currency, children }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);
  const open = Boolean(anchorEl);
  return (
    <>
      <WonderBalance onClick={handleClick} open={open}>
        {CURRENCY_SYMBOL[currency.symbol]}
        {currency ? currency.balance : 0}
        <ChevronFilled fill="white" className="accordion-expansion-icon" />
      </WonderBalance>
      <BalanceMenu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
      >
        {children}
      </BalanceMenu>
    </>
  );
};

function Wallet({isActive = true, handleClick = () => {}}) {
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
      {/* <Tooltip title={CHAIN_TO_CHAIN_DIPLAY_NAME[wonderWeb3.chain]}>
        <ChainWrapper>{CHAIN_LOGO[wonderWeb3.chain]}</ChainWrapper>
      </Tooltip> */}
      {/* <Balance currency={currency}>
        <CurrencyDropdownItem
          currency="WONDER"
          selected={currency.symbol === 'WONDER'}
          displayCurrency={displayCurrency}
        />
        <CurrencyDropdownItem currency="USDC" selected={currency.symbol === 'USDC'} displayCurrency={displayCurrency} />
        {wonderWeb3.nativeTokenSymbol && (
          <CurrencyDropdownItem
            currency={wonderWeb3.nativeTokenSymbol}
            selected={currency.symbol === wonderWeb3.nativeTokenSymbol}
            displayCurrency={displayCurrency}
          />
        )}
      </Balance> */}

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
