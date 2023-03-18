import { Grid, Typography } from '@mui/material';
import { Twitter } from 'components/Icons/twitter';
import { HeaderButton } from 'components/organization/wrapper/styles';
import IntegrationFeatures from 'components/Settings/Integrations/Helpers/IntegrationFeatures';
import palette from 'theme/palette';
import { ButtonsPanel } from '../Shared';
import { FEATURES, FEATURES_TYPES } from '../Shared/constants';
import { PageLabel } from '../Shared/styles';

const TwitterPanel = ({ onClick }) => {
  const onContinue = () => onClick();
  const onSkip = () => onClick();
  return (
    <Grid container direction="column" justifyContent="space-between" height="100%">
      <Grid container direction="column" gap="24px">
        <Grid bgcolor={palette.grey87} padding="28px" container justifyContent="center" borderRadius="6px">
          <HeaderButton reversed>
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
          {/* <PageLabel fontSize="13px">Linking your Twitter will enable these features:</PageLabel> */}
          <IntegrationFeatures
            features={FEATURES[FEATURES_TYPES.TWITTER]}
            label="Linking your Twitter will enable these features:"
            typographyStyles={{
              fontWeight: 400,
            }}
          />
        </Grid>
      </Grid>
      <ButtonsPanel onContinue={onContinue} onSkip={onSkip} />
    </Grid>
  );
};

export default TwitterPanel;
