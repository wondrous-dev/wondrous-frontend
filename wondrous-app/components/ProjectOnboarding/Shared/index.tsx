import { Box, Grid, Typography } from '@mui/material';
import Stepper from '@mui/material/Stepper';
import { styled } from '@mui/material/styles';
import LeftArrowIcon from 'components/Icons/leftArrow';
import palette from 'theme/palette';

import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { BackButton } from 'components/OnboardingDao/StepWrapper/styles';

import StepConnector, { stepConnectorClasses } from '@mui/material/StepConnector';

import Button from 'components/Button';
import { HeaderButton } from 'components/organization/wrapper/styles';
import { useEffect, useRef } from 'react';
import typography from 'theme/typography';
import { PageLabel, RightSideWrapper } from './styles';

export const GenericArtPanel = ({ url, mediaType = null }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    videoRef.current?.load();
  }, [url]);

  return (
    <Grid
      maxWidth={{
        xs: '100%',
        md: '40%',
      }}
      width="100%"
    >
      <RightSideWrapper>
        {mediaType === 'video' ? (
          <Grid maxWidth="70%">
            <video width="100%" height="auto" autoPlay loop muted ref={videoRef}>
              <source src={url} type="video/webm" />
            </video>
          </Grid>
        ) : (
          <img
            src={url}
            style={{
              maxWidth: '70%',
            }}
          />
        )}
      </RightSideWrapper>
    </Grid>
  );
};
export const GenericLeftWrapper = ({ children }) => (
  <Grid
    display="flex"
    direction="column"
    justifyContent="flex-start"
    gap="24px"
    bgcolor={palette.grey920}
    flexGrow={1}
    padding={{
      xs: '18px 24px 24px 24px',
      sm: '42px',
    }}
  >
    {children}
  </Grid>
);

const ColorlibConnector = styled(StepConnector)(({ theme }) => ({
  [`&.${stepConnectorClasses.alternativeLabel}`]: {
    top: 15,
    left: 'calc(-33%)',
    right: 'calc(50%)',
  },
  [`& .${stepConnectorClasses.line}`]: {
    height: '1px',
    border: 0,
    background: palette.highlightPurple,
    borderRadius: 1,
  },
}));

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

export const ButtonsPanel = ({ onContinue = null, onSkip = null, nextTitle = 'Continue' }) =>
  onContinue || onSkip ? (
    <Grid
      bgcolor={palette.black92}
      borderRadius="12px"
      padding="24px"
      marginBottom="5%"
      width="100%"
      alignItems="center"
      justifyContent="flex-end"
    >
      <Box
        display="flex"
        justifyContent="flex-end"
        gap="12px"
        flexDirection={{
          xs: 'column',
          sm: 'row',
        }}
      >
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
          <Grid>
            <HeaderButton
              reversed
              onClick={onContinue}
              style={{
                width: '100%',
              }}
            >
              {nextTitle}
            </HeaderButton>
          </Grid>
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
    <Grid
      display="flex"
      gap="14px"
      flexDirection={{
        xs: 'column',
        sm: 'row',
      }}
      justifyContent="space-between"
      alignItems={{
        xs: 'flex-start',
        sm: 'center',
      }}
    >
      <Grid display="flex" alignItems="center" gap="14px">
        <BackButton color={palette.tundora} onClick={handleBackwards}>
          <LeftArrowIcon />
        </BackButton>
        <Typography color={palette.white} fontWeight={700} fontSize="16px" lineHeight="20px">
          Back
        </Typography>
      </Grid>
      <Box
        width="30%"
        display={{
          xs: 'none',
          sm: 'block',
        }}
      >
        <StepperWrapper steps={steps} currentStep={currentStep} />
      </Box>
    </Grid>
    <Grid display="flex" alignItems="center" gap="8px">
      <PageLabel>
        {index}.{currentStep + 1}
      </PageLabel>
      <Typography
        color={palette.white}
        fontSize={{
          xs: '16px',
          sm: '24px',
        }}
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

export const Container = ({ children, sx = {} }) => (
  <Grid
    display="flex"
    width="100%"
    height="100%"
    minHeight="100vh"
    sx={{
      flexDirection: {
        xs: 'column-reverse',
        md: 'row',
      },
      ...sx,
    }}
  >
    {children}
  </Grid>
);

export const sendAnalyticsData = (type, data) => {
  if (window?.analytics && process.env.NEXT_PUBLIC_PRODUCTION) {
    window?.analytics?.track(type, data);
  }
};
