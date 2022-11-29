import { SharedOrgHeaderCard } from 'components/Collaboration/SharedOrgHeader';
import RolePill from 'components/Common/RolePill';
import { Modal as ModalComponent } from 'components/Modal';
import SmartLink from 'components/Common/SmartLink';
import TaskCardPrivacy from 'components/Common/TaskCardPrivacy';
import { useContext, useEffect, useState } from 'react';
import { PERMISSIONS } from 'utils/constants';
import { parseUserPermissionContext } from 'utils/helpers';
import { useMutation } from '@apollo/client';
import { APPROVE_ORG_COLLAB_REQUEST, DECLINE_ORG_COLLAB_REQUEST } from 'graphql/mutations';
import CollabDetails, { MODAL_TYPE } from 'components/CreateCollaborationModal/ViewCollab/CollabDetails';
import { SnackbarAlertContext } from 'components/Common/SnackbarAlert';
import { Actions } from 'components/CreateCollaborationModal/ViewCollab';
import {
  CollabBottom,
  CollabCard,
  CollabCardHeader,
  CollabDescription,
  InvitationButton,
  InvitationButtonText,
  StyledBottomHr,
} from './styles';
import { RoleButtonWrapper } from '../wrapper/styles';

const ORG_PERMISSIONS = {
  MANAGE_SETTINGS: 'manageSettings',
  CONTRIBUTOR: 'contributor',
};

export const ActiveCollaborationItem = (props) => {
  const { collab, userPermissionsContext } = props;
  const [orgRoleName, setOrgRoleName] = useState(null);
  const [permissions, setPermissions] = useState(undefined);
  useEffect(() => {
    const orgPermissions = parseUserPermissionContext({
      userPermissionsContext,
      orgId: collab?.id,
    });
    const role = userPermissionsContext?.orgRoles[collab?.id];
    setOrgRoleName(role);
    if (
      orgPermissions?.includes(PERMISSIONS.MANAGE_MEMBER) ||
      orgPermissions?.includes(PERMISSIONS.FULL_ACCESS) ||
      orgPermissions?.includes(PERMISSIONS.APPROVE_PAYMENT)
    ) {
      setPermissions(ORG_PERMISSIONS.MANAGE_SETTINGS);
    } else if (
      userPermissionsContext?.orgPermissions &&
      collab?.id in userPermissionsContext?.orgPermissions &&
      orgPermissions
    ) {
      // Normal contributor with no access to admin settings
      setPermissions(ORG_PERMISSIONS.CONTRIBUTOR);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collab?.id, userPermissionsContext]);
  return (
    <SmartLink href={`/collaboration/${collab?.username}/boards`}>
      <CollabCard>
        <CollabCardHeader>
          <SharedOrgHeaderCard collab={collab} />
        </CollabCardHeader>
        <CollabDescription>{collab?.description}</CollabDescription>
        <CollabBottom>
          <RoleButtonWrapper
            style={{
              marginRight: '8px',
            }}
          >
            <RolePill roleName={orgRoleName}>🔑 {orgRoleName}</RolePill>
          </RoleButtonWrapper>
          <TaskCardPrivacy privacyLevel={collab?.privacyLevel} />
        </CollabBottom>
      </CollabCard>
    </SmartLink>
  );
};

export const PendingRequestCollaborationItem = (props) => {
  const { collab, userPermissionsContext } = props;

  const [isOpen, setIsOpen] = useState(false);

  const handleModal = () => setIsOpen((prevState) => !prevState);

  return (
    <CollabCard>
      <ModalComponent maxWidth={560} title="Project collaboration request" open={isOpen} onClose={handleModal}>
        <CollabDetails type={MODAL_TYPE.VIEW} request={collab} />
      </ModalComponent>
      <CollabCardHeader>
        <SharedOrgHeaderCard
          collab={{
            childOrgProfilePicture: collab?.initiatorOrg?.profilePicture,
            parentOrgProfilePIcture: collab?.recipientOrg?.profilePicture,
            childOrgName: collab?.initiatorOrg?.name,
            parentOrgName: collab?.recipientOrg?.name,
          }}
          blurChild
        />
      </CollabCardHeader>
      <CollabDescription>{collab?.title}</CollabDescription>
      <StyledBottomHr />
      <CollabBottom
        style={{
          justifyContent: 'flex-end',
        }}
      >
        <InvitationButton
          buttonInnerStyle={{
            padding: '8px',
            paddingRight: '12px',
            paddingLeft: '12px',
          }}
          highlighted
          onClick={handleModal}
        >
          <InvitationButtonText>View Request</InvitationButtonText>
        </InvitationButton>
      </CollabBottom>
    </CollabCard>
  );
};

export const PendingInviteCollaborationItem = (props) => {
  const { collab, userPermissionsContext } = props;

  const [isOpen, setIsOpen] = useState(false);
  const { setSnackbarAlertOpen, setSnackbarAlertMessage } = useContext(SnackbarAlertContext);
  const [declineOrgCollabRequest] = useMutation(DECLINE_ORG_COLLAB_REQUEST, {
    refetchQueries: ['getOrgCollabRequestForRecipient', 'getOrgInviteCollabCount'],
  });

  const [approveOrgCollabRequest, { data }] = useMutation(APPROVE_ORG_COLLAB_REQUEST, {
    refetchQueries: ['getUserPermissionContext', 'getOrgCollabRequestForRecipient', 'getOrgActiveCollabCount'],
  });
  const handleModal = () => setIsOpen((prevState) => !prevState);

  const handleDecline = () =>
    declineOrgCollabRequest({ variables: { orgCollabRequestId: collab.id } }).then(() => handleModal());

  const handleApprove = () =>
    approveOrgCollabRequest({ variables: { orgCollabRequestId: collab.id } }).then(() => {
      handleModal();
      setSnackbarAlertOpen(true);
      setSnackbarAlertMessage('Collaboration request approved - click the Active tab to see all collabs');
    });

  return (
    <CollabCard>
      <ModalComponent
        footerRight={
          <Actions
            declineLabel="Decline"
            acceptLabel="Accept"
            type={MODAL_TYPE.ACTION}
            onClose={() => handleDecline()}
            onSubmit={() => handleApprove()}
          />
        }
        maxWidth={560}
        title="Project collaboration request"
        open={isOpen}
        onClose={handleModal}
      >
        <CollabDetails type={MODAL_TYPE.ACTION} request={collab} />
      </ModalComponent>
      <CollabCardHeader>
        <SharedOrgHeaderCard
          collab={{
            childOrgProfilePicture: collab?.recipientOrg?.profilePicture,
            parentOrgProfilePIcture: collab?.initiatorOrg?.profilePicture,
            childOrgName: collab?.recipientOrg?.name,
            parentOrgName: collab?.initiatorOrg?.name,
          }}
        />
      </CollabCardHeader>
      <CollabDescription>{collab?.title}</CollabDescription>
      <StyledBottomHr />
      <CollabBottom
        style={{
          justifyContent: 'flex-end',
        }}
      >
        <InvitationButton
          buttonInnerStyle={{
            padding: '8px',
            paddingRight: '12px',
            paddingLeft: '12px',
          }}
          highlighted
          onClick={handleModal}
        >
          <InvitationButtonText>View Invite</InvitationButtonText>
        </InvitationButton>
      </CollabBottom>
    </CollabCard>
  );
};
