import { Grid } from '@mui/material';
import GradientHeading from 'components/GradientHeading';
import { useLazyQuery, useMutation } from '@apollo/client';
import { Formik } from 'formik';
import { CREATE_ORG, REDEEM_COLLAB_TOKEN } from 'graphql/mutations';
import { GET_ORG_DISCORD_NOTIFICATION_CONFIGS, GET_USER_ORGS, IS_ORG_USERNAME_TAKEN } from 'graphql/queries';
import { useRouter } from 'next/router';
import { useState } from 'react';
import * as Yup from 'yup';
import { Error } from 'components/OnboardingDao/styles';
import { FieldInput } from 'components/OnboardingDao/StepWrapper/styles';
import { HeaderButton } from 'components/organization/wrapper/styles';
import palette from 'theme/palette';
import useProjectOnboardingContext from '../Shared/context';
import { RightSideWrapper, InfoTypography } from '../Shared/styles';

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
const LeftPanel = () => {
  const { form, projectData, createOrg } = useProjectOnboardingContext();

  const { handleChange, handleBlur, touched, errors } = form;
  return (
    <Grid bgcolor={palette.grey920} flexGrow={1}>
      <Grid
        display="flex"
        position="absolute"
        sx={{
          left: '8%',
          top: '25%',
        }}
        direction="column"
        alignItems="left"
        height="fit-content"
        width="fit-content"
        gap="42px"
      >
        <GradientHeading fontSize="24">Create a project</GradientHeading>
        <Grid display="flex" direction="column" gap="14px" minWidth="30rem">
          {config.map((item, idx) => (
            <Grid maxWidth="30em" key={item.name}>
              <FieldInput
                placeholder={item.placeholder}
                name={item.name}
                onChange={handleChange}
                value={projectData[item.name]}
                onBlur={handleBlur}
              />
              {touched[item.name] && errors[item.name] ? <Error>{errors[item.name]}</Error> : null}
            </Grid>
          ))}
        </Grid>
        {projectData.username && projectData.name && !errors.username ? (
          <HeaderButton type="button" reversed onClick={createOrg}>
            Proceed to customization
          </HeaderButton>
        ) : null}
      </Grid>
    </Grid>
  );
};

const RightPanel = () => {
  const { projectData } = useProjectOnboardingContext();
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
    <Grid flexGrow={1} maxWidth="50%">
      <RightSideWrapper>
        <div
          style={{
            maxWidth: '40%',
          }}
        >
          <video width="100%" height="auto" autoPlay loop muted>
            <source src="/images/project-onboarding/spinning-hexagon.webm" type="video/webm" />
          </video>
        </div>
        <Grid position="absolute" left="10%" bottom="12%" display="flex" flexDirection="column" gap="14px">
          {/* username: blablabla */}
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

const ProjectCreateComponents = {
  LeftPanel,
  RightPanel,
};

export default ProjectCreateComponents;
