import React, { useState } from 'react';
import { Box, Chip, OutlinedInput } from '@mui/material';

import { toggleHtmlOverflow } from 'utils/helpers';
import FilterIcon from '../../Icons/filter';
import ArrowDropDownIcon from '../../Icons/arrowDropDown';

import { CreateFormSelectArrowIcon } from '../DropdownSelect/styles';

import {
  MultiSelectClearButton,
  MultiSelectCounter,
  MultiSelectForm,
  MultiSelectInputLabel,
  MultiSelectMenuHeader,
  MultiSelectMenuItem,
  MultiSelectSelector,
} from './styles';

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: 340,
      height: '100%',
      minWidth: 325,
      background: 'linear-gradient(180deg, #1E1E1E 0%, #141414 109.19%)',
      padding: '15px',

      '*::-webkit-scrollbar': {
        width: 100,
      },
    },
  },
};

export function MultiSelect(props) {
  const { name, options } = props;
  const [value, setValue] = useState([]);

  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setValue(
      // On autofill we get a the stringified value.
      typeof value === 'string' ? value.split(',') : value
    );
  };

  const resetValue = () => {
    setValue([]);
  };

  const labelId = `multiple-chip-label-${name}`;

  return (
    <MultiSelectForm>
      <MultiSelectInputLabel id={labelId}>
        {!value.length && (
          <>
            <FilterIcon />
            Filter
          </>
        )}
      </MultiSelectInputLabel>

      <MultiSelectSelector
        multiple
        labelId={labelId}
        id={`multiple-chip-${name}`}
        value={value}
        onChange={handleChange}
        onClose={toggleHtmlOverflow}
        onOpen={toggleHtmlOverflow}
        input={<OutlinedInput label="Chip" />}
        renderValue={(selected) => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
            {selected.map((value) => (
              <Chip key={value} label={value} />
            ))}
          </Box>
        )}
        MenuProps={MenuProps}
        IconComponent={ArrowDropDownIcon}
      >
        <MultiSelectMenuHeader onClick={(e) => e.stopPropagation()}>
          <MultiSelectCounter>{value.length} selected</MultiSelectCounter>
          <MultiSelectClearButton
            onClick={(e) => {
              e.stopPropagation();
              resetValue();
            }}
          >
            Clear
          </MultiSelectClearButton>
        </MultiSelectMenuHeader>
        {options.map(({ label, value }) => (
          <MultiSelectMenuItem key={value} value={value}>
            {label}
          </MultiSelectMenuItem>
        ))}
      </MultiSelectSelector>
    </MultiSelectForm>
  );
}
