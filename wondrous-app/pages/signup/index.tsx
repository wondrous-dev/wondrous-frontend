import React from 'react';
import Image from 'next/legacy/image';
import styled from 'styled-components';

import { Invite } from 'components/Onboarding/Invite';
import { InviteWelcomeBoxParagraph, MainWrapper } from 'components/Onboarding/styles';
import { useRouter } from 'next/router';

export const Builders = styled.div`
  padding-top: 24px;
  margin-top: 24px;
  border-top: 1px dashed #2b2b2b;
`;

function OrganicSignUpPage() {
  const router = useRouter();

  return (
    <MainWrapper>
      <Invite
        title="Welcome to the Wonderverse"
        onAuthenticated={() => {
          router.push('/onboarding/welcome', undefined, {
            shallow: true,
          });
        }}
      >
        <Builders>
          <Image alt="Background" src="/images/onboarding/avatars.png" quality={100} width={289} height={45} />
          <InviteWelcomeBoxParagraph style={{ marginTop: '18px' }}>
            Join the movement of builders.
          </InviteWelcomeBoxParagraph>
        </Builders>
      </Invite>
    </MainWrapper>
  );
}

export default OrganicSignUpPage;
