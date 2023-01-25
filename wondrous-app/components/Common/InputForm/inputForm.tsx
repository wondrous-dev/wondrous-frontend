import React from 'react';
import SearchIcon from '../../Icons/search';
import { SearchInput, SearchInputBlock, SearchInputIcon, SearchInputIconButton } from './styles';

function InputForm(props) {
  const {
    icon,
    placeholder,
    search,
    margin,
    style,
    type,
    value,
    onChange,
    min,
    endAdornment,
    disabled = false,
  } = props;

  return (
    <SearchInputBlock style={style} margin={margin}>
      <SearchInput
        type={type}
        min={min}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        startAdornment={<SearchInputIcon position="start">{icon}</SearchInputIcon>}
        endAdornment={endAdornment}
        onWheel={(e) => e.target.blur()}
        disabled={disabled}
      />
      {search && (
        <SearchInputIconButton>
          <SearchIcon />
        </SearchInputIconButton>
      )}
    </SearchInputBlock>
  );
}

export default InputForm;
