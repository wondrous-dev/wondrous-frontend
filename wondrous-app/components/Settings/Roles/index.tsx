import React, { useState } from 'react'

import { SettingsWrapper } from '../settingsWrapper'
import { HeaderBlock } from '../headerBlock'
import UserCheckIcon from '../../Icons/userCheckIcon'

import {
  GeneralSettingsContainer,
  GeneralSettingsDAONameBlock,
  GeneralSettingsDAONameInput,
  GeneralSettingsInputsBlock,
  LabelBlock,
} from '../styles'


const Roles = () => {
  const [newRole, setNewRole] = useState('')

  const handleNewRoleNameChange = (e) => {
    const { value } = e.target

    if (value.length <= 100) {
      setNewRole(value)
    }
  }

  return (
    <SettingsWrapper>
      <GeneralSettingsContainer>
        <HeaderBlock
          icon={<UserCheckIcon circle />}
          title="Roles"
          description="Use roles to organize contributors and admins"
        />
        <GeneralSettingsInputsBlock>
          <GeneralSettingsDAONameBlock>
            <LabelBlock>Create a new role</LabelBlock>
            <GeneralSettingsDAONameInput />
          </GeneralSettingsDAONameBlock>
        </GeneralSettingsInputsBlock>
      </GeneralSettingsContainer>
    </SettingsWrapper>
  )
}

export default Roles
