import GitHubIcon from '@mui/icons-material/GitHub';
import palette from 'theme/palette';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
import {
  GET_ORG_AVAILABLE_REPOSITORIES,
  GET_POD_GITHUB_INTEGRATIONS,
  HAS_ORG_GITHUB_INTEGRATION,
} from 'graphql/queries';
import CloseModalIcon from 'components/Icons/closeModal';
import { DELETE_ORG_GITHUB } from 'graphql/mutations/org';
import {
  CreateFormPreviewButton,
  OptionDiv,
  OptionTypography,
  StyledAutocompletePopper,
} from 'components/CreateEntity/styles';
import { TextField } from '@mui/material';
import { SafeImage } from 'components/Common/Image';
import { ADD_POD_GITHUB_REPO, DELETE_POD_GITHUB_REPO_INTEGRATION } from 'graphql/mutations/pod';
import { GRAPHQL_ERRORS } from 'utils/constants';
import { ErrorText } from 'components/Common';
import SettingsWrapper from 'components/Common/SidebarSettings';
import HeaderBlock from 'components/Settings/headerBlock';
import { ImportTaskModal } from './confirmImportTaskModal';
import { AddRepoDiv, GithubLink, GithubButtonDiv, PodGithubExplainerText, RepoDiv, RepoDivTitle } from './styles';

const GITHUB_BASE_URL = `https://github.com/apps/wonderverse-integration/installations/new`;

const filterGithubRepo = (repositories) => {
  if (!repositories) {
    return [];
  }
  return repositories.map((repository) => ({
    label: repository?.fullName,
    id: repository?.id,
  }));
};

export function GithubIntegrationRow({ githubIntegrationId, githubInfo, deletePodGithubIntegration }) {
  return (
    <RepoDiv>
      <RepoDivTitle>
        {' '}
        <span style={{ fontWeight: 'bold' }}>{githubInfo?.repoPathname}</span> connected
      </RepoDivTitle>
      <div
        style={{
          flex: 1,
        }}
      />
      <CloseModalIcon
        style={{
          marginLeft: '16px',
          cursor: 'pointer',
        }}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          deletePodGithubIntegration({
            variables: {
              entityIntegrationId: githubIntegrationId,
            },
          });
        }}
      />
    </RepoDiv>
  );
}

export function GithubIntegration({ orgId, podId }) {
  const router = useRouter();
  const [getPodGithubIntegrations, { data: podGithubIntegrationData, error: podGithubIntegrationError }] =
    useLazyQuery(GET_POD_GITHUB_INTEGRATIONS);
  const [deletePodGithubIntegration] = useMutation(DELETE_POD_GITHUB_REPO_INTEGRATION, {
    refetchQueries: [GET_POD_GITHUB_INTEGRATIONS],
  });
  const [githubConnected, setGithubConnected] = useState(false);
  const [hasGithubIntegration, { data: hasGithubIntegrationData }] = useLazyQuery(HAS_ORG_GITHUB_INTEGRATION);
  const [getOrgAvailableRepos, { data: availableReposData }] = useLazyQuery(GET_ORG_AVAILABLE_REPOSITORIES, {
    fetchPolicy: 'network-only',
  });
  const [addPodGithubRepo] = useMutation(ADD_POD_GITHUB_REPO, {
    refetchQueries: [GET_POD_GITHUB_INTEGRATIONS],
  });
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [chosenRepo, setChosenRepo] = useState(null);
  const [chosenRepoString, setChosenRepoString] = useState('');
  const [deleteOrgGithubIntegration] = useMutation(DELETE_ORG_GITHUB);
  const [githubUrl, setGithubUrl] = useState(null);
  const [addRepoError, setAddRepoError] = useState(null);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const state = JSON.stringify({
        redirectUrl: encodeURIComponent(window.location.href),
        orgId,
      });
      setGithubUrl(`${GITHUB_BASE_URL}?state=${state}`);
    }
  }, []);

  useEffect(() => {
    if (orgId) {
      hasGithubIntegration({
        variables: {
          orgId,
        },
      }).then((result) => {
        if (result?.data?.hasGithubOrgIntegration.exist) {
          setGithubConnected(true);
        }
      });
    }
  }, [orgId]);

  useEffect(() => {
    if (githubConnected) {
      getOrgAvailableRepos({
        variables: {
          orgId,
        },
      });
    }
  }, [githubConnected]);

  useEffect(() => {
    if (podId) {
      getPodGithubIntegrations({
        variables: {
          podId,
        },
      });
    }
  }, [podId]);
  const githubIntegrations = podGithubIntegrationData?.getPodGithubRepoIntegrations;

  return (
    <>
      <ImportTaskModal
        onClose={() => setImportModalOpen(false)}
        open={importModalOpen}
        onContinue={() => {
          addPodGithubRepo({
            variables: {
              importTasks: false,
              repoName: chosenRepo?.label,
              repoId: chosenRepo?.id,
              podId,
            },
          })
            .then(() => {
              setImportModalOpen(false);
            })
            .catch((err) => {
              setImportModalOpen(false);
              if (
                err?.graphQLErrors &&
                err?.graphQLErrors[0]?.extensions.errorCode === GRAPHQL_ERRORS.GITHUB_REPO_ALREADY_ADDED_TO_POD
              ) {
                setAddRepoError(GRAPHQL_ERRORS.GITHUB_REPO_ALREADY_ADDED_TO_POD);
              }
            });
        }}
        onImport={() => {
          addPodGithubRepo({
            variables: {
              importTasks: true,
              repoName: chosenRepo?.label,
              repoId: chosenRepo?.id,
              podId,
            },
          })
            .then(() => {
              setImportModalOpen(false);
            })
            .catch((err) => {
              console.log('err', err);
              setImportModalOpen(false);
              if (
                err?.graphQLErrors &&
                err?.graphQLErrors[0]?.extensions.errorCode === GRAPHQL_ERRORS.GITHUB_REPO_ALREADY_ADDED_TO_POD
              ) {
                setAddRepoError(GRAPHQL_ERRORS.GITHUB_REPO_ALREADY_ADDED_TO_POD);
              }
            });
        }}
      />
      {/* <HeaderBlock
        icon={
          <GitHubIcon
            width="32"
            height="32"
            style={{
              color: palette.white,
              marginTop: '-34px',
            }}
          />
        }
        title="Add Github repos"
      /> */}
      <>
        <PodGithubExplainerText>
          By connecting a Github repo, all existing issues from the repo will be imported and new issues will be turned
          into tasks. You can also link PRs to tasks and create Github issues from Wonder - more information here. ADD
          GITHUB TUTORIAL
        </PodGithubExplainerText>
        <AddRepoDiv>
          <StyledAutocompletePopper
            style={{
              flex: 1,
            }}
            options={filterGithubRepo(availableReposData?.getOrgAvailableRepositories)}
            renderInput={(params) => {
              const InputProps = {
                ...params?.InputProps,
                type: 'autocomplete',
              };
              return (
                <TextField
                  {...params}
                  style={{
                    color: palette.white,
                    fontFamily: 'Space Grotesk',
                    fontSize: '1px',
                    paddingLeft: '4px',
                  }}
                  placeholder="Enter Github repo"
                  InputLabelProps={{ shrink: false }}
                  InputProps={InputProps}
                />
              );
            }}
            value={chosenRepo}
            inputValue={chosenRepo?.fu}
            onInputChange={(event, newInputValue) => {
              setChosenRepoString(newInputValue);
            }}
            onChange={(_, __, reason) => {
              if (reason === 'clear') {
                setChosenRepo(null);
              }
            }}
            renderOption={(props, option, state) => (
              <OptionDiv
                onClick={(event) => {
                  setChosenRepo(option);
                  props?.onClick(event);
                }}
              >
                {option?.profilePicture && (
                  <SafeImage
                    useNextImage={false}
                    src={option?.profilePicture}
                    style={{
                      width: '30px',
                      height: '30px',
                      borderRadius: '15px',
                    }}
                    alt="Profile picture"
                  />
                )}
                <OptionTypography>{option?.label}</OptionTypography>
              </OptionDiv>
            )}
          />
          <CreateFormPreviewButton
            disabled={!(chosenRepo?.id && chosenRepoString)}
            onClick={() => {
              setImportModalOpen(true);
            }}
          >
            Add repo
          </CreateFormPreviewButton>
        </AddRepoDiv>
        {githubIntegrations?.length > 0 &&
          githubIntegrations?.map((githubIntegration, index) => (
            <GithubIntegrationRow
              key={index}
              githubIntegrationId={githubIntegration?.id}
              githubInfo={githubIntegration?.githubInfo}
              deletePodGithubIntegration={deletePodGithubIntegration}
            />
          ))}
      </>

      {addRepoError && <ErrorText>{addRepoError}</ErrorText>}
    </>
  );
}
