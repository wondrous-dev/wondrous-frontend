import { useState } from 'react';
import { SettingsWrapper } from '../settingsWrapper';
import {
  TokenGatingAutocomplete,
  TokenGatingAutocompleteLabel,
  TokenGatingAutocompleteListBox,
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

const options = ['abcd', 'xyz', 'xyz', 'xyz', 'xyz', 'xyz', 'xyz', 'xyz', 'xyz', 'xyz', 'xyz'];

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
            ListboxComponent={TokenGatingAutocompleteListBox}
            PopperComponent={TokenGatingAutocompletePopper}
          />
          <TokenGatingTokenAmountWrapper>
            <TokenGatingInputWrapper>
              <TokenGatingAutocompleteLabel>Token</TokenGatingAutocompleteLabel>
              <TokenGatingAutocomplete
                disablePortal
                options={options}
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
                ListboxComponent={TokenGatingAutocompleteListBox}
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
