import { useLazyQuery, useMutation } from '@apollo/client';
import { withAuth } from 'components/Auth/withAuth';
import { AddImages, CreateDao, DaoCategory, InviteCommunity, Review, StepWrapper } from 'components/OnboardingDao';
import { STEP_ACTIONS } from 'components/OnboardingDao/constants';
import { Form, Formik } from 'formik';
import { CREATE_ORG } from 'graphql/mutations';
import { IS_ORG_USERNAME_TAKEN } from 'graphql/queries';
import { useRouter } from 'next/router';
import { useReducer, useState } from 'react';
import * as Yup from 'yup';

export const FIELD_SETS = [
  {
    title: 'Create DAO',
    subtitle: 'Use the power of web3 to launch and scale your project.',
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
    Component: AddImages,
    fields: {
      headerPicture: { name: 'headerPicture', label: 'Header Picture' },
      profilePicture: { name: 'profilePicture', label: 'Profile Picture' },
    },
  },
  {
    title: 'DAO category',
    subtitle: 'How would you categorize what your DAO does?',
    Component: DaoCategory,
    hideLater: true,
    fields: {
      category: { name: 'category', label: 'Enter custom goal', placeholder: "What is your DAO's goal?" },
    },
  },
  // NOTE: not in used yet
  // {
  //   title: 'Import tasks',
  //   subtitle: 'Set up your workflow so members can begin contributing.',
  //   Component: ImportTasks,
  // },
  {
    title: 'Invite your community',
    subtitle: `Invite your contributors and community members. Those who don't have an account will be sent an invite link.`,
    Component: InviteCommunity,
  },
  {
    title: 'Review',
    subtitle: `Review your DAO details and then let's launch!`,
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
] as const;

const fieldSetsLength = FIELD_SETS.length;

const handleStep = (step, { action, hasError = false }) => {
  if (hasError) return step;
  const actions = {
    [STEP_ACTIONS.next]: step + 1,
    [STEP_ACTIONS.prev]: step - 1,
  };
  return actions[action] ?? step;
};

const useCreateOrg = () => {
  const [createOrg, { loading }] = useMutation(CREATE_ORG);
  const router = useRouter();
  const handleCreateOrg = (values) => {
    createOrg({ variables: { input: values } }).then(() => router.push(`organization/${values.username}/boards`));
  };
  return { handleCreateOrg, loading };
};

const useIsOrgUsernameTaken = () => {
  const [isOrgUsernameTaken] = useLazyQuery(IS_ORG_USERNAME_TAKEN, {
    fetchPolicy: 'network-only',
  });
  const [prevUsername, setPrevUsername] = useState('');
  const [prevResult, setPrevResult] = useState(false);
  const handleIsOrgUsernameTaken = async (username) => {
    if (username && username !== prevUsername) {
      // check the previous parameter first to prevent unnecessary queries during form validation; refer to https://github.com/jaredpalmer/formik/issues/512#issuecomment-666549238
      const { data } = await isOrgUsernameTaken({ variables: { username } });
      const result = !data?.isOrgUsernameTaken?.exist;
      setPrevUsername(username);
      setPrevResult(result);
      return result;
    }
    return prevResult;
  };
  return handleIsOrgUsernameTaken;
};

const useSchema = () => {
  const handleIsOrgUsernameTaken = useIsOrgUsernameTaken();
  const usernameRegex = /^(?=[a-z0-9._]{5,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/; // https://stackoverflow.com/questions/12018245/regular-expression-to-validate-username
  const schema = Yup.object().shape({
    name: Yup.string().required('DA0 name is required'),
    username: Yup.string()
      .required('DA0 username is required')
      .matches(
        usernameRegex,
        'Usernames should be between 5 and 15 characters long and contain only lowercase letters, numbers, and underscores.'
      )
      .test('is-taken', 'This username is taken', handleIsOrgUsernameTaken), // https://github.com/jquense/yup#schematestname-string-message-string--function--any-test-function-schema=
    description: Yup.string().required('DA0 description is required'),
    category: Yup.string().required('DA0 category is required'),
  });
  return schema;
};

const OnboardingCreateDao = () => {
  const [step, setStep] = useReducer(handleStep, 0);
  const currentFieldSet = FIELD_SETS[step];
  const { handleCreateOrg, loading } = useCreateOrg();
  return (
    <Formik
      initialValues={{
        category: 'social_good',
      }}
      onSubmit={handleCreateOrg}
      validationSchema={useSchema()}
      validateOnMount
    >
      <Form>
        <StepWrapper
          key={step}
          {...currentFieldSet}
          handleStep={({ action, hasError = false }) => setStep({ action, hasError })}
          loading={loading}
          step={step + 1}
          fieldSetsLength={fieldSetsLength}
        />
      </Form>
    </Formik>
  );
}

export default withAuth(OnboardingCreateDao);
