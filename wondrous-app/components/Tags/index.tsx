import React, { useState } from 'react';
import { TextField } from '@material-ui/core';
import { createFilterOptions } from '@material-ui/lab';
import _ from 'lodash';

import { RightInputAdornment, StyledAutocomplete, StyledChipTag, LeftInputAdornment, OptionItem } from './styles';
import { White } from '../../theme/colors';
import SearchIcon from '../Icons/search';
import TagsIcon from '../Icons/tagsIcon';
import CreateBtnIconDark from 'components/Icons/createBtnIconDark';
import { ColorTypes } from 'utils/constants';

export type Option = {
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
  ids: string[];
  // The maximum number of labels
  limit: number;
  // Callback fired when the value changes
  onChange?: (ids: string[]) => unknown;
  onCreate?: (option: Option) => unknown;
};

const filter = createFilterOptions({
  matchFrom: 'start',
  stringify: (option: Option) => option.name || '',
});

function Tags({ options, onChange, onCreate, limit, ids = [] }: Props) {
  const [openTags, setOpenTags] = useState(false);
  const [randomColor, setRandomColor] = useState(_.sample(Object.values(ColorTypes)));

  return (
    <StyledAutocomplete
      clearOnBlur
      multiple
      filterSelectedOptions
      freeSolo
      open={openTags}
      onOpen={() => setOpenTags(true)}
      onClose={() => setOpenTags(false)}
      onChange={(e, tags) => {
        if (tags.length > limit) {
          return;
        }

        const lastTagOrNewTagName = tags[tags.length - 1];

        if (lastTagOrNewTagName) {
          const randomColor = _.sample(Object.values(ColorTypes));

          if (typeof lastTagOrNewTagName === 'string') {
            onCreate({
              name: lastTagOrNewTagName,
            } as Option);
            return setRandomColor(randomColor);
          } else if (!lastTagOrNewTagName.id) {
            onCreate(lastTagOrNewTagName);
            return setRandomColor(randomColor);
          }
        }

        onChange(tags.map((tag) => tag.id));
      }}
      getOptionLabel={(option) => option.name}
      filterOptions={(options, params) => {
        const filtered = filter(options, params);

        if (!filtered.length && ids.length < limit && params.inputValue.trim().length) {
          filtered.push({
            name: params.inputValue,
            color: randomColor,
          } as Option);
        }

        return filtered;
      }}
      renderOption={(props, option) => {
        if (!option.id) {
          return (
            <OptionItem {...props} color={option.color}>
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
      disabled={ids.length === limit}
      value={ids.map((id) => options.find((label) => label.id === id)).filter((v) => !!v)}
      options={ids.length !== limit ? options : []}
      renderTags={(value, getLabelProps) => {
        return value?.map((option, index) => {
          const props = getLabelProps({ index });

          return (
            <StyledChipTag
              key={index}
              icon={<span>&times;</span>}
              onClick={props.onDelete}
              label={option.name}
              bgColor={option.color}
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
              placeholder={ids.length !== limit ? `Add tags (max ${limit})` : ''}
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
