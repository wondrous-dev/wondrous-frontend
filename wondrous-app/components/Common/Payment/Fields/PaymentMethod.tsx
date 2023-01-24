import Grid from '@mui/material/Grid';
import Button from 'components/Button';
import DropdownSelect from 'components/Common/DropdownSelect';
import { LinkIcon } from 'components/Icons/taskModalIcons';
import WalletIcon from 'components/Icons/WalletIcon';
import { HeaderButton } from 'components/organization/wrapper/styles';
import { forwardRef, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import palette from 'theme/palette';
import { OfflinePayment } from '../OfflinePayment/OfflinePayment';
import { SingleWalletPayment } from '../SingleWalletPayment';
import { PaymentMethodDropdown, WalletMethodWrapper, Wrapper } from './styles';

const PLATFORM_TYPE_VALUES = {
  WALLET: 'WALLET',
  OFF_PLATFORM: 'OFF_PLATFORM',
};

const PLATFORM_TYPE = [
  {
    value: PLATFORM_TYPE_VALUES.WALLET,
    label: 'Pay from wallet',
    icon: <WalletIcon width="14" height="14" />,
  },
  {
    value: PLATFORM_TYPE_VALUES.OFF_PLATFORM,
    label: 'Pay off platform',
    icon: <LinkIcon height="14" width="14" />,
  },
];

// const WalletPay = ({ wallets, paymentInfo }) => {
//   const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
//   const wonderWeb3 = useWonderWeb3();
//   const paymentModal = usePaymentModal();

//   const walletOptions = useMemo(() => {
//     const corrctChainWallets = [];
//     const chain = paymentInfo?.paymentData[0].chain;
//     wallets.map((wallet) => {
//       if (wallet.chain === chain || wallet.type === WALLET_TYPE.METAMASK) {
//         const address = generateReadablePreviewForAddress(wallet.address);
//         const label = `${wallet.name}:  ${address}`;
//         corrctChainWallets.push({ value: wallet.id, label });
//       }
//     });
//     // if (corrctChainWallets.length === 0 && wallets.length > 0) {
//     //   setIncompatibleWalletError(`Existing wallets are not on ${chain}`);
//     // }

//     return corrctChainWallets;
//   }, [paymentInfo, wallets]);

//   const setSelectedWallet = (value) =>
//     dispatch({
//       type: ACTION_TYPES.SET_SELECTED_WALLET,
//       payload: walletOptions.find((wallet) => wallet.value === value),
//     });

//   const connectWeb3 = async () => {
//     await wonderWeb3.onConnect();
//   };
//   useEffect(() => {
//     connectWeb3();
//   }, []);

//   const wonderGnosis = useGnosisSdk();
//   const connectSafeSdk = async (chain, safeAddress) => {
//     try {
//       await wonderGnosis.connectSafeSdk({ chain, safeAddress });
//     } catch (e) {
//       console.log('error connecting to gnosis safe', selectedWallet.chain, e);
//       dispatch({
//         type: ACTION_TYPES.SET_SAFE_CONNECTION_ERROR,
//         payload: `Cannot connect to safe, check if connected to  ${selectedWallet.chain}`,
//       });
//     }
//   };

//   // useEffect(() => {
//   //   setNotOwnerError(null);
//   //   setSafeConnectionError(null);
//   //   setCurrentChainId(wonderWeb3.chain);
//   // }, [wonderWeb3.chain, wonderWeb3.address]);

//   const currentChainId = wonderWeb3.chain;

//   const { selectedWallet } = state;

//   const incompatibleWalletError = walletOptions?.length === 0 && wallets?.length > 0;

//   console.log(state);

//   return (
//     <Wrapper label="Pay from Wallet">
//       <PaymentMethodDropdown>
//         <DropdownSelect
//           options={walletOptions}
//           setValue={setSelectedWallet}
//           hideLabel
//           value={selectedWallet?.value}
//           formSelectStyle={{
//             flex: 1,
//             maxWidth: '100%',
//           }}
//           innerStyle={{
//             marginTop: '0',
//           }}
//         />
//       </PaymentMethodDropdown>
//     </Wrapper>
//   );
// };

const PaymentMethod = forwardRef(
  (
    {
      submissionOrApplicationId,
      wallets,
      paymentData,
      orgId,
      podId,
      changedRewardAmount,
      parentError,
      entityType,
      reward,
      onClose,
    }: any,
    ref: any
  ) => {
    const [selectedTab, setSelectedTab] = useState(null);

    const buttonsRef: any = useRef();

    useEffect(() => {
      setSelectedTab(PLATFORM_TYPE[0]);
    }, []);

    const FooterButtons = (
      <Grid container gap="18px">
        <Button
          onClick={onClose}
          buttonTheme={{
            background: palette.grey75,
            borderColor: 'transparent',
            fontSize: '14px',
            fontWeight: 500,
            paddingX: 24,
            paddingY: 8,

            hover: {
              background: palette.grey76,
            },
          }}
        >
          Cancel
        </Button>
        <HeaderButton
          style={{
            height: '40px',
          }}
          reversed
          type="submit"
          onClick={() => buttonsRef.current?.onClick()}
          // disabled={!(selectedUsers.admins.length || selectedUsers.members.length)}
        >
          Confirm payment
        </HeaderButton>
      </Grid>
    );
    return (
      <>
        <Wrapper label="Payment Method">
          <PaymentMethodDropdown>
            <WalletMethodWrapper>
              <DropdownSelect
                options={PLATFORM_TYPE}
                setValue={(value) => setSelectedTab(PLATFORM_TYPE.find((item) => item.value === value))}
                hideLabel
                value={selectedTab?.value}
                formSelectStyle={{
                  flex: 1,
                  maxWidth: '100%',
                }}
                innerStyle={{
                  marginTop: '0',
                }}
              />
            </WalletMethodWrapper>
          </PaymentMethodDropdown>
        </Wrapper>
        <WalletMethodWrapper>
          {selectedTab?.value === PLATFORM_TYPE_VALUES.WALLET ? (
            <Wrapper label="Pay from wallet">
              <SingleWalletPayment
                submissionOrApplicationId={submissionOrApplicationId}
                wallets={wallets}
                paymentData={paymentData}
                orgId={orgId}
                podId={podId}
                changedRewardAmount={changedRewardAmount}
                parentError={parentError}
                entityType={entityType}
                hidePayButton
                dropdownProps={{
                  hideLabel: true,
                  innerStyle: {
                    marginTop: '0',
                  },
                  labelText: null,
                  formSelectStyle: {
                    flex: 1,
                    maxWidth: '100%',
                  },
                }}
                reward={reward}
                renderButtons={({ onClick }) => {
                  buttonsRef.current = { onClick };
                }}
              />
            </Wrapper>
          ) : null}
          {selectedTab?.value === PLATFORM_TYPE_VALUES.OFF_PLATFORM ? (
            <OfflinePayment
              handleClose={onClose}
              submissionOrApplicationId={submissionOrApplicationId}
              paymentData={paymentData}
              entityType={entityType}
            />
          ) : null}
        </WalletMethodWrapper>
        {ref.current ? createPortal(FooterButtons, ref.current) : null}
      </>
    );
  }
);

export default PaymentMethod;
