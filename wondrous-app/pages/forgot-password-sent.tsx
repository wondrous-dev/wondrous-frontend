import React from 'react';
import Image from 'next/image';

import { useRouter } from 'next/router';
import { Card, CardBody, CardFooter } from 'components/Common/auth';
import AuthLayout from 'components/Common/Layout/Auth';
import { Line } from 'components/Common/lines';
import { StyledLink } from 'components/Common/text';
import { SmallLogo, LoginWrapper, TopBubble } from 'components/Pages/login';
import { CenteredFlexRow } from 'components/Common/index';
import palette from 'theme/palette';

function ForgotPasswordSent() {
  const router = useRouter();
  const { email } = router.query;

  return (
    <AuthLayout>
      <LoginWrapper>
        <Image
          alt="background"
          className="auth-background"
          src="/images/login/background.png"
          fill
          style={{
            objectFit: 'cover',
          }}
          quality={80}
        />
        <Image
          alt="background"
          src="/images/login/background-blur.png"
          fill
          style={{
            objectFit: 'cover',
          }}
          quality={80}
        />
        <TopBubble src="/images/login/top-floater-bubble.png" alt="" />
        <Card>
          <CardBody>
            <SmallLogo />
            <h1>Password Reset Sent</h1>
            <p>
              Check your email <span style={{ color: palette.highlightBlue }}>{email} </span>for a link to reset your
              password. If it doesn’t appear within a few minutes, check your spam folder.
            </p>
            <p>Your account might also be associated with another email</p>
          </CardBody>
          <CardFooter>
            <Line size="80%" />
            <CenteredFlexRow>
              Go back to &nbsp;
              <StyledLink href="/login">Login</StyledLink>
            </CenteredFlexRow>
          </CardFooter>
        </Card>
      </LoginWrapper>
    </AuthLayout>
  );
}

export default ForgotPasswordSent;
