import { withAuth } from 'components/Auth/withAuth';
import {
  AddImages,
  CreateDao,
  DaoCategory,
  ImportTasks,
  InviteCommunity,
  Review,
  StepWrapper,
} from 'components/OnboardingDao';
import { useReducer } from 'react';

const fields = [
  {
    title: 'Create DAO',
    subtitle: 'Use the power of web3 to launch and scale your project.',
    step: 1,
    Component: CreateDao,
  },
  {
    title: 'Add images',
    subtitle: 'Add your dOrgs logo and header to personalize your boards.',
    step: 2,
    Component: AddImages,
  },
  {
    title: 'DAO category',
    subtitle: 'How would you categorize what your DAO does?',
    step: 3,
    Component: DaoCategory,
  },
  {
    title: 'Import tasks',
    subtitle: 'Set up your workflow so members can begin contributing.',
    step: 4,
    Component: ImportTasks,
  },
  {
    title: 'Invite your community ',
    subtitle: `Upload a CSV with all your contributors and community members. Those who don\'t have an account will be sent an invite link.`,
    step: 5,
    Component: InviteCommunity,
  },
  {
    title: 'Review',
    subtitle: `Review your DAO details and then let\'s launch!`,
    step: 6,
    Component: Review,
  },
];

const handleStep = (step, { action }) => {
  if (action === 'next') return step + 1;
  if (action === 'back') return step - 1;
  return step;
};

const OnboardingCreateDao = () => {
  const [step, setStep] = useReducer(handleStep, 0);
  const currentField = fields[step];
  return (
    <StepWrapper
      {...currentField}
      handleLater={() => setStep({ action: 'next' })}
      handleBack={() => setStep({ action: 'back' })}
    />
  );
};

export default withAuth(OnboardingCreateDao);
