import React, { useState } from 'react';
import { useRouter } from 'next/router';

import { PaddedParagraph, StyledLink } from 'components/Common/text';
import OnboardingHeader from 'components/Onboarding/OnboardingLayout/Header';
import { Layout, OnboardingTitle } from 'components/Onboarding/OnboardingLayout/styles';
import { Form } from 'components/Common/form';
import { LoginError } from 'components/Pages/login';
import { Field } from 'components/Common/field';
import { EmailIcon, LockIcon } from 'components/Icons/userpass';
import { LineWithText } from 'components/Common/lines';
import palette from 'theme/palette';
import { ContinueButton } from 'components/Onboarding/OnboardingLayout/Footer/styles';
import { emailSignup } from 'components/Auth/withAuth';

function Signup() {
  // looks like this is not used?
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const result = await emailSignup(email, password);
    if (result?.success === true) {
      // Check for token
      router.push('/mission-control', undefined, {
        shallow: true,
      });
    } else {
      setErrorMessage(result);
    }
  };

  return (
    <Layout
      style={{
        minHeight: 'unset',
      }}
    >
      <OnboardingHeader secondVersionLogo />
      <OnboardingTitle
        style={{
          textAlign: 'center',
        }}
      >
        Sign-up with email
      </OnboardingTitle>

      <div style={{ width: '100%' }}>
        {errorMessage ? <LoginError>{errorMessage}</LoginError> : ''}
        <Form onSubmit={handleSubmit} style={{ marginBottom: '37px' }}>
          <Field
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email address"
            icon={EmailIcon}
            required
          />
          <Field
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            icon={LockIcon}
            required
          />
          <ContinueButton
            type="submit"
            style={{
              marginTop: '37px',
              minHeight: '50px',
              width: '100%',
            }}
          >
            Sign up
          </ContinueButton>
        </Form>
        <LineWithText>
          <PaddedParagraph padding="0 10px" color={palette.white} style={{ fontWeight: 500 }}>
            or
          </PaddedParagraph>
        </LineWithText>
        <StyledLink
          href="/"
          style={{
            display: 'block',
            textAlign: 'center',
            fontWeight: 500,
            marginTop: '18px',
            textDecoration: 'none',
          }}
        >
          Back to options
        </StyledLink>
      </div>
    </Layout>
  );
}

export default Signup;
