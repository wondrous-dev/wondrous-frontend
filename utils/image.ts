
import * as FileSystem from 'expo-file-system'

import apollo from '../services/apollo'
import { GET_PRESIGNED_IMAGE_URL } from '../graphql/queries/media'

export const uploadMedia = async ({ filename, localUrl, fileType }) => {
  try {
    const apolloResult = await apollo.query({
      query: GET_PRESIGNED_IMAGE_URL,
      variables: {
        filename
      }
    })
    const apiUrl = apolloResult.data.getPresignedImageUrl.url
    // TODO: parse filetype
    const uploadResponse = await FileSystem.uploadAsync(apiUrl, localUrl, {
      httpMethod: "PUT",
      headers: {
        "Accept": "application/json",
        "Content-Type": `image/${fileType}`
      }
    })
    // console.log('uploadResponse', uploadResponse)
  } catch (error) {
    console.log("error", JSON.stringify(error, null, 2))
  }
}