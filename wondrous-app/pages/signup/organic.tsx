import React from 'react';
import Image from 'next/image';
import styled from 'styled-components';

import { Invite } from 'components/Onboarding/Invite';
import { InviteWelcomeBoxParagraph, MainWrapper } from 'components/Onboarding/styles';

export const Builders = styled.div`
  padding-top: 24px;
  margin-top: 24px;
  border-top: 1px dashed #2B2B2B;
`;

const OrganicSignUpPage = () => {
  return (
    <MainWrapper>
      <Invite title="Welcome to the Wonderverse">
        <Builders>
          <Image alt="Background" src="/images/onboarding/avatars.png" quality={100} width={289} height={45} />
          <InviteWelcomeBoxParagraph style={{ marginTop: '18px' }}>Join the movement of builders.</InviteWelcomeBoxParagraph>
        </Builders>
      </Invite>
    </MainWrapper>
  );
};

export default OrganicSignUpPage;
