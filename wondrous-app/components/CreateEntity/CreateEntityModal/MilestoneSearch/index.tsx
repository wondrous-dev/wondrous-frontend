import { CreateEntity } from 'components/CreateEntity';
import { useEffect, useRef, useState } from 'react';
import { ENTITIES_TYPES } from 'utils/constants';
import {
  MilestoneSearchAutocomplete,
  MilestoneSearchAutocompletePopper,
  MilestoneSearchButton,
  MilestoneSearchButtonCloseIcon,
  MilestoneSearchCheckBox,
  MilestoneSearchCheckBoxEmpty,
  MilestoneSearchClickAway,
  MilestoneSearchCreateMilestoneButton,
  MilestoneSearchCreateMilestoneButtonLabel,
  MilestoneSearchCreateMilestoneIcon,
  MilestoneSearchDefaultImage,
  MilestoneSearchImageLabelWrapper,
  MilestoneSearchInput,
  MilestoneSearchInputAdornment,
  MilestoneSearchInputIcon,
  MilestoneSearchLabel,
  MilestoneSearchList,
  MilestoneSearchListItem,
  MilestoneSearchPaper,
  MilestoneSearchPopper,
  MilestoneSearchWrapper,
} from './styles';

function MilestoneSearch({ options, onChange, value, handleClose, formValues = null, disabled, autoFocus = false }) {
  const [createMilestone, setCreateMilestone] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const anchorEl = useRef(null);
  const handleClick = () => setIsOpen((open) => !open);
  const handleClickAway = () => setIsOpen(false);

  useEffect(() => {
    if (autoFocus) {
      setIsOpen(true);
    }
  }, [autoFocus]);

  const selectedValue = options.find((option) => option.id === value);

  if (createMilestone) {
    return (
      <CreateEntity
        entityType={ENTITIES_TYPES.MILESTONE}
        handleCloseModal={() => {
          setCreateMilestone(false);
          handleClickAway();
        }}
        open={isOpen}
        cancel={() => {
          setCreateMilestone(false);
          handleClickAway();
        }}
        handleClose={({ data }) => {
          setCreateMilestone(false);
          handleClickAway();
          onChange(data?.createMilestone?.id);
        }}
        formValues={formValues}
      />
    );
  }

  return (
    <MilestoneSearchClickAway onClickAway={handleClickAway}>
      <MilestoneSearchWrapper>
        <MilestoneSearchButton open={isOpen} disabled={!options || disabled} onClick={handleClick} ref={anchorEl}>
          <MilestoneSearchImageLabelWrapper>
            <MilestoneSearchDefaultImage color={selectedValue?.color ?? `#474747`} />
            <MilestoneSearchLabel hasValue={selectedValue?.label}>
              {selectedValue?.label ?? `Select a Milestone`}
            </MilestoneSearchLabel>
          </MilestoneSearchImageLabelWrapper>
          <MilestoneSearchButtonCloseIcon onClick={handleClose} />
        </MilestoneSearchButton>
        <MilestoneSearchPopper open={isOpen} anchorEl={anchorEl.current} placement="bottom-start" disablePortal>
          <MilestoneSearchAutocomplete
            name="milestoneId"
            value={selectedValue}
            renderInput={(params) => (
              <MilestoneSearchInput
                {...params}
                autoFocus={autoFocus}
                ref={params.InputProps.ref}
                disableUnderline
                fullWidth
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <MilestoneSearchInputAdornment position="end">
                      <MilestoneSearchInputIcon />
                    </MilestoneSearchInputAdornment>
                  ),
                }}
              />
            )}
            disableClearable
            isOptionEqualToValue={(option, value) => option.id === value?.id}
            getOptionLabel={(option) => option.label}
            renderOption={(props, option) => (
              <MilestoneSearchListItem {...props}>
                {selectedValue?.id === option.id ? <MilestoneSearchCheckBox /> : <MilestoneSearchCheckBoxEmpty />}
                <MilestoneSearchLabel hasValue>{option?.label}</MilestoneSearchLabel>
              </MilestoneSearchListItem>
            )}
            PaperComponent={MilestoneSearchPaper}
            ListboxComponent={MilestoneSearchList}
            PopperComponent={(params) => {
              const { children } = params;
              return (
                <MilestoneSearchAutocompletePopper {...params}>
                  <MilestoneSearchCreateMilestoneButton
                    onClick={() => {
                      setCreateMilestone(true);
                    }}
                  >
                    <MilestoneSearchCreateMilestoneIcon />
                    <MilestoneSearchCreateMilestoneButtonLabel>
                      Create New Milestone
                    </MilestoneSearchCreateMilestoneButtonLabel>
                  </MilestoneSearchCreateMilestoneButton>
                  {children}
                </MilestoneSearchAutocompletePopper>
              );
            }}
            open={isOpen}
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
        </MilestoneSearchPopper>
      </MilestoneSearchWrapper>
    </MilestoneSearchClickAway>
  );
}

export default MilestoneSearch;
