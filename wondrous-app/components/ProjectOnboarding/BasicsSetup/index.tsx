import { Grid } from '@mui/material';
import { useOrgBoard, useSteps } from 'utils/hooks';
import { Container, GenericArtPanel, GenericSetupLeftWrapper } from '../Shared';
import { CONFIG, TYPES } from '../Shared/constants';
import Category from './Category';
import ProjectLogo from './ProjectLogo';
import Twitter from './Twitter';

const BASICS_CONFIG = [
  {
    label: 'Project Type',
    title: 'Project Category',
    component: Category,
    mediaUrl: '/images/project-onboarding/guides-gif.gif',
  },
  {
    label: 'Twitter',
    title: 'Project Twitter',
    component: Twitter,
    mediaUrl: '/images/project-onboarding/twitter-icon.webm',
    mediaType: 'video',
  },
  {
    label: 'Logo & Header',
    title: 'Add your Project Logo and Cover Photo',
    component: ProjectLogo,
    mediaUrl: '/images/project-onboarding/pic-icon.webm',
    mediaType: 'video',
  },
];

const LeftPanel = () => {
  const { setStep } = useOrgBoard();
  const { step, nextStep, prevStep } = useSteps();

  const handlePrevStep = () => {
    if (step - 1 < 0) {
      return setStep(CONFIG.findIndex((i) => i.type === TYPES.GUIDES));
    }
    prevStep();
  };

  const { component: Component, title, mediaUrl, mediaType } = BASICS_CONFIG[step];

  const STEPS = BASICS_CONFIG.map(({ label }) => ({ label }));

  return (
    <Container>
      <GenericSetupLeftWrapper
        handleBackwards={handlePrevStep}
        steps={STEPS}
        currentStep={step}
        index={1}
        title={title}
      >
        <Component handleNextStep={nextStep} />
      </GenericSetupLeftWrapper>
      <GenericArtPanel url={mediaUrl} mediaType={mediaType} />
    </Container>
  );
};

export default LeftPanel;
