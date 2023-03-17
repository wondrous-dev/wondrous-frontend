import { Grid, Typography } from '@mui/material';
import CheckMarkIcon from 'components/Icons/checkMark';
import palette from 'theme/palette';
import typography from 'theme/typography';
import { INTEGRATION_FEATURES } from '../constants';
import { Label } from '../styles';

const IntegrationFeatures = ({ type }) => {
  const features = INTEGRATION_FEATURES[type];
  if (!features?.length) return null;
  return (
    <Grid display="flex" direction="column" gap="14px" justifyContent="flex-start">
      <Label>What the integration can do</Label>
      {features?.map((feature) => (
        <Grid display="flex" alignItems="center" gap="6px">
          <Grid
            bgcolor={palette.grey78}
            height="18px"
            width="18px"
            display="flex"
            alignItems="center"
            justifyContent="center"
            borderRadius="4px"
          >
            <CheckMarkIcon />
          </Grid>
          <Typography
            color={palette.white}
            fontSize="15px"
            fontWeight={500}
            lineHeight="24px"
            fontFamily={typography.fontFamily}
          >
            {feature}
          </Typography>
        </Grid>
      ))}
    </Grid>
  );
};
export default IntegrationFeatures;
