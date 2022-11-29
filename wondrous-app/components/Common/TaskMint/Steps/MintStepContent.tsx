import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import GradientHeading from 'components/GradientHeading';
import palette from 'theme/palette';
import typography from 'theme/typography';

const MintStepContent = ({ title, img, body, description = null, children }) => (
  <Grid display="flex" direction="column" gap="18px">
    {title ? (
      <GradientHeading fontSize={24} mb="2px" gradient="89.67deg, #CCBBFF 37.16%, #00BAFF 108.05%">
        {title}
      </GradientHeading>
    ) : null}
    <Typography color={palette.white} fontFamily={typography.fontFamily} fontSize={15} fontWeight={600}>
      {body}
    </Typography>
    {!!description && (
      <Typography color={palette.grey250} fontFamily={typography.fontFamily} fontSize={15} fontWeight={400}>
        {description}
      </Typography>
    )}
    {children}
    <img src={img} />
  </Grid>
);

export default MintStepContent;
