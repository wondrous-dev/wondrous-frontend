import { useState, useEffect } from 'react';
import { Modal as ModalComponent } from 'components/Modal';
import CollabDetails, { MODAL_TYPE } from 'components/CreateCollaborationModal/ViewCollab/CollabDetails';
import Grid from '@mui/material/Grid';
import { Button } from 'components/Button';
import { useMutation } from '@apollo/client';
import { DECLINE_ORG_COLLAB_REQUEST, APPROVE_ORG_COLLAB_REQUEST } from 'graphql/mutations';
import CollabCreateSuccess from 'components/CreateCollaborationModal/Steps/CollabCreateSuccess';
import { useRouter } from 'next/router';
import { useSteps } from 'utils/hooks';
import { ViewButton } from './styles';

export const Actions = ({ type, onClose, onSubmit, declineLabel, acceptLabel }) => (
  <Grid container gap="18px">
    <Button color="grey" onClick={onClose}>
      {declineLabel}
    </Button>
    {type === MODAL_TYPE.ACTION && (
      <Button color="primary" type="submit" onClick={onSubmit}>
        {acceptLabel}
      </Button>
    )}
  </Grid>
);

const ViewCollabModal = ({ orgCollabRequest, type }) => {
  const router = useRouter();
  const { step, setStep } = useSteps();
  const [isOpen, setIsOpen] = useState(false);

  const [declineOrgCollabRequest] = useMutation(DECLINE_ORG_COLLAB_REQUEST, {
    refetchQueries: ['getOrgCollabRequestForRecipient', 'getOrgInviteCollabCount'],
  });

  const isActionTypeModal = type === MODAL_TYPE.ACTION;

  const [approveOrgCollabRequest, { data }] = useMutation(APPROVE_ORG_COLLAB_REQUEST, {
    refetchQueries: ['getUserPermissionContext', 'getOrgActiveCollabCount'],
  });

  useEffect(() => {
    if (step && !isOpen) setStep(0);
  }, [isOpen]);

  const handleDecline = () =>
    declineOrgCollabRequest({ variables: { orgCollabRequestId: orgCollabRequest.id } }).then(() => handleModal());

  const handleApprove = () =>
    approveOrgCollabRequest({ variables: { orgCollabRequestId: orgCollabRequest.id } }).then(() => {
      setStep((prevState) => prevState + 1);
    });

  const handleModal = () => setIsOpen((prevState) => !prevState);

  const STEPS_TO_ACTIONS_MAP = [
    {
      approve: () => handleApprove(),
      close: () => (isActionTypeModal ? handleDecline() : handleModal()),
      title: 'Project collaboration request',
      declineLabel: isActionTypeModal ? 'Decline' : 'Close',
      acceptLabel: 'Accept',
    },
    {
      approve: () => router.push(`/collaboration/${data?.approveOrgCollabRequest?.username}/boards?addMembers=${true}`),
      close: () => handleModal(),
      title: 'Success!',
      declineLabel: 'Close',
      acceptLabel: 'Add contributors',
    },
  ];
  const STEPS_MAP = [
    () => <CollabDetails type={type} request={orgCollabRequest} />,
    () => <CollabCreateSuccess request={orgCollabRequest} />,
  ];

  const Component = STEPS_MAP[step];

  const stepConfig = STEPS_TO_ACTIONS_MAP[step];

  return (
    <>
      <ModalComponent
        maxWidth={560}
        title={stepConfig.title}
        footerRight={
          <Actions
            declineLabel={stepConfig.declineLabel}
            acceptLabel={stepConfig.acceptLabel}
            type={type}
            onClose={stepConfig.close}
            onSubmit={stepConfig.approve}
          />
        }
        open={isOpen}
        onClose={handleModal}
      >
        <Component />
      </ModalComponent>

      <ViewButton onClick={handleModal}>View Invitation</ViewButton>
    </>
  );
};

export default ViewCollabModal;
