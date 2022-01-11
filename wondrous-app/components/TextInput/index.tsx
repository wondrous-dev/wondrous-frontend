import { MentionsInput, Mention } from 'react-mentions'
import React, { useCallback, useEffect, useState } from 'react'
import { useTextInput } from '../../utils/hooks'
import { useLazyQuery } from '@apollo/client'
import { GET_AUTOCOMPLETE_USERS } from '../../graphql/queries'
import { MENTION_REGEX } from '../../utils/constants'
import {
	StyledMention,
	UserSuggestionTypography,
	UserSuggestionWrapper,
} from './styles'
import { SafeImage } from '../Common/Image'

const renderUserSuggestion = (entry) => {
	// console.log('entry', entry)
	return <></>
}

export const TextInput = (props) => {
	const [name, setName] = useState('')
	const inputProps = useTextInput()
	const [
		getAutocompleteUsers,
		{ data: userData, loading: userLoading, error: userError },
	] = useLazyQuery(GET_AUTOCOMPLETE_USERS)
	const handleChange = useCallback(
		(event, newValue, newPlainTextValue, mentions) => {
			if (inputProps?.onChange) {
				inputProps?.onChange(event)
			}
		},
		[inputProps]
	)

	const fetchUsers = (query, callback) => {
		if (!query) return
		getAutocompleteUsers({
			variables: {
				username: query,
			},
		}).then((usersResult) => {
			callback(usersResult?.data?.getAutocompleteUsers)
		})
	}

	return (
		<MentionsInput
			value={inputProps?.content}
			onChange={handleChange}
			style={{
				top: '10px !important',
				borderRadius: '8px',
				div: {
					top: '10px !important',
					borderRadius: '8px',
				},
				suggestions: {
					list: {
						top: '10px !important',
						borderRadius: '8px',
					},
				},
			}}
			{...props}
		>
			<Mention
				trigger="@"
				data={fetchUsers}
				suggestionsPortalHost={UserSuggestionWrapper}
				renderSuggestion={(
					suggestion,
					search,
					highlightedDisplay,
					index,
					focused
				) => (
					<UserSuggestionWrapper>
						<SafeImage
							src={suggestion?.profilePicture}
							style={{
								width: '30px',
								height: '30px',
								borderRadius: '15px',
							}}
						/>
						<UserSuggestionTypography>
							{suggestion?.username}
						</UserSuggestionTypography>
					</UserSuggestionWrapper>
				)}
			/>
		</MentionsInput>
	)
}
