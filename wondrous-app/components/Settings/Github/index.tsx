import { HeaderBlock } from '../headerBlock';
import { SettingsWrapper } from '../settingsWrapper';
import GitHubIcon from '@mui/icons-material/GitHub';
import { Green400, White } from 'theme/colors';
import { GithubButton, GithubButtonDiv } from './styles';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
import { HAS_ORG_GITHUB_INTEGRATION } from 'graphql/queries';
import CloseModalIcon from 'components/Icons/closeModal';
import { DELETE_ORG_GITHUB } from 'graphql/mutations/org';

const GITHUB_BASE_URL = `https://github.com/apps/wonderverse-integration/installations/new`;

export const GithubIntegration = ({ orgId }) => {
  const router = useRouter();
  const [githubConnected, setGithubConnected] = useState(false);
  const [hasGithubIntegration, { data: hasGithubIntegrationData }] = useLazyQuery(HAS_ORG_GITHUB_INTEGRATION);
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

  return (
    <SettingsWrapper>
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
        title="Github Integration"
        description="Manage Github Integration"
      />
      {githubConnected ? (
        <GithubButtonDiv>
          <GithubButton
            style={{
              backgroundColor: Green400,
              cursor: 'auto',
            }}
          >
            <span
              style={{
                color: White,
              }}
            >
              Github organization connected
            </span>
            <CloseModalIcon
              style={{
                marginLeft: '16px',
                cursor: 'pointer',
              }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setGithubConnected(false);
                deleteOrgGithubIntegration({
                  variables: {
                    orgId,
                  },
                });
              }}
            />
          </GithubButton>
        </GithubButtonDiv>
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
