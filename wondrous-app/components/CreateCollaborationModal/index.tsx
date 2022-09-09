import React, { useEffect, useMemo, useRef, useState } from 'react';

import { Modal as ModalComponent } from 'components/Modal';
import SelectOrgs from 'components/CreateCollaborationModal/Steps/SelectOrgs';
import AddTeamMembers from 'components/CreateCollaborationModal/Steps/AddTeamMembers';
import Confirmation from 'components/CreateCollaborationModal/Steps/Confirmation';
import { Org } from 'types/Org';
import { User } from 'types/User';
import { CREATE_COLLAB_REQUST } from 'graphql/mutations';
import { useMutation } from '@apollo/client';

type Props = {
  open: boolean;
  onCancel: () => void;
  defaultOrgId?: string;
};

type Users = {
  admins: Array<User>;
  members: Array<User>;
};
const CreateCollaborationModal = ({ open, onCancel, defaultOrgId }: Props) => {
  const [createCollabRequest, { data: collabRequest, error, loading }] = useMutation(CREATE_COLLAB_REQUST, {
    onCompleted: () => onCancel(),
    refetchQueries: ['getOrgCollabRequestForInitiator'],
  });

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

  const handleCollabCreate = (values) =>
    createCollabRequest({
      variables: {
        input: {
          initiatorOrgId: values.org1.id,
          recipientOrgId: values.org2.id,
          title: values.title,
          mission: values.mission,
        },
      },
    });

  const steps = [
    () => (
      <SelectOrgs footerRef={footerRef} defaultOrgId={defaultOrgId} onCancel={onCancel} onSubmit={handleCollabCreate} />
    ),
    // () => (
    // <AddTeamMembers
    //   org={data.org1}
    //   footerRef={footerRef}
    //   onCancel={onCancel}
    //   onSubmit={({ users }) => {
    //     setData({ ...data, users });
    //     setStep(3);
    //   }}
    // />
    // ),
    // (props) => (
    //   <Confirmation
    //     footerRef={footerRef}
    //     onCancel={onCancel}
    //     deleteMember={deleteMember}
    //     onSubmit={() => {
    //       throw new Error('Not implemented');
    //     }}
    //     {...props}
    //   />
    // ),
  ];

  return (
    <ModalComponent
      maxWidth={560}
      title="Create Project Collaboration"
      footerRight={<div ref={footerRef} />}
      open={open}
      onClose={onCancel}
    >
      <SelectOrgs footerRef={footerRef} defaultOrgId={defaultOrgId} onCancel={onCancel} onSubmit={handleCollabCreate} />
    </ModalComponent>
  );
};

export default CreateCollaborationModal;
