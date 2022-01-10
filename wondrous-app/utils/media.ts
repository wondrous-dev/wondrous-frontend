import apollo from '../services/apollo'
import { GET_PRESIGNED_IMAGE_URL } from '../graphql/queries/media'

export const uploadMedia = async ({ filename, fileType, file }) => {
	try {
		const apolloResult = await apollo.query({
			query: GET_PRESIGNED_IMAGE_URL,
			variables: {
				filename,
			},
		})
		const apiUrl = apolloResult.data.getPresignedImageUrl.url
		// TODO: parse filetype
		const uploadResponse = await fetch(apiUrl, {
			method: 'PUT',
			body: file,
			headers: {
				Accept: 'application/json',
				'Content-Type': `image/${fileType}`,
			},
		})
		// console.log('uploadResponse', uploadResponse)
	} catch (error) {
		console.log('error', JSON.stringify(error, null, 2))
	}
}

export const getFilenameAndType = (result) => {
	const uriArr = result.split('/')
	const filename = uriArr[uriArr.length - 1]
	const fileType = filename.substring(filename.lastIndexOf('.') + 1)
	return {
		filename,
		fileType,
	}
}

export const getVideoFileType = (result) => {
	const uriArr = result.split('ext=')
	const fileType = uriArr[uriArr.length - 1]
	return fileType
}
