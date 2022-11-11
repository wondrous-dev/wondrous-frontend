import { useState } from 'react';
import Modal from 'components/Modal';
import { useTaskContext, useSteps } from 'utils/hooks';
import { StartMint, MintInProgress, SuccessMint } from 'components/Common/TaskMint/Steps';
import { Actions } from 'components/CreateCollaborationModal/ViewCollab';
import { MODAL_TYPE } from 'components/CreateCollaborationModal/ViewCollab/CollabDetails';
import OpenseaButton from '../OpenseaButton';

const ModalsComponent = ({ isOpen, onClose }) => {
  const [tokenData, setTokenData] = useState(null);
  const { nextStep, step, setStep } = useSteps();
  const { refetch } = useTaskContext();
  const STEPS_TITLE_MAP = ['Mint task', 'In-progress...', 'Minting task'];

  const title = STEPS_TITLE_MAP[step];

  const handleTokenData = (tokenData) => {
    nextStep();
    setTokenData(tokenData);
  };

  const handleClose = () => {
    onClose();
    setTokenData(null);
    setStep(0);
    if (step > 0) {
      refetch();
    }
  };

  const STEPS = [
    () => <StartMint />,
    () => <MintInProgress setTokenData={handleTokenData} />,
    () => <SuccessMint tokenData={tokenData} />,
  ];

  const FOOTER_ACTIONS = [
    {
      left: null,
      right: (
        <Actions
          declineLabel="Not yet"
          acceptLabel="Mint task"
          type={MODAL_TYPE.ACTION}
          onClose={handleClose}
          onSubmit={nextStep}
        />
      ),
    },
    null,
    {
      left: null,
      right: <OpenseaButton tokenId={tokenData?.tokenId} />,
      footerCenter: true,
    },
  ];

  const Component = STEPS[step];

  return (
    <Modal
      maxWidth={560}
      title={title}
      footerRight={FOOTER_ACTIONS[step]?.right || null}
      footerLeft={FOOTER_ACTIONS[step]?.left || null}
      footerCenter={FOOTER_ACTIONS[step]?.footerCenter || false}
      open={isOpen}
      onClose={handleClose}
    >
      <Component />
    </Modal>
  );
};

export default ModalsComponent;
