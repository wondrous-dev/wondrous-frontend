import { HeaderBlock } from '../headerBlock';
import { SettingsWrapper } from '../settingsWrapper';
import GitHubIcon from '@mui/icons-material/GitHub';
import { White } from 'theme/colors';
import { GithubButton, GithubButtonDiv } from './styles';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const GITHUB_BASE_URL = `https://github.com/apps/wonderverse-integration/installations/new`;
const GITHUB_APP_CLIENT_ID = 'Iv1.64f7faecf13dacf2';
const GITHUB_REDIRECT_URI = 'http://localhost:3000/github/callback';
export const GithubIntegration = ({ orgId }) => {
  const router = useRouter();
  console.log('router', router);
  const [githubUrl, setGithubUrl] = useState(null);
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setGithubUrl(`${GITHUB_BASE_URL}?state=${window.location.href}`);
    }
  }, []);

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
    </SettingsWrapper>
  );
};
