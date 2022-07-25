import { useMutation } from '@apollo/client';
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
import { OnboardingCreateDaoProvider } from 'components/OnboardingDao/context';
import { Form, Formik } from 'formik';
import { CREATE_ORG } from 'graphql/mutations/org';
import { useReducer } from 'react';
import * as Yup from 'yup';

const fieldSet = [
  {
    title: 'Create DAO',
    subtitle: 'Use the power of web3 to launch and scale your project.',
    step: 1,
    Component: CreateDao,
    hideLater: true,
    fields: {
      name: { name: 'name', label: 'Enter DAO name', placeholder: "What is the org's title?", required: true },
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
    hideLater: true,
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
    title: 'Invite your community',
    subtitle: `Upload a CSV with all your contributors and community members. Those who don't have an account will be sent an invite link.`,
    step: 5,
    Component: InviteCommunity,
  },
  {
    title: 'Review',
    subtitle: `Review your DAO details and then let's launch!`,
    step: 6,
    Component: Review,
    hoverContinue: true,
    fields: {
      name: { name: 'name' },
      description: {
        name: 'description',
        multiline: true,
        maxLength: 200,
      },
    },
  },
];

const handleStep = (step, { action, hasError = false }) => {
  if (hasError) return step;
  const actions = {
    next: step + 1,
    back: step - 1,
  };
  return actions[action] ?? step;
};

const useCreateOrg = () => {
  const [createOrg] = useMutation(CREATE_ORG);
  const handleCreateOrg = (values) => {
    createOrg({ variables: { input: values } });
  };
  return handleCreateOrg;
};

const schema = Yup.object().shape({
  name: Yup.string().required('DA0 name is required'),
  description: Yup.string().required('DA0 description is required'),
  category: Yup.string().required('DA0 category is required'),
});

const handleTempState = (field, { key, value }) => {
  console.log('handleTempState', field, key, value);
  return { ...field, [key]: value };
};

const OnboardingCreateDao = () => {
  const [step, setStep] = useReducer(handleStep, 0);
  const [tempState, setTempState] = useReducer(handleTempState, {});
  const currentField = fieldSet[step];
  const handleCreateOrg = useCreateOrg();
  return (
    <Formik
      initialValues={{
        category: '🌎 Social good',
      }}
      onSubmit={handleCreateOrg}
      validationSchema={schema}
    >
      <Form>
        <OnboardingCreateDaoProvider value={{ tempState, setTempState }}>
          <StepWrapper {...currentField} handleStep={({ action, hasError = false }) => setStep({ action, hasError })} />
        </OnboardingCreateDaoProvider>
      </Form>
    </Formik>
  );
};

export default withAuth(OnboardingCreateDao);
