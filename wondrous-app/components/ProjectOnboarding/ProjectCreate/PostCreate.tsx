import GradientHeading from 'components/GradientHeading';
import Grid from '@mui/material/Grid';
import ProgressBar from 'components/Common/ProgressBar';
import palette from 'theme/palette';
import { useState, useEffect } from 'react';
import { InfoTypography, RightSideWrapper } from '../Shared/styles';

const TOTAL = 100;
const PostCreate = () => {
  const [progressBarValue, setProgressBarValue] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgressBarValue((prev) => {
        const newValue = prev + 1;
        if (newValue === TOTAL) {
          clearInterval(interval);
        }
        return newValue;
      });
    }, 10);
    return () => clearInterval(interval);
  }, []);

  return (
    <Grid width="100%">
      <RightSideWrapper gap="14px">
        <Grid maxWidth="40%" maxHeight="20%">
          <video width="100%" height="100%" autoPlay loop muted>
            <source src="/images/project-onboarding/spinning-hexagon.webm" type="video/webm" />
          </video>
        </Grid>
        <GradientHeading fontSize="24">Creating your project</GradientHeading>

        <InfoTypography>Checking flux capacitor...</InfoTypography>
        <Grid width="20%">
          <ProgressBar value={progressBarValue} total={TOTAL} color={palette.green30} />
        </Grid>
      </RightSideWrapper>
    </Grid>
  );
};

export default PostCreate;
