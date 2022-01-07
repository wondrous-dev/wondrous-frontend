import { gql } from '@apollo/client'

export const GET_PRESIGNED_IMAGE_URL = gql`
	query GetPresignedImageUrl($filename: String!) {
		getPresignedImageUrl(filename: $filename) {
			url
		}
	}
`

export const GET_PRESIGNED_VIDEO_URL = gql`
	query GetPresignedVideoUrl($filename: String!) {
		getPresignedVideoUrl(filename: $filename) {
			url
		}
	}
`

export const GET_PREVIEW_IMAGE = gql`
	query GetPreviewImage($path: String!) {
		getPreviewImage(path: $path) {
			url
		}
	}
`
