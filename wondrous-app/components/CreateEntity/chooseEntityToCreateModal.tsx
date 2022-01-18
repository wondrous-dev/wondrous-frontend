import React from 'react'
import { IconButton } from '@material-ui/core'

import CloseModalIcon from '../Icons/closeModal'
import RightArrowIcon from '../Icons/rightArrow'

import { ENTITIES_TYPES } from '../../utils/constants'

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
} from './styles'

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
    label: 'DAO',
  },
}

const ChooseEntityToCreateModal = (props) => {
  const { handleClose, setEntityType } = props

  // TODO: remove since DAO creation will be introduced
  const entries = Object.entries(ENTITIES_UI_ELEMENTS).filter(
    ([key]) => key !== ENTITIES_TYPES.ORG
  )

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
  )
}

export default ChooseEntityToCreateModal
