import React from 'react';
import { IconButton } from '@material-ui/core';

import CloseModalIcon from '../Icons/closeModal';
import RightArrowIcon from '../Icons/rightArrow';

import { ENTITIES_TYPES, PERMISSIONS } from '../../utils/constants';

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
} from './styles';
import { useRouter } from 'next/router';
import { GET_USER_PERMISSION_CONTEXT } from '../../graphql/queries';
import { parseUserPermissionContext } from '../../utils/helpers';
import { useQuery } from '@apollo/client';
import { useOrgBoard, usePodBoard } from '../../utils/hooks';

export const ENTITIES_UI_ELEMENTS = {
  [ENTITIES_TYPES.TASK]: {
    icon: CreateLayoutTaskIcon,
    label: 'Task',
  },
  // [ENTITIES_TYPES.MILESTONE]: {
  //   icon: CreateLayoutMilestoneIcon,
  //   label: 'Milestone',
  // },
  [ENTITIES_TYPES.POD]: {
    icon: CreateLayoutPodsIcon,
    label: 'Pod',
  },
  [ENTITIES_TYPES.ORG]: {
    icon: CreateLayoutDaoIcon,
    label: 'DAO',
  },
};

const ChooseEntityToCreateModal = (props) => {
  const { handleClose, setEntityType } = props;

  // TODO: remove since DAO creation will be introduced
  const router = useRouter();
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

  const onPodPage = router.pathname.includes('/pod/');
  const entries = Object.entries(ENTITIES_UI_ELEMENTS).filter(([key]) => {
    if (!permissions.includes(PERMISSIONS.FULL_ACCESS) && key === ENTITIES_TYPES.POD) {
      return false;
    }
    const condition = onPodPage ? key !== ENTITIES_TYPES.ORG && key !== ENTITIES_TYPES.POD : key !== ENTITIES_TYPES.ORG;
    return condition;
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
        {/*{Object.entries(ENTITIES_UI_ELEMENTS).map(([key, { icon: EntityIcon, label }]) => (*/}
        {entries.map(([key, { icon: EntityIcon, label }]) => (
          <CreateLayoutsModalItem key={key} onClick={() => setEntityType(key)}>
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
};

export default ChooseEntityToCreateModal;
