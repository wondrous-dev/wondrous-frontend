import { Grid } from '@mui/material';
import GradientHeading from 'components/GradientHeading';
import { FieldInput } from 'components/OnboardingDao/StepWrapper/styles';
import { Error } from 'components/OnboardingDao/styles';
import { HeaderButton } from 'components/organization/wrapper/styles';
import { useFormik } from 'formik';
import palette from 'theme/palette';
import * as Yup from 'yup';

import { useLazyQuery } from '@apollo/client';
import { IS_ORG_USERNAME_TAKEN } from 'graphql/queries';
import { useState } from 'react';
import { useOrgBoard } from 'utils/hooks';
import { Container } from '../Shared';
import { InfoTypography, RightSideWrapper } from '../Shared/styles';

const config = [
  {
    placeholder: 'Enter project title',
    name: 'name',
  },
  {
    placeholder: 'Enter project username',
    name: 'username',
  },
];

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
  });
  return schema;
};

const RightPanel = ({ projectData }) => {
  const orgInfo = [
    {
      label: 'Username:',
      value: projectData.username ? `@${projectData?.username}` : '',
    },
    {
      label: 'Profile title:',
      value: projectData?.name,
    },
  ];

  return (
    <Grid
      width={{
        xs: '100%',
        sm: '50%',
      }}
    >
      <RightSideWrapper>
        <Grid
          display="flex"
          maxHeight={{
            xs: '100%',
            sm: '60%',
          }}
        >
          <video width="100%" height="auto" autoPlay loop muted>
            <source src="/images/project-onboarding/spinning-hexagon.webm" type="video/webm" />
          </video>
        </Grid>
        <Grid
          position={{
            xs: 'relative',
            sm: 'absolute',
          }}
          left="10%"
          bottom="12%"
          display="flex"
          flexDirection="column"
          gap="14px"
        >
          {orgInfo.map((item, idx) =>
            !item.value ? null : (
              <Grid
                display="flex"
                gap="14px"
                key={item.label}
                sx={{
                  color: 'white',
                }}
              >
                <InfoTypography>{item.label}</InfoTypography>
                <InfoTypography>{item.value}</InfoTypography>
              </Grid>
            )
          )}
        </Grid>
      </RightSideWrapper>
    </Grid>
  );
};

const ProjectCreate = () => {
  const form = useFormik({
    initialValues: {
      name: '',
      username: '',
    },
    validationSchema: useSchema(),
    onSubmit: (values) => {},
  });

  const { createOrg } = useOrgBoard();

  const { handleChange, handleBlur, touched, errors } = form;
  return (
    <Container
      sx={{
        flexDirection: {
          xs: 'column-reverse',
          md: 'row',
        },
      }}
    >
      <Grid
        bgcolor={palette.grey920}
        flexGrow={1}
        display="flex"
        justifyContent={{
          xs: 'center',
          sm: '',
        }}
        alignItems={{
          xs: 'center',
          sm: '',
        }}
      >
        <Grid
          display="flex"
          position={{
            xs: 'relative',
            sm: 'absolute',
          }}
          top={{
            sm: '25%',
          }}
          justifyContent={{
            xs: 'center',
            sm: 'flex-start',
          }}
          max-width="100%"
          padding={{
            xs: '0 24px',
            sm: 'none',
          }}
          direction="column"
          alignItems="left"
          height="fit-content"
          width={{
            xs: '100%',
            sm: 'fit-content',
          }}
          minWidth={{
            xs: '100%',
            sm: '40%',
          }}
          maxWidth={{
            xs: '100%',
            sm: '70%',
          }}
          gap="42px"
        >
          <GradientHeading fontSize="24">Create a project</GradientHeading>
          <Grid display="flex" direction="column" gap="14px">
            {config.map((item, idx) => (
              <Grid maxWidth="30em" key={item.name}>
                <FieldInput
                  placeholder={item.placeholder}
                  name={item.name}
                  onChange={handleChange}
                  value={form.values[item.name]}
                  onBlur={handleBlur}
                />
                {touched[item.name] && errors[item.name] ? <Error>{errors[item.name]}</Error> : null}
              </Grid>
            ))}
          </Grid>
          {form.values.username && form.values.name && !errors.username ? (
            <HeaderButton type="button" reversed onClick={() => createOrg(form.values)}>
              Proceed to customization
            </HeaderButton>
          ) : null}
        </Grid>
      </Grid>
      <RightPanel projectData={form.values} />
    </Container>
  );
};

export default ProjectCreate;
