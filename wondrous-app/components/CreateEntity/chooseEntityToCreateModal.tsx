import React from 'react';
import { IconButton } from '@mui/material';

import { ENTITIES_TYPES, PERMISSIONS } from 'utils/constants';

import { useRouter } from 'next/router';
import { GET_USER_PERMISSION_CONTEXT } from 'graphql/queries';
import { parseUserPermissionContext } from 'utils/helpers';
import { useQuery } from '@apollo/client';
import { useHotkey, useOrgBoard, usePodBoard } from 'utils/hooks';
import { HOTKEYS } from 'utils/hotkeyHelper';
import {
  CreateLayoutDaoIcon,
  CreateLayoutMilestoneIcon,
  CreateLayoutPodsIcon,
  CreateLayoutsModal,
  CreateLayoutsModalCloseButton,
  CreateLayoutsModalHeader,
  CreateLayoutsModalItem,
  CreateLayoutsModalItemContainer,
  CreateLayoutsModalItemTitle,
  CreateLayoutsModalItemTitleBlock,
  CreateLayoutsModalTitle,
  CreateLayoutTaskIcon,
  CreateLayoutBountyIcon,
  CreateLayoutProposalIcon,
  CreateLayoutsModalSubtitle,
} from './styles';
import RightArrowIcon from '../Icons/rightArrow';
import CloseModalIcon from '../Icons/closeModal';

export const ENTITIES_UI_ELEMENTS = {
  [ENTITIES_TYPES.TASK]: {
    icon: CreateLayoutTaskIcon,
    label: 'Task',
    hotkey: HOTKEYS.CREATE_TASK,
  },
  [ENTITIES_TYPES.MILESTONE]: {
    icon: CreateLayoutMilestoneIcon,
    label: 'Milestone',
    hotkey: HOTKEYS.CREATE_MILESTONE,
  },
  [ENTITIES_TYPES.POD]: {
    icon: CreateLayoutPodsIcon,
    label: 'Pod',
    hotkey: HOTKEYS.CREATE_POD,
  },
  [ENTITIES_TYPES.ORG]: {
    icon: CreateLayoutDaoIcon,
    label: 'DAO',
    hotkey: HOTKEYS.CREATE_DAO,
  },
  [ENTITIES_TYPES.BOUNTY]: {
    icon: CreateLayoutBountyIcon,
    label: 'Bounty',
    hotkey: HOTKEYS.CREATE_BOUNTY,
  },
  [ENTITIES_TYPES.PROPOSAL]: {
    icon: CreateLayoutProposalIcon,
    label: 'Proposal',
    hotkey: HOTKEYS.CREATE_PROPOSAL,
  },
};

function ChooseEntityToCreateModal(props) {
  const { handleClose, setEntityType } = props;

  // TODO: remove since DAO creation will be introduced
  const router = useRouter();
  const { data: userPermissionsContextData } = useQuery(GET_USER_PERMISSION_CONTEXT, {
    fetchPolicy: 'cache-and-network',
  });
  const orgBoard = useOrgBoard();
  const podBoard = usePodBoard();
  const showBadge = useHotkey();
  const board = orgBoard || podBoard;
  const userPermissionsContext = userPermissionsContextData?.getUserPermissionContext
    ? JSON.parse(userPermissionsContextData?.getUserPermissionContext)
    : null;

  const permissions = parseUserPermissionContext({
    userPermissionsContext,
    orgId: board?.orgId,
    podId: board?.podId,
  });

  const onPodPage = router.pathname.includes('/pod/');
  const entries = Object.entries(ENTITIES_UI_ELEMENTS).filter(([key]) => {
    if (
      !permissions.includes(PERMISSIONS.FULL_ACCESS) &&
      !permissions.includes(PERMISSIONS.MANAGE_POD) &&
      key === ENTITIES_TYPES.POD
    ) {
      return false;
    }
    if (
      !permissions.includes(PERMISSIONS.FULL_ACCESS) &&
      !permissions.includes(PERMISSIONS.CREATE_TASK) &&
      key === ENTITIES_TYPES.MILESTONE
    ) {
      return false;
    }
    return key !== ENTITIES_TYPES.ORG;
  });

  return (
    <CreateLayoutsModal>
      <CreateLayoutsModalHeader>
        <CreateLayoutsModalTitle>Create new...</CreateLayoutsModalTitle>
        <CreateLayoutsModalCloseButton onClick={handleClose}>
          <CloseModalIcon />
        </CreateLayoutsModalCloseButton>
      </CreateLayoutsModalHeader>
      <CreateLayoutsModalItemContainer>
        {/* {Object.entries(ENTITIES_UI_ELEMENTS).map(([key, { icon: EntityIcon, label }]) => ( */}
        {entries.map(([key, { icon: EntityIcon, label, hotkey }]) => (
          <CreateLayoutsModalItem key={key} onClick={() => setEntityType(key)}>
            <CreateLayoutsModalItemTitleBlock>
              <EntityIcon circle />
              <CreateLayoutsModalItemTitle>{label}</CreateLayoutsModalItemTitle>
            </CreateLayoutsModalItemTitleBlock>
            <IconButton>
              {showBadge ? <CreateLayoutsModalSubtitle>{`shift+${hotkey}`}</CreateLayoutsModalSubtitle> : null}
              <RightArrowIcon />
            </IconButton>
          </CreateLayoutsModalItem>
        ))}
      </CreateLayoutsModalItemContainer>
    </CreateLayoutsModal>
  );
}

export default ChooseEntityToCreateModal;
