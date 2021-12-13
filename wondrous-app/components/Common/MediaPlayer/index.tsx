import React from 'react'
import {
	TaskMediaWrapper,
	TaskImage,
	TaskAudio,
	TaskVideo,
	TaskMediaUnsuported,
} from './styles'

export const TaskMedia = (props) => {
	let mediaType = props.media ? props.media.type : ''

	return (
		<TaskMediaWrapper key={'media-task-' + props.id}>
			{mediaType == 'image' ? (
				<TaskImage src={props.media.url} />
			) : mediaType == 'video' ? (
				<TaskVideo
					url={props.media.url}
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
			) : mediaType == 'audio' ? (
				<TaskAudio
					url={props.media.url}
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
