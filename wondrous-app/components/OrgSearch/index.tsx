import { useState } from 'react';
import { OrgProfilePicture } from 'components/Common/ProfilePictureHelpers';
import {
  PodSearchClickAway,
  PodSearchButtonDeleteIcon,
  PodSearchButtonArrowIcon,
  PodSearchPopper,
  PodSearchAutocomplete,
  PodSearchInputAdornment,
  PodSearchPaper,
  PodSearchAutocompletePopper,
} from 'components/CreateEntity/CreateEntityModal/PodSearch/styles';
import {
  OrgSearchButton,
  OrgSearchWrapper,
  LabelWrapper,
  OrgSearchInput,
  OrgSearchListItem,
  OrgSearchList,
  OrgSearchInputIcon,
} from './styles';

function OrgSearch(props) {
  const { options, onChange, value, disabled, label } = props;
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => setAnchorEl(anchorEl ? null : event.currentTarget);
  const handleClickAway = () => setAnchorEl(null);
  const open = Boolean(anchorEl);
  const selectedValue = options?.find((option) => option?.id === value);
  return (
    <PodSearchClickAway onClickAway={handleClickAway}>
      <OrgSearchWrapper>
        <OrgSearchButton open={open} disabled={!options || disabled} onClick={handleClick}>
          <LabelWrapper>
            {/* <PodSearchDefaultImage color={selectedValue?.color ?? `#474747`} /> */}
            <OrgProfilePicture
              style={{ width: '42px', height: '42px' }}
              profilePicture={selectedValue?.profilePicture}
            />
            {/* <PodSearchLabel>{selectedValue?.name ?? label}</PodSearchLabel> */}
            <span>{selectedValue?.name ?? label}</span>
          </LabelWrapper>
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
        </OrgSearchButton>
        <PodSearchPopper open={open} anchorEl={anchorEl} placement="bottom-start" disablePortal>
          <PodSearchAutocomplete
            value={selectedValue}
            renderInput={(params) => (
              <OrgSearchInput
                {...params}
                ref={params.InputProps.ref}
                disableUnderline
                placeholder="Search for any Org"
                fullWidth
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <PodSearchInputAdornment position="end">
                      <OrgSearchInputIcon />
                    </PodSearchInputAdornment>
                  ),
                }}
              />
            )}
            disableClearable
            isOptionEqualToValue={(option, value) => option.name === value?.name}
            getOptionLabel={(option) => option.name}
            renderOption={(props, option) => (
              <OrgSearchListItem {...props}>
                <OrgProfilePicture style={{ width: '26px', height: '26px' }} profilePicture={option?.profilePicture} />

                <span>{option.name}</span>
                {/* <PodSearchDefaultImage color={option?.color ?? '#474747'} />
                <PodSearchLabel>{option?.label}</PodSearchLabel> */}
              </OrgSearchListItem>
            )}
            PaperComponent={PodSearchPaper}
            ListboxComponent={OrgSearchList}
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
      </OrgSearchWrapper>
    </PodSearchClickAway>
  );
}

export default OrgSearch;
