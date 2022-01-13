import React from 'react'
import {
	PostMediaAudio,
	PostMediaImage,
	PostMediaUnsuported,
	PostMediaVideo,
	PostTaskImageBlock,
} from './styles'

export const PostMediaItem = (props) => {
	const { id = '', type = '', url = '', full = false } = props

	const mediaContentComponents = {
		image: <PostMediaImage src={url} height={full ? '344px' : '182px'} />,
		video: (
			<PostMediaVideo
				url={url}
				config={{
					youtube: {
						playerVars: {
							controls: 0,
						},
					},
				}}
				width="100%"
			/>
		),
		audio: (
			<PostMediaAudio
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
		<PostMediaUnsuported>Media Not supported.</PostMediaUnsuported>
	)

	return mediaContent
}

const PostMedia = (props) => {
	const { media = [] } = props
	const full = media.length == 1

	return (
		<PostTaskImageBlock>
			{media.map((item, i) => (
				<PostMediaItem
					key={'media-task-' + i}
					type={item.type}
					url={item.url}
					full={full}
				/>
			))}
		</PostTaskImageBlock>
	)
}

export default PostMedia
