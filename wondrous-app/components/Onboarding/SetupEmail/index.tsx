import React, { useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import { useRouter } from 'next/router';

import { validateEmail } from 'utils/constants';
import { SET_USER_SIGNUP_COMPLETE, UPDATE_USER } from 'graphql/mutations';
import OnboardingLayout from 'components/Onboarding/OnboardingLayout';
import { useMe } from 'components/Auth/withAuth';
import { UsernameTitle, UsernameInput, ErrorText } from '../styles';

export function SetupEmail({ firstOrg, firstPod }) {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(null);
  const user = useMe();
  const router = useRouter();
  const { collabInvite } = router.query;
  const [setUserSignupComplete] = useMutation(SET_USER_SIGNUP_COMPLETE);
  const collabInviteQueryString = collabInvite ? `?collabInvite=${collabInvite}` : '';

  useEffect(() => {
    setUserSignupComplete();
  }, []);

  const goToNextStep = () => {
    const nextStep = user.activeEthAddress
      ? `/onboarding/discord${collabInviteQueryString}`
      : `/onboarding/twitter${collabInviteQueryString}`;
    router.push(nextStep, undefined, { shallow: true });
  };

  const [updateUser] = useMutation(UPDATE_USER, {
    onCompleted: () => goToNextStep(),
  });

  const handleContinueClick = () => {
    setLoading(true);
    if (validateEmail(email)) {
      updateUser({
        variables: {
          input: {
            email,
          },
        },
      });
    } else {
      setLoading(false);
      setError('Please enter a valid email');
    }
  };

  return (
    <OnboardingLayout
      title="Set up your email"
      description="Set up your accounts so you can begin contributing."
      onBackClick={() => router.back()}
      onContinueClick={handleContinueClick}
      onLaterClick={goToNextStep}
      loading={loading}
      step={4}
    >
      <div>
        <UsernameTitle
          style={{
            marginBottom: '14px',
          }}
        >
          Enter your email
        </UsernameTitle>
        <UsernameInput
          type="email"
          name="email"
          value={email}
          error={error}
          onChange={(e) => {
            setEmail(e.target.value);
            setError(null);
          }}
          placeholder="Enter your best email"
          required
        />
      </div>
      <div>{error && <ErrorText>{error}</ErrorText>}</div>
    </OnboardingLayout>
  );
}
