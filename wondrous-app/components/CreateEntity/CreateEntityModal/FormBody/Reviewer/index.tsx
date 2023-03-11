import { SafeImage } from 'components/Common/Image';
import Tooltip from 'components/Tooltip';
import { cloneDeep, isEmpty, isNull } from 'lodash';
import { entityTypeData, Fields, useGetEligibleReviewers } from '../../Helpers';
import {
  CreateEntityLabelSelectWrapper,
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
} from '../../styles';

const Reviewer = ({ entityType, reviewerIds, setFieldError, setFieldValue, errors, orgId, podId }) => {
  const eligibleReviewers = useGetEligibleReviewers(orgId, podId);
  const filteredEligibleReviewers = eligibleReviewers.filter((reviewer) => !reviewerIds?.includes(reviewer.id));

  return (
    <CreateEntityLabelSelectWrapper show={entityTypeData[entityType].fields.includes(Fields.reviewer)}>
      <CreateEntityLabelWrapper>
        <CreateEntityLabel>Reviewer</CreateEntityLabel>
      </CreateEntityLabelWrapper>

      <CreateEntitySelectWrapper>
        {reviewerIds?.map((reviewerId, index) => {
          const hasError = errors?.reviewerIds?.[index];
          return (
            <CreateEntitySelectErrorWrapper key={index}>
              <CreateEntityAutocompletePopper
                onFocus={() => setFieldError(undefined)}
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
                      startAdornment={
                        <CreateEntityAutocompletePopperRenderInputAdornment position="start">
                          {reviewer?.profilePicture ? (
                            <SafeImage useNextImage={false} src={reviewer.profilePicture} alt="Profile picture" />
                          ) : (
                            <CreateEntityDefaultUserImage />
                          )}
                        </CreateEntityAutocompletePopperRenderInputAdornment>
                      }
                      endAdornment={
                        <CreateEntityAutocompletePopperRenderInputAdornment
                          position="end"
                          onClick={() => {
                            const newReviewers = cloneDeep(reviewerIds).filter((id, i) => i !== index);
                            setFieldValue(newReviewers);
                          }}
                        >
                          <CreateEntityAutocompletePopperRenderInputIcon />
                        </CreateEntityAutocompletePopperRenderInputAdornment>
                      }
                    />
                  );
                }}
                renderOption={(props, option) => {
                  if (reviewerIds.includes(option.id) && option.id !== reviewerId) return null;
                  return (
                    <CreateEntityAutocompleteOption {...props}>
                      {option?.profilePicture ? (
                        <SafeImage useNextImage={false} src={option?.profilePicture} alt="Profile picture" />
                      ) : (
                        <CreateEntityDefaultUserImage />
                      )}
                      <CreateEntityAutocompleteOptionTypography>
                        {option?.label}
                      </CreateEntityAutocompleteOptionTypography>
                    </CreateEntityAutocompleteOption>
                  );
                }}
                onChange={(event, value, reason) => {
                  if (reason === 'selectOption' && !reviewerIds.includes(value.id)) {
                    const clonedReviewerIds = cloneDeep(reviewerIds);
                    clonedReviewerIds[index] = value.id;
                    setFieldValue(clonedReviewerIds);
                  }
                }}
                blurOnSelect
                error={hasError}
              />
              {hasError && <CreateEntityError>{hasError}</CreateEntityError>}
            </CreateEntitySelectErrorWrapper>
          );
        })}
        <Tooltip
          title={isEmpty(filteredEligibleReviewers) && 'You reached the maximum no. of available reviewers'}
          placement="top"
        >
          <CreateEntityLabelAddButton
            onClick={() => {
              if (isEmpty(filteredEligibleReviewers)) return;
              if (!reviewerIds) {
                setFieldValue([null]);
                return;
              }
              setFieldValue(reviewerIds.concat(null));
            }}
          >
            <CreateEntityAddButtonIcon />
            {(isNull(reviewerIds) || isEmpty(reviewerIds)) && (
              <CreateEntityAddButtonLabel>Add</CreateEntityAddButtonLabel>
            )}
          </CreateEntityLabelAddButton>
        </Tooltip>
      </CreateEntitySelectWrapper>
    </CreateEntityLabelSelectWrapper>
  );
};

export default Reviewer;
