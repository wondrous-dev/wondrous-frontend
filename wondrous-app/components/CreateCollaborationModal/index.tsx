import React, { useEffect, useMemo, useRef, useState } from 'react';

import { Modal as ModalComponent } from 'components/Modal';
import SelectOrgs from 'components/CreateCollaborationModal/Steps/SelectOrgs';
import AddTeamMembers from 'components/CreateCollaborationModal/Steps/AddTeamMembers';
import Confirmation from 'components/CreateCollaborationModal/Steps/Confirmation';
import { Org } from 'types/Org';
import { User } from 'types/User';

type Props = {
  open: boolean;
  onCancel: () => void;
};

type Users = {
  admins: Array<User>;
  members: Array<User>;
};
const CreateCollaborationModal = ({ open, onCancel }: Props) => {
  const [step, setStep] = useState(1);
  const [data, setData] = useState<{
    org1?: Org;
    org2?: Org;
    users?: Users;
    title?: string;
    mission?: string;
  }>({});

  const footerRef = useRef(null);

  const deleteMember = (userId) => {
    setData((prevState) => ({
      ...prevState,
      users: { members: prevState.users.members.filter((user) => user.id !== userId), admins: prevState.users.admins },
    }));
  };
  const steps = [
    () => (
      <SelectOrgs
        footerRef={footerRef}
        onCancel={onCancel}
        onSubmit={(values) => {
          setData({ ...data, ...values });
          setStep(2);
        }}
      />
    ),
    () => (
      <AddTeamMembers
        org={data.org1}
        footerRef={footerRef}
        onCancel={onCancel}
        onSubmit={({ users }) => {
          setData({ ...data, users });
          setStep(3);
        }}
      />
    ),
    (props) => (
      <Confirmation
        footerRef={footerRef}
        onCancel={onCancel}
        deleteMember={deleteMember}
        onSubmit={() => {
          throw new Error('Not implemented');
        }}
        {...props}
      />
    ),
  ];

  const Component = useMemo(() => steps[step - 1], [step]);

  return (
    <ModalComponent
      maxWidth={560}
      title="Create Project Collaboration"
      footerRight={<div ref={footerRef} />}
      open={open}
      onClose={onCancel}
    >
      <Component collabDetails={data} />
    </ModalComponent>
  );
};

export default CreateCollaborationModal;
