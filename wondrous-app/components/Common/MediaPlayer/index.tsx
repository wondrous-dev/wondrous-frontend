import React from 'react'
import {
	TaskMediaWrapper,
	TaskImage,
	TaskAudio,
	TaskVideo,
	TaskMediaUnsuported,
} from './styles'

export const TaskMedia = (props) => {
	const { id = '', media = {}, } = props
	const { type = '', url = '' } = media

	return (
		<TaskMediaWrapper key={'media-task-' + id}>
			{type == 'image' ? (
				<TaskImage src={url} />
			) : type == 'video' ? (
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
			) : type == 'audio' ? (
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
			) : (
				<TaskMediaUnsuported>Medua Not supported.</TaskMediaUnsuported>
			)}
		</TaskMediaWrapper>
	)
}
