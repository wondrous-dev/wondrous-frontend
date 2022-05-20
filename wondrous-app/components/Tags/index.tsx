import React, { useState } from 'react';
import { TextField } from '@material-ui/core';
import { createFilterOptions } from '@material-ui/lab';

import { RightInputAdornment, StyledAutocomplete, StyledChipTag, LeftInputAdornment, OptionItem } from './styles';
import { White } from '../../theme/colors';
import SearchIcon from '../Icons/search';
import TagsIcon from '../Icons/tagsIcon';
import CreateBtnIconDark from 'components/Icons/createBtnIconDark';

type Option = {
  id: string;
  createdAt: string;
  orgId: string;
  name: string;
  color: string;
};

type Props = {
  // Array of options.
  options: Option[];
  // The value of the autocomplete.
  value?: Array<string>;
  // The maximum number of labels
  limit: number;
  // Callback fired when the value changes
  onChange?: (value: Array<string>) => any;
};

const filter = createFilterOptions({
  matchFrom: 'start',
  stringify: (option: Option) => option.name || '',
});

function Tags({ options, onChange, limit, value = [] }: Props) {
  const [openTags, setOpenTags] = useState(false);

  return (
    <StyledAutocomplete
      open={openTags}
      onOpen={() => setOpenTags(true)}
      onClose={() => setOpenTags(false)}
      onChange={(e, value) => {
        if (value.length <= limit) {
          onChange(value);
        }
      }}
      getOptionLabel={(option) => option.name}
      filterOptions={(options, params) => {
        const filtered = filter(options, params);

        if (!filtered.length && params.inputValue !== '') {
          filtered.push({
            name: params.inputValue,
          } as Option);
        }

        return filtered;
      }}
      renderOption={(props, option) => {
        if (!option.id) {
          return (
            <OptionItem {...props}>
              <CreateBtnIconDark style={{ marginRight: '16px' }} /> Create tag for &quot;{option.name}&quot;
            </OptionItem>
          );
        }

        return (
          <OptionItem {...props} color={option.color}>
            {option.name}
          </OptionItem>
        );
      }}
      clearOnBlur
      multiple
      filterSelectedOptions
      freeSolo
      value={value}
      options={value.length !== limit ? options : []}
      renderTags={(value, getLabelProps) => {
        return value?.map((option, index) => {
          const props = getLabelProps({ index });

          debugger;

          return (
            <StyledChipTag
              key={index}
              icon={<span>&times;</span>}
              onClick={props.onDelete}
              label={option.name}
              variant="outlined"
            />
          );
        });
      }}
      renderInput={(params) => {
        return (
          <>
            <LeftInputAdornment>
              <TagsIcon />
            </LeftInputAdornment>
            <TextField
              style={{
                color: White,
                fontFamily: 'Space Grotesk',
                fontSize: '14px',
                paddingLeft: '4px',
                paddingRight: '0',
              }}
              {...params}
              variant="standard"
              InputLabelProps={{ shrink: false }}
              placeholder={value.length !== limit ? `Add tags (max ${limit})` : ''}
              InputProps={{
                ...params.InputProps,
                endAdornment: null,
              }}
            />
            <RightInputAdornment>
              <SearchIcon color="white" />
            </RightInputAdornment>
          </>
        );
      }}
    />
  );
}

export default Tags;
