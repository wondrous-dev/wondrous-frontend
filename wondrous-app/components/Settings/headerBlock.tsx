import React from 'react'
import {
	SettingsHeaderBlock,
	SettingsHeaderContent,
	SettingsHeaderText,
	SettingsHeaderTitle,
} from './styles'
import GeneralSettings from '../Icons/generalSettings'

export const HeaderBlock = (props) => {
	const { title, description } = props

	return (
		<SettingsHeaderBlock>
			<GeneralSettings circle />
			<SettingsHeaderContent>
				<SettingsHeaderTitle>{title}</SettingsHeaderTitle>
				<SettingsHeaderText>{description}</SettingsHeaderText>
			</SettingsHeaderContent>
		</SettingsHeaderBlock>
	)
}
