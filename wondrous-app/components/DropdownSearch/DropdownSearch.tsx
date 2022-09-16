/* eslint-disable react/no-unstable-nested-components */
import { useEffect, useState, useRef, useMemo } from 'react';
import { Autocomplete, Box, Checkbox, ClickAwayListener } from '@mui/material';

import {
  DropdownSearchLabel,
  DropdownSearchButton,
  DropdownSearchImageLabelWrapper,
  DropdownSearchDownIcon,
  DropdownSearchPopper,
  DropdownSearchInput,
  DropdownSearchInputAdornment,
  DropdownSearchInputIcon,
  DropdownSearchCheckBox,
  DropdownSearchCheckBoxEmpty,
  DropdownSearchPaper,
  DropdownSearchList,
  DropdownSearchListItem,
  DropdownSearchAutocompletePopper,
} from './DropdownSearchStyles';

const DropdownSearch = ({
  value,
  options,
  disabled,
  label = 'Select an option',
  searchPlaceholder = 'Search...',
  autoFocus = false,
  onChange,
  onClose,
}) => {
  const anchorEl = useRef(null);

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (autoFocus) {
      setIsOpen(true);
    }
  }, [autoFocus]);

  const handleClick = () => setIsOpen((open) => !open);

  const handleClickAway = () => setIsOpen(false);
  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box width="100%">
        <DropdownSearchButton open={isOpen} disabled={!options || disabled} onClick={handleClick} ref={anchorEl}>
          <DropdownSearchImageLabelWrapper>
            {value?.length > 0 ? (
              value?.map((category) => (
                <DropdownSearchLabel key={category.id} hasValue={category.id}>
                  {category.label}
                </DropdownSearchLabel>
              ))
            ) : (
              <DropdownSearchLabel>{label}</DropdownSearchLabel>
            )}
          </DropdownSearchImageLabelWrapper>
          <DropdownSearchDownIcon onClick={onClose} />
        </DropdownSearchButton>
        <DropdownSearchPopper open={isOpen} anchorEl={anchorEl.current} placement="bottom-start" disablePortal>
          <Autocomplete
            multiple
            value={value || []}
            renderInput={(params) => (
              <DropdownSearchInput
                {...params}
                autoFocus={autoFocus}
                disableUnderline
                fullWidth
                placeholder={searchPlaceholder}
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <DropdownSearchInputAdornment position="end">
                      <DropdownSearchInputIcon />
                    </DropdownSearchInputAdornment>
                  ),
                }}
                ref={params.InputProps.ref}
              />
            )}
            disableClearable
            isOptionEqualToValue={(option, optionValue) => option.id === optionValue?.id}
            getOptionLabel={(option) => option.label}
            renderOption={(props, option, { selected }) => (
              <DropdownSearchListItem {...props}>
                {selected ? <DropdownSearchCheckBox /> : <DropdownSearchCheckBoxEmpty />}
                <DropdownSearchLabel hasValue placeholder="Favorites">
                  {option?.label}
                </DropdownSearchLabel>
              </DropdownSearchListItem>
            )}
            PaperComponent={DropdownSearchPaper}
            ListboxComponent={DropdownSearchList}
            PopperComponent={(params) => {
              const { children } = params;
              return <DropdownSearchAutocompletePopper {...params}>{children}</DropdownSearchAutocompletePopper>;
            }}
            open={isOpen}
            options={options}
            disablePortal
            onChange={(event, value) => {
              onChange(value);
            }}
            blurOnSelect
          />
        </DropdownSearchPopper>
      </Box>
    </ClickAwayListener>
  );
};

export default DropdownSearch;
