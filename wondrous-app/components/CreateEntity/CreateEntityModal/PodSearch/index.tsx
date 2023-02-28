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

const MultiplePodsSelected = ({ selectedValue }) => {
  if (selectedValue?.length > 1) {
    return (
      <>
        <PodSearchDefaultImage color="#474747" />
        <PodSearchLabel>{`${selectedValue?.length} pods selected`}</PodSearchLabel>
      </>
    );
  }
  return (
    <>
      <PodSearchDefaultImage color={selectedValue[0]?.color ?? `#474747`} />
      <PodSearchLabel>{selectedValue[0]?.label ?? `Select a Pod`}</PodSearchLabel>
    </>
  );
};

function PodSearch(props) {
  const { options, onChange, value, disabled, multiple = false } = props;
  const selectedValue = useMemo(() => {
    if (multiple) return options.filter((option) => value.includes(option.id));
    return options.find((option) => option.id === value?.id || option.id === value);
  }, [value, options, multiple]);

  console.log(selectedValue, 'selected');
  return (
    <DropdownSearch
      label="Select pod"
      searchPlaceholder="Search pods"
      multiple={multiple}
      anchorComponent={({ onClick, disabled, open }) => (
        <PodSearchButton open={open} disabled={disabled} onClick={onClick}>
          <PodSearchImageLabelWrapper>
            {multiple && selectedValue?.length ? (
              <MultiplePodsSelected selectedValue={selectedValue} />
            ) : (
              <>
                <PodSearchDefaultImage color={selectedValue?.color ?? `#474747`} />
                <PodSearchLabel>{selectedValue?.label ?? `Select a Pod`}</PodSearchLabel>
              </>
            )}
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
