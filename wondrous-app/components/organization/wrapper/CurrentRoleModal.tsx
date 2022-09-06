import { useLazyQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { PERMISSIONS } from 'utils/constants';
import { ActionButton } from 'components/Common/Task/styles';
import { GET_ORG_ROLES } from 'graphql/queries';
import { StyledWarningMessage } from 'components/Common/ArchiveTaskModal/styles';
import ChecklistRow from 'components/CheckList/ChecklistRow';
import {
  RequestModalBox,
  RequestModalButtonsContainer,
  RequestModalCloseIcon,
  RequestModalContainer,
  RequestModalRolesAbilityColumns,
  RequestModalRolesAbilityContainer,
  RequestModalRolesSubtitle,
  RequestModalTitle,
  RequestModalTitleBar,
} from './styles';

const CurrentRoleModal = (props) => {
  const {
    open,
    onClose,
    orgId,
    notLinkedWalletError,
    linkedWallet,
    orgRole,
    handleOpenCurrentRoleModal,
    handleOpenExploreOtherRoles,
  } = props;

  const [levelPicked, setLevelPicked] = useState('contributor');

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

  const roleIndex = orgRoles ? orgRoles.findIndex((object) => object.name === levelPicked) : null;

  const rolePermissions = orgRoles?.[roleIndex]?.permissions;
  const roleCanDo = Object.keys(PERMISSIONS).filter((key) => rolePermissions?.includes(PERMISSIONS[key]));
  const roleCannotDo = Object.keys(PERMISSIONS).filter((key) => !rolePermissions?.includes(PERMISSIONS[key]));

  useEffect(() => {
    setLevelPicked(orgRole);
  }, [orgRole, roleCannotDo]);

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
          <RequestModalTitle>Your Role in Wonderverse</RequestModalTitle>

          <RequestModalCloseIcon
            color="#FFFFFF"
            onClick={() => {
              onClose();
            }}
          />
        </RequestModalTitleBar>
        <RequestModalTitle>{levelPicked}</RequestModalTitle>
        <RequestModalRolesAbilityContainer>
          <RequestModalRolesAbilityColumns>
            <RequestModalRolesSubtitle>This role can:</RequestModalRolesSubtitle>
            {roleCanDo?.includes(PERMISSIONS.FULL_ACCESS.toUpperCase())
              ? Object.keys(PERMISSIONS)?.map((permission) => (
                  <ChecklistRow role={permission} key={permission} status="success" />
                ))
              : roleCanDo?.map((permission) => <ChecklistRow role={permission} key={permission} status="success" />)}
          </RequestModalRolesAbilityColumns>
          <RequestModalRolesAbilityColumns>
            <RequestModalRolesSubtitle>This role cannot:</RequestModalRolesSubtitle>
            {roleCannotDo.includes(PERMISSIONS.FULL_ACCESS.toUpperCase())
              ? roleCannotDo?.map((permission) => <ChecklistRow role={permission} key={permission} status="fail" />)
              : null}
          </RequestModalRolesAbilityColumns>
        </RequestModalRolesAbilityContainer>
      </RequestModalBox>

      <RequestModalButtonsContainer
        style={{
          marginRight: 0,
        }}
      >
        <ActionButton
          style={{ padding: '8px 30px 8px 30px', marginLeft: '8px' }}
          onClick={() => {
            handleOpenCurrentRoleModal(false);
            handleOpenExploreOtherRoles(true);
          }}
        >
          Explore other roles
        </ActionButton>
      </RequestModalButtonsContainer>
    </RequestModalContainer>
  );
};

export default CurrentRoleModal;
