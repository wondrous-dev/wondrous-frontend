import React, { useRef, useState } from 'react';

import { Modal as ModalComponent } from 'components/Modal';
import SelectOrgs from 'components/CreateCollaborationModal/Steps/SelectOrgs';
import SentRequestSuccess from 'components/CreateCollaborationModal/Steps/SentRequestSuccess';
import { Org } from 'types/Org';
import { User } from 'types/User';
import { CREATE_COLLAB_REQUST } from 'graphql/mutations';
import { useMutation } from '@apollo/client';
import StarsBackground from 'components/StarsBackground';
import { useSteps } from 'utils/hooks';

type Props = {
  open: boolean;
  onCancel: () => void;
  defaultOrgId?: string;
};

const CreateCollaborationModal = ({ open, onCancel, defaultOrgId }: Props) => {
  const { step, setStep } = useSteps(0);
  const [orgs, setOrgs] = useState({ org1: null, org2: null });
  const [createCollabRequest, { data: collabRequestData }] = useMutation(CREATE_COLLAB_REQUST, {
    onCompleted: () => {
      setStep((prevState) => prevState + 1);
    },
    refetchQueries: ['getOrgCollabRequestForInitiator'],
  });

  const onClose = () => {
    setStep(0);
    onCancel();
  };

  const footerRef = useRef(null);

  const handleCollabCreate = (values) => {
    setOrgs({ org1: values.org1, org2: values.org2 });
    createCollabRequest({
      variables: {
        input: {
          initiatorOrgId: values.org1.id,
          title: values.title,
          mission: values.mission,
          ...(values.org2.id ? { recipientOrgId: values.org2.id } : {}),
        },
      },
    });
  };
  const steps = [
    () => (
      <SelectOrgs footerRef={footerRef} defaultOrgId={defaultOrgId} onCancel={onClose} onSubmit={handleCollabCreate} />
    ),
    () => (
      <SentRequestSuccess
        orgs={orgs}
        token={collabRequestData?.requestOrgCollab?.token}
        footerRef={footerRef}
        onClose={onClose}
      />
    ),
  ];

  const Component = steps[step];

  const isCenterStep = step === steps.length - 1;

  return (
    <StarsBackground enableStarsBg={open && step === steps.length - 1}>
      <ModalComponent
        maxWidth={560}
        alignCenter={isCenterStep}
        title="Create Project Collaboration"
        footerRight={<div ref={footerRef} />}
        open={open}
        onClose={onCancel}
      >
        <Component />
      </ModalComponent>
    </StarsBackground>
  );
};

export default CreateCollaborationModal;
