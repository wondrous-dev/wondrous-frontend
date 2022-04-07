import Ethereum from 'components/Icons/ethereum';
import PolygonIcon from 'components/Icons/polygonMaticLogo.svg';
import { useEffect, useState } from 'react';
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

const options = [
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

const TokenGatingSettings = () => {
  const [minAmount, setMinAmount] = useState(0);
  const handleMinAmountOnChange = (event) => {
    const { value } = event.target;
    if (!/^\d+$/.test(value)) return;
    setMinAmount(Number(value));
  };
  const handleMinAmountOnClick = (change) => {
    setMinAmount(Number(minAmount + change));
  };

  const [chain, setChain] = useState(options[0]);

  const [tokenList, setTokenList] = useState(null);
  const [selectedToken, setSelectedToken] = useState(null);

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
  }, [setTokenList]);

  console.log(tokenList);

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
            options={options}
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
                renderOption={(props, option) => (
                  <TokenGatingAutocompleteListItem value={option.value} {...props}>
                    <TokenGatingInputImage src={option?.icon} />
                    {option.label}
                  </TokenGatingAutocompleteListItem>
                )}
                ListboxComponent={TokenGatingAutocompleteList}
                PopperComponent={TokenGatingAutocompletePopper}
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
