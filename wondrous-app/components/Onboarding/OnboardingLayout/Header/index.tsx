import React from 'react';
import Link from 'next/link';

import { Header, LogoText, Wonder } from './styles';
import WonderLogo from '../../../../public/images/onboarding/wonder-logo.svg';
import { Button } from 'components/Button';

type Props = {
  children?: any;
  login?: boolean;
  borderNone?: number | string;
};

const OnboardingHeader = ({ children, login, borderNone }: Props) => (
  <Header style={{ borderBottom: borderNone }}>
    <Wonder>
      <WonderLogo />
      <LogoText>wonder</LogoText>
    </Wonder>
    {login ? (
      <Link href={`/login`} passHref>
        <Button>Login</Button>
      </Link>
    ) : (
      children
    )}
  </Header>
);

export default OnboardingHeader;
