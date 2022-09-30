import { useCallback, useState } from 'react';
import { OrgProfilePicture } from 'components/Common/ProfilePictureHelpers';
import { SEARCH_GLOBAL_ORGS } from 'graphql/queries';
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
import debounce from 'lodash/debounce';
import { useLazyQuery } from '@apollo/client';
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
  const { options, onChange, value, disabled, label, globalSearch } = props;
  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => setAnchorEl(anchorEl ? null : event.currentTarget);
  const [globalSearchOrgs, { data, error }] = useLazyQuery(SEARCH_GLOBAL_ORGS);
  const handleClickAway = () => setAnchorEl(null);
  const open = Boolean(anchorEl);
  const searchOptions = data?.globalSearchOrgs || options;
  const selectedValue = searchOptions?.find((option) => option?.id === value?.id);

  const search = useCallback(debounce(globalSearchOrgs, 500), []);

  const handleInputChange = (e) =>
    globalSearch && e.target.value && search({ variables: { searchString: e.target.value } });
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
                onChange={handleInputChange}
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
                {!option?.skipProfilePicture && (
                  <OrgProfilePicture
                    style={{ width: '26px', height: '26px' }}
                    profilePicture={option?.profilePicture}
                  />
                )}
                <span>{option.name}</span>
              </OrgSearchListItem>
            )}
            PaperComponent={PodSearchPaper}
            ListboxComponent={OrgSearchList}
            PopperComponent={(params) => <PodSearchAutocompletePopper {...params} />}
            open={open}
            options={searchOptions}
            disablePortal
            onChange={(event, value, reason) => {
              if (reason === 'selectOption') {
                onChange(value);
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
