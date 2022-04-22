import React, { useRef, useState } from 'react';
import {
  ImageUploadBlock,
  ImageUploadBlockActivitySection,
  ImageUploadBlockInputButton,
  ImageUploadBlockInputLabel,
  ImageUploadBlockInputWrapper,
  ImageUploadBlockRemoveButton,
  ImageUploadBlockUploadedImg,
  ImageUploadRecommendText,
  LabelBlock,
} from './styles';

export const ImageUpload = (props) => {
  const { image, imageWidth, imageHeight, imageName, updateFilesCb, ...otherProps } = props;

  const imageInputField = useRef(null);
  const [files, setFiles] = useState({ file: null });

  const imageInputId = `upload-${imageName.toLowerCase()}-image`;

  const imageWidthCondition = imageWidth < 560 ? `${imageWidth}px` : '100%';
  const imageHeightCondition = imageWidth < 560 ? `${imageHeight}px` : '90px';

  const uploadedImageSize = {
    width: imageWidthCondition,
    height: imageHeightCondition,
  };

  const addNewFiles = (newFiles) => {
    for (let file of newFiles) {
      // if (file.size <= maxFileSizeInBytes) {
      if (!otherProps.multiple) {
        return { file };
      }
      files[file.name] = file;
      // }
    }
    return { ...files };
  };

  const callUpdateFilesCb = (files) => {
    const filesAsArray = Object.values(files);
    const newFiles = otherProps.multiple ? filesAsArray : filesAsArray[0];
    if (newFiles) {
      updateFilesCb(newFiles);
    }
  };

  const handleNewFileUpload = (e) => {
    const { files: newFiles } = e.target;
    if (newFiles.length) {
      const updatedFiles = addNewFiles(newFiles);
      setFiles(updatedFiles);
      callUpdateFilesCb(updatedFiles);
    }
  };

  const handleRemoveFile = () => {
    imageInputField.current.value = '';
    setFiles({ file: null });
    updateFilesCb('');
  };

  return (
    <ImageUploadBlock>
      <LabelBlock>{imageName}</LabelBlock>
      <ImageUploadRecommendText>
        (Recommended {imageWidth} x {imageHeight})
      </ImageUploadRecommendText>
      <ImageUploadBlockActivitySection>
        <ImageUploadBlockInputWrapper>
          <ImageUploadBlockInputButton
            id={imageInputId}
            type="file"
            ref={imageInputField}
            onChange={handleNewFileUpload}
          />
          <ImageUploadBlockInputLabel for={imageInputId}>
            {image ? `${image.name} uploaded` : `Upload new ${imageName.toLowerCase()}`}
          </ImageUploadBlockInputLabel>
        </ImageUploadBlockInputWrapper>

        {image && (
          <>
            <ImageUploadBlockUploadedImg style={uploadedImageSize} src={URL.createObjectURL(image)} />
            <ImageUploadBlockRemoveButton onClick={handleRemoveFile}>Remove</ImageUploadBlockRemoveButton>
          </>
        )}
      </ImageUploadBlockActivitySection>
    </ImageUploadBlock>
  );
};
