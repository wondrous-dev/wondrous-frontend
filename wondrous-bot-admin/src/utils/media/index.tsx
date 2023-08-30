import apollo from 'services/apollo';
import { GET_PRESIGNED_IMAGE_URL, GET_PRESIGNED_TELEGRAM_IMAGE_URL } from 'graphql/queries';
import { makeUniqueId } from '@apollo/client/utilities';

import {
  IMAGE_FILE_EXTENSIONS_TYPE_MAPPING,
  VIDEO_FILE_EXTENSIONS_TYPE_MAPPING,
} from 'utils/constants';

export const uploadMedia = async ({ filename, fileType, file }) => {
  try {
    const apolloResult = await apollo.query({
      query: GET_PRESIGNED_IMAGE_URL,
      variables: {
        filename,
      },
    });
    const apiUrl = apolloResult.data.getPresignedFileUrl.url;
    // TODO: parse filetype
    const uploadResponse = await fetch(apiUrl, {
      method: 'PUT',
      body: file,
    });
    // console.log('uploadResponse', uploadResponse, apiUrl)
  } catch (error) {
    console.error('error', JSON.stringify(error, null, 2));
  }
};

export const uploadTelegramMedia = async ({ filename, fileType, file }) => {
  const telegramUserId = (window as any)?.Telegram?.WebApp?.initDataUnsafe?.user?.id?.toString();
  try {
    const apolloResult = await apollo.query({
      query: GET_PRESIGNED_TELEGRAM_IMAGE_URL,
      variables: {
        filename,
        telegramUserId
      },
    });
    const apiUrl = apolloResult.data.getTelegramPresignedFileUrl.url;
    // TODO: parse filetype
    const uploadResponse = await fetch(apiUrl, {
      method: 'PUT',
      body: file,
    });
    // console.log('uploadResponse', uploadResponse, apiUrl)
  } catch (error) {
    console.log(error, 'error')
    console.error('error', JSON.stringify(error, null, 2));
  }
};

export const getFilenameAndType = (result) => {
  const uriArr = result.split('/');
  const filename = uriArr[uriArr.length - 1];
  const fileType = filename.substring(filename.lastIndexOf('.') + 1);
  return {
    filename,
    fileType,
  };
};

export const getVideoFileType = (result) => {
  const uriArr = result.split('ext=');
  const fileType = uriArr[uriArr.length - 1];
  return fileType;
};

export const handleAddFile = async (props) => {
  const {
    event,
    filePrefix,
    setMediaUploads,
    mediaUploads,
    setFileUploadLoading,
  } = props;
  const file = event.target.files[0];
  if (file) {
    if (setFileUploadLoading) {
      setFileUploadLoading(true);
    }
    const fileName = file?.name;
    // get image preview
    const { fileType, filename } = getFilenameAndType(fileName);
    const fileUrl = filePrefix + filename;
    await uploadMedia({ filename: fileUrl, fileType, file });
    const fileToAdd = {
      uploadSlug: fileUrl,
      name: filename,
      type: '',
    };
    if (fileType in IMAGE_FILE_EXTENSIONS_TYPE_MAPPING) {
      fileToAdd.type = 'image';
    } else if (fileType in VIDEO_FILE_EXTENSIONS_TYPE_MAPPING) {
      fileToAdd.type = 'video';
    } else {
      fileToAdd.type = 'file';
    }
    setMediaUploads([...mediaUploads, fileToAdd]);
    if (setFileUploadLoading) {
      setFileUploadLoading(false);
    }
    return fileToAdd;
  }
};

export const handleImageFile = ({ file, id }) => {
  if (!file) return { filename: null, fileType: null, file: null };
  const fileName = file?.name;
  // get image preview
  const { fileType, filename } = getFilenameAndType(fileName);
  const imageFile = `tmp/${id}/${filename}`;
  return { filename: imageFile, fileType, file };
};

export const transformMediaFormat = (media) =>
  media &&
  media.map((item) => ({
    uploadSlug: item?.slug,
    type: item?.type,
    name: item?.name,
  }));

export function isImage(url, mediaType) {
  if (mediaType?.includes('image')) {
    return true;
  }
  return /\.(jpg|jpeg|png|webp|avif|gif|svg)$/.test(url);
}

export function isVideo(url, mediaType) {
  if (mediaType?.includes('video')) {
    return true;
  }
  return /\.(mp4|mov|avi|wmv|flv|webm|mkv|m4v)$/.test(url);
}

export function extractFilename(name, url) {
  if(name) return name;
  const urlParts = url.split('/');
  return urlParts[urlParts.length - 1];
}

export const transformAndUploadMedia = async ({ file }) => {
  if (!file) return null;

  const imageFile = handleImageFile({ file, id: makeUniqueId('temp') });
  await uploadMedia(imageFile);
  return { ...imageFile };
};

export const transformAndUploadTelegramMedia = async ({ file }) => {
  if (!file) return null;

  const imageFile = handleImageFile({ file, id: makeUniqueId('temp') });
  await uploadTelegramMedia(imageFile);
  return { ...imageFile };
};
