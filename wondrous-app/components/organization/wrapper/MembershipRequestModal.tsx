import { useLazyQuery, useMutation } from '@apollo/client';
import { useEffect, useState } from 'react';
import { PERMISSIONS } from 'utils/constants';
import { GET_USER_JOIN_ORG_REQUEST } from 'graphql/queries/org';
import { ErrorText } from 'components/Common';
import { ActionButton } from 'components/Common/Task/styles';
import { KudosFormTextareaCharacterCount } from 'components/Common/KudosForm/styles';
import { CREATE_JOIN_ORG_REQUEST } from 'graphql/mutations/org';
import { StyledCancelButton, StyledWarningMessage } from 'components/Common/ArchiveTaskModal/styles';
import ChecklistRow from 'components/CheckList/ChecklistRow';
import RolePill from 'components/Common/RolePill';
import SuccessRoleModal from 'components/Common/RoleSuccessModal/SuccessRoleModal';
import {
  RequestLightBoxContainer,
  RequestMiddleContainer,
  RequestModalBackButton,
  RequestModalBox,
  RequestModalButtonsContainer,
  RequestModalCloseIcon,
  RequestModalContainer,
  RequestModalHelperContainer,
  RequestModalHelperDiv,
  RequestModalHorizontalAlign,
  RequestModalRolesAbilityColumns,
  RequestModalRolesAbilityContainer,
  RequestModalRolesSubtitle,
  RequestModalTextarea,
  RequestModalTextareaWrapper,
  RequestModalTitle,
  RequestModalTitleBar,
} from './styles';

const MembershipRequestModal = (props) => {
  const { open, onClose, orgId, requestingRole, setOpenCurrentRoleModal } = props;
  const [requestMessage, setRequestMessage] = useState('');
  const [error, setError] = useState(null);
  const [openSuccessModal, setOpenSuccessModal] = useState(false);

  const [createJoinOrgRequest] = useMutation(CREATE_JOIN_ORG_REQUEST, {
    onCompleted: () => {
      setOpenSuccessModal(true);
    },
    refetchQueries: [GET_USER_JOIN_ORG_REQUEST],
  });

  const handleSubmit = () => {
    if (!requestMessage) {
      setError('Please enter a request message');
      return;
    }
    if (orgId) {
      createJoinOrgRequest({
        variables: {
          orgId,
          message: requestMessage,
          roleId: requestingRole.id,
        },
      });
    }
  };

  const handleOnClose = () => {
    setRequestMessage('');
    setError(false);
    setOpenSuccessModal(false);
    onClose();
  };

  const rolePermissions = requestingRole?.permissions;
  const roleCanDo = Object.keys(PERMISSIONS).filter((key) => rolePermissions?.includes(PERMISSIONS[key]));
  const roleCannotDo = Object.keys(PERMISSIONS).filter((key) => !rolePermissions?.includes(PERMISSIONS[key]));

  if (openSuccessModal) {
    return (
      <SuccessRoleModal
        open={openSuccessModal}
        role={requestingRole}
        joinRequestSent
        onClose={() => {
          handleOnClose();
        }}
      />
    );
  }

  return (
    <RequestModalContainer
      open={open}
      onClose={onClose}
      aria-labelledby="archive-task-modal"
      aria-describedby="modal-modal-description"
    >
      <RequestModalBox
        style={{
          width: '600px',
          height: 'auto',
        }}
      >
        <RequestModalTitleBar>
          <RequestModalHorizontalAlign>
            <RequestModalBackButton
              color="#FFFFFF"
              onClick={() => {
                setOpenCurrentRoleModal(true);
              }}
            />

            <RequestModalTitle style={{ marginRight: '12px' }}>Applying for role: </RequestModalTitle>
            {requestingRole ? <RolePill roleName={requestingRole?.name} /> : null}
          </RequestModalHorizontalAlign>

          <RequestModalCloseIcon
            color="#FFFFFF"
            onClick={() => {
              onClose();
            }}
          />
        </RequestModalTitleBar>
        <RequestMiddleContainer>
          <RequestLightBoxContainer>
            <RequestModalHelperContainer>
              <RequestModalHelperDiv />
            </RequestModalHelperContainer>
            <RequestModalRolesSubtitle>Message to admins</RequestModalRolesSubtitle>
            <RequestModalRolesAbilityContainer>
              <RequestModalRolesAbilityColumns>
                <RequestModalRolesSubtitle>This role can:</RequestModalRolesSubtitle>
                {roleCanDo?.map((permission) => (
                  <ChecklistRow role={permission} key={permission} status="success" />
                ))}
              </RequestModalRolesAbilityColumns>
              <RequestModalRolesAbilityColumns>
                <RequestModalRolesSubtitle>This role cannot:</RequestModalRolesSubtitle>
                {roleCannotDo?.map((permission) => (
                  <ChecklistRow role={permission} key={permission} status="fail" />
                ))}
              </RequestModalRolesAbilityColumns>
            </RequestModalRolesAbilityContainer>

            <RequestModalTextareaWrapper noValidate autoComplete="off" style={{ marginTop: '24px' }}>
              <RequestModalTextarea
                placeholder="What do you want admin to know about you!"
                rows={4}
                rowsMax={8}
                onChange={(e) => setRequestMessage(e.target.value)}
                value={requestMessage}
              />
              <KudosFormTextareaCharacterCount>
                {requestMessage?.length}/{200} characters
              </KudosFormTextareaCharacterCount>
            </RequestModalTextareaWrapper>
            {error && <ErrorText>{error}</ErrorText>}
          </RequestLightBoxContainer>
        </RequestMiddleContainer>
      </RequestModalBox>

      <RequestModalButtonsContainer
        style={{
          marginRight: 0,
        }}
      >
        <StyledCancelButton onClick={onClose}>Cancel</StyledCancelButton>
        <ActionButton style={{ padding: '8px 30px 8px 30px', marginLeft: '8px' }} onClick={handleSubmit}>
          Apply
        </ActionButton>
      </RequestModalButtonsContainer>
    </RequestModalContainer>
  );
};

export default MembershipRequestModal;
