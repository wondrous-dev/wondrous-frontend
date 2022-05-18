import { Button } from '../button';
import React, { useCallback, useEffect, useState, useContext } from 'react';
import { useWonderWeb3 } from 'services/web3';
import Ethereum from '../../Icons/ethereum';
import { Metamask } from '../../Icons/metamask';
import { WonderCoin } from '../../Icons/wonderCoin';
import { PaddedParagraph } from '../text';

import {
  WalletWrapper,
  ChainWrapper,
  WalletDisplay,
  WonderBalance,
  WalletAddress,
  CurrencySelectorItem,
  CurrencyName,
  CurrencySymbol,
} from './styles';
import { getUserSigningMessage, linkWallet, logout, useMe } from '../../Auth/withAuth';
import { DropDown, DropDownItem } from '../dropdown';
import { Matic } from '../../Icons/matic';
import { CURRENCY_KEYS } from 'utils/constants';
import { USDCoin } from '../../Icons/USDCoin';
import Arbitrum from '../../Icons/arbitrum';
import Harmony from '../../Icons/harmony';
import { SupportedChainType } from 'utils/web3Constants';
import { ErrorText } from '..';
import signedMessageIsString from 'services/web3/utils/signedMessageIsString';
import WalletModal from './WalletModal';
import useEagerConnect from 'services/web3/hooks/useEagerConnect';
import { WonderWeb3Context } from 'services/web3/context/WonderWeb3Context';

const CHAIN_LOGO = {
  '1': <Ethereum />,
  '137': <Matic />,
  '1666600000': <Harmony />,
  '42161': <Arbitrum />,
};

const CURRENCY_SYMBOL = {
  ETH: <Ethereum />,
  WONDER: <WonderCoin />,
  MATIC: <Matic />,
  USDC: <USDCoin />,
  ONE: <Harmony />,
  AETH: <Arbitrum />,
};

const CURRENCY_UI_ELEMENTS = {
  ETH: { icon: <Ethereum />, label: 'ETH' },
  WONDER: { icon: <WonderCoin />, label: 'WONDER' },
  MATIC: { icon: <Matic />, label: 'MATIC' },
  USDC: { icon: <USDCoin />, label: 'USDC' },
  ONE: { icon: <Harmony />, label: 'ONE' },
  AETH: { icon: <Arbitrum />, label: 'AETH' },
};

const Wallet = () => {
  const wonderWeb3 = useWonderWeb3();
  const { provider } = useContext(WonderWeb3Context);
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
          await linkWallet(wonderWeb3.address, signedMessage, SupportedChainType.ETH);
        }
      }
    }
  }, [wonderWeb3]);

  const displayCurrency = (currencyCode) => {
    console.log('currencyCode', currencyCode)
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
        if (user && !user.activeEthAddress && provider) {
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
  }, [wonderWeb3.address, provider]);

  const Balance = () => {
    return (
      <WonderBalance>
        <span
          style={{
            marginRight: '4px',
          }}
        >
          {currency ? currency.balance : 0}
        </span>
        {CURRENCY_SYMBOL[currency.symbol]}
      </WonderBalance>
    );
  };

  const CurrencyDropdownItem = ({ currency }) => {
    if (currency in CURRENCY_UI_ELEMENTS) {
      console.log('currennncy', currency)
      const { icon: currencyIcon, label: currencyLabel } = CURRENCY_UI_ELEMENTS[currency];
      return (
        <DropDownItem key={`wallet-currency-${currency}`} onClick={() => displayCurrency(currency)}>
          <CurrencySelectorItem>
            <CurrencySymbol>{currencyIcon}</CurrencySymbol>
            <CurrencyName>{currencyLabel}</CurrencyName>
          </CurrencySelectorItem>
        </DropDownItem>
      );
    }
    return <></>;
  };

  if (!connected) {
    return (
      <WalletWrapper>
        <Button
          highlighted="true"
          onClick={() => setWalletModalOpen(true)}
          style={{ width: '270px', minHeight: '40px' }}
        >
          <PaddedParagraph
            style={{
              marginLeft: '8px',
            }}
          >
            {!user?.activeEthAddress ? 'Link Wallet to Account' : 'Connect Wallet'}
          </PaddedParagraph>
        </Button>
        <WalletModal open={walletModalOpen} onClose={() => setWalletModalOpen(false)} />
      </WalletWrapper>
    );
  } else if (wonderWeb3.notSupportedChain) {
    return (
      <WalletWrapper>
        <WalletDisplay>Chain Not Supported</WalletDisplay>
      </WalletWrapper>
    );
  } else {
    return (
      <WalletWrapper>
        <ChainWrapper>{CHAIN_LOGO[wonderWeb3.wallet.chain]}</ChainWrapper>
        <WalletDisplay>
          <DropDown DropdownHandler={Balance}>
            <CurrencyDropdownItem currency={CURRENCY_KEYS.WONDER} />
            <CurrencyDropdownItem currency={CURRENCY_KEYS.USDC} />
            {wonderWeb3.nativeTokenSymbol && <CurrencyDropdownItem currency={wonderWeb3.nativeTokenSymbol} />}
          </DropDown>
          <WalletAddress>{wonderWeb3.wallet.addressTag || 'loading...'}</WalletAddress>
          {differentAccountError && (
            <ErrorText
              style={{
                width: '120px',
                marginLeft: '8px',
              }}
            >
              Not linked wallet
            </ErrorText>
          )}
        </WalletDisplay>
      </WalletWrapper>
    );
  }
};

export default Wallet;
