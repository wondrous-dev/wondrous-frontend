import { useOrgBoard, useSteps } from 'utils/hooks';
import { Container, GenericArtPanel, GenericSetupLeftWrapper } from '../Shared';
import { CONFIG, TYPES } from '../Shared/constants';
import DiscordIntegration from './Discord';
import InviteCollaborators from './Invite';

const COMMUNITY_CONFIGS = [
  {
    label: 'Connect Discord',
    title: 'Connect Discord',
    component: DiscordIntegration,
    mediaUrl: '/images/project-onboarding/discord-icon.webm',
    mediaType: 'video',
  },
  {
    label: 'Collaborators',
    title: 'Invite collaborators',
    component: InviteCollaborators,
    mediaUrl: '/images/project-onboarding/collab-icon.webm',
    mediaType: 'video',
  },
];

const Community = () => {
  const { setStep: setOnboardingStep } = useOrgBoard();

  const { step, nextStep, prevStep } = useSteps();
  const { title, component: Component, mediaUrl, mediaType } = COMMUNITY_CONFIGS[step];

  const STEPS = COMMUNITY_CONFIGS.map(({ label }) => ({ label }));

  const handleNextStep = () => {
    if (step + 1 === COMMUNITY_CONFIGS.length) {
      return setOnboardingStep(CONFIG.findIndex((item) => item.type === TYPES.SUMMARY));
    }
    nextStep();
  };

  const handlePrevStep = () => {
    if (step - 1 < 0) {
      return setOnboardingStep(CONFIG.findIndex((i) => i.type === TYPES.GUIDES));
    }
    prevStep();
  };

  return (
    <Container>
      <GenericSetupLeftWrapper
        handleBackwards={handlePrevStep}
        steps={STEPS}
        currentStep={step}
        index={3}
        title={title}
      >
        <Component nextStep={handleNextStep} />
      </GenericSetupLeftWrapper>
      <GenericArtPanel mediaType={mediaType} url={mediaUrl} />;
    </Container>
  );
};

export default Community;
