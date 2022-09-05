import React, { MutableRefObject, useEffect, useState } from 'react';
import { Autocomplete } from '@mui/material';
import Grid from '@mui/material/Grid';
import { useMutation, useLazyQuery } from '@apollo/client';
import { createPortal } from 'react-dom';
import apollo from 'services/apollo';
import { FixedSizeList, ListChildComponentProps } from 'react-window';

import Ethereum from 'components/Icons/ethereum';
import Harmony from 'components/Icons/harmony';
import Optimism from 'components/Icons/Optimism';
import Button from 'components/Button';
import CustomField from 'components/FormField/CustomField';
import PolygonIcon from 'components/Icons/polygonMaticLogo.svg';
import { GET_TOKEN_GATING_CONDITIONS_FOR_ORG, GET_TOKEN_INFO, GET_NFT_INFO } from 'graphql/queries/tokenGating';
import { CREATE_TOKEN_GATING_CONDITION_FOR_ORG, UPDATE_TOKEN_GATING_CONDITION } from 'graphql/mutations/tokenGating';
import { AccessCondition, TokenGatingCondition } from 'types/TokenGating';
import { useTokenGatingCondition } from 'utils/hooks';
import { NFT_LIST, HARMONY_TOKEN_LIST } from 'utils/tokenList';
import DropdownSelect from '../../Common/DropdownSelect/dropdownSelect';
import {
  TokenGatingAutocompleteList,
  TokenGatingAutocompleteListItem,
  TokenGatingAutocompletePopper,
  TokenGatingAutocompleteTextfieldButton,
  TokenGatingAutocompleteTextfieldDownIcon,
  TokenGatingAutocompleteTextfieldWrapper,
  TokenGatingInputImage,
  TokenGatingTextfieldButtonDown,
  TokenGatingTextfieldButtonUp,
  TokenGatingTextfieldButtonWrapper,
  TokenGatingTextfieldInput,
} from './styles';

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
    label: 'Optimism',
    icon: <Optimism />,
    value: 'optimism',
  },
];

const SUPPORTED_ACCESS_CONDITION_TYPES = [
  {
    label: 'ERC20',
    value: 'ERC20',
  },
  {
    label: 'NFT',
    value: 'ERC721',
  },
];

const tokenListItemVirtualized = (props: ListChildComponentProps) => {
  const { data, index, style } = props;
  const dataSet = data[index];
  return (
    <TokenGatingAutocompleteListItem {...props} {...dataSet[0]} value={dataSet[1].value} style={style}>
      <TokenGatingInputImage src={dataSet[1]?.icon} />
      {dataSet[1].label}
    </TokenGatingAutocompleteListItem>
  );
};

const OuterElementContext = React.createContext({});

const OuterElementType = React.forwardRef<HTMLDivElement>((props, ref) => {
  const outerProps = React.useContext(OuterElementContext);
  return <TokenGatingAutocompleteList ref={ref} {...props} {...outerProps} />;
});

const TokenListboxVirtualized = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLElement>>((props, ref) => {
  const { children, ...other } = props;
  const itemData: React.ReactChild[] = (children as React.ReactChild[]).flatMap(
    (item: React.ReactChild & { children?: React.ReactChild[] }) => [item, ...(item.children || [])]
  );
  const itemCount = itemData?.length;
  const itemSize = 50;
  const maxNoOfItemsToDisplay = 5;
  const height = itemCount > maxNoOfItemsToDisplay ? itemSize * maxNoOfItemsToDisplay : itemCount * itemSize;
  return (
    <div ref={ref}>
      <OuterElementContext.Provider value={other}>
        <FixedSizeList
          itemData={itemData}
          height={height}
          width="100%"
          outerElementType={OuterElementType}
          innerElementType="ul"
          itemSize={itemSize}
          overscanCount={20}
          itemCount={itemCount}
        >
          {tokenListItemVirtualized}
        </FixedSizeList>
      </OuterElementContext.Provider>
    </div>
  );
});

type Props = {
  orgId: string;
  footerRef: MutableRefObject<HTMLDivElement>;
};

function TokenGatingConfigForm({ orgId, footerRef }: Props) {
  const { selectedTokenGatingCondition, closeTokenGatingModal } = useTokenGatingCondition();
  const [chain, setChain] = useState(chainOptions[0].value);
  const [name, setName] = useState('');
  const [accessConditionType, setAccessConditionType] = useState('ERC20');
  const [tokenList, setTokenList] = useState([]);
  const [nftList, setNftList] = useState([]);
  const [selectedToken, setSelectedToken] = useState(null);
  const [minAmount, setMinAmount] = useState(0);
  const [nameError, setNameError] = useState(null);
  const [ceationError, setCreationError] = useState(null);
  const [minAmountError, setMinAmountError] = useState(false);
  const [openChainSelection, setOpenChainSelection] = useState(false);
  const [getTokenInfo, { loading: getTokenInfoLoading }] = useLazyQuery(GET_TOKEN_INFO, {
    onCompleted: (data) => {
      if (data?.getTokenInfo) {
        const formattedOption = {
          label: data?.getTokenInfo.name,
          value: data?.getTokenInfo.contractAddress,
          icon: data?.getTokenInfo.logoUrl,
        };
        setSelectedToken(formattedOption);
        setTokenList((oldArray) => [...oldArray, formattedOption]);
      }
    },
    fetchPolicy: 'network-only',
  });

  const [getNFTInfo, { loading: getNFTInfoLoading }] = useLazyQuery(GET_NFT_INFO, {
    onCompleted: (data) => {
      if (data?.getNFTInfo) {
        if (
          data?.getNFTInfo.type !== 'ERC721' &&
          data?.getNFTInfo.type !== 'ERC1155' &&
          data?.getNFTInfo.type !== 'UNKNOWN'
        ) {
          return;
        }
        const formattedOption = {
          label: data?.getNFTInfo.name,
          value: data?.getNFTInfo.contractAddress,
          icon: data?.getNFTInfo.logoUrl,
        };
        setSelectedToken(formattedOption);
        setNftList((oldArray) => [...oldArray, formattedOption]);
      }
    },
    fetchPolicy: 'network-only',
  });

  const searchSelectedTokenInList = (contractAddress, tokenList, chain) => {
    contractAddress = contractAddress?.toLowerCase();
    for (const tokenInfo of tokenList) {
      if (contractAddress === tokenInfo.value) {
        return tokenInfo;
      }
    }
    if (accessConditionType === 'ERC20') {
      getTokenInfo({
        variables: {
          contractAddress,
          chain,
        },
      });
    }
    if (accessConditionType === 'ERC721') {
      getNFTInfo({
        variables: {
          contractAddress,
        },
      });
    }
  };

  useEffect(() => {
    // this is for edit only, prepopulating
    if (selectedTokenGatingCondition && selectedTokenGatingCondition?.accessCondition) {
      const accessCondition = selectedTokenGatingCondition.accessCondition as AccessCondition;

      setAccessConditionType(accessCondition?.type);
      setName(selectedTokenGatingCondition.name);
      setChain(accessCondition?.chain);
      setMinAmount(Number(accessCondition.minValue));
      const selectedContractAddress = accessCondition.contractAddress;
      if (selectedContractAddress) {
        let selectedTokenInfo;
        if (accessConditionType === 'ERC20') {
          selectedTokenInfo = searchSelectedTokenInList(selectedContractAddress, tokenList, chain);
        }
        if (accessConditionType === 'ERC721') {
          selectedTokenInfo = searchSelectedTokenInList(selectedContractAddress, nftList, chain);
        }
        if (selectedTokenInfo) {
          setSelectedToken(selectedTokenInfo);
        }
      }
    }
  }, [selectedTokenGatingCondition]);

  const clearErrors = () => {
    setNameError(null);
    setCreationError(null);
    setMinAmountError(null);
  };
  const clearSelection = () => {
    setName('');
    setAccessConditionType('ERC20');
    setSelectedToken(null);
    setMinAmount(0);
    closeTokenGatingModal();
  };
  const handleMinAmountOnChange = (event) => {
    const { value } = event.target;
    setMinAmount(Number(value));
  };
  const [createTokenGatingConditionForOrg, { loading: creating }] = useMutation(CREATE_TOKEN_GATING_CONDITION_FOR_ORG, {
    onCompleted: (data) => {
      clearErrors();
      clearSelection();
      closeTokenGatingModal();
    },
    refetchQueries: [GET_TOKEN_GATING_CONDITIONS_FOR_ORG],
    onError: (e) => {
      console.error(e);
      setCreationError('Error creating token gating condition');
    },
  });

  const handleMinAmountOnClick = (change) => {
    const newMinAmount = Number(minAmount) + change;
    if (newMinAmount < 0) return;
    setMinAmount(newMinAmount.toString());
  };
  const handleSelectedTokenInputChange = (event, value) => {
    let foundToken;
    if (value && value.length === 42 && value.startsWith('0x')) {
      if (accessConditionType === 'ERC20') {
        foundToken = searchSelectedTokenInList(value, tokenList, chain);
      } else if (accessConditionType === 'ERC721') {
        foundToken = searchSelectedTokenInList(value, nftList, chain);
      }
      if (foundToken) {
        setSelectedToken(foundToken);
      }
    }
  };
  const handleUpdateTokenGate = async () => {
    setMinAmountError(false);
    setNameError(false);
    if (minAmount <= 0) {
      setMinAmountError(true);
      return;
    }
    if (name === '') {
      setNameError(true);
      return;
    }
    clearErrors();
    const contractAddress = selectedToken?.value;
    try {
      await apollo.mutate({
        mutation: UPDATE_TOKEN_GATING_CONDITION,
        variables: {
          tokenGatingConditionId: selectedTokenGatingCondition?.id,
          input: {
            name,
            accessCondition: {
              contractAddress,
              type: accessConditionType,
              chain,
              method: 'balanceOf', // fixme this is wrong, should figure out what the method is
              minValue: minAmount.toString(),
            },
          },
        },
      });
    } catch (e) {
      console.error(e);
    }
    clearErrors();
    clearSelection();
    closeTokenGatingModal();
  };

  const handleCreateTokenGate = () => {
    setMinAmountError(false);
    setNameError(false);
    if (minAmount <= 0) {
      setMinAmountError(true);
      return;
    }
    if (name === '') {
      setNameError(true);
      return;
    }
    clearErrors();
    const contractAddress = selectedToken?.value;
    createTokenGatingConditionForOrg({
      variables: {
        input: {
          orgId,
          name,
          accessCondition: {
            contractAddress,
            type: accessConditionType,
            chain,
            method: 'balanceOf', // fixme this is wrong, should figure out what the method is
            minValue: minAmount.toString(),
          },
        },
      },
    });
  };
  const getTokenList = async () => {
    if (chain === 'harmony') {
      const formatted = HARMONY_TOKEN_LIST.map((token) => ({
        label: token.name,
        value: token.address,
        icon: token.logoURI,
      }));
      setTokenList(formatted);
      return formatted;
    }
    const erc20Url = 'https://tokens.coingecko.com/uniswap/all.json';
    const erc20Promise = fetch(erc20Url).then((r2) => r2.json());
    const [erc20s] = await Promise.all([erc20Promise]);
    const sorted = [...erc20s.tokens].sort((a, b) => (a.name > b.name ? 1 : -1));
    const formatted = sorted.map((token) => ({
      label: token.name,
      value: token.address,
      icon: token.logoURI,
    }));
    setTokenList(formatted);
    return formatted;
  };

  async function getNFTList() {
    const sorted = NFT_LIST.sort((a, b) => (a.name > b.name ? 1 : -1));
    const formatted = sorted.map((token) => ({
      label: token.name,
      value: token.address,
      icon: token.logoURI,
    }));
    setNftList(formatted);
    return formatted;
  }

  useEffect(() => {
    if (accessConditionType === 'ERC20') {
      getTokenList();
      // if (tokenList && tokenList.length === 0) {
      // }
    }
    if (accessConditionType === 'ERC721') {
      if (nftList && nftList.length === 0) {
        getNFTList();
      }
    }
  }, [accessConditionType, chain]);

  return (
    <>
      <CustomField label="Chain">
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
      </CustomField>

      <CustomField label="Token Type">
        <DropdownSelect
          value={accessConditionType}
          options={SUPPORTED_ACCESS_CONDITION_TYPES}
          setValue={setAccessConditionType}
          innerStyle={{
            marginTop: 10,
          }}
          formSelectStyle={{
            height: 'auto',
          }}
        />
      </CustomField>

      <Grid container marginBottom="18px">
        <Grid item xs={5}>
          <CustomField label="Token">
            <Autocomplete
              disablePortal
              options={accessConditionType === 'ERC20' ? tokenList : nftList}
              value={selectedToken}
              onInputChange={handleSelectedTokenInputChange}
              onChange={(event, newValue) => setSelectedToken(newValue)}
              renderInput={(params) => (
                <TokenGatingAutocompleteTextfieldWrapper ref={params.InputProps.ref}>
                  <TokenGatingTextfieldInput
                    {...params.inputProps}
                    endAdornment={
                      <TokenGatingAutocompleteTextfieldButton>
                        <TokenGatingAutocompleteTextfieldDownIcon />
                      </TokenGatingAutocompleteTextfieldButton>
                    }
                  />
                </TokenGatingAutocompleteTextfieldWrapper>
              )}
              ListboxComponent={TokenListboxVirtualized}
              PopperComponent={TokenGatingAutocompletePopper}
              renderOption={(props, option) => [props, option]}
              renderGroup={(params) => params}
            />
          </CustomField>
        </Grid>
        <Grid item xs={2} />
        <Grid item xs={5}>
          <CustomField label="Min. amount to hold" error={minAmountError ? 'Please enter an amount' : null}>
            <TokenGatingTextfieldInput
              type="number"
              value={minAmount.toString()}
              onChange={handleMinAmountOnChange}
              open={openChainSelection}
              onWheel={(e) => e.target.blur()}
              endAdornment={
                <TokenGatingTextfieldButtonWrapper>
                  <TokenGatingTextfieldButtonUp onClick={() => handleMinAmountOnClick(1)}>
                    <TokenGatingAutocompleteTextfieldDownIcon />
                  </TokenGatingTextfieldButtonUp>
                  <TokenGatingTextfieldButtonDown onClick={() => handleMinAmountOnClick(-1)}>
                    <TokenGatingAutocompleteTextfieldDownIcon />
                  </TokenGatingTextfieldButtonDown>
                </TokenGatingTextfieldButtonWrapper>
              }
            />
          </CustomField>
        </Grid>
      </Grid>

      <CustomField label="Name">
        <TokenGatingTextfieldInput value={name} onChange={(e) => setName(e.target.value)} />
      </CustomField>

      {footerRef.current
        ? createPortal(
            <Grid container gap="18px">
              <Button color="grey" onClick={closeTokenGatingModal}>
                Cancel
              </Button>
              {selectedTokenGatingCondition ? (
                <Button onClick={handleUpdateTokenGate}>Update Token Gate</Button>
              ) : (
                <Button onClick={handleCreateTokenGate} disabled={creating}>
                  Create Token Gate
                </Button>
              )}
            </Grid>,
            footerRef.current
          )
        : null}
    </>
  );
}

export default TokenGatingConfigForm;
