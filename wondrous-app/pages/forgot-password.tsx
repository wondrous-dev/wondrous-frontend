import React, { useState } from 'react';
import Image from 'next/image';

import { useRouter } from 'next/router';
import { REQUEST_PASSWORD_RESET } from 'graphql/mutations/user';
import apollo from 'services/apollo';
import { Card, CardBody, CardFooter } from 'components/Common/auth';
import { Button } from 'components/Common/button';
import AuthLayout from 'components/Common/Layout/Auth';
import { Line } from 'components/Common/lines';
import { Form } from 'components/Common/form';
import { Field } from 'components/Common/field';
import { StyledLink } from 'components/Common/text';
import { SmallLogo, LoginWrapper, TopBubble, LoginError } from 'components/Pages/login';
import { CenteredFlexRow } from 'components/Common/index';
import { EmailIcon } from 'components/Icons/userpass';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage(null);
    await apollo
      .mutate({
        mutation: REQUEST_PASSWORD_RESET,
        variables: {
          email,
        },
      })
      .then(() => {
        router.push(`/forgot-password-sent?email=${email}`);
      })
      .catch((e) => {
        console.error(e);
        setErrorMessage('Error sending reset email, please try again');
      });
  };

  return (
    <AuthLayout>
      <LoginWrapper>
        <Image
          alt="background"
          className="auth-background"
          src="/images/login/background.png"
          layout="fill"
          objectFit="cover"
          quality={80}
        />
        <Image alt="background" src="/images/login/background-blur.png" layout="fill" objectFit="cover" quality={80} />
        <TopBubble src="/images/login/top-floater-bubble.png" alt="" />
        <Card>
          <CardBody>
            <SmallLogo />
            <h1>Forgot password</h1>
            <Form onSubmit={handleSubmit}>
              {errorMessage ? <LoginError>{errorMessage}</LoginError> : ''}
              <Field
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                icon={EmailIcon}
                required
              />
              <Button highlighted type="submit" marginTop="25px">
                Reset password
              </Button>
            </Form>
          </CardBody>
          <CardFooter>
            <Line size="80%" />
            <CenteredFlexRow marginTop="16px">
              Don&apos;t have an account yet?&nbsp;
              <StyledLink href="/signup">Sign up for the beta.</StyledLink>
            </CenteredFlexRow>
            <CenteredFlexRow>
              Go back to &nbsp;
              <StyledLink href="/login">Login</StyledLink>?
            </CenteredFlexRow>
          </CardFooter>
        </Card>
      </LoginWrapper>
    </AuthLayout>
  );
}

export default ForgotPassword;
