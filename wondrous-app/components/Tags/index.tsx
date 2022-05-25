import React, { useEffect, useState } from 'react';
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

const colors = Object.values(ColorTypes);
const randomColors = _.shuffle(colors);

function Tags({ options, onChange, onCreate, limit, ids = [] }: Props) {
  const [openTags, setOpenTags] = useState(false);
  const [randomColor, setRandomColor] = useState(randomColors[0]);

  const generateRandomColor = () => {
    return options.length < colors.length
      ? // pick random color that doesn't exist in the option
        colors.find((color) => !options.some((option) => option.color === color))
      : _.shuffle(colors)[0];
  };

  useEffect(() => {
    setRandomColor(generateRandomColor());
  }, [options]);

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

        const tagOrNewTagName = tags[tags.length - 1];

        if (!tagOrNewTagName) {
          onChange([]);

          return;
        }

        if (typeof tagOrNewTagName === 'string') {
          const option = options.find((option) => option.name === tagOrNewTagName);

          if (option) {
            const selected = ids.find((id) => option.id === id);

            if (!selected) {
              tags[tags.length - 1] = option;
              onChange(tags.map((tag) => tag.id));
            }
          } else {
            onCreate({
              name: tagOrNewTagName,
              color: randomColor,
            } as Option);
          }
        } else if (tagOrNewTagName.id) {
          onChange(tags.map((tag) => tag.id));
        } else {
          onCreate(tagOrNewTagName);
        }
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
              background={option.color}
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
