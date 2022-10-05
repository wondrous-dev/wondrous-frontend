import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { RESET_PASSWORD } from 'graphql/mutations/user';
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
import { LockIcon } from 'components/Icons/userpass';
import { checkPasswordStrength } from 'components/Onboarding/Signup';

function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);
  const router = useRouter();
  const { token, userId } = router.query;
  if (resetSuccess) {
    return (
      <AuthLayout>
        <LoginWrapper>
          <TopBubble src="/images/login/top-floater-bubble.png" alt="" />
          <Card>
            <CardBody>
              <SmallLogo />
              <h1>Successfull reset password</h1>
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
  if (!token || !userId) {
    // TODO perhaps we should let user enter in token if the link is not working
    return (
      <AuthLayout>
        <LoginWrapper>
          <TopBubble src="/images/login/top-floater-bubble.png" alt="" />
          <Card>
            <CardBody>
              <SmallLogo />
              <h1>No token found</h1>
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
  const handleSubmit = async (event) => {
    event.preventDefault();
    setErrorMessage(null);
    setResetSuccess(false);
    if (!checkPasswordStrength(password)) {
      setErrorMessage('Password is too weak! Please enter more than 8 characters');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage('Confirmation password does not match!');
      return;
    }
    await apollo
      .mutate({
        mutation: RESET_PASSWORD,
        variables: {
          input: {
            userId,
            token,
            newPassword: password,
          },
        },
      })
      .then(async () => {
        // TODO we could potentially just log the user in right away
        setResetSuccess(true);
        router.push(`/login`); // FIXME ideally we wait a few seconds before this but not necessary
      })
      .catch((e) => {
        console.error(e);
        setErrorMessage('Password reset error! please try again');
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
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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
