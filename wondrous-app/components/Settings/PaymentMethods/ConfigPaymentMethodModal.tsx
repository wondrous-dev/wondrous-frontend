import { useMutation, useLazyQuery } from '@apollo/client';
import apollo from 'services/apollo';
import { useRouter } from 'next/router';

import ErrorFieldIcon from 'components/Icons/errorField.svg';
import Ethereum from 'components/Icons/ethereum';
import PolygonIcon from 'components/Icons/polygonMaticLogo.svg';
import React, { useEffect, useState } from 'react';
import Modal from '@mui/material/Modal';
import DropdownSelect from '../../Common/DropdownSelect/dropdownSelect';
import {
  PaymentConfigModal,
  CustomAddressInput,
  AddPaymetMethodButton,
  PaymentMethodFormHeader,
  PaymentMethodFormHeaderSecondary,
  PaymentMethodFormWrapper,
  PaymentMethodSubHeader,
  PaymentMethodNameHeader,
  PaymentMethodDescription
} from './styles';
import { USDCoin } from '../../Icons/USDCoin';
import DaiIcon from '../../Icons/dai';
import Arbitrum from '../../Icons/arbitrum';
import Harmony from '../../Icons/harmony';
import Binance from '../../Icons/binace';
import Boba from '../../Icons/Boba';
import PlusIcon from '../../Icons/plus';
import { GET_PAYMENT_METHODS_FOR_ORG } from 'graphql/queries/payment';
import { GET_TOKEN_INFO } from 'graphql/queries/tokenGating';
import { CREATE_PAYMENT_METHOD } from 'graphql/mutations/payment';
import { ErrorText } from '../../Common';
import { TokenLogoDisplay } from 'components/Settings/TokenGating/styles';
import { GRAPHQL_ERRORS } from 'utils/constants';

const chainOptions = [
  {
    label: 'Ethereum',
    icon: <Ethereum />,
    value: 'ethereum',
  },
  {
    label: 'Polygon',
    icon: <PolygonIcon />,
    value: 'polygon',
  },
  {
    label: 'Harmony',
    icon: <Harmony />,
    value: 'harmony',
  },
  {
    label: 'Arbitrum One',
    icon: <Arbitrum />,
    value: 'arbitrum',
  },
  {
    label: 'Boba',
    icon: <Boba />,
    value: 'boba',
  },
];

const PresetTokens = [
  {
    label: 'USDC',
    icon: <USDCoin />,
    value: 'USDC',
  },
  {
    label: 'DAI',
    icon: <DaiIcon />,
    value: 'DAI',
  },
  {
    label: 'Add Custom',
    icon: <PlusIcon />,
    value: 'custom',
  },
];

const HarmonyPresetTokens = [
  {
    label: 'USDC',
    icon: <USDCoin />,
    value: 'USDC',
  },
  {
    label: 'DAI',
    icon: <DaiIcon />,
    value: 'DAI',
  },
  {
    label: 'One',
    icon: <Harmony />,
    value: 'one',
  },
];

const BobaPresetTokens = [
  {
    label: 'USDC',
    icon: <USDCoin />,
    value: 'USDC',
  },
  {
    label: 'DAI',
    icon: <DaiIcon />,
    value: 'DAI',
  },
];

const PresetTokenPerChain = {
  ethereum: PresetTokens,
  polygon: PresetTokens,
  arbitrum: PresetTokens,
  boba: BobaPresetTokens,
  harmony: HarmonyPresetTokens,
}
const CHAIN_TO_USDC_ADDR = {
  ethereum: '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  polygon: '0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174',
  harmony: '0x44cED87b9F1492Bf2DCf5c16004832569f7f6cBa',
  arbitrum: '0xFF970A61A04b1cA14834A43f5dE4533eBDDB5CC8',
  bsc: '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
  boba: '0x66a2A913e447d6b4BF33EFbec43aAeF87890FBbc'
};

const CHAIN_TO_DAI_ADDR = {
  ethereum: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
  polygon: '0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063',
  harmony: '0xEf977d2f931C1978Db5F6747666fa1eACB0d0339',
  arbitrum: '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
  bsc: '0x1AF3F329e8BE154074D8769D1FFa4eE058B1DBc3',
  boba: '0xf74195Bb8a5cf652411867c5C2C5b8C2a402be35'
};

const ConfigPaymentMethodModal = (props) => {
  const router = useRouter();
  const { orgId, org, open, setShowConfigModal } = props;
  const [chain, setChain] = useState(chainOptions[0].value);
  const [selectedToken, setSelectedToken] = useState(PresetTokens[0].value);
  const [customTokenAddress, setCustomTokenAddress] = useState('');
  const [customToken, setCustomToken] = useState(null);
  const [tokenNotFoundError, setTokenNotFoundError] = useState(null);
  const [createError, setCreateError] = useState(null);
  const [getTokenInfo] = useLazyQuery(GET_TOKEN_INFO, {
    onCompleted: (data) => {
      if (data?.getTokenInfo) {
        const tokenInfo = {
          name: data?.getTokenInfo.name,
          contractAddress: data?.getTokenInfo.contractAddress,
          symbol: data?.getTokenInfo.symbol,
          icon: data?.getTokenInfo.logoUrl,
          decimals: data?.getTokenInfo.decimals,
        };
        setTokenNotFoundError(null);
        setCustomToken(tokenInfo);
      }
    },
    onError: (e) => {
      setTokenNotFoundError('Token not found');
    },
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    if (customTokenAddress && customTokenAddress.length === 42 && customTokenAddress.startsWith('0x')) {
      getTokenInfo({
        variables: {
          contractAddress: customTokenAddress,
          chain: chain,
        },
      }).catch((e) => {
        setTokenNotFoundError('Token not found');
      });
    } else {
      setCustomToken(null);
    }
  }, [customTokenAddress, chain]);

  const clearSelection = () => {
    setCustomTokenAddress(null)
    setCustomToken(null)
    setSelectedToken(PresetTokens[0].value)
    setCreateError(null)
    setTokenNotFoundError(null)
  }


  const handleAddPaymentMethodClick = async () => {
    let tokenAddress, tokenName, symbol, icon, decimals;
    if (selectedToken === 'USDC') {
      tokenAddress = CHAIN_TO_USDC_ADDR[chain];
      tokenName = 'USD Coin';
      symbol = 'USDC';
    } else if (selectedToken === 'DAI') {
      tokenAddress = CHAIN_TO_DAI_ADDR[chain];
      tokenName = 'Dai';
      symbol = 'DAI';
    } else if (selectedToken === 'one') {
      tokenAddress = '0x0000000000000000000000000000000000000000';
      tokenName = 'One';
      symbol = 'ONE';
    } else if (selectedToken === 'custom') {
      tokenAddress = customToken?.contractAddress;
      tokenName = customToken?.name;
      symbol = customToken?.symbol;
    } else {
      setCreateError('invalid selection')
      return
    }
    try {
      await apollo.mutate({
        mutation: CREATE_PAYMENT_METHOD,
        variables: {
          input: {
            orgId,
            tokenAddress,
            chain,
            tokenName,
            symbol,
          },
        },
        refetchQueries:[GET_PAYMENT_METHODS_FOR_ORG]
      });
    } catch (error) {
      if (error?.graphQLErrors && error?.graphQLErrors[0]?.extensions.errorCode === GRAPHQL_ERRORS.PAYMENT_METHOD_EXIST) {
        setCreateError('Payment method of this type already exist')
        return
      }
      setCreateError('Error creating payment method')
      return
    }
    clearSelection()
    setShowConfigModal(false)
  };
  return (
    <Modal
      open={open}
      onClose={() => {
        setShowConfigModal(false);
        clearSelection()
      }}
    >
      <PaymentConfigModal>
        <PaymentMethodFormWrapper>
          <PaymentMethodFormHeader>
            Add payment method for{' '}
            <PaymentMethodFormHeaderSecondary as="span">{org?.username || ''}</PaymentMethodFormHeaderSecondary>
          </PaymentMethodFormHeader>
          <PaymentMethodSubHeader>Chain </PaymentMethodSubHeader>
          <DropdownSelect
            value={chain}
            setValue={setChain}
            innerStyle={{
              marginTop: 0,
            }}
            formSelectStyle={{
              height: 'auto',
            }}
            options={chainOptions}
            name="chain"
          />
          <PaymentMethodDescription>for BNB and Boba chain please contact support@wonderverse.xyz</PaymentMethodDescription>
          <PaymentMethodSubHeader>Token </PaymentMethodSubHeader>
          <DropdownSelect
            value={selectedToken}
            setValue={setSelectedToken}
            innerStyle={{
              marginTop: 0,
            }}
            formSelectStyle={{
              height: 'auto',
            }}
            options={PresetTokenPerChain[chain] || []}
            name="Preset Token"
          />
          {selectedToken === 'custom' && (
            <>
              <CustomAddressInput
                placeholder="Custom token address"
                value={customTokenAddress}
                onChange={(e) => setCustomTokenAddress(e.target.value)}
              />
              {tokenNotFoundError && <ErrorText>Custom token not found, check if the chain is correct</ErrorText>}
              {tokenNotFoundError && <PaymentMethodDescription>Please contact support@wonderverse.xyz to add your token</PaymentMethodDescription>}
              {customToken && (
                <>
                  <TokenLogoDisplay src={customToken?.icon} />
                  <PaymentMethodNameHeader>Token Name: {customToken?.name}</PaymentMethodNameHeader>
                  <PaymentMethodNameHeader>Token Symbol: {customToken?.symbol}</PaymentMethodNameHeader>
                </>
              )}
            </>
          )}
          <AddPaymetMethodButton onClick={handleAddPaymentMethodClick}>Add Payment Method </AddPaymetMethodButton>
          {createError && <ErrorText>{createError}</ErrorText>}
        </PaymentMethodFormWrapper>
      </PaymentConfigModal>
    </Modal>
  );
};

export default ConfigPaymentMethodModal;
