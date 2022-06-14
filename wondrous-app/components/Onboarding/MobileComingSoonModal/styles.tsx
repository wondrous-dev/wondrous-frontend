import styled from 'styled-components';

export const ModalContent = styled.div`
  align-items: center;
  background: linear-gradient(180deg, #1e1e1e 0%, #141414 100%);
  border-radius: 6px;
  border: 1px solid #484848;
  display: flex;
  flex-direction: column;
  justify-content: center;
  left: 50%;
  max-width: 320px;
  padding: 32px 24px;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 100%;

  @media (min-width: 400px) {
    max-width: 374px;
  }
`;

export const CloseButton = styled.button`
  cursor: pointer;
  height: 34px;
  width: 34px;
  border-radius: 50%;
  background: #141414;
  padding: 0;
  position: absolute;
  border: none;
  right: 10px;
  top: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ModalBackdrop = styled.div`
  position: fixed;
  right: 0;
  bottom: 0;
  top: 0;
  left: 0;
  background: url('/images/onboarding/background-invite-mobile.png') no-repeat center center;
  background-size: cover;
  opacity: 0.93;
`;
