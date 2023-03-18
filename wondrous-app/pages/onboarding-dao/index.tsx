import { useRouter } from 'next/router';
import * as Yup from 'yup';
import { withAuth } from 'components/Auth/withAuth';
import { useLazyQuery, useMutation } from '@apollo/client';
import palette from 'theme/palette';
import { Grid, Typography } from '@mui/material';
import { ProjectCreateForm, GuidesPage, BasicsSetup } from 'components/ProjectOnboarding';
import { STEP_ACTIONS } from 'components/OnboardingDao/constants';
import ReactPlayer from 'react-player/lazy';

import { useReducer, useState } from 'react';
import { ProjectOnboardingContext } from 'components/ProjectOnboarding/Shared/context';
import { useFormik } from 'formik';
import { GET_ORG_DISCORD_NOTIFICATION_CONFIGS, GET_USER_ORGS, IS_ORG_USERNAME_TAKEN } from 'graphql/queries';
import { REDEEM_COLLAB_TOKEN, CREATE_ORG } from 'graphql/mutations';
import PostCreate from 'components/ProjectOnboarding/ProjectCreate/PostCreate';
import { CONFIG } from 'components/ProjectOnboarding/Shared/constants';

// const handleStep = (step, { action, hasError = false }) => {
//   if (hasError) return step;
//   const actions = {
//     [STEP_ACTIONS.next]: step + 1,
//     [STEP_ACTIONS.prev]: step - 1,
//     [STEP_ACTIONS.]
//   };
//   return actions[action] ?? step;
// };

interface ProjectData {
  username?: string;
  name?: string;
}

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
      if (collabInvite) {
        redeemCollabToken({ variables: { orgId: id, token: collabInvite } });
      }
    },
  });
  const handleMutation = async (values) => {
    const { addBot, ...rest } = values;
    return await mutation({ variables: { input: rest } });
  };
  return { handleMutation, loading: loading || redeemLoading };
};

const ProjectOnboarding = () => {
  const [step, setStep] = useState(0);
  // const [step, setStep] = useReducer(handleStep, 0);
  const { handleMutation, loading } = useCreateOrg();

  const moveForward = () => setStep((prev) => prev + 1);

  const moveBackwards = () => setStep((prev) => prev - 1);

  const { LeftPanel, RightPanel } = CONFIG[step];

  const form = useFormik({
    initialValues: {},
    validationSchema: useSchema(),
    onSubmit: (values) => {},
  });

  const projectData = form.values as ProjectData;

  const handleOrgCreate = async (e) => {
    e.stopPropagation();
    try {
      moveForward();
      // const {data} = await handleMutation(form.values);
      setTimeout(() => moveForward(), 1000);
    } catch (error) {
      console.log(error, 'error');
    }
  };
  return (
    <ProjectOnboardingContext.Provider
      value={{
        projectData,
        form,
        setStep,
        createOrg: handleOrgCreate,
        loading,
      }}
    >
      <Grid
        display="flex"
        width="100%"
        height="100%"
        minHeight="inherit"
        sx={{
          flexDirection: {
            xs: 'column',
            md: 'row',
          },
        }}
      >
        {LeftPanel ? <LeftPanel /> : null}
        {RightPanel ? <RightPanel /> : null}
        {/* {position === 'left' ?  <Grid bgcolor={palette.grey920} flexGrow={1}>
          <Component />
        </Grid> : null} */}
        {/* {position === 'right' ?   : null} */}
      </Grid>
    </ProjectOnboardingContext.Provider>
  );
};

export default withAuth(ProjectOnboarding);
