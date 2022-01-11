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
import { Blue400, White } from '../../theme/colors'

const renderUserSuggestion = (entry) => {
	// console.log('entry', entry)
	return <></>
}

export const TextInput = (props) => {
	const [name, setName] = useState('')
	const inputProps = useTextInput()
	// const getOrgUsers = useLazyQuery()
	// Only return a list of org users if an org is set
	const [orgUsers, setOrgUsers] = useState([])
	const handleChange = useCallback(
		(event, newValue, newPlainTextValue, mentions) => {
			if (inputProps?.onChange) {
				inputProps?.onChange(event)
			}
		},
		[inputProps]
	)

	useEffect(() => {
		if (inputProps?.orgId) {
		}
	}, [inputProps?.orgId])
	const fetchData = (query, callback) => {
		return inputProps?.list.filter((user) => user?.username?.startsWith(query))
	}

	const style = {
		suggestions: {
			top: '16px',
			borderRadius: '8px',
			list: {
				borderRadius: '8px',
				background: 'linear-gradient(180deg, #1e1e1e 0%, #141414 100%)',
				boxShadow: '0px 34px 84px rgba(0, 0, 0, 0.55)',
			},
			item: {},
		},
	}
	return (
		<MentionsInput
			value={inputProps?.content}
			onChange={handleChange}
			{...props}
			style={{
				...props?.style,
				...style,
			}}
		>
			<Mention
				trigger="@"
				data={fetchData}
				displayTransform={(id, display) => `@${display}`}
				regex={/@\[(.*?)]\((.*?)\)/}
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
