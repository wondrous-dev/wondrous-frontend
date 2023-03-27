import { ENTITIES_TYPES } from 'utils/constants';
import { useOrgBoard, useSteps } from 'utils/hooks';
import { CONFIG, TYPES } from '../Shared/constants';
import { Container, GenericArtPanel, GenericSetupLeftWrapper } from '../Shared';
import AddEntity from './AddEntity';

const ENTITY_CONFIGS = [
  {
    label: 'Pods',
    title: 'Project Pods',
    subtitle:
      'Pods are how you organize your teams. For example, you can have a “Design Pod” to do design work.  Use our suggestions or add custom pods for your community.',
    entityType: ENTITIES_TYPES.POD,
    mediaUrl: '/images/project-onboarding/project-pods.gif',
  },
  {
    label: 'Milestones',
    title: 'Milestones',
    subtitle:
      'What are the big goals your community is working towards? Milestones are a way to organize big projects into smaller attainable pieces.',
    entityType: ENTITIES_TYPES.MILESTONE,
    mediaUrl: '/images/project-onboarding/milestone-icon.webm',
    mediaType: 'video',
  },
  {
    label: 'Tasks',
    title: 'Tasks',
    subtitle:
      'Tasks are how work gets done in projects. You can assign tasks or let members with specific roles claim them. Members can also be compensated for task completion.',
    entityType: ENTITIES_TYPES.TASK,
    mediaUrl: '/images/project-onboarding/task-icon.webm',
    mediaType: 'video',
  },
  {
    label: 'Bounties',
    title: 'Bounties',
    subtitle:
      'Bounties are for sourcing and rewarding open contribution from your community. You can compensate bounty submission and manage approvals in your admin dashboard.',
    entityType: ENTITIES_TYPES.BOUNTY,
    mediaUrl: '/images/project-onboarding/bounty-icon.webm',
    mediaType: 'video',
  },
];

const Workflow = () => {
  const { setStep } = useOrgBoard();
  const { step, nextStep, prevStep } = useSteps();

  const { title, subtitle, entityType, mediaUrl, mediaType } = ENTITY_CONFIGS[step];

  const handleStep = () => {
    if (step + 1 === ENTITY_CONFIGS.length) {
      return setStep(CONFIG.findIndex((item) => item.type === TYPES.GUIDES));
    }
    nextStep();
  };
  const handlePrevStep = () => {
    if (step - 1 < 0) {
      return setStep(CONFIG.findIndex((i) => i.type === TYPES.GUIDES));
    }
    prevStep();
  };

  const STEPS = ENTITY_CONFIGS.map(({ label }) => ({ label }));
  return (
    <Container>
      <GenericSetupLeftWrapper
        subtitle={subtitle}
        handleBackwards={handlePrevStep}
        steps={STEPS}
        currentStep={step}
        index={2}
        title={title}
      >
        <AddEntity entityType={entityType} nextStep={handleStep} />
      </GenericSetupLeftWrapper>
      <GenericArtPanel url={mediaUrl} mediaType={mediaType} />
    </Container>
  );
};

export default Workflow;
