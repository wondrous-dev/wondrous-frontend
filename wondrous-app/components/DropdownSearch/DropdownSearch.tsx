/* eslint-disable react/no-unstable-nested-components */
import { useEffect, useState, useRef, useMemo } from 'react';
import { Autocomplete, Box, ClickAwayListener } from '@mui/material';

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
  onClose = null,
  multiple = true,
  anchorComponent = null,
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

  const selectedValues = useMemo(() => {
    if (!multiple) {
      return options?.find((option) => option.id === value?.id || option.id === value);
    }
    const valueIds = value?.map((v) => v.id || v);
    return options?.filter((option) => valueIds?.includes(option.id));
  }, [value, options, multiple]);

  return (
    <ClickAwayListener onClickAway={handleClickAway}>
      <Box width="100%">
        {anchorComponent ? (
          <div ref={anchorEl}>{anchorComponent({ onClick: handleClick, disabled, open: isOpen })}</div>
        ) : (
          <DropdownSearchButton open={isOpen} disabled={!options || disabled} onClick={handleClick} ref={anchorEl}>
            <DropdownSearchImageLabelWrapper>
              {selectedValues?.length > 0 ? (
                selectedValues.map((v) => (
                  <DropdownSearchLabel key={v.id} hasValue={v.id}>
                    {v.label}
                  </DropdownSearchLabel>
                ))
              ) : (
                <DropdownSearchLabel>{label}</DropdownSearchLabel>
              )}
            </DropdownSearchImageLabelWrapper>
            <DropdownSearchDownIcon onClick={() => onClose?.()} />
          </DropdownSearchButton>
        )}

        <DropdownSearchPopper
          open={isOpen}
          anchorEl={anchorEl.current}
          placement="bottom-start"
          disablePortal
          modifiers={[
            {
              name: 'offset',
              enabled: true,
              options: {
                offset: [0, 8],
              },
            },
          ]}
        >
          <Autocomplete
            multiple={multiple}
            value={selectedValues}
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
                  {option?.label || ''}
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
            onChange={(_, changedOptions) => {
              onChange(changedOptions);
            }}
            blurOnSelect
          />
        </DropdownSearchPopper>
      </Box>
    </ClickAwayListener>
  );
};

export default DropdownSearch;
