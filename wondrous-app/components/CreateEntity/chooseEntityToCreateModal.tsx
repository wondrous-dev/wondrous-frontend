import React from 'react';

import CreateEntityComponent from 'components/HeaderItems/CreateEntityComponent';
import { ENTITIES_TYPES } from 'utils/constants';

import Dao2DaoIcon from 'components/Icons/Dao2Dao';
import { useOutsideAlerter } from 'utils/hooks';
import {
  ChooseEntityWrapper,
  CreateLayoutBountyIcon,
  CreateLayoutDaoIcon,
  CreateLayoutGrantIcon,
  CreateLayoutMilestoneIcon,
  CreateLayoutPodsIcon,
  CreateLayoutProposalIcon,
  CreateLayoutTaskIcon,
} from './styles';

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
  [ENTITIES_TYPES.GRANT]: {
    icon: CreateLayoutGrantIcon,
    label: 'Grant',
  },
  [ENTITIES_TYPES.COLLAB]: {
    icon: Dao2DaoIcon,
    label: 'Collaboration',
  },
};

function ChooseEntityToCreateModal(props) {
  const { handleClose } = props;
  return (
    <ChooseEntityWrapper>
      <CreateEntityComponent onClose={handleClose} />
    </ChooseEntityWrapper>
  );
}

export default ChooseEntityToCreateModal;
