import { Box, Grid, Typography } from '@mui/material';
import LeftArrowIcon from 'components/Icons/leftArrow';
import { BackButton } from 'components/OnboardingDao/StepWrapper/styles';
import { useState } from 'react';
import palette from 'theme/palette';
import typography from 'theme/typography';
import { GenericArtPanel, GenericLeftWrapper, StepperWrapper } from '../Shared';
import { PageLabel } from '../Shared/styles';
import Category from './Category';
import ProjectLogo from './ProjectLogo';
import Twitter from './Twitter';

const CONFIG = [
  {
    label: 'Project Type',
    title: 'Select your Project Category',
    component: Category,
  },
  {
    label: 'Twitter',
    title: 'Connect your Project Twitter',
    component: Twitter,
  },
  {
    label: 'Logo & Header',
    title: 'Add your Project Logo and Cover Photo',
    component: ProjectLogo,
  },
];

const RightPanel = () => <GenericArtPanel img="/images/project-onboarding/guides-artwork.png" />;

const LeftPanel = () => {
  const [step, setStep] = useState(0);

  const [data, setData] = useState({
    category: '',
    headerPicture: '',
    profilePicture: '',
    description: '',
  });
  const handleBackwards = () => {
    if (step === 0) return;
    setStep((prev) => prev - 1);
  };
  const handleForward = () => setStep((prev) => prev + 1);

  const { component: Component, title } = CONFIG[step];

  const STEPS = CONFIG.map(({ label }) => ({ label }));

  return (
    <GenericLeftWrapper>
      <Grid display="flex" justifyContent="space-between" alignItems="center">
        <Grid display="flex" alignItems="center" gap="14px">
          <BackButton color={palette.tundora} onClick={handleBackwards}>
            <LeftArrowIcon />
          </BackButton>
          <Typography color={palette.white} fontWeight={700} fontSize="16px" lineHeight="20px">
            Back
          </Typography>
        </Grid>
        <Box width="30%">
          <StepperWrapper steps={STEPS} currentStep={step} />
        </Box>
      </Grid>
      <Grid display="flex" alignItems="center" gap="8px">
        <PageLabel>1.{step + 1}</PageLabel>
        <Typography
          color={palette.white}
          fontSize="24px"
          fontFamily={typography.fontFamily}
          fontWeight={700}
          lineHeight="31px"
        >
          {title}
        </Typography>
      </Grid>
      <Component onClick={handleForward} updateData={setData} data={data} />
    </GenericLeftWrapper>
  );
};

const BasicsSetup = {
  LeftPanel,
  RightPanel,
};

export default BasicsSetup;
