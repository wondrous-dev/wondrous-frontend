import { HeaderBlock } from '../headerBlock';
import { SettingsWrapper } from '../settingsWrapper';
import GitHubIcon from '@mui/icons-material/GitHub';
import { Green400, White } from 'theme/colors';
import { AddRepoDiv, GithubButton, GithubButtonDiv, PodGithubExplainerText } from './styles';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
import { GET_ORG_AVAILABLE_REPOSITORIES, HAS_ORG_GITHUB_INTEGRATION } from 'graphql/queries';
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
import { ImportTaskModal } from './confirmImportTaskModal';

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
export const GithubIntegration = ({ orgId, podId }) => {
  const router = useRouter();
  const [githubConnected, setGithubConnected] = useState(false);
  const [hasGithubIntegration, { data: hasGithubIntegrationData }] = useLazyQuery(HAS_ORG_GITHUB_INTEGRATION);
  const [getOrgAvailableRepos, { data: availableReposData }] = useLazyQuery(GET_ORG_AVAILABLE_REPOSITORIES, {
    fetchPolicy: 'network-only',
  });
  const [importModalOpen, setImportModalOpen] = useState(false);
  const [chosenRepo, setChosenRepo] = useState(null);
  const [chosenRepoString, setChosenRepoString] = useState('');
  const [deleteOrgGithubIntegration] = useMutation(DELETE_ORG_GITHUB);
  const [githubUrl, setGithubUrl] = useState(null);
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

  return (
    <SettingsWrapper>
      <ImportTaskModal onClose={() => setImportModalOpen(false)} open={importModalOpen} />
      <HeaderBlock
        icon={
          <GitHubIcon
            width="32"
            height="32"
            style={{
              color: White,
              marginTop: '-34px',
            }}
          />
        }
        title="Add Github repos"
      />
      {githubConnected ? (
        <>
          <PodGithubExplainerText>
            By connecting a Github repo, all existing issues from the repo will be imported and new issues will be
            turned into tasks. You can also link PRs to tasks and create Github issues from Wonder - more information
            here. ADD GITHUB TUTORIAL
          </PodGithubExplainerText>
          <AddRepoDiv>
            <StyledAutocompletePopper
              style={{
                flex: 1,
              }}
              options={filterGithubRepo(availableReposData?.getOrgAvailableRepositories)}
              onOpen={() => {
                // if (pod) {
                //   getPodUsers({
                //     variables: {
                //       podId: pod?.id || pod,
                //       limit: 100, // TODO: fix autocomplete
                //     },
                //   });
                // }
              }}
              renderInput={(params) => {
                const InputProps = {
                  ...params?.InputProps,
                  type: 'autocomplete',
                };
                return (
                  <TextField
                    {...params}
                    style={{
                      color: White,
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
              renderOption={(props, option, state) => {
                return (
                  <OptionDiv
                    onClick={(event) => {
                      setChosenRepo(option);
                      props?.onClick(event);
                    }}
                  >
                    {option?.profilePicture && (
                      <SafeImage
                        src={option?.profilePicture}
                        style={{
                          width: '30px',
                          height: '30px',
                          borderRadius: '15px',
                        }}
                      />
                    )}
                    <OptionTypography>{option?.label}</OptionTypography>
                  </OptionDiv>
                );
              }}
            />
            <CreateFormPreviewButton
              disabled={!(chosenRepo?.id && chosenRepoString)}
              onClick={() => {
                setImportModalOpen(true);
                // inviteUserToPod({
                //   variables: {
                //     userId: invitee?.id,
                //     roleId: inviteeRole,
                //     podId,
                //   },
                //   onCompleted: (data) => {
                //     const userPod = data?.inviteUserToPod;
                //     setUsers([userPod, ...users]);
                //   },
                // });
                // setSnackbarAlertOpen(true);
                // setSnackbarAlertMessage(<>{invitee?.username} invited!</>);
              }}
            >
              Add repo
            </CreateFormPreviewButton>
          </AddRepoDiv>
        </>
      ) : (
        <GithubButtonDiv>
          <GithubButton href={githubUrl}>
            <GitHubIcon
              style={{
                marginRight: '8px',
              }}
            />
            <span>Connect Github Organization</span>
          </GithubButton>
        </GithubButtonDiv>
      )}
    </SettingsWrapper>
  );
};
