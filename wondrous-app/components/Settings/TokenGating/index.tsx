import { SettingsWrapper } from '../settingsWrapper';
import {
  TokenGatingAutocomplete,
  TokenGatingAutocompleteLabel,
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

const options = ['abcd', 'xyz'];

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
          popupIcon={<TokenGatingAutocompleteTextfieldIcon />}
          openOnFocus={true}
        />
      </TokenGatingFormWrapper>
    </SettingsWrapper>
  );
};

export default TokenGatingSettings;
