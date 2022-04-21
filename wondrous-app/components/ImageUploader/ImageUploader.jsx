import { useRef, useState } from 'react';
import { styled } from '@mui/material/styles';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import styles, {
  inputStyles,
  uploadButtonStyles,
  deleteButtonStyles,
  whiteTypographyStyles,
} from './ImageUploaderStyles';
import Image from 'next/image';

const HiddenInput = styled('input')(inputStyles);
const UploadButton = styled(Button)(uploadButtonStyles);
const DeleteButton = styled(Button)(deleteButtonStyles);
const WhiteTypography = styled(Typography)(whiteTypographyStyles);

const ImageUploader = ({ register, errors }) => {
  const [file, setFile] = useState();
  const hiddenFileInput = useRef(null);

  const triggerUpload = () => {
    hiddenFileInput.current.click();
  };

  const handleFormUpload = (event) => {
    const fileUploaded = event.target.files[0];
    setFile(fileUploaded);
  };

  const handleDelete = () => {
    setFile();
  };

  return (
    <Box display="flex">
      <HiddenInput type="file" {...register} ref={hiddenFileInput} onChange={handleFormUpload} />
      <Box position="relative" width={214} height={100} sx={styles.imageContainer}>
        {file ? (
          <Image src={URL.createObjectURL(file)} alt="preview" layout="fill" objectFit="cover" />
        ) : (
          <Box sx={styles.imagePlaceholder}>Upload a image to see the preview</Box>
        )}
      </Box>
      <Box>
        <Box display="flex" my={2}>
          {file && <DeleteButton onClick={handleDelete}>Delete Image</DeleteButton>}
          {file && <Box mr={2} />}
          <UploadButton onClick={triggerUpload}>Upload {file && 'New'} Image</UploadButton>
        </Box>
        <WhiteTypography>Max file size: 10mb</WhiteTypography>
      </Box>
      {errors?.file && <Typography>{errors.file && errors.file.message}</Typography>}
    </Box>
  );
};

export default ImageUploader;
