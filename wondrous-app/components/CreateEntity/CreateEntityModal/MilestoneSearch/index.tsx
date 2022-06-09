import { CreateEntity } from 'components/CreateEntity';
import { useState } from 'react';
import { ENTITIES_TYPES } from 'utils/constants';
import { useLocation } from 'utils/useLocation';
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

const MilestoneSearch = (props) => {
  const { options, onChange, value, handleClose } = props;
  const [createMilestone, setCreateMilestone] = useState(false);

  const [anchorEl, setAnchorEl] = useState(null);
  const handleClick = (event) => setAnchorEl(anchorEl ? null : event.currentTarget);
  const handleClickAway = () => setAnchorEl(null);

  const open = Boolean(anchorEl);
  const selectedValue = options.find((option) => option.id === value);

  if (createMilestone) {
    return (
      <CreateEntity
        entityType={ENTITIES_TYPES.MILESTONE}
        handleCloseModal={() => {
          setCreateMilestone(false);
          handleClickAway();
        }}
        open={open}
        cancel={() => {
          setCreateMilestone(false);
          handleClickAway();
        }}
        handleClose={({ data }) => {
          setCreateMilestone(false);
          handleClickAway();
          onChange(data?.createMilestone?.id);
        }}
      />
    );
  }

  return (
    <MilestoneSearchClickAway onClickAway={handleClickAway}>
      <MilestoneSearchWrapper>
        <MilestoneSearchButton open={open} disabled={!options} onClick={handleClick}>
          <MilestoneSearchImageLabelWrapper>
            <MilestoneSearchDefaultImage color={selectedValue?.color ?? `#474747`} />
            <MilestoneSearchLabel hasValue={selectedValue?.label}>
              {selectedValue?.label ?? `Select a Milestone`}
            </MilestoneSearchLabel>
          </MilestoneSearchImageLabelWrapper>
          <MilestoneSearchButtonCloseIcon onClick={handleClose} />
        </MilestoneSearchButton>
        <MilestoneSearchPopper open={open} anchorEl={anchorEl} placement="bottom-start" disablePortal={true}>
          <MilestoneSearchAutocomplete
            name="milestoneId"
            value={selectedValue}
            renderInput={(params) => {
              return (
                <MilestoneSearchInput
                  {...params}
                  ref={params.InputProps.ref}
                  disableUnderline={true}
                  fullWidth={true}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <MilestoneSearchInputAdornment position="end">
                        <MilestoneSearchInputIcon />
                      </MilestoneSearchInputAdornment>
                    ),
                  }}
                />
              );
            }}
            disableClearable={true}
            isOptionEqualToValue={(option, value) => option.id === value?.id}
            getOptionLabel={(option) => option.label}
            renderOption={(props, option) => {
              return (
                <MilestoneSearchListItem {...props}>
                  {selectedValue?.id === option.id ? <MilestoneSearchCheckBox /> : <MilestoneSearchCheckBoxEmpty />}
                  <MilestoneSearchLabel hasValue={true}>{option?.label}</MilestoneSearchLabel>
                </MilestoneSearchListItem>
              );
            }}
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
            open={open}
            options={options}
            disablePortal={true}
            onChange={(event, value, reason) => {
              if (reason === 'selectOption') {
                onChange(value.id);
                handleClickAway();
              }
            }}
            blurOnSelect={true}
          />
        </MilestoneSearchPopper>
      </MilestoneSearchWrapper>
    </MilestoneSearchClickAway>
  );
};

export default MilestoneSearch;
