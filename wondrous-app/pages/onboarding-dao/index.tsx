import { useLazyQuery, useMutation } from '@apollo/client';
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
import { IS_ORG_USERNAME_TAKEN } from 'graphql/queries';
import { useRouter } from 'next/router';
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
      name: { name: 'name', label: 'Enter DAO name', placeholder: "What is the org's title?" },
      username: {
        name: 'username',
        label: 'Enter DAO username',
        placeholder: `What is the org's username?`,
      },
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
      name: { name: 'name', label: 'DAO name' },
      username: { name: 'username', label: 'DAO username' },
      description: {
        name: 'description',
        label: 'Description',
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
  const [createOrg, { loading }] = useMutation(CREATE_ORG);
  const router = useRouter();
  const handleCreateOrg = (values) => {
    createOrg({ variables: { input: values } }).then(() => {
      router.push(`organization/${values.username}/boards`);
    });
  };
  return { handleCreateOrg, loading };
};

const useIsOrgUsernameTaken = () => {
  const [isOrgUsernameTaken] = useLazyQuery(IS_ORG_USERNAME_TAKEN);
  const handleIsOrgUsernameTaken = async (username) => {
    // TODO: debounce this
    if (!username) return false;
    const { data } = await isOrgUsernameTaken({ variables: { username } });
    return !data?.isOrgUsernameTaken?.exist;
  };
  return handleIsOrgUsernameTaken;
};

// https://stackoverflow.com/questions/12018245/regular-expression-to-validate-username
const usernameRegex = /^(?=[a-zA-Z0-9._]{5,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

const useSchema = () => {
  const handleIsOrgUsernameTaken = useIsOrgUsernameTaken();
  const schema = Yup.object().shape({
    name: Yup.string().required('DA0 name is required'),
    username: Yup.string()
      .required('DA0 username is required')
      .matches(
        usernameRegex,
        'Username should be between 5 and 15 characters, and can only contain letters, numbers, and the underscore.'
      )
      .test('is-taken', 'This username is taken', handleIsOrgUsernameTaken), // https://github.com/jquense/yup#schematestname-string-message-string--function--any-test-function-schema=
    description: Yup.string().required('DA0 description is required'),
    category: Yup.string().required('DA0 category is required'),
  });
  return schema;
};

const handleTempState = (field, { key, value }) => {
  return { ...field, [key]: value };
};

const OnboardingCreateDao = () => {
  const [step, setStep] = useReducer(handleStep, 0);
  const [tempState, setTempState] = useReducer(handleTempState, {});
  const currentField = fieldSet[step];
  const { handleCreateOrg, loading } = useCreateOrg();
  return (
    <Formik
      initialValues={{
        category: '🌎 Social good',
      }}
      onSubmit={handleCreateOrg}
      validationSchema={useSchema()}
    >
      <Form>
        <OnboardingCreateDaoProvider value={{ tempState, setTempState }}>
          <StepWrapper
            {...currentField}
            handleStep={({ action, hasError = false }) => setStep({ action, hasError })}
            loading={loading}
          />
        </OnboardingCreateDaoProvider>
      </Form>
    </Formik>
  );
};

export default withAuth(OnboardingCreateDao);
