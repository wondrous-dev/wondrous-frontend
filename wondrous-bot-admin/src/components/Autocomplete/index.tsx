import { Autocomplete, Popper } from '@mui/material';
import { StyledTextFieldSelect } from 'components/Shared/styles';

const AutocompleteComponent = ({
  id = 'autocomplete-id',
  options,
  handleChange,
  value,
}) => {
  if(!options?.length) return null;
  return (
    <Autocomplete
      disablePortal
      id={id}
      options={options}
      value={value}
      getOptionLabel={(option) => {
        
        return option?.label || options?.find(i => i.value === option)?.label || ''
      }}
      sx={{ width: 300 }}
      onChange={(e, { value }) => {
        handleChange(value);
      }}
      PopperComponent={(props) => (
        <Popper
          {...props}
          sx={{
            '.MuiPaper-root': {
              backgroundColor: '#E8E8E8',
              borderRadius: '6px',
            },
          }}
        />
      )}
      renderInput={(params) => (
        <StyledTextFieldSelect
          {...params}
          SelectProps={{
            displayEmpty: true,
          }}
        />
      )}
    />
  );
};

export default AutocompleteComponent;
