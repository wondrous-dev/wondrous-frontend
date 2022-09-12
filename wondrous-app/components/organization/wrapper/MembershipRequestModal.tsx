import { useLazyQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { PERMISSIONS } from 'utils/constants';
import { ErrorText } from 'components/Common';
import { ActionButton } from 'components/Common/Task/styles';
import { KudosFormTextareaCharacterCount } from 'components/Common/KudosForm/styles';
import { GET_ORG_ROLES, GET_POD_ROLES } from 'graphql/queries';
import { StyledCancelButton, StyledWarningMessage } from 'components/Common/ArchiveTaskModal/styles';
import ChecklistRow from 'components/CheckList/ChecklistRow';
import RolePill from 'components/Common/RolePill';
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
  const {
    open,
    onClose,
    sendRequest,
    orgId,
    podId,
    setJoinRequestSent,
    notLinkedWalletError,
    linkedWallet,
    orgRole,
    handleSetRequest,
    handleOpenClaimedRole,
    handleOpenJoinRequestModal,
    handleOpenCurrentRoleModal,
    handleSetClaimedRole,
  } = props;
  const [requestMessage, setRequestMessage] = useState('');
  const [error, setError] = useState(null);
  const [characterCount, setCharacterCount] = useState(0);
  const [roles, setRoles] = useState(null);

  const useGetOrgRoles = (org) => {
    const [getOrgRoles, { data }] = useLazyQuery(GET_ORG_ROLES, {
      fetchPolicy: 'network-only',
    });
    useEffect(() => {
      if (org) {
        getOrgRoles({
          variables: {
            orgId: org,
          },
        });
      }
    }, [getOrgRoles, org]);
    return data?.getOrgRoles;
  };

  const useGetPodRoles = (pod) => {
    const [getPodRoles, { data }] = useLazyQuery(GET_POD_ROLES, {
      fetchPolicy: 'network-only',
    });
    useEffect(() => {
      if (pod) {
        getPodRoles({
          variables: {
            podId: pod,
          },
        });
      }
    }, [getPodRoles, pod]);
    return data?.getPodRoles;
  };

  const orgRoles = useGetOrgRoles(orgId);
  const podRoles = useGetPodRoles(podId);

  useEffect(() => {
    if (orgRoles) {
      setRoles(orgRoles);
    } else {
      setRoles(podRoles);
    }
  }, [orgRoles, podRoles]);

  const roleIndex = roles ? roles?.findIndex((object) => object.name === orgRole?.name) : null;

  const handleChange = (e) => {
    if (error) {
      setError(false);
    }
    if (e.target.value.length <= 200) {
      setRequestMessage(e.target.value);
      setCharacterCount(e.target.value.length);
    }
  };
  const handleOnClose = () => {
    setRequestMessage('');
    setCharacterCount(0);
    setError(false);
    onClose();
  };

  const defaultRole = roles?.[roles?.findIndex((role) => role?.default === true)];

  const rolePermissions = roles?.[roleIndex]?.permissions;
  const roleCanDo = Object.keys(PERMISSIONS).filter((key) => rolePermissions?.includes(PERMISSIONS[key]));
  const roleCannotDo = Object.keys(PERMISSIONS).filter((key) => !rolePermissions?.includes(PERMISSIONS[key]));

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
        {notLinkedWalletError && (
          <StyledWarningMessage
            style={{
              marginLeft: 0,
            }}
          >
            {`To join via token gated role, switch to linked wallet ${linkedWallet?.slice(0, 7)}...`}
          </StyledWarningMessage>
        )}

        <RequestModalTitleBar>
          <RequestModalHorizontalAlign>
            <RequestModalBackButton
              color="#FFFFFF"
              onClick={() => {
                handleOpenClaimedRole(false);
                handleOpenCurrentRoleModal(true);
              }}
            />

            <RequestModalTitle style={{ marginRight: '12px' }}>Applying for role: </RequestModalTitle>
            {orgId ? <RolePill roleName={orgRole?.name} /> : <RolePill roleName={defaultRole?.name} />}
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
            {orgId ? null : <RequestModalRolesSubtitle>Message to admins</RequestModalRolesSubtitle>}
            {orgId ? (
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
            ) : null}

            <RequestModalTextareaWrapper noValidate autoComplete="off" style={{ marginTop: '24px' }}>
              <RequestModalTextarea
                placeholder="What do you want admin to know about you!"
                rows={4}
                rowsMax={8}
                onChange={handleChange}
                value={requestMessage}
              />
              <KudosFormTextareaCharacterCount>
                {characterCount}/{200} characters
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
        <ActionButton
          style={{ padding: '8px 30px 8px 30px', marginLeft: '8px' }}
          onClick={() => {
            if (!requestMessage) {
              setError('Please enter a request message');
            } else {
              handleSetRequest(requestMessage);
              handleOpenJoinRequestModal(false);
              handleOpenClaimedRole(true);
              if (orgId) {
                sendRequest({
                  variables: {
                    orgId,
                    message: requestMessage,
                    roleId: orgRole.id,
                  },
                });
              } else if (podId) {
                handleSetClaimedRole(defaultRole);
                sendRequest({
                  variables: {
                    podId,
                    message: requestMessage,
                    roleId: defaultRole?.id,
                  },
                });
              }
              setJoinRequestSent(true);
              handleOnClose();
            }
          }}
        >
          Apply
        </ActionButton>
      </RequestModalButtonsContainer>
    </RequestModalContainer>
  );
};

export default MembershipRequestModal;
