import { useLazyQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { PERMISSIONS } from 'utils/constants';
import { useOrgBoard } from 'utils/hooks';
import { ErrorText } from 'components/Common';
import {
  SelectMenuBoardTypeClickAway,
  SelectMenuBoardTypeIcon,
  SelectMenuBoardTypeItem,
  SelectMenuBoardTypeWrapper,
} from 'components/Common/SelectMenuBoardType/styles';
import { ActionButton } from 'components/Common/Task/styles';
import { KudosFormTextareaCharacterCount } from 'components/Common/KudosForm/styles';
import { GET_ORG_ROLES } from 'graphql/queries';
import {
  RequestModalBackButton,
  RequestModalBox,
  RequestModalButtonsContainer,
  RequestModalCloseIcon,
  RequestModalContainer,
  RequestModalCustomPopper,
  RequestModalHorizontalAlign,
  RequestModalLevelContainer,
  RequestModalRolesAbilityCheckIcon,
  RequestModalRolesAbilityCloseIcon,
  RequestModalRolesAbilityColumns,
  RequestModalRolesAbilityContainer,
  RequestModalRolesAbilityRows,
  RequestModalRolesAbilityText,
  RequestModalRolesSubtitle,
  RequestModalTextarea,
  RequestModalTextareaWrapper,
  RequestModalTitle,
  RequestModalTitleBar,
  RequestModalTypeText,
} from './styles';
import { StyledCancelButton, StyledWarningMessage } from '../../Common/ArchiveTaskModal/styles';

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
    handleOpenExploreOtherRoles,
  } = props;
  const [requestMessage, setRequestMessage] = useState('');
  const [error, setError] = useState(null);
  const [characterCount, setCharacterCount] = useState(0);

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

  const orgRoles = useGetOrgRoles(orgId);

  const roleIndex = orgRoles ? orgRoles.findIndex((object) => object.name === orgRole?.name) : null;

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

  const rolePermissions = orgRoles?.[roleIndex]?.permissions;
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
                handleOpenExploreOtherRoles(true);
              }}
            />

            <RequestModalTitle> {orgId ? 'DAO' : 'Pod'} membership request message </RequestModalTitle>
          </RequestModalHorizontalAlign>

          <RequestModalCloseIcon
            color="#FFFFFF"
            onClick={() => {
              onClose();
            }}
          />
        </RequestModalTitleBar>
        <RequestModalTypeText>{orgRole?.name}</RequestModalTypeText>
        <RequestModalRolesAbilityContainer>
          <RequestModalRolesAbilityColumns>
            <RequestModalRolesSubtitle>This role can:</RequestModalRolesSubtitle>
            {roleCanDo?.map((role) => (
              <RequestModalRolesAbilityRows key={role}>
                <RequestModalRolesAbilityCheckIcon />
                <RequestModalRolesAbilityText>{role}</RequestModalRolesAbilityText>
              </RequestModalRolesAbilityRows>
            ))}
          </RequestModalRolesAbilityColumns>
          <RequestModalRolesAbilityColumns>
            <RequestModalRolesSubtitle>This role cannot:</RequestModalRolesSubtitle>
            {roleCannotDo?.map((role) => (
              <RequestModalRolesAbilityRows key={role}>
                <RequestModalRolesAbilityCloseIcon />
                <RequestModalRolesAbilityText>{role}</RequestModalRolesAbilityText>
              </RequestModalRolesAbilityRows>
            ))}
          </RequestModalRolesAbilityColumns>
        </RequestModalRolesAbilityContainer>
        <RequestModalTextareaWrapper noValidate autoComplete="off">
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
                    ...(requestMessage && {
                      message: `Requesting permissions for ${orgRole?.name}. Message: ${requestMessage}`,
                    }),
                  },
                });
              } else if (podId) {
                sendRequest({
                  variables: {
                    podId,
                    ...(requestMessage && {
                      message: `Requesting permissions for ${orgRole?.name}. Message: ${requestMessage}`,
                    }),
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
