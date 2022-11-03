import React, { useEffect, useState } from 'react';
import Image from 'next/legacy/image';
import Modal from '@mui/material/Modal';

import { Layout, OnboardingDescription, OnboardingTitle } from 'components/Onboarding/OnboardingLayout/styles';
import { UsernameDescription, UsernameTitle } from 'components/Onboarding/styles';
import { useIsMobile } from 'utils/hooks';
import CloseModalIcon from 'components/Icons/closeModal';
import { CloseButton, ModalBackdrop, ModalContent } from './styles';

function MobileComingSoonModal() {
  const isMobile = useIsMobile();
  const [isOpen, setIsOpen] = useState(isMobile);

  useEffect(() => {
    if (isMobile) {
      setIsOpen(isMobile);
    }
  }, [isMobile]);

  return (
    <Modal open={isOpen} onClose={() => setIsOpen(false)} BackdropComponent={ModalBackdrop}>
      <ModalContent>
        <CloseButton onClick={() => setIsOpen(false)}>
          <CloseModalIcon />
        </CloseButton>
        <div>
          <OnboardingTitle
            style={{
              textAlign: 'center',
            }}
          >
            When mobile?!
          </OnboardingTitle>
          <OnboardingDescription
            style={{
              textAlign: 'center',
              fontWeight: 500,
              marginBottom: '22px',
            }}
          >
            Wonder is best on your desktop.
          </OnboardingDescription>
        </div>
        <Image
          alt="Mobile is coming (very) soon."
          src="/images/onboarding/mobile-version-cming-soon.png"
          width={327}
          height={209}
        />
        <div>
          <UsernameTitle
            style={{
              textAlign: 'center',
              fontSize: '15px',
              marginTop: '24px',
            }}
          >
            Mobile is coming (very) Soon™.
          </UsernameTitle>
          <UsernameDescription
            style={{
              textAlign: 'center',
              fontSize: '15px',
              color: '#ffffff',
              fontWeight: 500,
              marginBottom: 0,
            }}
          >
            Please check us out on desktop
          </UsernameDescription>
        </div>
      </ModalContent>
    </Modal>
  );
}

export default MobileComingSoonModal;
