import { SettingsWrapper } from '../settingsWrapper';
import {
  TokenGatingAutocomplete,
  TokenGatingAutocompleteLabel,
  TokenGatingAutocompleteListBox,
  TokenGatingAutocompletePopper,
  TokenGatingAutocompleteTextfieldButton,
  TokenGatingAutocompleteTextfieldIcon,
  TokenGatingAutocompleteTextfieldInput,
  TokenGatingAutocompleteTextfieldWrapper,
  TokenGatingFormHeader,
  TokenGatingFormHeaderSecondary,
  TokenGatingFormWrapper,
  TokenGatingHeaderText,
  TokenGatingHeaderTextSecondary,
  TokenGatingSubheading,
} from './styles';

const TokenGatingSettings = () => {
  return (
    <SettingsWrapper>
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
              <TokenGatingAutocompleteTextfieldInput
                {...params.inputProps}
                endAdornment={
                  <TokenGatingAutocompleteTextfieldButton>
                    <TokenGatingAutocompleteTextfieldIcon />
                  </TokenGatingAutocompleteTextfieldButton>
                }
              />
            </TokenGatingAutocompleteTextfieldWrapper>
          )}
          ListboxComponent={TokenGatingAutocompleteListBox}
          PopperComponent={TokenGatingAutocompletePopper}
        />
      </TokenGatingFormWrapper>
    </SettingsWrapper>
  );
};

export default TokenGatingSettings;
