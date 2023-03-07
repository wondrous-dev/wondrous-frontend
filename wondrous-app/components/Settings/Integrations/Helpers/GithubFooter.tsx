import { getGithubCallbackUrl } from 'components/Settings/Github';
import { useContext, useEffect, useState } from 'react';
import ConnectionContext from './ConnectionContext';
import FooterButtons from './FooterButtons';

const GITHUB_BASE_URL = `https://github.com/apps/wonderverse-integration/installations/new`;

const GithubFooter = () => {
  const { onClose, orgId } = useContext(ConnectionContext);

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

  return <FooterButtons title="Connect Github" onClose={onClose} action={() => window.open(githubUrl)} />;
};

export default GithubFooter;
