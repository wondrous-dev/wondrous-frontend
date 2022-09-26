import { useLazyQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { PERMISSIONS } from 'utils/constants';
import { ActionButton } from 'components/Common/Task/styles';
import {
  GET_ORG_ROLES_WITH_TOKEN_GATE_AND_DISCORD,
  GET_AUTO_CLAIMABLE_ROLES,
  CAN_CLAIM_ORG_ROLE,
} from 'graphql/queries';
import { StyledWarningMessage } from 'components/Common/ArchiveTaskModal/styles';
import ChecklistRow from 'components/CheckList/ChecklistRow';
import RolePill from 'components/Common/RolePill';
import { CLAIM_ORG_ROLE_BY_DISCORD_ROLE } from 'graphql/mutations';
import apollo from 'services/apollo';
import NoRolesIcon from 'components/Icons/noRolesIcon';
import { DiscordIcon } from 'components/Icons/discord';
import { Tooltip } from '@mui/material';
import { redColors } from 'theme/colors';
import {
  RequestLightBoxContainer,
  RequestMiddleContainer,
  RequestModalBox,
  RequestModalButtonsContainer,
  RequestModalCheckbox,
  RequestModalCheckPillCombo,
  RequestModalCloseIcon,
  RequestModalContainer,
  RequestModalHelperContainer,
  RequestModalHelperDiv,
  RequestModalHorizontalAlign,
  RequestModalLockedIconOutline,
  RequestModalNoRolesContainer,
  RequestModalNoRolesSubtitle,
  RequestModalRolesAbilityColumns,
  RequestModalRolesAbilityContainer,
  RequestModalRolesSubtitle,
  RequestModalTitle,
  RequestModalTitleBar,
  RequestModalTokenGatingItem,
  RequestModalTokenGatingLockBackground,
  RequestModalTokenGatingSubtitle,
} from './styles';

const CurrentRoleModal = (props) => {
  const {
    open,
    onClose,
    orgId,
    notLinkedWalletError,
    linkedWallet,
    currentRoleName,
    handleOpenCurrentRoleModal,
    handleSetClaimedRole,
    handleOpenJoinRequestModal,
    handleOpenClaimedRole,
  } = props;

  const [checkboxRoles, setCheckboxRoles] = useState(null);

  const useGetOrgRoles = (orgId) => {
    // why even use this chook here
    const [getOrgRoles, { data: orgRoles }] = useLazyQuery(GET_ORG_ROLES_WITH_TOKEN_GATE_AND_DISCORD, {
      fetchPolicy: 'network-only',
    });
    useEffect(() => {
      if (orgId) {
        getOrgRoles({
          variables: {
            orgId,
          },
        });
      }
    }, [getOrgRoles, orgId]);
    return { orgRoles: orgRoles?.getOrgRoles };
  };
  const { orgRoles } = useGetOrgRoles(orgId);
  const noneCurrentRoles = orgRoles?.filter((role) => role.name !== currentRoleName);
  const rolesWithAccessCondition = noneCurrentRoles?.filter((role) => {
    if (role.discordRolesInfo?.length > 0) return true;
    if (role.tokenGatingCondition) return true;
    return false;
  });
  const rolesWithoutAccessCondition = noneCurrentRoles?.filter((role) => {
    if (role.discordRolesInfo?.length > 0) return false;
    if (role.tokenGatingCondition) return false;
    return true;
  });
  console.log('currentRoleName', currentRoleName);
  console.log('rolesWithAccessCondition', rolesWithAccessCondition);
  console.log('rolesWithoutAccessCondition', rolesWithoutAccessCondition);

  const handleClaimClick = async (role) => {
    if (role.__typename === 'OrgRole') {
      try {
        await apollo.mutate({
          mutation: CLAIM_ORG_ROLE_BY_DISCORD_ROLE,
          variables: {
            orgRoleId: role?.id,
          },
          refetchQueries: ['getUserOrgRoles'],
        });
      } catch (e) {
        console.error(e);
      }
    }
  };

  const currentRoleIndex = orgRoles ? orgRoles.findIndex((object) => object.name === currentRoleName) : null; //

  const currentRolePermissions = orgRoles?.[currentRoleIndex]?.permissions;
  const currentRoleCanDo = Object.keys(PERMISSIONS).filter((key) => currentRolePermissions?.includes(PERMISSIONS[key]));
  const currentRoleCannotDo = Object.keys(PERMISSIONS).filter(
    (key) => !currentRolePermissions?.includes(PERMISSIONS[key])
  );
  const claimableRoleLength = rolesWithAccessCondition ? rolesWithAccessCondition.length : 0;

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
          <RequestModalTitle>Explore Roles</RequestModalTitle>

          <RequestModalCloseIcon
            color="#FFFFFF"
            onClick={() => {
              onClose();
            }}
          />
        </RequestModalTitleBar>
        <RequestMiddleContainer>
          {/* {currentRoleName ? (
            <RequestLightBoxContainer>
              <RequestModalRolesSubtitle>Current role</RequestModalRolesSubtitle>
              <RequestModalCheckPillCombo>
                <RequestModalCheckbox disabled checked />
                <RequestModalHelperContainer>
                  <RolePill roleName={currentRoleName} />
                  <RequestModalHelperDiv />
                </RequestModalHelperContainer>
              </RequestModalCheckPillCombo>
              <RequestModalRolesAbilityContainer>
                <RequestModalRolesAbilityColumns>
                  <RequestModalRolesSubtitle>This role can:</RequestModalRolesSubtitle>

                  {currentRoleCanDo?.includes(PERMISSIONS.FULL_ACCESS.toUpperCase())
                    ? Object.keys(PERMISSIONS)?.map((permission) => (
                        <ChecklistRow role={permission} key={permission} status="success" />
                      ))
                    : currentRoleCanDo?.map((permission) => (
                        <ChecklistRow role={permission} key={permission} status="success" />
                      ))}
                </RequestModalRolesAbilityColumns>
                <RequestModalRolesAbilityColumns>
                  <RequestModalRolesSubtitle>This role cannot:</RequestModalRolesSubtitle>
                  {currentRoleCannotDo.includes(PERMISSIONS.FULL_ACCESS.toUpperCase())
                    ? currentRoleCannotDo?.map((permission) => (
                        <ChecklistRow role={permission} key={permission} status="fail" />
                      ))
                    : null}
                </RequestModalRolesAbilityColumns>
              </RequestModalRolesAbilityContainer>
            </RequestLightBoxContainer>
          ) : null} */}
          <RequestLightBoxContainer>
            <RequestModalRolesSubtitle>Roles you can claim</RequestModalRolesSubtitle>
            {/* {rolesWithAccessCondition?.length === 0 ? (
              <RequestModalNoRolesContainer>
                <NoRolesIcon />
                <RequestModalNoRolesSubtitle style={{ marginTop: '8px' }}>
                  No claimable roles yet
                </RequestModalNoRolesSubtitle>
                <RequestModalHorizontalAlign>
                  <Tooltip title="Token needed" placement="top">
                    <RequestModalTokenGatingItem>
                      <RequestModalHorizontalAlign>
                        <RequestModalTokenGatingLockBackground>
                          <RequestModalLockedIconOutline />
                        </RequestModalTokenGatingLockBackground>
                        <RequestModalTokenGatingSubtitle color="white" style={{ paddingLeft: '8px' }}>
                          Token Gate:
                        </RequestModalTokenGatingSubtitle>
                        <RequestModalTokenGatingSubtitle color={redColors.red300} style={{ paddingLeft: '8px' }}>
                          Missing
                        </RequestModalTokenGatingSubtitle>
                      </RequestModalHorizontalAlign>
                    </RequestModalTokenGatingItem>
                  </Tooltip>
                  <Tooltip title="Connect discord" placement="top">
                    <RequestModalTokenGatingItem style={{ marginLeft: '8px' }}>
                      <RequestModalHorizontalAlign>
                        <RequestModalTokenGatingLockBackground>
                          <DiscordIcon fill={redColors.red300} />
                        </RequestModalTokenGatingLockBackground>
                        <RequestModalTokenGatingSubtitle color="white" style={{ paddingLeft: '8px' }}>
                          Discord Linked:
                        </RequestModalTokenGatingSubtitle>
                        <RequestModalTokenGatingSubtitle color={redColors.red300} style={{ paddingLeft: '8px' }}>
                          No
                        </RequestModalTokenGatingSubtitle>
                      </RequestModalHorizontalAlign>
                    </RequestModalTokenGatingItem>
                  </Tooltip>
                </RequestModalHorizontalAlign>
              </RequestModalNoRolesContainer>
            ) : null} */}
            {rolesWithAccessCondition?.map((role, index) => {
              const roleCanDo = Object.keys(PERMISSIONS).filter((key) => role?.permissions?.includes(PERMISSIONS[key]));
              const roleCannotDo = Object.keys(PERMISSIONS).filter(
                (key) => !role?.permissions?.includes(PERMISSIONS[key])
              );

              return (
                <div key={role?.name}>
                  <RequestModalCheckPillCombo>
                    <div
                      onClick={() => {
                        if (index === checkboxRoles) {
                          setCheckboxRoles(null);
                        } else {
                          setCheckboxRoles(index);
                        }
                      }}
                    >
                      <RequestModalCheckbox checked={index === checkboxRoles} />
                    </div>
                    <RequestModalHelperContainer>
                      <RolePill roleName={role.name} />
                      <RequestModalHelperDiv />
                    </RequestModalHelperContainer>
                  </RequestModalCheckPillCombo>
                  {index === checkboxRoles ? (
                    <RequestModalRolesAbilityContainer>
                      <RequestModalRolesAbilityColumns>
                        <RequestModalRolesSubtitle>This role can:</RequestModalRolesSubtitle>

                        {roleCanDo?.includes(PERMISSIONS.FULL_ACCESS.toUpperCase())
                          ? Object.keys(PERMISSIONS)?.map((permission) => (
                              <ChecklistRow role={permission} key={permission} status="success" />
                            ))
                          : roleCanDo?.map((permission) => (
                              <ChecklistRow role={permission} key={permission} status="success" />
                            ))}
                      </RequestModalRolesAbilityColumns>
                      <RequestModalRolesAbilityColumns>
                        <RequestModalRolesSubtitle>This role cannot:</RequestModalRolesSubtitle>
                        {roleCannotDo.includes(PERMISSIONS.FULL_ACCESS.toUpperCase())
                          ? roleCannotDo?.map((permission) => (
                              <ChecklistRow role={permission} key={permission} status="fail" />
                            ))
                          : null}
                      </RequestModalRolesAbilityColumns>
                    </RequestModalRolesAbilityContainer>
                  ) : null}
                </div>
              );
            })}
          </RequestLightBoxContainer>
          <RequestLightBoxContainer>
            <RequestModalRolesSubtitle>Roles you can request</RequestModalRolesSubtitle>
            {rolesWithoutAccessCondition?.map((role, index) => {
              const roleCanDo = Object.keys(PERMISSIONS).filter((key) => role?.permissions?.includes(PERMISSIONS[key]));
              const roleCannotDo = Object.keys(PERMISSIONS).filter(
                (key) => !role?.permissions?.includes(PERMISSIONS[key])
              );
              return (
                <div key={role?.name}>
                  <RequestModalCheckPillCombo>
                    <div
                      onClick={() => {
                        if (index + claimableRoleLength === checkboxRoles) {
                          setCheckboxRoles(null);
                        } else {
                          setCheckboxRoles(index + claimableRoleLength);
                        }
                      }}
                    >
                      <RequestModalCheckbox checked={index + claimableRoleLength === checkboxRoles} />
                    </div>

                    <RequestModalHelperContainer>
                      <RolePill roleName={role.name} />
                      <RequestModalHelperDiv />
                    </RequestModalHelperContainer>
                  </RequestModalCheckPillCombo>
                  {index + claimableRoleLength === checkboxRoles ? (
                    <RequestModalRolesAbilityContainer>
                      <RequestModalRolesAbilityColumns>
                        <RequestModalRolesSubtitle>This role can:</RequestModalRolesSubtitle>

                        {roleCanDo?.includes(PERMISSIONS.FULL_ACCESS.toUpperCase())
                          ? Object.keys(PERMISSIONS)?.map((permission) => (
                              <ChecklistRow role={permission} key={permission} status="success" />
                            ))
                          : roleCanDo?.map((permission) => (
                              <ChecklistRow role={permission} key={permission} status="success" />
                            ))}
                      </RequestModalRolesAbilityColumns>
                      <RequestModalRolesAbilityColumns>
                        <RequestModalRolesSubtitle>This role cannot:</RequestModalRolesSubtitle>
                        {roleCannotDo.includes(PERMISSIONS.FULL_ACCESS.toUpperCase())
                          ? roleCannotDo?.map((permission) => (
                              <ChecklistRow role={permission} key={permission} status="fail" />
                            ))
                          : null}
                      </RequestModalRolesAbilityColumns>
                    </RequestModalRolesAbilityContainer>
                  ) : null}
                </div>
              );
            })}
          </RequestLightBoxContainer>
        </RequestMiddleContainer>
      </RequestModalBox>

      {checkboxRoles !== null ? (
        <RequestModalButtonsContainer
          style={{
            marginRight: 0,
          }}
        >
          <ActionButton
            style={{ padding: '8px 30px 8px 30px', marginLeft: '8px' }}
            onClick={() => {
              handleSetClaimedRole(noneCurrentRoles[checkboxRoles]);
              if (checkboxRoles >= claimableRoleLength) {
                handleOpenCurrentRoleModal(false);
                handleOpenJoinRequestModal(true);
              } else {
                handleClaimClick(noneCurrentRoles[checkboxRoles]);
                handleOpenCurrentRoleModal(false);
                handleOpenClaimedRole(true);
              }
            }}
          >
            {checkboxRoles >= claimableRoleLength ? 'Request role' : 'Claim role'}
          </ActionButton>
        </RequestModalButtonsContainer>
      ) : null}
    </RequestModalContainer>
  );
};

export default CurrentRoleModal;
