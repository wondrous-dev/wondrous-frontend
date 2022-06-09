import React from 'react';

import { Header, LogoText, Wonder } from './styles';
import WonderLogo from '../../../../public/images/onboarding/wonder-logo.svg';

const OnboardingHeader = ({ children }) => (
  <Header>
    <Wonder>
      <WonderLogo />
      <LogoText>wonder</LogoText>
    </Wonder>
    {children}
  </Header>
);

export default OnboardingHeader;
