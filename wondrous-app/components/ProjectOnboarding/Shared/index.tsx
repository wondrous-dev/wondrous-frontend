import { Box, Grid, Typography } from '@mui/material';
import palette from 'theme/palette';
import { styled } from '@mui/material/styles';
import Stack from '@mui/material/Stack';
import Stepper from '@mui/material/Stepper';
import LeftArrowIcon from 'components/Icons/leftArrow';

import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { BackButton } from 'components/OnboardingDao/StepWrapper/styles';

import Check from '@mui/icons-material/Check';
import SettingsIcon from '@mui/icons-material/Settings';
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import VideoLabelIcon from '@mui/icons-material/VideoLabel';
import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';
import { StepIconProps } from '@mui/material/StepIcon';

import typography from 'theme/typography';
import { HeaderButton } from 'components/organization/wrapper/styles';
import Button from 'components/Button';
import { PageLabel, RightSideWrapper } from './styles';

export const GenericArtPanel = ({ img }) => (
  <Grid
    maxWidth={{
      xs: '100%',
      md: '40%',
    }}
  >
    <RightSideWrapper>
      <img
        src={img}
        style={{
          maxWidth: '70%',
        }}
      />
    </RightSideWrapper>
  </Grid>
);

export const GenericLeftWrapper = ({ children }) => (
  <Grid
    display="flex"
    direction="column"
    justifyContent="flex-start"
    gap="24px"
    bgcolor={palette.grey920}
    flexGrow={1}
    padding="42px"
  >
    {children}
  </Grid>
);

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 15,
    left: 'calc(-50%)',
    right: 'calc(50%)',
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: '1px',
    border: 0,
    background: palette.highlightPurple,
    borderRadius: 1,
  },
}));

const ColorlibStepIconRoot = styled('div')<{
  ownerState: { completed?: boolean; active?: boolean };
}>(({ theme, ownerState }) => ({
  backgroundColor: palette.highlightPurple,
  zIndex: 1,
  // color: '#fff',
  color: palette.blue20,
  width: 'auto',
  height: 29,
  minWidth: 29,
  display: 'flex',
  borderRadius: '50%',
  justifyContent: 'center',
  alignItems: 'center',
  ...(ownerState.active && {
    color: palette.white,
    backgroundColor: palette.violet100,
    border: `1px solid ${palette.highlightPurple}`,

    // backgroundImage: 'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
    // boxShadow: '0 4px 10px 0 rgba(0,0,0,.25)',
  }),
  ...(ownerState.completed &&
    {
      // backgroundImage: 'linear-gradient( 136deg, rgb(242,113,33) 0%, rgb(233,64,87) 50%, rgb(138,35,135) 100%)',
    }),
}));

// function ColorlibStepIcon(props: StepIconProps) {
//   const { active, completed, className } = props;

//   const icons: { [index: string]: React.ReactElement } = {
//     1: <SettingsIcon />,
//     2: <GroupAddIcon />,
//     3: <VideoLabelIcon />,
//   };

//   return (
//     <ColorlibStepIconRoot ownerState={{ completed, active }} className={className}>
//       4
//     </ColorlibStepIconRoot>
//   );
// }

const sharedTypographyStyles = {
  fontFamily: typography.fontFamily,
  fontSize: '13px',
  fontWeight: 500,
};

const IndexTypography = ({ idx }) => (
  <Typography color={palette.blue20} {...sharedTypographyStyles}>
    {idx}
  </Typography>
);

const StepItem = (props) => {
  const { active, completed, className, label, icon } = props;
  console.log(props, 'props');

  if (active) {
    return (
      <Grid
        padding="8px"
        borderRadius="100px"
        display="flex"
        maxHeight={29}
        width="max-content"
        alignItems="center"
        zIndex={100}
        gap="6px"
        color={palette.blue20}
        bgcolor={palette.violet100}
        border={`1px solid ${palette.highlightPurple}`}
      >
        <IndexTypography idx={icon} />
        <Typography color={palette.white} {...sharedTypographyStyles}>
          {label}
        </Typography>
      </Grid>
    );
  }
  return (
    <Grid
      bgcolor={palette.highlightPurple}
      padding="8px"
      zIndex={100}
      borderRadius="50%"
      maxHeight={29}
      width={29}
      height={29}
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <IndexTypography idx={icon} />
    </Grid>
  );
};

export const StepperWrapper = ({ steps, currentStep }) => (
  <Stepper alternativeLabel activeStep={currentStep} connector={<ColorlibConnector />}>
    {steps.map(({ label }) => (
      <Step key={label}>
        <StepLabel StepIconComponent={(props) => <StepItem label={label} {...props} />} />
      </Step>
    ))}
  </Stepper>
);

export const ButtonsPanel = ({ onContinue = null, onSkip = null }) =>
  onContinue || onSkip ? (
    <Grid
      bgcolor={palette.black92}
      borderRadius="12px"
      padding="24px"
      width="100%"
      alignItems="center"
      justifyContent="flex-end"
    >
      <Box display="flex" justifyContent="flex-end" gap="12px">
        {onSkip ? (
          <Button
            onClick={onSkip}
            buttonTheme={{
              background: palette.grey75,
              borderColor: 'transparent',
              fontSize: '14px',
              fontWeight: 500,
              paddingX: 24,
              paddingY: 8,

              hover: {
                background: palette.grey76,
              },
            }}
          >
            Maybe later
          </Button>
        ) : null}
        {onContinue ? (
          <HeaderButton reversed onClick={onContinue}>
            Continue
          </HeaderButton>
        ) : null}
      </Box>
    </Grid>
  ) : null;

export const GenericSetupLeftWrapper = ({
  children,
  handleBackwards,
  steps,
  currentStep,
  index,
  title,
  subtitle = null,
}) => (
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
        <StepperWrapper steps={steps} currentStep={currentStep} />
      </Box>
    </Grid>
    <Grid display="flex" alignItems="center" gap="8px">
      <PageLabel>
        {index}.{currentStep + 1}
      </PageLabel>
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
    {subtitle ? (
      <Typography
        fontFamily={typography.fontFamily}
        fontSize="15px"
        lineHeight="24px"
        color={palette.grey250}
        fontWeight={400}
        letterSpacing="0.01em"
      >
        {subtitle}
      </Typography>
    ) : null}
    {children}
  </GenericLeftWrapper>
);
