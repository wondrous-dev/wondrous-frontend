import Ethereum from 'components/Icons/ethereum';
import PolygonIcon from 'components/Icons/polygonMaticLogo.svg';
import React, { useEffect, useState } from 'react';
import { FixedSizeList, ListChildComponentProps } from 'react-window';
import { SettingsWrapper } from '../settingsWrapper';
import {
  TokenGatingAutocomplete,
  TokenGatingAutocompleteLabel,
  TokenGatingAutocompleteList,
  TokenGatingAutocompleteListItem,
  TokenGatingAutocompletePopper,
  TokenGatingAutocompleteTextfieldButton,
  TokenGatingAutocompleteTextfieldDownIcon,
  TokenGatingAutocompleteTextfieldWrapper,
  TokenGatingButton,
  TokenGatingFormHeader,
  TokenGatingFormHeaderSecondary,
  TokenGatingFormWrapper,
  TokenGatingHeaderText,
  TokenGatingHeaderTextSecondary,
  TokenGatingInputImage,
  TokenGatingInputWrapper,
  TokenGatingSubheading,
  TokenGatingTextfieldButtonDown,
  TokenGatingTextfieldButtonUp,
  TokenGatingTextfieldButtonWrapper,
  TokenGatingTextfieldInput,
  TokenGatingTextfieldInputWrapper,
  TokenGatingTokenAmountWrapper,
  TokenGatingWrapper,
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
];

const renderRow = (props: ListChildComponentProps) => {
  const { data, index, style } = props;
  const dataSet = data[index];
  console.log(props);
  return (
    <TokenGatingAutocompleteListItem {...props} {...dataSet[0]} value={dataSet[1].value} style={style}>
      <TokenGatingInputImage src={dataSet[1]?.icon} />
      {dataSet[1].label}
    </TokenGatingAutocompleteListItem>
  );
};

const OuterElementContext = React.createContext({});

const OuterElementType = React.forwardRef<HTMLDivElement>(function OuterElementType(props, ref) {
  const outerProps = React.useContext(OuterElementContext);
  return <TokenGatingAutocompleteList ref={ref} {...props} {...outerProps} />;
});

const ListboxComponent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLElement>>(function ListboxComponent(
  props,
  ref
) {
  const { children, ...other } = props;
  const itemData: React.ReactChild[] = (children as React.ReactChild[]).flatMap(
    (item: React.ReactChild & { children?: React.ReactChild[] }) => [item, ...(item.children || [])]
  );
  const itemCount = itemData.length;
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
          {renderRow}
        </FixedSizeList>
      </OuterElementContext.Provider>
    </div>
  );
});

const TokenGatingSettings = () => {
  const [chain, setChain] = useState(chainOptions[0]);
  const [tokenList, setTokenList] = useState(null);
  const [selectedToken, setSelectedToken] = useState(null);
  const [minAmount, setMinAmount] = useState(0);
  const handleMinAmountOnChange = (event) => {
    const { value } = event.target;
    if (!/^\d+$/.test(value)) return;
    setMinAmount(Number(value));
  };
  const handleMinAmountOnClick = (change) => {
    setMinAmount(Number(minAmount + change));
  };

  useEffect(() => {
    const getTokenList = async () => {
      const erc20Url = 'https://tokens.coingecko.com/uniswap/all.json';
      const erc20Promise = fetch(erc20Url).then((r2) => r2.json());
      const erc721Url = 'https://raw.githubusercontent.com/0xsequence/token-directory/main/index/mainnet/erc721.json';
      const erc721Promise = fetch(erc721Url).then((r2) => r2.json());
      const [erc20s, erc721s] = await Promise.all([erc20Promise, erc721Promise]);
      const sorted = [...erc20s.tokens, ...erc721s.tokens].sort((a, b) => (a.name > b.name ? 1 : -1));
      const formatted = sorted.map((token) => {
        return {
          label: token.name,
          value: token.address,
          icon: token.logoURI,
        };
      });
      setTokenList(formatted);
      setSelectedToken(formatted[0]);
    };
    getTokenList();
  }, []);

  console.log(ListboxComponent);

  return (
    <SettingsWrapper>
      <TokenGatingWrapper>
        <TokenGatingHeaderText>
          Token <TokenGatingHeaderTextSecondary as="span">gating</TokenGatingHeaderTextSecondary>
        </TokenGatingHeaderText>
        <TokenGatingSubheading>
          Set a minimum amount of holdings for users to get standard permissions
        </TokenGatingSubheading>
        <TokenGatingFormWrapper>
          <TokenGatingFormHeader>
            Token gating for <TokenGatingFormHeaderSecondary as="span">Wonder</TokenGatingFormHeaderSecondary>
          </TokenGatingFormHeader>
          <TokenGatingAutocompleteLabel>Chain</TokenGatingAutocompleteLabel>
          <TokenGatingAutocomplete
            disablePortal
            options={chainOptions}
            value={chain}
            onChange={(event, newValue) => setChain(newValue)}
            renderInput={(params) => {
              return (
                <TokenGatingAutocompleteTextfieldWrapper ref={params.InputProps.ref}>
                  <TokenGatingTextfieldInput
                    {...params.inputProps}
                    endAdornment={
                      <TokenGatingAutocompleteTextfieldButton>
                        <TokenGatingAutocompleteTextfieldDownIcon />
                      </TokenGatingAutocompleteTextfieldButton>
                    }
                  ></TokenGatingTextfieldInput>
                </TokenGatingAutocompleteTextfieldWrapper>
              );
            }}
            renderOption={(props, option) => (
              <TokenGatingAutocompleteListItem value={option.value} {...props}>
                {option?.icon}
                {option.label}
              </TokenGatingAutocompleteListItem>
            )}
            ListboxComponent={TokenGatingAutocompleteList}
            PopperComponent={TokenGatingAutocompletePopper}
            openOnFocus
          />
          <TokenGatingTokenAmountWrapper>
            <TokenGatingInputWrapper>
              <TokenGatingAutocompleteLabel>Token</TokenGatingAutocompleteLabel>
              <TokenGatingAutocomplete
                disablePortal
                options={tokenList}
                value={selectedToken}
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
                ListboxComponent={ListboxComponent}
                PopperComponent={TokenGatingAutocompletePopper}
                renderOption={(props, option) => [props, option]}
                renderGroup={(params) => params}
              />
            </TokenGatingInputWrapper>
            <TokenGatingInputWrapper>
              <TokenGatingAutocompleteLabel>Min. amount to hold</TokenGatingAutocompleteLabel>
              <TokenGatingTextfieldInputWrapper>
                <TokenGatingTextfieldInput
                  value={minAmount}
                  onChange={handleMinAmountOnChange}
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
              </TokenGatingTextfieldInputWrapper>
            </TokenGatingInputWrapper>
          </TokenGatingTokenAmountWrapper>
          <TokenGatingButton>Confirm</TokenGatingButton>
        </TokenGatingFormWrapper>
      </TokenGatingWrapper>
    </SettingsWrapper>
  );
};

export default TokenGatingSettings;
