import {
  PodSearchClickAway,
  PodSearchWrapper,
  PodSearchButton,
  PodSearchImageLabelWrapper,
  PodSearchDefaultImage,
  PodSearchLabel,
  PodSearchButtonDeleteIcon,
  PodSearchButtonArrowIcon,
  PodSearchPopper,
  PodSearchAutocomplete,
  PodSearchInput,
  PodSearchInputAdornment,
  PodSearchInputIcon,
  PodSearchListItem,
  PodSearchPaper,
  PodSearchList,
  PodSearchAutocompletePopper,
} from 'components/CreateEntity/CreateEntityModal/PodSearch/styles';
import { useState } from 'react';

function OrgSearch(props) {
  const { options, onChange, value, disabled } = props;
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => setAnchorEl(anchorEl ? null : event.currentTarget);
  const handleClickAway = () => setAnchorEl(null);
  const open = Boolean(anchorEl);
  const selectedValue = options?.find((option) => option?.id === value);
  return (
    <PodSearchClickAway onClickAway={handleClickAway}>
      <PodSearchWrapper>
        <PodSearchButton open={open} disabled={!options || disabled} onClick={handleClick}>
          <PodSearchImageLabelWrapper>
            <PodSearchDefaultImage color={selectedValue?.color ?? `#474747`} />
            <PodSearchLabel>{selectedValue?.name ?? `Select a Pod`}</PodSearchLabel>
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
        <PodSearchPopper open={open} anchorEl={anchorEl} placement="bottom-start" disablePortal>
          <PodSearchAutocomplete
            value={selectedValue}
            renderInput={(params) => (
              <PodSearchInput
                {...params}
                ref={params.InputProps.ref}
                disableUnderline
                fullWidth
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <PodSearchInputAdornment position="end">
                      <PodSearchInputIcon />
                    </PodSearchInputAdornment>
                  ),
                }}
              />
            )}
            disableClearable
            isOptionEqualToValue={(option, value) => option.name === value?.name}
            getOptionLabel={(option) => option.name}
            renderOption={(props, option) => (
              <PodSearchListItem {...props}>
                <span>{option.name}</span>
                {/* <PodSearchDefaultImage color={option?.color ?? '#474747'} />
                <PodSearchLabel>{option?.label}</PodSearchLabel> */}
              </PodSearchListItem>
            )}
            PaperComponent={PodSearchPaper}
            ListboxComponent={PodSearchList}
            PopperComponent={(params) => <PodSearchAutocompletePopper {...params} />}
            open={open}
            options={options}
            disablePortal
            onChange={(event, value, reason) => {
              if (reason === 'selectOption') {
                onChange(value.id);
                handleClickAway();
              }
            }}
            blurOnSelect
          />
        </PodSearchPopper>
      </PodSearchWrapper>
    </PodSearchClickAway>
  );
}

export default OrgSearch;
