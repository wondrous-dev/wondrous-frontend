import React from 'react'
import regexifyString from 'regexify-string'
import { Typography } from '@material-ui/core'
import { Blue400 } from '../theme/colors'

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
				const { id, name, trigger } = mentionExp.groups
				if (simple) {
					return trigger + name
				}
				return (
					<Typography
						style={{
							color: Blue400,
							...textStyle,
						}}
						onClick={() => {
							router.replace(`/profile/${name}/boards`)
						}}
					>
						{`@${name}`}
					</Typography>
				)
			} else if (httpMatch) {
				return (
					<Typography
						style={{
							color: Blue400,
							...textStyle,
						}}
						onClick={() => {
							if (window) {
								window.open(match, '_blank').focus()
							}
						}}
					>
						{match}
					</Typography>
				)
			} else if (urlMatch) {
				return (
					<Typography
						style={{
							color: Blue400,
							...textStyle,
						}}
						onClick={() => {
							if (window) {
								window.open(`https://${match}`, '_blank').focus()
							}
						}}
					>
						{`https://${match}`}
					</Typography>
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
	return ''
}
