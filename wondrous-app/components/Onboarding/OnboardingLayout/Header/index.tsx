import React from 'react';

import { Header, LogoText, Wonder } from './styles';
import WonderLogo from '../../../../public/images/onboarding/wonder-logo.svg';
import { StyledLink } from "components/Common/text";

type Props = {
  children?: any;
  login?: boolean;
  borderNone?: number | string;
};

const OnboardingHeader = ({ children, login, borderNone }: Props) => (
  <Header style={{borderBottom: borderNone}}>
    <Wonder>
      <WonderLogo />
      <LogoText>wonder</LogoText>
    </Wonder>
    {login ? <StyledLink href="/login" style={{fontWeight: 500, marginBottom: '20px'}}>Login</StyledLink> : children}
  </Header>
);

export default OnboardingHeader;
