import React from 'react';

import { LogoDiv, LogoText } from 'components/Onboarding/styles';
import WonderLogo from '../../public/images/onboarding/wonder-logo.svg';

export function Logo({ divStyle }) {
  return (
    <LogoDiv style={divStyle}>
      <WonderLogo />
      <LogoText>wonder</LogoText>
    </LogoDiv>
  );
}
