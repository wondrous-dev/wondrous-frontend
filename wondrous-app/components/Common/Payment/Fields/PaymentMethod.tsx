import DropdownSelect from 'components/Common/DropdownSelect';
import { LinkIcon } from 'components/Icons/taskModalIcons';
import WalletIcon from 'components/Icons/WalletIcon';
import { WALLET_TYPE } from 'components/Settings/WalletSetup/WalletSetupModal/constants';
import { useEffect, useMemo, useReducer, useState } from 'react';
import useGnosisSdk from 'services/payment';
import { useWonderWeb3 } from 'services/web3';
import { usePaymentModal } from 'utils/hooks';
import { ACTION_TYPES, INITIAL_STATE, reducer } from './helpers';
import { PaymentMethodDropdown, Wrapper } from './styles';

const WALLET_TYPES = [
  {
    value: 'wallet',
    label: 'Pay from wallet',
    icon: <WalletIcon width="14" height="14" />,
  },
  {
    value: 'off_platform',
    label: 'Pay off platform',
    icon: <LinkIcon height="14" width="14" />,
  },
];

const generateReadablePreviewForAddress = (address: String) => {
  if (address && address.length > 10) {
    return `${address.substring(0, 4)}...${address.substring(address.length - 3)}`;
  }
};

const WalletPay = ({ wallets, paymentInfo }) => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const wonderWeb3 = useWonderWeb3();
  const paymentModal = usePaymentModal();

  const walletOptions = useMemo(() => {
    const corrctChainWallets = [];
    const chain = paymentInfo?.paymentData[0].chain;
    wallets.map((wallet) => {
      if (wallet.chain === chain || wallet.type === WALLET_TYPE.METAMASK) {
        const address = generateReadablePreviewForAddress(wallet.address);
        const label = `${wallet.name}:  ${address}`;
        corrctChainWallets.push({ value: wallet.id, label });
      }
    });
    // if (corrctChainWallets.length === 0 && wallets.length > 0) {
    //   setIncompatibleWalletError(`Existing wallets are not on ${chain}`);
    // }

    return corrctChainWallets;
  }, [paymentInfo, wallets]);

  const setSelectedWallet = (value) =>
    dispatch({
      type: ACTION_TYPES.SET_SELECTED_WALLET,
      payload: walletOptions.find((wallet) => wallet.value === value),
    });

  const connectWeb3 = async () => {
    await wonderWeb3.onConnect();
  };
  useEffect(() => {
    connectWeb3();
  }, []);

  const wonderGnosis = useGnosisSdk();
  const connectSafeSdk = async (chain, safeAddress) => {
    try {
      await wonderGnosis.connectSafeSdk({ chain, safeAddress });
    } catch (e) {
      console.log('error connecting to gnosis safe', selectedWallet.chain, e);
      dispatch({
        type: ACTION_TYPES.SET_SAFE_CONNECTION_ERROR,
        payload: `Cannot connect to safe, check if connected to  ${selectedWallet.chain}`,
      });
    }
  };

  // useEffect(() => {
  //   setNotOwnerError(null);
  //   setSafeConnectionError(null);
  //   setCurrentChainId(wonderWeb3.chain);
  // }, [wonderWeb3.chain, wonderWeb3.address]);

  const currentChainId = wonderWeb3.chain;

  const { selectedWallet } = state;

  const incompatibleWalletError = walletOptions?.length === 0 && wallets?.length > 0;

  console.log(state);

  return (
    <Wrapper label="Pay from Wallet">
      <PaymentMethodDropdown>
        <DropdownSelect
          options={walletOptions}
          setValue={setSelectedWallet}
          hideLabel
          value={selectedWallet?.value}
          formSelectStyle={{
            flex: 1,
            maxWidth: '100%',
          }}
          innerStyle={{
            marginTop: '0',
          }}
        />
      </PaymentMethodDropdown>
    </Wrapper>
  );
};

const PaymentMethod = ({ wallets, paymentInfo }) => {
  const [selectedTab, setSelectedTab] = useState(WALLET_TYPES[0]);

  return (
    <>
      <Wrapper label="Payment Method">
        <PaymentMethodDropdown>
          <DropdownSelect
            options={WALLET_TYPES}
            setValue={(value) => setSelectedTab(WALLET_TYPES.find((item) => item.value === value))}
            hideLabel
            value={selectedTab.value}
            formSelectStyle={{
              flex: 1,
              maxWidth: '100%',
            }}
            innerStyle={{
              marginTop: '0',
            }}
          />
        </PaymentMethodDropdown>
      </Wrapper>
      <WalletPay wallets={wallets} paymentInfo={paymentInfo} />
    </>
  );
};

export default PaymentMethod;
