import React from 'react'
import { SafeImage } from '../../Common/Image'
import DeleteIcon from '../../Icons/delete'
import { Filename, MediaItemWrapper } from './styles'

export const MediaItem = (props) => {
	const { mediaItem, setMediaUploads, mediaUploads } = props
	return (
		<MediaItemWrapper>
			{mediaItem?.type === 'image' && (
				<SafeImage
					src={mediaItem?.uploadSlug}
					style={{
						borderRadius: '4px',
						position: 'relative',
						left: '0',
						height: '40px',
					}}
				/>
			)}
			<Filename>{mediaItem?.name}</Filename>
			<DeleteIcon
				onClick={() => {
					const newMediaUploads = mediaUploads.filter(
						(mediaUpload) => mediaUpload.uploadSlug !== mediaItem?.uploadSlug
					)
					setMediaUploads(newMediaUploads)
				}}
			/>
		</MediaItemWrapper>
	)
}
