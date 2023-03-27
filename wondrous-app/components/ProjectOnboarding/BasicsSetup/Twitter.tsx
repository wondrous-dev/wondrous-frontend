import { Grid, Typography } from '@mui/material';
import { Twitter } from 'components/Icons/twitter';
import { HeaderButton } from 'components/organization/wrapper/styles';
import IntegrationFeatures from 'components/Settings/Integrations/Helpers/IntegrationFeatures';
import { buildTwitterAuthUrl } from 'components/Twitter/utils';
import { useEffect, useState } from 'react';
import palette from 'theme/palette';
import { TWITTER_CHALLENGE_CODE } from 'utils/constants';
import { useOrgBoard } from 'utils/hooks';
import { ButtonsPanel } from '../Shared';
import { FEATURES, FEATURES_TYPES } from '../Shared/constants';

const TwitterPanel = ({ handleNextStep }) => {
  const { orgData, startPolling, stopPolling, getOrgFromUsername } = useOrgBoard();
  const [isPolling, setIsPolling] = useState(false);
  const onContinue = () => handleNextStep();
  const onSkip = () => handleNextStep();

  useEffect(() => {
    if (!isPolling) return;
    if (orgData?.description || orgData?.profilePicture) {
      stopPolling();
      setIsPolling(false);
      handleNextStep();
    }
  }, [orgData?.description, orgData?.profilePicture, isPolling]);

  const handleTwitterConnect = async () => {
    if (!orgData?.username) {
      return;
    }
    await getOrgFromUsername({
      variables: {
        username: orgData?.username,
      },
    });

    startPolling(1000);
    setIsPolling(true);
    const url = buildTwitterAuthUrl(TWITTER_CHALLENGE_CODE, `project-onboarding${orgData?.orgId}`);
    window.open(url);
  };

  return (
    <Grid container direction="column" justifyContent="space-between" height="100%" gap="42px">
      <Grid container direction="column" gap="24px">
        <Grid bgcolor={palette.grey87} padding="28px" container justifyContent="center" borderRadius="6px">
          <HeaderButton reversed onClick={handleTwitterConnect}>
            <Twitter
              height="12px"
              style={{
                marginRight: '8px',
              }}
            />
            Link Twitter
          </HeaderButton>
        </Grid>
        <Grid display="flex" gap="14px">
          <IntegrationFeatures
            features={FEATURES[FEATURES_TYPES.TWITTER]}
            label="Linking your Twitter will enable these features:"
            typographyStyles={{
              fontWeight: 400,
              fontSize: '14px',
            }}
          />
        </Grid>
      </Grid>
      <ButtonsPanel onContinue={onContinue} onSkip={onSkip} />
    </Grid>
  );
};

export default TwitterPanel;
