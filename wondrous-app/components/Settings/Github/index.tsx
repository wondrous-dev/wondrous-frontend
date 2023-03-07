import GitHubIcon from '@mui/icons-material/GitHub';
import palette from 'theme/palette';
import { useContext, useEffect, useState } from 'react';
import { useLazyQuery, useMutation } from '@apollo/client';
import { HAS_ORG_GITHUB_INTEGRATION } from 'graphql/queries';
import CloseModalIcon from 'components/Icons/closeModal';
import { DELETE_ORG_GITHUB } from 'graphql/mutations/org';
import { GithubLink, GithubButtonDiv } from './styles';
import { IntegrationsInputsBlock } from '../Integrations/styles';
import { LabelBlock } from '../styles';
import ConnectionContext from '../Integrations/Helpers/ConnectionContext';

const GITHUB_BASE_URL = `https://github.com/apps/wonderverse-integration/installations/new`;

export const getGithubCallbackUrl = () => {
  if (process.env.NEXT_PUBLIC_PRODUCTION) {
    return 'https%3A%2F%2Fapp.wonderverse.xyz%2Fgithub%2Fcallback';
  }
  if (process.env.NEXT_PUBLIC_STAGING) {
    return 'https://wondrous-app-git-staging-wonderverse.vercel.app/github/callback';
  }
  return 'http%3A%2F%2Flocalhost%3A3000%2Fgithub%2Fcallback';
};

export function GithubIntegration() {
  const {orgId} = useContext(ConnectionContext)
  const [githubConnected, setGithubConnected] = useState(false);
  const [hasGithubIntegration, { data: hasGithubIntegrationData }] = useLazyQuery(HAS_ORG_GITHUB_INTEGRATION);
  const [deleteOrgGithubIntegration] = useMutation(DELETE_ORG_GITHUB);

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

  if(!githubConnected) {
    return null
  }
  return (
    <IntegrationsInputsBlock>
        <GithubButtonDiv
          style={{
            marginLeft: '0',
          }}
        >
          <GithubLink
            style={{
              backgroundColor: palette.grey900,
              border: `1px solid ${palette.highlightPurple}`,
              cursor: 'auto',
              width: '100%',
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <span
              style={{
                color: palette.white,
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
          </GithubLink>
        </GithubButtonDiv>
      
    </IntegrationsInputsBlock>
  );
}
