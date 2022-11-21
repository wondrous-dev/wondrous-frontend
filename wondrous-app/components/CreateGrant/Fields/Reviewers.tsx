import { Tooltip } from '@mui/material';
import { SafeImage } from 'components/Common/Image';
import { TaskSectionDisplayDiv } from 'components/Common/TaskViewModal/styles';
import { useGetEligibleReviewers } from 'components/CreateEntity/CreateEntityModal/Helpers';
import {
  CreateEntityLabelWrapper,
  CreateEntityLabel,
  CreateEntitySelectWrapper,
  CreateEntitySelectErrorWrapper,
  CreateEntityAutocompletePopper,
  CreateEntityAutocompletePopperRenderInput,
  CreateEntityAutocompletePopperRenderInputAdornment,
  CreateEntityDefaultUserImage,
  CreateEntityAutocompletePopperRenderInputIcon,
  CreateEntityAutocompleteOption,
  CreateEntityAutocompleteOptionTypography,
  CreateEntityError,
  CreateEntityLabelAddButton,
  CreateEntityAddButtonIcon,
  CreateEntityAddButtonLabel,
} from 'components/CreateEntity/CreateEntityModal/styles';
import { cloneDeep, isEmpty, isNull } from 'lodash';
import { useMemo } from 'react';

// TODO - reuse this component on CreateEntityModal

const renderOption = (props, option, reviewerIds, reviewerId) => {
  if (reviewerIds.includes(option.id) && option.id !== reviewerId) return null;
  return (
    <CreateEntityAutocompleteOption {...props}>
      {option?.profilePicture ? (
        <SafeImage useNextImage={false} src={option?.profilePicture} alt="User profile picture" />
      ) : (
        <CreateEntityDefaultUserImage />
      )}
      <CreateEntityAutocompleteOptionTypography>{option?.label}</CreateEntityAutocompleteOptionTypography>
    </CreateEntityAutocompleteOption>
  );
};

const EndAdornment = ({ reviewerIds, index, onChange }) => (
  <CreateEntityAutocompletePopperRenderInputAdornment
    position="end"
    onClick={() => {
      const newReviewers = cloneDeep(reviewerIds).filter((id, i) => i !== index);
      // form.setFieldValue('reviewerIds', newReviewers);
      onChange(newReviewers);
    }}
  >
    <CreateEntityAutocompletePopperRenderInputIcon />
  </CreateEntityAutocompletePopperRenderInputAdornment>
);

const StartAdornment = ({ reviewer }) => (
  <CreateEntityAutocompletePopperRenderInputAdornment position="start">
    {reviewer?.profilePicture ? (
      <SafeImage useNextImage={false} src={reviewer.profilePicture} alt="User profile picture" />
    ) : (
      <CreateEntityDefaultUserImage />
    )}
  </CreateEntityAutocompletePopperRenderInputAdornment>
);

const Reviewers = ({ orgId, podId, reviewerIds, reviewerIdsErrors, onFocus, onChange }) => {
  const eligibleReviewers = useGetEligibleReviewers(orgId, podId);
  const filteredEligibleReviewers = eligibleReviewers.filter((reviewer) => !reviewerIds?.includes(reviewer.id));

  const handleChange = (_, value, reason, index) => {
    if (reason === 'selectOption' && !reviewerIds.includes(value.id)) {
      const newReviewerIds = cloneDeep(reviewerIds);
      newReviewerIds[index] = value.id;
      onChange(newReviewerIds);
    }
  };

  const isEligibileReviewersEmpty = useMemo(() => isEmpty(filteredEligibleReviewers), [filteredEligibleReviewers]);

  const handleAddButton = () => {
    if (isEligibileReviewersEmpty) return;
    if (!reviewerIds) {
      return onChange([null]);
    }
    onChange(reviewerIds.concat(null));
  };

  const canAdd = useMemo(() => isNull(reviewerIds) || isEmpty(reviewerIds), [reviewerIds]);

  return (
    <TaskSectionDisplayDiv>
      <CreateEntityLabelWrapper>
        <CreateEntityLabel>Reviewer</CreateEntityLabel>
      </CreateEntityLabelWrapper>

      <CreateEntitySelectWrapper>
        {reviewerIds?.map((reviewerId, index) => {
          const hasError = reviewerIdsErrors?.[index];
          return (
            <CreateEntitySelectErrorWrapper key={index}>
              <CreateEntityAutocompletePopper
                onFocus={onFocus}
                openOnFocus
                options={eligibleReviewers}
                value={reviewerId}
                isOptionEqualToValue={(option, value) => option.id === value}
                renderInput={(params) => {
                  const reviewer = eligibleReviewers.find((reviewer) => reviewer.id === params.inputProps.value);
                  const shouldAutoFocus = reviewerIds?.filter((id) => id === null)?.length > 0;
                  return (
                    <CreateEntityAutocompletePopperRenderInput
                      {...params}
                      inputProps={{
                        ...params.inputProps,
                        value: reviewer?.label,
                      }}
                      autoFocus={shouldAutoFocus}
                      ref={params.InputProps.ref}
                      disableUnderline
                      fullWidth
                      placeholder="Enter username..."
                      startAdornment={<StartAdornment reviewer={reviewer} />}
                      endAdornment={<EndAdornment reviewerIds={reviewerIds} index={index} onChange={onChange} />}
                    />
                  );
                }}
                renderOption={(props, option) => renderOption(props, option, reviewerIds, reviewerId)}
                onChange={(_, value, reason) => handleChange(_, value, reason, index)}
                blurOnSelect
                error={hasError}
              />
              {hasError && <CreateEntityError>{hasError}</CreateEntityError>}
            </CreateEntitySelectErrorWrapper>
          );
        })}
        <Tooltip
          title={isEligibileReviewersEmpty && 'You reached the maximum no. of available reviewers'}
          placement="top"
        >
          <CreateEntityLabelAddButton onClick={handleAddButton}>
            <CreateEntityAddButtonIcon />
            {canAdd && <CreateEntityAddButtonLabel>Add</CreateEntityAddButtonLabel>}
          </CreateEntityLabelAddButton>
        </Tooltip>
      </CreateEntitySelectWrapper>
    </TaskSectionDisplayDiv>
  );
};

export default Reviewers;
