import { Popper } from '@mui/material';
import { createFilterOptions } from '@mui/material/Autocomplete';
import CreateBtnIconDark from 'components/Icons/createBtnIconDark';
import shuffle from 'lodash/shuffle';
import React, { useEffect, useState } from 'react';
import { ColorTypes } from 'utils/constants';
import {
  OptionItem,
  StyledAutocomplete,
  StyledChipTag,
  TagAutocompletePopper,
  TagsChipWrapper,
  TagsTextField,
} from './styles';

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
  autoFocus?: boolean;
  disablePortal?: boolean;
};

const filter = createFilterOptions({
  matchFrom: 'start',
  stringify: (option: Option) => option.name || '',
});

const colors = Object.values(ColorTypes);
const randomColors = shuffle(colors);

const PopperComponent = (props) => (
  <Popper
    {...props}
    modifiers={[
      {
        name: 'offset',
        enabled: true,
        options: {
          offset: [0, 8],
        },
      },
    ]}
  />
);

function Tags({ options, onChange, onCreate, limit, ids = [], autoFocus = false, disablePortal = false }: Props) {
  const [openTags, setOpenTags] = useState(false);
  const [randomColor, setRandomColor] = useState(randomColors[0]);

  useEffect(() => {
    if (autoFocus) {
      setOpenTags(true);
    }
  }, [autoFocus]);

  const generateRandomColor = () =>
    options.length < colors.length
      ? // pick random color that doesn't exist in the option
        colors.find((color) => !options.some((option) => option.color === color))
      : shuffle(colors)[0];

  useEffect(() => {
    setRandomColor(generateRandomColor());
  }, [options]);

  return (
    <TagAutocompletePopper
      clearOnBlur
      multiple
      filterSelectedOptions
      freeSolo
      fullWidth
      disablePortal={disablePortal}
      open={openTags}
      PopperComponent={PopperComponent}
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
      renderTags={(value, getLabelProps) =>
        value?.map((option, index) => {
          const props = getLabelProps({ index });

          return (
            <StyledChipTag
              key={index}
              deleteIcon={<div>&times;</div>}
              onClick={props.onDelete}
              label={option.name}
              // background={option.color}
              variant="outlined"
              onDelete={props.onDelete}
            />
          );
        })
      }
      renderInput={(params) => (
        <TagsTextField
          {...params}
          autoFocus={autoFocus}
          fullWidth
          placeholder={ids.length !== limit ? `Add tags (max ${limit})` : ''}
          InputProps={{
            ...params.InputProps,
            startAdornment: <TagsChipWrapper>{params.InputProps.startAdornment}</TagsChipWrapper>,
            endAdornment: null,
          }}
        />
      )}
    />
  );
}

export default Tags;
