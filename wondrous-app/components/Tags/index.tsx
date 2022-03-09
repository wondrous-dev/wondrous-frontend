import React, { useState } from 'react';
import { InputAdornment, TextField } from '@material-ui/core';

import { StyledAutocomplete, StyledChipTag } from './styles';
import { White, Grey700 } from '../../theme/colors';
import SearchIcon from '../Icons/search';

type Props = {
  // Array of options.
  options: Array<string>;
  // The value of the autocomplete.
  value?: Array<string>;
  // The maximum number of tags
  limit: number;
  // Callback fired when the value changes
  onChange?: (value: Array<string>) => any;
};

function Tags({ options, onChange, limit, value = [] }: Props) {
  const [openTags, setOpenTags] = useState(false);

  return (
    <StyledAutocomplete
      open={openTags}
      onOpen={() => setOpenTags(true)}
      onClose={() => setOpenTags(false)}
      onChange={(e, value) => onChange(value)}
      multiple
      filterSelectedOptions
      value={value}
      options={value.length !== limit ? options : []}
      renderTags={(value, getTagProps) =>
        value?.map((option, index) => {
          const props = getTagProps({ index });

          return (
            <StyledChipTag
              key={index}
              icon={<span>&times;</span>}
              onClick={props.onDelete}
              label={option}
              variant="outlined"
            />
          );
        })
      }
      renderInput={(params) => {
        return (
          <TextField
            style={{
              color: White,
              fontFamily: 'Space Grotesk',
              fontSize: '14px',
              paddingLeft: '4px',
            }}
            {...params}
            variant="standard"
            InputLabelProps={{ shrink: false }}
            placeholder={value.length !== limit ? `Add tags (max ${limit})` : ''}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        );
      }}
    />
  );
}

export default Tags;
