import React from 'react'
import regexifyString from 'regexify-string'
import { Typography } from '@material-ui/core'
import { HighlightBlue } from '../theme/colors'

export const renderMentionString = (props) => {
	const { content, textStyle, simple, router } = props
	const urlRegex =
		/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi
	const httpRegex =
		/https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{2,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
	const final = regexifyString({
		pattern:
			/@\[(.*?)]\((.*?)\)|([-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?)|(https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*))/gi,
		decorator: (match, index) => {
			const mentionExp = /@\[(.*?)]\((.*?)\)/.exec(match)
			const urlMatch = urlRegex.exec(match)
			const httpMatch = httpRegex.exec(match)
			if (mentionExp) {
				const [original, username, id] = mentionExp
				if (simple) {
					return '@' + username
				}
				return (
					<span
						style={{
							color: HighlightBlue,
							marginRight: '4px',
							...textStyle,
						}}
						onClick={() => {
							router.replace(`/profile/${username}/boards`)
						}}
					>
						{`@${username}`}
					</span>
				)
			} else if (httpMatch) {
				return (
					<a
						href={match}
						target="_blank"
						rel="noreferrer"
						style={{
							color: HighlightBlue,
							marginRight: '4px',
							...textStyle,
						}}
					>
						{match}
					</a>
				)
			} else if (urlMatch) {
				return (
					<a
						href={`https://${match}`}
						target="_blank"
						rel="noreferrer"
						style={{
							color: HighlightBlue,
							marginRight: '4px',
							...textStyle,
						}}
					>
						{`https://${match}`}
					</a>
				)
			} else {
				return match
			}
		},
		input: content,
	})
	if (simple) {
		return final.join('')
	}
	return final
}
