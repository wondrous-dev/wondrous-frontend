import { HeaderBlock } from '../headerBlock';
import { SettingsWrapper } from '../settingsWrapper';
import GitHubIcon from '@mui/icons-material/GitHub';
import { White } from 'theme/colors';

export const GithubIntegration = ({ orgId }) => {
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
    </SettingsWrapper>
  );
};
