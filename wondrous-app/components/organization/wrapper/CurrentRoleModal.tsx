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

const CurrentRoleModal = (props) => {
  const [showPopper, setShowPopper] = useState(false);
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
  const ROLES_COLORS_AND_EMOJIS = {
    owner: { emoji: '🔑', color: '#7ECC49' },
    contributor: { emoji: '✨', color: '#FF9933' },
    core_team: { emoji: '🔮', color: '#EB96EB' },
  };
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

  const roleIndex = orgRoles ? orgRoles.findIndex((object) => object.name === levelPicked) : null;

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
  const [anchorEl, setAnchorEl] = useState(null);
  const openLevel = Boolean(anchorEl);
  const handleOnClickAway = () => setAnchorEl(null);
  const board = useOrgBoard();
  const [requestMessage, setRequestMessage] = useState('');
  const [error, setError] = useState(null);
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
              ? Object.keys(PERMISSIONS)?.map((role) => (
                  <RequestModalRolesAbilityRows key={role}>
                    <RequestModalRolesAbilityCheckIcon />
                    <RequestModalRolesAbilityText>{role}</RequestModalRolesAbilityText>
                  </RequestModalRolesAbilityRows>
                ))
              : roleCanDo?.map((role) => (
                  <RequestModalRolesAbilityRows key={role}>
                    <RequestModalRolesAbilityCheckIcon />
                    <RequestModalRolesAbilityText>{role}</RequestModalRolesAbilityText>
                  </RequestModalRolesAbilityRows>
                ))}
          </RequestModalRolesAbilityColumns>
          <RequestModalRolesAbilityColumns>
            <RequestModalRolesSubtitle>This role cannot:</RequestModalRolesSubtitle>
            {roleCannotDo.includes(PERMISSIONS.FULL_ACCESS.toUpperCase())
              ? roleCannotDo?.map((role) => (
                  <RequestModalRolesAbilityRows key={role}>
                    <RequestModalRolesAbilityCloseIcon />
                    <RequestModalRolesAbilityText>{role}</RequestModalRolesAbilityText>
                  </RequestModalRolesAbilityRows>
                ))
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
