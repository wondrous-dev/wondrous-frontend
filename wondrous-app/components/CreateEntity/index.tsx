import { FormikValues } from 'formik';
import { useState } from 'react';
import { ENTITIES_TYPES } from 'utils/constants';
import ChooseEntityToCreateModal from './chooseEntityToCreateModal';
import CreatePodModal from './CreatePodModal';
import { CreateEntityModal } from './CreateEntityModal/index';
import EditLayoutBaseModal from './editEntityModal';
import { CreateFormModalOverlay } from './styles';
import { OrgBoardContext, PodBoardContext } from 'utils/contexts';
import { useRouter } from 'next/router';
import { GET_USER_PERMISSION_CONTEXT } from 'graphql/queries';
import { useQuery } from '@apollo/client';
import { useGetOrgFromUsername } from 'pages/organization/[username]/analytics';
import { useGetPodById } from 'pages/pod/[podId]/analytics';

interface ICreateEntity {
  entityType: string;
  handleClose: Function;
  cancel: Function;
  existingTask?: {
    id: string;
    githubIssue: {
      id: string;
      url: string;
    };
    claimPolicyRoles: [string] | null;
    shouldUnclaimOnDueDateExpiry: boolean | null;
    claimPolicy: string | null;
    githubPullRequest: {
      id: string;
      url: string;
      title: string;
    };
  };
  open: Boolean;
  handleCloseModal: Function;
  isTaskProposal?: boolean;
  formValues?: FormikValues;
  parentTaskId?: string;
}

export const CreateEntity = (props: ICreateEntity) => {
  const { open, entityType, handleCloseModal, isTaskProposal } = props;
  const forNewModal = [ENTITIES_TYPES.TASK, ENTITIES_TYPES.MILESTONE, ENTITIES_TYPES.BOUNTY].includes(entityType);
  if (isTaskProposal) {
    return (
      <CreateFormModalOverlay
        open={open}
        onClose={handleCloseModal}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <CreateEntityModal {...props} />
      </CreateFormModalOverlay>
    );
  }
  return (
    <CreateFormModalOverlay
      open={open}
      onClose={handleCloseModal}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      {forNewModal ? <CreateEntityModal {...props} /> : <CreatePodModal {...props} />}
    </CreateFormModalOverlay>
  );
};

const ChooseEntityToCreate = (props) => {
  const { open, toggleOpen } = props;
  const [entityType, setEntityType] = useState(undefined);
  const router = useRouter();
  const { username, podId } = router.query;
  const { data: userPermissionsContext } = useQuery(GET_USER_PERMISSION_CONTEXT, {
    fetchPolicy: 'cache-and-network',
  });
  const org = useGetOrgFromUsername(username);
  const getPodById = useGetPodById(podId);

  const resetEntityType = () => {
    if (entityType) {
      setEntityType(undefined);
    }
  };
  const handleCloseModal = () => {
    resetEntityType();
    toggleOpen();
  };

  if (entityType) {
    return (
      <CreateEntity
        entityType={entityType}
        isTaskProposal={entityType === ENTITIES_TYPES.PROPOSAL}
        handleCloseModal={handleCloseModal}
        open={open}
        cancel={resetEntityType}
        handleClose={handleCloseModal}
      />
    );
  }

  return (
    <PodBoardContext.Provider
      value={{
        pod: getPodById,
        podId,
        userPermissionsContext: userPermissionsContext?.getUserPermissionContext
          ? JSON.parse(userPermissionsContext?.getUserPermissionContext)
          : null,
      }}
    >
      <OrgBoardContext.Provider
        value={{
          userPermissionsContext: userPermissionsContext?.getUserPermissionContext
            ? JSON.parse(userPermissionsContext?.getUserPermissionContext)
            : null,
          orgId: org?.id,
        }}
      >
        <CreateFormModalOverlay
          open={open}
          onClose={handleCloseModal}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <ChooseEntityToCreateModal handleClose={handleCloseModal} setEntityType={setEntityType} />
        </CreateFormModalOverlay>
      </OrgBoardContext.Provider>
    </PodBoardContext.Provider>
  );
};

export default ChooseEntityToCreate;
