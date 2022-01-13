import React from 'react'
import { SafeImage } from '../Image'
import {
	TaskMediaWrapper,
	TaskImage,
	TaskAudio,
	TaskVideo,
	TaskMediaUnsuported,
} from './styles'

export const TaskMedia = (props) => {
	const { id = '', media = {} } = props
	const { type = '', url = '' } = media

	const mediaContentComponents = {
		image: (
			<SafeImage
				style={{
					borderRadius: '6px',
				}}
				src={url}
			/>
		),
		video: (
			<TaskVideo
				url={url}
				config={{
					youtube: {
						playerVars: {
							controls: 0,
						},
					},
				}}
				width="100%"
				height="100%"
			/>
		),
		audio: (
			<TaskAudio
				url={url}
				config={{
					soundcloud: {
						show_artwork: false,
						download: false,
						sharing: false,
					},
				}}
				width="100%"
				height="54px"
			/>
		),
	}
	const mediaContent = mediaContentComponents[type] || (
		<TaskMediaUnsuported>Media Not supported.</TaskMediaUnsuported>
	)

	return (
		<TaskMediaWrapper key={'media-task-' + id}>{mediaContent}</TaskMediaWrapper>
	)
}
