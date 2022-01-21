import React from 'react'
import {
  SettingsHeaderBlock,
  SettingsHeaderContent,
  SettingsHeaderText,
  SettingsHeaderTitle,
} from './styles'
import GeneralSettings from '../Icons/generalSettings'

export const HeaderBlock = (props) => {
  const { title, description, icon } = props

  return (
    <SettingsHeaderBlock>
      {icon ? icon : <GeneralSettings circle />}
      <SettingsHeaderContent>
        <SettingsHeaderTitle>{title}</SettingsHeaderTitle>
        <SettingsHeaderText>{description}</SettingsHeaderText>
      </SettingsHeaderContent>
    </SettingsHeaderBlock>
  )
}
