import { useSteps } from 'utils/hooks';
import { GenericArtPanel, GenericSetupLeftWrapper } from '../Shared';
import { CONFIG, TYPES } from '../Shared/constants';
import useProjectOnboardingContext from '../Shared/context';
import DiscordIntegration from './Discord';
import InviteCollaborators from './Invite';

const COMMUNITY_CONFIGS = [
  {
    label: 'Connect Discord',
    title: 'Connect Discord',
    component: DiscordIntegration,
  },
  {
    title: 'Invite collaborators',
    label: 'Invite collaborators',
    component: InviteCollaborators,
  },
];

const LeftPanel = () => {
  const { setStep: setOnboardingStep } = useProjectOnboardingContext();
  const { step, nextStep, prevStep } = useSteps();

  const { title, component: Component } = COMMUNITY_CONFIGS[step];

  const STEPS = COMMUNITY_CONFIGS.map(({ label }) => ({ label }));

  const handleNextStep = () => {
    if (step + 1 === COMMUNITY_CONFIGS.length) {
      return setOnboardingStep(CONFIG.findIndex((item) => item.type === TYPES.SUMMARY));
    }
    nextStep();
  };
  return (
    <GenericSetupLeftWrapper handleBackwards={prevStep} steps={STEPS} currentStep={step} index={3} title={title}>
      <Component nextStep={handleNextStep} />
    </GenericSetupLeftWrapper>
  );
};

const RightPanel = () => <GenericArtPanel img="/images/project-onboarding/guides-artwork.png" />;

const Community = {
  LeftPanel,
  RightPanel,
};

export default Community;
