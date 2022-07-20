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
import { Form, Formik } from 'formik';
import { useReducer } from 'react';

const fieldSet = [
  {
    title: 'Create DAO',
    subtitle: 'Use the power of web3 to launch and scale your project.',
    step: 1,
    Component: CreateDao,
    fields: {
      name: { name: 'name', label: 'Enter DAO name', placeholder: "What is the org's title?" },
      description: {
        name: 'description',
        label: 'Enter DAO description',
        placeholder: 'What is your DAOs aims?',
        multiline: true,
        maxLength: 200,
      },
    },
  },
  {
    title: 'Add images',
    subtitle: 'Add your dOrgs logo and header to personalize your boards.',
    step: 2,
    Component: AddImages,
    fields: {
      headerPicture: { name: 'headerPicture', label: 'Header Picture' },
      profilePicture: { name: 'profilePicture', label: 'Profile Picture' },
    },
  },
  {
    title: 'DAO category',
    subtitle: 'How would you categorize what your DAO does?',
    step: 3,
    Component: DaoCategory,
    fields: {
      category: { name: 'category', label: 'Enter custom goal', placeholder: "What is your DAO's goal?" },
    },
  },
  {
    title: 'Import tasks',
    subtitle: 'Set up your workflow so members can begin contributing.',
    step: 4,
    Component: ImportTasks,
  },
  {
    title: 'Invite your community ',
    subtitle: `Upload a CSV with all your contributors and community members. Those who don't have an account will be sent an invite link.`,
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
  const actions = {
    next: step + 1,
    back: step - 1,
  };
  return actions[action] ?? step;
};

const OnboardingCreateDao = () => {
  const [step, setStep] = useReducer(handleStep, 0);
  const currentField = fieldSet[step];
  return (
    <Formik initialValues={{}} onSubmit={() => {}}>
      <Form>
        <StepWrapper
          {...currentField}
          handleLater={() => setStep({ action: 'next' })}
          handleBack={() => setStep({ action: 'back' })}
        />
      </Form>
    </Formik>
  );
};

export default withAuth(OnboardingCreateDao);
