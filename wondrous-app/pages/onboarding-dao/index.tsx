import { useLazyQuery, useMutation } from '@apollo/client';
import { withAuth } from 'components/Auth/withAuth';
import { AddImages, CreateDao, DaoCategory, InviteCommunity, Review, StepWrapper } from 'components/OnboardingDao';
import { STEP_ACTIONS } from 'components/OnboardingDao/constants';
import { Form, Formik } from 'formik';
import { CREATE_ORG, REDEEM_COLLAB_TOKEN } from 'graphql/mutations';
import { GET_ORG_DISCORD_NOTIFICATION_CONFIGS, GET_USER_ORGS, IS_ORG_USERNAME_TAKEN } from 'graphql/queries';
import { useRouter } from 'next/router';
import { useReducer, useState } from 'react';
import * as Yup from 'yup';

export const FIELD_SETS = [
  {
    title: 'Create Workspace',
    subtitle: 'Use the power of web3 to launch and scale your project.',
    Component: CreateDao,
    hideLater: true,
    fields: {
      name: { name: 'name', label: 'Enter Org name', placeholder: "What is the org's title?" },
      username: {
        name: 'username',
        label: 'Enter Org username',
        placeholder: `What is the org's username?`,
      },
      description: {
        name: 'description',
        label: 'Enter description',
        placeholder: 'What is your organization about?',
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
    title: 'Org category',
    subtitle: 'How would you categorize what your organization does?',
    Component: DaoCategory,
    hideLater: true,
    fields: {
      category: { name: 'category', label: 'Enter custom goal', placeholder: "What is your Org's goal?" },
    },
  },
  // NOTE: not in used yet
  // {
  //   title: 'Import tasks',
  //   subtitle: 'Set up your workflow so members can begin contributing.',
  //   Component: ImportTasks,
  // },
  {
    title: 'Discord Integration',
    subtitle: `For private channels, please ensure that the bot is added as a role.`,
    Component: InviteCommunity,
    fields: {
      guildId: { name: 'guildId', label: '1. Paste Invite Link', placeholder: 'Paste invite link from Discord' },
      addBot: { name: 'addBot', label: '2. Add bot', placeholder: 'Add Wonder Bot' },
      channelId: {
        name: 'channelId',
        label: '3.  Select Channel',
        placeholder: 'Where do you want to add the Wonder Bot?',
      },
    },
  },
  {
    title: 'Review',
    subtitle: `Review your org details and then let's launch!`,
    Component: Review,
    hoverContinue: true,
    fields: {
      name: { name: 'name', label: 'Org name' },
      username: { name: 'username', label: 'Org username' },
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
  const router = useRouter();
  const { collabInvite } = router.query;

  const [redeemCollabToken, { loading: redeemLoading }] = useMutation(REDEEM_COLLAB_TOKEN, {
    notifyOnNetworkStatusChange: true,
    onCompleted: ({ redeemOrgCollabRequestInviteToken }) => {
      const { username } = redeemOrgCollabRequestInviteToken;
      router.push(`/collaboration/${username}/boards`);
    },
  });
  const [mutation, { loading }] = useMutation(CREATE_ORG, {
    refetchQueries: [GET_ORG_DISCORD_NOTIFICATION_CONFIGS, GET_USER_ORGS],
    onCompleted: ({ createOrg }) => {
      const { username, id } = createOrg;
      if (!collabInvite) {
        router.push(`organization/${username}/home`);
      } else {
        redeemCollabToken({ variables: { orgId: id, token: collabInvite } });
      }
    },
  });
  const handleMutation = async (values) => {
    const { addBot, ...rest } = values;
    await mutation({ variables: { input: rest } });
  };
  return { handleCreateOrg: handleMutation, loading: loading || redeemLoading };
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
    name: Yup.string().required('Name is required'),
    username: Yup.string()
      .required('Username is required')
      .matches(
        usernameRegex,
        'Usernames should be between 5 and 15 characters long and contain only lowercase letters, numbers, and underscores.'
      )
      .test('is-taken', 'This username is taken', handleIsOrgUsernameTaken), // https://github.com/jquense/yup#schematestname-string-message-string--function--any-test-function-schema=
    description: Yup.string().required('Description is required'),
    category: Yup.string().required('Category is required'),
    guildId: Yup.string().optional(),
    addBot: Yup.boolean().optional(),
    channelId: Yup.string().when('guildId', {
      is: (guildId) => guildId,
      then: Yup.string().required('Channel is required'),
      otherwise: Yup.string().optional(),
    }),
    headerPicture: Yup.string().optional(),
    profilePicture: Yup.string().optional(),
  });
  return schema;
};

const OnboardingCreateDao = () => {
  const [step, setStep] = useReducer(handleStep, 0);
  const [tempState, setTempState] = useState({});
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
          tempState={tempState}
          setTempState={setTempState}
        />
      </Form>
    </Formik>
  );
};

export default withAuth(OnboardingCreateDao);
