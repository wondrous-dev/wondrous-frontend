import { ENTITIES_TYPES } from 'utils/constants';
import { useSteps } from 'utils/hooks';
import { CONFIG, TYPES } from '../Shared/constants';
import { GenericArtPanel, GenericSetupLeftWrapper } from '../Shared';
import AddEntity from './AddEntity';
import useProjectOnboardingContext from '../Shared/context';

const RightPanel = () => <GenericArtPanel img="/images/project-onboarding/guides-artwork.png" />;

const ENTITY_CONFIGS = [
  {
    label: 'Pods',
    title: 'Project Pods',
    subtitle:
      'Pods are how you organize your teams. For example, you can have a “Design Pod” to do design work.  Use our suggestions or add custom pods for your community.',
    // component: AddEntity,
    entityType: ENTITIES_TYPES.POD,
  },
  {
    label: 'Milestones',
    title: 'Milestones',
    subtitle:
      'What are the big goals your community is working towards? Milestones are a way to organize big projects into smaller attainable pieces.',
    // component: AddEntity,
    entityType: ENTITIES_TYPES.MILESTONE,
  },
  {
    label: 'Tasks',
    title: 'Tasks',
    subtitle:
      'Tasks are how work gets done in projects. You can assign tasks or let members with specific roles claim them. Members can also be compensated for task completion.',
    // component: AddEntity,
    entityType: ENTITIES_TYPES.TASK,
  },
  {
    label: 'Bounties',
    title: 'Bounties',
    subtitle:
      'Bounties are for sourcing and rewarding open contribution from your community. You can compensate bounty submission and manage approvals in your admin dashboard.',
    // component: AddEntity,
    entityType: ENTITIES_TYPES.BOUNTY,
  },
];

const LeftPanel = () => {
  const { setStep } = useProjectOnboardingContext();
  const { step, nextStep, prevStep } = useSteps();

  const { title, subtitle, entityType } = ENTITY_CONFIGS[step];

  const handleStep = () => {
    if (step + 1 === ENTITY_CONFIGS.length) {
      return setStep(CONFIG.findIndex((item) => item.type === TYPES.GUIDES));
    }
    nextStep();
  };
  const STEPS = ENTITY_CONFIGS.map(({ label }) => ({ label }));
  return (
    <GenericSetupLeftWrapper
      subtitle={subtitle}
      handleBackwards={prevStep}
      steps={STEPS}
      currentStep={step}
      index={2}
      title={title}
    >
      <AddEntity entityType={entityType} nextStep={handleStep} />
    </GenericSetupLeftWrapper>
  );
};

const Workflow = {
  LeftPanel,
  RightPanel,
};

export default Workflow;
