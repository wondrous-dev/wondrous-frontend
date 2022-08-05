import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { Card, CardBody, CardFooter } from 'components/Common/auth';
import { Button } from 'components/Common/button';
import AuthLayout from 'components/Common/Layout/Auth';
import { Line } from 'components/Common/lines';
import { Form } from 'components/Common/form';
import { Field } from 'components/Common/field';
import { StyledLink } from 'components/Common/text';
import { SmallLogo, LoginWrapper, TopBubble, LoginError } from 'components/Pages/login';
import { CenteredFlexRow } from 'components/Common/index';
import { LockIcon } from 'components/Icons/userpass';

function ResetPassword() {
  const [password, setPassword] = useState('');
  const [repassword, setRePassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    // TODO: Reset Password plumbing with backend
    router.push('/login', undefined, {
      shallow: true,
    });
  };

  return (
    <AuthLayout>
      <LoginWrapper>
        <TopBubble src="/images/login/top-floater-bubble.png" alt="" />
        <Card>
          <CardBody>
            <SmallLogo />
            <h1>Update password</h1>
            <Form onSubmit={handleSubmit}>
              {errorMessage ? <LoginError>{errorMessage}</LoginError> : ''}
              <Field
                type="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                icon={LockIcon}
                required
              />
              <Field
                type="password"
                name="repassword"
                value={repassword}
                onChange={(e) => setRePassword(e.target.value)}
                placeholder="Re-enter password"
                icon={LockIcon}
                required
              />
              <Button highlighted type="submit" marginTop="25px">
                Change password
              </Button>
            </Form>
          </CardBody>
          <CardFooter>
            <Line size="80%" />
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

export default ResetPassword;
