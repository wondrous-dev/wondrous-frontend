import { useRef } from 'react';
import { useSteps } from 'utils/hooks';
import Modal from 'components/Modal';
import { StartMint } from 'components/Common/MintTask/Steps';

const ModalsComponent = ({ isOpen, onClose }) => {
  const { step, nextStep, prevStep } = useSteps();
  const footerRef = useRef();
  const footerLeftRef = useRef();

  console.log(footerRef, footerLeftRef);
  const STEPS_TITLE_MAP = ['Mint task', 'In-progress...', 'Minting task'];

  const title = STEPS_TITLE_MAP[step];

  const STEPS = [() => <StartMint nextStep={nextStep} onCancel={onClose} footerRef={footerRef} />];

  const Component = STEPS[step];
  return (
    <Modal
      maxWidth={560}
      title={title}
      footerRight={<div ref={footerRef} />}
      footerLeft={<div ref={footerLeftRef} />}
      open={isOpen}
      onClose={onClose}
    >
      <Component />
    </Modal>
  );
};

export default ModalsComponent;
