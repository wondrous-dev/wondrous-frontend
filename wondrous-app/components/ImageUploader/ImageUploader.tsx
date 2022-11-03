import { useEffect, useRef, useState, useMemo } from 'react';
import head from 'lodash/head';
import Image from 'next/legacy/image';
import { styled } from '@mui/material/styles';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import { handleAddFile } from 'utils/media';
import { URL_REGEX } from 'utils/constants';

import { useLazyQuery } from '@apollo/client';
import { GET_PREVIEW_FILE } from 'graphql/queries';
import styles, {
  inputStyles,
  uploadButtonStyles,
  deleteButtonStyles,
  whiteTypographyStyles,
} from './ImageUploaderStyles';

const HiddenInput = styled('input')(inputStyles);
const UploadButton = styled(Button)(uploadButtonStyles);
const DeleteButton = styled(Button)(deleteButtonStyles);
const WhiteTypography = styled(Typography)(whiteTypographyStyles);

function ImageUploader({ errors, setValue, value }) {
  const [file, setFile] = useState(value);
  const hiddenFileInput = useRef(null);
  const [mediaUploads, setMediaUploads] = useState([]);
  const [fileUploadLoading, setFileUploadLoading] = useState(false);

  const [getPreviewFile, { data }] = useLazyQuery(GET_PREVIEW_FILE, {
    fetchPolicy: 'network-only',
  });

  const imgUrl = data?.getPreviewFile?.url;

  useEffect(() => {
    if (file && typeof file !== 'object') {
      getPreviewFile({
        variables: {
          path: file,
        },
      });
    }
  }, [imgUrl, file]);

  const triggerUpload = () => {
    hiddenFileInput.current.click();
  };

  const handleFormUpload = async (event) => {
    const fileUploaded = event.target.files[0];
    setFile(fileUploaded);

    handleAddFile({
      event,
      filePrefix: 'tmp/docs/',
      mediaUploads,
      setMediaUploads,
      setFileUploadLoading,
    });
  };

  useEffect(() => {
    setValue('previewPicture', head(mediaUploads)?.uploadSlug);
  }, [mediaUploads]);

  const handleDelete = () => {
    setFile(null);
  };

  const fileIsUrl = URL_REGEX.test(file);

  return (
    <Box display="flex">
      <HiddenInput type="file" ref={hiddenFileInput} onChange={handleFormUpload} />
      <Box position="relative" width={214} height={100} sx={styles.imageContainer}>
        {/* {renderImageDisplayer(file)} */}
        {!file && <Box sx={styles.imagePlaceholder}>Upload a image to see the preview</Box>}
        {file && imgUrl && <Image src={imgUrl} alt="preview" layout="fill" objectFit="cover" />}
        {file && typeof file === 'object' && (
          <Image src={URL.createObjectURL(file)} alt="preview" layout="fill" objectFit="cover" />
        )}
      </Box>
      <Box>
        <Box display="flex" my={2}>
          {file && <DeleteButton onClick={handleDelete}>Delete Image</DeleteButton>}
          {file && <Box mr={2} />}
          <UploadButton onClick={triggerUpload}>Upload {file && 'New'} Image</UploadButton>
        </Box>
        <WhiteTypography>Max file size: 10mb</WhiteTypography>
        {fileUploadLoading && <WhiteTypography>Loading</WhiteTypography>}
      </Box>
      {errors?.file && <Typography>{errors.file?.message}</Typography>}
    </Box>
  );
}

export default ImageUploader;
