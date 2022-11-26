import { useEffect, useMemo, useState } from 'react';
import Modal from 'components/Modal';
import { useTaskContext, useSteps } from 'utils/hooks';
import { StartMint, MintInProgress, SuccessMint } from 'components/Common/TaskMint/Steps';
import { Actions } from 'components/CreateCollaborationModal/ViewCollab';
import { MODAL_TYPE } from 'components/CreateCollaborationModal/ViewCollab/CollabDetails';
import { TaskMintStatus } from 'utils/constants';
import OpenseaButton from '../OpenseaButton';
import { useCreateMint } from '../Steps/useCreateMint';

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

  const { startTaskMintProcess, data, step: inProgressMintStep } = useCreateMint();

  useEffect(() => {
    if (data?.getTaskMintTokenData) {
      handleTokenData(data.getTaskMintTokenData);
    }
  }, [data?.getTaskMintTokenData]);

  const handleClose = () => {
    onClose();
    setTokenData(null);
    setStep(0);
    if (step > 0) {
      refetch();
    }
  };

  const handleFirstStepSubmit = () => {
    startTaskMintProcess();
    nextStep();
  };

  const STEPS = [StartMint, MintInProgress, SuccessMint];

  const FOOTER_ACTIONS = [
    {
      left: null,
      right: (
        <Actions
          declineLabel="Not yet"
          acceptLabel="Mint task"
          type={MODAL_TYPE.ACTION}
          onClose={handleClose}
          onSubmit={handleFirstStepSubmit}
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
      <Component step={inProgressMintStep} tokenData={tokenData} />
    </Modal>
  );
};

export default ModalsComponent;
