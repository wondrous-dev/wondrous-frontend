import DropdownSearch from 'components/DropdownSearch';
import { useMemo, useState } from 'react';
import {
  PodSearchAutocomplete,
  PodSearchAutocompletePopper,
  PodSearchButton,
  PodSearchButtonArrowIcon,
  PodSearchButtonDeleteIcon,
  PodSearchClickAway,
  PodSearchDefaultImage,
  PodSearchImageLabelWrapper,
  PodSearchInput,
  PodSearchInputAdornment,
  PodSearchInputIcon,
  PodSearchLabel,
  PodSearchList,
  PodSearchListItem,
  PodSearchPaper,
  PodSearchPopper,
  PodSearchWrapper,
} from './styles';

function PodSearch(props) {
  const { options, onChange, value, disabled, multiple = false } = props;
  const selectedValue = useMemo(() => {
    if(multiple) return value;
    return options.find((option) => option.id === value?.id);
  }, [value, options, multiple]);

  return (
    <DropdownSearch
      label="Select pod"
      searchPlaceholder="Search pods"
      multiple={multiple}
      anchorComponent={({ onClick, disabled, open }) => (
        <PodSearchButton open={open} disabled={disabled} onClick={onClick}>
          <PodSearchImageLabelWrapper>
            <PodSearchDefaultImage color={selectedValue?.color ?? `#474747`} />
            <PodSearchLabel>{selectedValue?.label ?? `Select a Pod`}</PodSearchLabel>
          </PodSearchImageLabelWrapper>
          {selectedValue && !disabled ? (
            <PodSearchButtonDeleteIcon
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onChange(null);
              }}
            />
          ) : (
            <PodSearchButtonArrowIcon />
          )}
        </PodSearchButton>
      )}
      value={selectedValue}
      options={options}
      disabled={!options || disabled}
      onChange={onChange}
    />
  );
}

export default PodSearch;
