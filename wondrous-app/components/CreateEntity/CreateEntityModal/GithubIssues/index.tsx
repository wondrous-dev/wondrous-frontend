import { useMutation } from '@apollo/client';
import GitHubIcon from '@mui/icons-material/GitHub';
import { CircularProgress } from '@mui/material';
import { GithubLink } from 'components/Settings/Github/styles';
import { CREATE_TASK_GITHUB_ISSUE } from 'graphql/mutations';
import { entityTypeData, Fields, useGetPodGithubIntegrations, useGetPodPullRequests } from '../Helpers';
import {
  CreateEntityAddButtonIcon,
  CreateEntityAddButtonLabel,
  CreateEntityAutocompleteOption,
  CreateEntityAutocompleteOptionTypography,
  CreateEntityAutocompletePopper,
  CreateEntityAutocompletePopperRenderInput,
  CreateEntityAutocompletePopperRenderInputAdornment,
  CreateEntityAutocompletePopperRenderInputIcon,
  CreateEntityError,
  CreateEntityLabel,
  CreateEntityLabelAddButton,
  CreateEntityLabelSelectWrapper,
  CreateEntityLabelWrapper,
  CreateEntitySelectErrorWrapper,
  CreateEntitySelectWrapper,
} from '../styles';

const GithubIssues = ({ existingTask, form, entityType }) => {
  const noGithubTies = !existingTask?.githubIssue && !existingTask?.githubPullRequest;
  const availablePullRequests = useGetPodPullRequests(form.values.podId);
  const availableRepos = useGetPodGithubIntegrations(form.values.podId);
  const [createGithubIssue, { data: createGithubIssueData, loading: createGithubIssueLoading }] =
    useMutation(CREATE_TASK_GITHUB_ISSUE);

  return (
    <>
      {noGithubTies &&
        availablePullRequests.length > 0 &&
        existingTask &&
        !form.values?.chooseGithubPullRequest &&
        !form?.values?.chooseGithubIssue && (
          <CreateEntityLabelSelectWrapper show={entityTypeData[entityType].fields.includes(Fields.githubPullRequest)}>
            <>
              <CreateEntityLabel
                style={{
                  marginRight: '8px',
                  cursor: 'pointer',
                }}
                onClick={() => form.setFieldValue('chooseGithubPullRequest', true)}
              >
                Link Github PR
              </CreateEntityLabel>
              <span
                style={{
                  color: '#ccbbff',
                  marginRight: '8px',
                  paddingTop: '4px',
                  fontWeight: 'bolder',
                }}
              >
                or
              </span>
              <CreateEntityLabel
                style={{
                  cursor: 'pointer',
                }}
                onClick={() => form.setFieldValue('chooseGithubIssue', true)}
              >
                Create Github issue
              </CreateEntityLabel>
            </>
          </CreateEntityLabelSelectWrapper>
        )}

      {(existingTask?.githubIssue ||
        form.values?.chooseGithubIssue ||
        (availablePullRequests.length === 0 && availableRepos?.length > 0)) &&
        !existingTask?.githubPullRequest && (
          <CreateEntityLabelSelectWrapper show={entityTypeData[entityType].fields.includes(Fields.githubPullRequest)}>
            <CreateEntityLabelWrapper>
              <CreateEntityLabel> Github issue </CreateEntityLabel>
            </CreateEntityLabelWrapper>
            {form.values.githubIssue ? (
              <CreateEntitySelectWrapper>
                <GithubLink
                  style={{
                    paddingTop: '4px',
                    paddingBottom: '4px',
                  }}
                  href={form.values.githubIssue?.url}
                  target="_blank"
                >
                  Connected Github issue
                </GithubLink>
              </CreateEntitySelectWrapper>
            ) : (
              <CreateEntitySelectWrapper>
                <CreateEntitySelectErrorWrapper>
                  <CreateEntityAutocompletePopper
                    onFocus={() => form.setFieldError('githubRepo', undefined)}
                    openOnFocus
                    options={availableRepos}
                    value={form.values.githubRepo}
                    isOptionEqualToValue={(option, value) => option.value?.id === value}
                    getOptionLabel={(option) => option?.label || option.title || ''}
                    renderInput={(params) => (
                      <CreateEntityAutocompletePopperRenderInput
                        {...params}
                        ref={params.InputProps.ref}
                        disableUnderline
                        fullWidth
                        placeholder="Choose Repo"
                        endAdornment={
                          <CreateEntityAutocompletePopperRenderInputAdornment
                            position="end"
                            onClick={() => {
                              form.setFieldValue('githubRepo', null);
                            }}
                          >
                            <CreateEntityAutocompletePopperRenderInputIcon />
                          </CreateEntityAutocompletePopperRenderInputAdornment>
                        }
                      />
                    )}
                    renderOption={(props, option) => (
                      <CreateEntityAutocompleteOption
                        {...props}
                        onClick={() => {
                          if (form.values.githubPullRequest?.id !== option.id) {
                            form.setFieldValue('githubRepo', option);
                          }
                          form.setFieldError('githuRepo', undefined);
                        }}
                      >
                        <CreateEntityAutocompleteOptionTypography>
                          {option?.label}
                        </CreateEntityAutocompleteOptionTypography>
                      </CreateEntityAutocompleteOption>
                    )}
                    error={form.errors?.githubRepo}
                  />
                  {form.errors?.githubRepo && <CreateEntityError>{form.errors?.githubRepo}</CreateEntityError>}
                </CreateEntitySelectErrorWrapper>
                {createGithubIssueLoading ? (
                  <CircularProgress />
                ) : (
                  <GithubLink
                    style={{
                      paddingTop: '4px',
                      paddingBottom: '4px',
                    }}
                    onClick={() => {
                      createGithubIssue({
                        variables: {
                          repoPathname: form.values.githubRepo?.label,
                          taskId: existingTask?.id,
                        },
                      }).then((result) => {
                        if (result?.data?.createTaskGithubIssue) {
                          form.setFieldValue('githubIssue', result?.data?.createTaskGithubIssue);
                        }
                      });
                    }}
                  >
                    <GitHubIcon
                      style={{
                        marginRight: '8px',
                      }}
                    />
                    <span>Add</span>
                  </GithubLink>
                )}
              </CreateEntitySelectWrapper>
            )}
          </CreateEntityLabelSelectWrapper>
        )}
      {availablePullRequests.length > 0 &&
        (existingTask?.githubPullRequest || form.values?.chooseGithubPullRequest) &&
        existingTask &&
        !existingTask?.githubIssue && (
          <CreateEntityLabelSelectWrapper show={entityTypeData[entityType].fields.includes(Fields.githubPullRequest)}>
            <CreateEntityLabelWrapper>
              <CreateEntityLabel>Link Github PR</CreateEntityLabel>
            </CreateEntityLabelWrapper>

            <CreateEntitySelectWrapper>
              {form.values.githubPullRequest !== null && (
                <CreateEntitySelectErrorWrapper>
                  <CreateEntityAutocompletePopper
                    onFocus={() => form.setFieldError('githubPullRequest', undefined)}
                    openOnFocus
                    options={availablePullRequests}
                    value={form.values.githubPullRequest}
                    isOptionEqualToValue={(option, value) => option.value?.id === value}
                    getOptionLabel={(option) => option?.label || option.title || ''}
                    renderInput={(params) => (
                      <CreateEntityAutocompletePopperRenderInput
                        {...params}
                        ref={params.InputProps.ref}
                        disableUnderline
                        fullWidth
                        placeholder="Enter PR name"
                        endAdornment={
                          <CreateEntityAutocompletePopperRenderInputAdornment
                            position="end"
                            onClick={() => {
                              form.setFieldValue('githubPullRequest', null);
                            }}
                          >
                            <CreateEntityAutocompletePopperRenderInputIcon />
                          </CreateEntityAutocompletePopperRenderInputAdornment>
                        }
                      />
                    )}
                    renderOption={(props, option) => (
                      <CreateEntityAutocompleteOption
                        {...props}
                        onClick={() => {
                          if (form.values.githubPullRequest?.id !== option.id) {
                            form.setFieldValue('githubPullRequest', option);
                          }
                          form.setFieldError('githubPullRequest', undefined);
                        }}
                      >
                        <CreateEntityAutocompleteOptionTypography>
                          {option?.label}
                        </CreateEntityAutocompleteOptionTypography>
                      </CreateEntityAutocompleteOption>
                    )}
                    error={form.errors?.githubPullRequest}
                  />
                  {form.errors?.githubPullRequest && (
                    <CreateEntityError>{form.errors?.githubPullRequest}</CreateEntityError>
                  )}
                </CreateEntitySelectErrorWrapper>
              )}
              {form.values.githubPullRequest === null && (
                <CreateEntityLabelAddButton
                  onClick={() => {
                    form.setFieldValue('githubPullRequest', '');
                  }}
                >
                  <CreateEntityAddButtonIcon />
                  <CreateEntityAddButtonLabel>Add</CreateEntityAddButtonLabel>
                </CreateEntityLabelAddButton>
              )}
            </CreateEntitySelectWrapper>
          </CreateEntityLabelSelectWrapper>
        )}
    </>
  );
};

export default GithubIssues;
