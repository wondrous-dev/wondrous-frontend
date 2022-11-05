import React from 'react';
import { IconButton } from '@mui/material';

import { ENTITIES_TYPES, PERMISSIONS } from 'utils/constants';

import { GET_USER_PERMISSION_CONTEXT } from 'graphql/queries';
import { parseUserPermissionContext } from 'utils/helpers';
import { useQuery } from '@apollo/client';
import { useOrgBoard, usePodBoard } from 'utils/hooks';
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
} from './styles';
import RightArrowIcon from '../Icons/rightArrow';
import CloseModalIcon from '../Icons/closeModal';

export const ENTITIES_UI_ELEMENTS = {
  [ENTITIES_TYPES.TASK]: {
    icon: CreateLayoutTaskIcon,
    label: 'Task',
  },
  [ENTITIES_TYPES.MILESTONE]: {
    icon: CreateLayoutMilestoneIcon,
    label: 'Milestone',
  },
  [ENTITIES_TYPES.POD]: {
    icon: CreateLayoutPodsIcon,
    label: 'Pod',
  },
  [ENTITIES_TYPES.ORG]: {
    icon: CreateLayoutDaoIcon,
    label: 'Organization',
  },
  [ENTITIES_TYPES.BOUNTY]: {
    icon: CreateLayoutBountyIcon,
    label: 'Bounty',
  },
  [ENTITIES_TYPES.PROPOSAL]: {
    icon: CreateLayoutProposalIcon,
    label: 'Proposal',
  },
};

function ChooseEntityToCreateModal(props) {
  const { handleClose, setEntityType } = props;

  const { data: userPermissionsContextData } = useQuery(GET_USER_PERMISSION_CONTEXT, {
    fetchPolicy: 'cache-and-network',
  });
  const orgBoard = useOrgBoard();
  const podBoard = usePodBoard();
  const board = orgBoard || podBoard;
  const userPermissionsContext = userPermissionsContextData?.getUserPermissionContext
    ? JSON.parse(userPermissionsContextData?.getUserPermissionContext)
    : null;

  const permissions = parseUserPermissionContext({
    userPermissionsContext,
    orgId: board?.orgId,
    podId: board?.podId,
  });

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
        {entries.map(([key, { icon: EntityIcon, label }]) => (
          <CreateLayoutsModalItem key={key} onClick={() => setEntityType(key)} data-cy={`modal-item-${label}`}>
            <CreateLayoutsModalItemTitleBlock>
              <EntityIcon circle />
              <CreateLayoutsModalItemTitle>{label}</CreateLayoutsModalItemTitle>
            </CreateLayoutsModalItemTitleBlock>
            <IconButton>
              <RightArrowIcon />
            </IconButton>
          </CreateLayoutsModalItem>
        ))}
      </CreateLayoutsModalItemContainer>
    </CreateLayoutsModal>
  );
}

export default ChooseEntityToCreateModal;
