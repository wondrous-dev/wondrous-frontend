import { useLazyQuery, useMutation } from '@apollo/client';
import { useEffect, useState } from 'react';
import { CHAR_LIMIT_PROFILE_BIO } from 'utils/constants';
import { useOrgBoard } from 'utils/hooks';
import CloseModalIcon from 'components/Icons/closeModal';
import { ArchivedIcon } from '../../Icons/statusIcons';
import { PERMISSIONS } from '../../../utils/constants';
import {
  StyledArchivedLabel,
  StyledArchiveTaskButton,
  StyledBody,
  StyledBox,
  StyledButtonsContainer,
  StyledCancelButton,
  StyledCloseButton,
  StyledDialog,
  StyledDivider,
  StyledHeader,
  StyledWarningMessage,
} from '../../Common/ArchiveTaskModal/styles';
import { GeneralSettingsDAODescriptionInput } from '../../Settings/styles';
import { ErrorText } from 'components/Common';
import {
  TaskTemplateCloseIcon,
  TaskTemplateTitle,
  TaskTemplateTitleBar,
} from 'components/CreateEntity/CreateEntityModal/TaskTemplatePicker/styles';
import {
  RequestModalBox,
  RequestModalButtonsContainer,
  RequestModalCloseIcon,
  RequestModalContainer,
  RequestModalCustomPopper,
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
import {
  SelectMenuBoardTypeClickAway,
  SelectMenuBoardTypeDiv,
  SelectMenuBoardTypeIcon,
  SelectMenuBoardTypeItem,
  SelectMenuBoardTypePopper,
  SelectMenuBoardTypePopperMenu,
  SelectMenuBoardTypeText,
  SelectMenuBoardTypeWrapper,
} from 'components/Common/SelectMenuBoardType/styles';
import { ActionButton } from 'components/Common/Task/styles';
import {
  KudosFormTextarea,
  KudosFormTextareaCharacterCount,
  KudosFormTextareaWrapper,
} from 'components/Common/KudosForm/styles';
import { Label } from 'components/Onboarding/styles';
import { GET_ORG_ROLES } from 'graphql/queries';
import { useMe } from 'components/Auth/withAuth';
import { ClickAwayListener } from '@mui/material';

const contributorLevels = ['Core member', 'Owner', 'Admin'];

const ROLES_COLORS_AND_EMOJIS = [
  { owner: { emoji: '🔑', color: '#7ECC49' } },
  { contributor: { emoji: '✨', color: '#FF9933' } },
  { core_team: { emoji: '🔮', color: '#EB96EB' } },
];

export const MembershipRequestModal = (props) => {
  const [showPopper, setShowPopper] = useState(false);
  const { open, onClose, sendRequest, orgId, podId, setJoinRequestSent, notLinkedWalletError, linkedWallet, orgRole } =
    props;

  const [levelPicked, setLevelPicked] = useState('contributor');

  const [characterCount, setCharacterCount] = useState(0);

  const getRoleColors = (role) => {
    switch (role) {
      case 'owner':
        return '#7ECC49';
      case 'contributor':
        return '#FF9933';
      case 'core team':
        return '#EB96EB';
    }
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'owner':
        return '🔑';
      case 'contributor':
        return '✨';
      case 'core team':
        return '🔮';
    }
  };

  const [textError, setTextError] = useState(false);
  const user = useMe();
  console.log(user);
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

  console.log(orgRoles);

  const roleIndex = orgRoles
    ? orgRoles.findIndex((object) => {
        return object.name === levelPicked;
      })
    : null;

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
  console.log(anchorEl);
  const handleOnClickButton = (e) => setAnchorEl(anchorEl ? null : e.currentTarget);
  const handleOnClickAway = () => setAnchorEl(null);
  const board = useOrgBoard();
  const [requestMessage, setRequestMessage] = useState('');
  const [error, setError] = useState(null);
  const rolePermissions = orgRoles?.[roleIndex]?.permissions;
  const roleCanDo = Object.keys(PERMISSIONS).filter((key) => rolePermissions?.includes(PERMISSIONS[key]));
  const roleCannotDo = Object.keys(PERMISSIONS).filter((key) => !rolePermissions?.includes(PERMISSIONS[key]));

  useEffect(() => {
    setLevelPicked(orgRole);
  }, [orgRole]);
  return (
    <>
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
            <RequestModalTitle> {orgId ? 'DAO' : 'Pod'} membership request message </RequestModalTitle>
            <RequestModalCloseIcon
              color={'#FFFFFF'}
              onClick={() => {
                onClose();
              }}
            />
          </RequestModalTitleBar>
          <SelectMenuBoardTypeClickAway onClickAway={handleOnClickAway}>
            <SelectMenuBoardTypeWrapper>
              <RequestModalLevelContainer open={openLevel} onClick={() => setShowPopper(!showPopper)}>
                <RequestModalTypeText color={getRoleColors(levelPicked)} open={openLevel}>{`${getRoleIcon(
                  levelPicked
                )} ${levelPicked}`}</RequestModalTypeText>
                <SelectMenuBoardTypeIcon open={openLevel} />
              </RequestModalLevelContainer>
              <RequestModalCustomPopper>
                {showPopper
                  ? orgRoles?.map((role) => {
                      console.log(role.name);
                      console.log(role.name === levelPicked);
                      console.log(String(role.name === levelPicked));
                      return (
                        <SelectMenuBoardTypeItem
                          picked={role.name === levelPicked}
                          onClick={() => {
                            setLevelPicked(role.name);
                            setShowPopper(false);
                          }}
                          value={role.name}
                          key={role.id}
                        >
                          {`${getRoleIcon(role.name)} ${role.name}`}
                        </SelectMenuBoardTypeItem>
                      );
                    })
                  : null}
              </RequestModalCustomPopper>
            </SelectMenuBoardTypeWrapper>
          </SelectMenuBoardTypeClickAway>
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
                if (orgId) {
                  sendRequest({
                    variables: {
                      orgId,
                      ...(requestMessage && {
                        message: `User requesting ${levelPicked} roles: ${requestMessage}`,
                      }),
                    },
                  });
                } else if (podId) {
                  sendRequest({
                    variables: {
                      podId,
                      ...(requestMessage && {
                        message: requestMessage,
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
    </>
  );
};
