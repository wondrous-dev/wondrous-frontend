import React from 'react'

import DeleteIcon from '../../Icons/delete'

import {
	CreateFormMembersListActivityButtons,
	CreateFormMembersListAdminBlock,
	CreateFormMembersListAdminBlockText,
	CreateFormMembersListAvatar,
	CreateFormMembersListDeleteButton,
	CreateFormMembersListInfo,
	CreateFormMembersListName,
	CreateFormMembersListRow,
} from './styles'

const MembersRow = (props) => {
	const { name, styledSwitch } = props

	return (
		<CreateFormMembersListRow>
			<CreateFormMembersListInfo>
				<CreateFormMembersListAvatar />
				<CreateFormMembersListName>{name}</CreateFormMembersListName>
			</CreateFormMembersListInfo>

			<CreateFormMembersListActivityButtons>
				<CreateFormMembersListAdminBlock>
					<CreateFormMembersListAdminBlockText>
						Admin
					</CreateFormMembersListAdminBlockText>
					{/*<AndroidSwitch />*/}
					{styledSwitch}
				</CreateFormMembersListAdminBlock>
				<CreateFormMembersListDeleteButton>
					<DeleteIcon />
				</CreateFormMembersListDeleteButton>
			</CreateFormMembersListActivityButtons>
		</CreateFormMembersListRow>
	)
}

export default MembersRow
