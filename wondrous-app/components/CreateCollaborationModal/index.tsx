import React, { useRef, useState } from 'react';

import { Modal as ModalComponent } from 'components/Modal';
import SelectOrgs from 'components/CreateCollaborationModal/Steps/SelectOrgs';
import AddTeamMembers from 'components/CreateCollaborationModal/Steps/AddTeamMembers';
import Confirmation from 'components/CreateCollaborationModal/Steps/Confirmation';
import { Org } from 'types/Org';

type Props = {
  open: boolean;
  onCancel: () => void;
};

const CreateCollaborationModal = ({ open, onCancel }: Props) => {
  const [state, setState] = useState<{
    step: number;
    org1?: Org;
    org2?: Org;
    users?: Array<any>; // FIXME
    title?: string;
    mission?: string;
  }>({
    step: 1,
  });

  console.log(state);
  const footerRef = useRef(null);
  const steps = [
    () => (
      <SelectOrgs
        footerRef={footerRef}
        onCancel={onCancel}
        onSubmit={(values) => {
          setState({ ...state, ...values, step: 2 });
        }}
      />
    ),
    () => (
      <AddTeamMembers
        org={state.org1}
        footerRef={footerRef}
        onCancel={onCancel}
        onSubmit={({ users }) => {
          setState({ ...state, users, step: 3 });
        }}
      />
    ),
    () => (
      <Confirmation
        footerRef={footerRef}
        onCancel={onCancel}
        onSubmit={() => {
          throw new Error('Not implemented');
        }}
      />
    ),
  ];

  const Component = steps[state.step - 1];

  return (
    <ModalComponent
      maxWidth={560}
      title="Create Project Collaboration"
      footerRight={<div ref={footerRef} />}
      open={open}
      onClose={onCancel}
    >
      <Component />;
    </ModalComponent>
  );
};

export default CreateCollaborationModal;
