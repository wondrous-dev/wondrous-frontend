/* eslint-disable import/prefer-default-export */
import React, { useRef, useState } from 'react';
import { SafeImage } from 'components/Common/Image';
import DefaultUserImage from 'components/Common/Image/DefaultUserImage';
import { AspectRatio } from 'react-aspect-ratio';
import { HEADER_ASPECT_RATIO } from 'utils/constants';
import {
  ImageUploadBlock,
  ImageUploadBlockActivitySection,
  ImageUploadBlockInput,
  ImageUploadBlockInputWrapper,
  LabelBlock,
  ImageUploadButton,
  ImageComponent,
} from './styles';

import AddPictureIcon from '../../public/images/icons/addPicture.svg';
import AvatarEditor from './AvatarEditor/AvatarEditor';

export function ImageUpload(props) {
  const { image, profileImage, title, updateFilesCb, imageType, avatarEditorTitle, LabelComponent, ...otherProps } =
    props;

  const imageInputField = useRef(null);
  const [files, setFiles] = useState({ file: null });

  const [openAvatarEditor, setOpenAvatarEditor] = useState(false);
  const [imageToEdit, setImageToEdit] = useState(null);
  const [editedImage, setEditedImage] = useState(null);

  const imageInputId = `upload-${title?.toLowerCase()}-image`;

  const addNewFiles = (newFiles) => {
    // eslint-disable-next-line no-restricted-syntax
    for (const file of newFiles) {
      // if (file.size <= maxFileSizeInBytes) {
      if (!otherProps.multiple) {
        return { file };
      }
      files[file.name] = file;
      // }
    }

    return { ...files };
  };

  const handleNewFileUpload = (e) => {
    const { files: newFiles } = e.target;

    if (newFiles.length) {
      const updatedFiles = addNewFiles(newFiles);
      setImageToEdit(updatedFiles.file);
    }
    setOpenAvatarEditor(true);
  };

  const handleNewFileUploadFromEditor = (file) => {
    if (!file) {
      setOpenAvatarEditor(false);
      return;
    }
    if (file.length) {
      const updatedFiles = addNewFiles(file);
      setFiles(updatedFiles);
      updateFilesCb(updatedFiles.file);
      setEditedImage(updatedFiles.file);
      setOpenAvatarEditor(false);
    }
  };

  const handleRemoveFile = () => {
    imageInputField.current.value = '';
    imageInputField.current.files = null;
    setFiles({ file: null });
    setEditedImage(null);
    updateFilesCb('');
  };

  const onCancelEditing = () => {
    imageInputField.current.value = '';
    imageInputField.current.files = null;
    setFiles({ file: null });
    setEditedImage(null);
    setOpenAvatarEditor(false);
  };

  const profilePictureStyle = {
    display: 'flex',
    width: '80px',
    height: '80px',
    borderRadius: '50%',
  };

  const renderEditedImage = () => {
    if (imageType === 'HEADER_IMAGE') {
      return (
        <AspectRatio ratio={HEADER_ASPECT_RATIO} style={{ maxHeight: 75 }}>
          <ImageComponent src={URL.createObjectURL(editedImage)} layout="fill" alt="header-pic" />
        </AspectRatio>
      );
    }

    return (
      <ImageComponent borderRadius src={URL.createObjectURL(editedImage)} width={80} height={80} alt="profile-pic" />
    );
  };

  const renderImage = () => {
    if (imageType === 'HEADER_IMAGE') {
      return (
        <AspectRatio ratio={HEADER_ASPECT_RATIO} style={{ maxHeight: 75 }}>
          <SafeImage src={image} width="100%" />;
        </AspectRatio>
      );
    }

    return (
      <SafeImage
        src={image}
        width={80}
        height={80}
        style={{ borderRadius: '50%' }}
        placeholderComp={<DefaultUserImage style={profilePictureStyle} />}
      />
    );
  };

  return (
    <ImageUploadBlock>
      <LabelBlock>{title}</LabelBlock>

      <ImageUploadBlockActivitySection>
        <ImageUploadBlockInputWrapper isIcon={imageType === 'ICON_IMAGE'}>
          <ImageUploadButton onClick={() => imageInputField.current.click()}>
            <AddPictureIcon />
          </ImageUploadButton>

          {editedImage ? renderEditedImage() : renderImage()}

          <ImageUploadBlockInput
            accept="image/*"
            id={imageInputId}
            type="file"
            ref={imageInputField}
            onChange={handleNewFileUpload}
          />
        </ImageUploadBlockInputWrapper>
      </ImageUploadBlockActivitySection>

      <AvatarEditor
        open={openAvatarEditor}
        originalImage={imageToEdit}
        onCancel={onCancelEditing}
        onSave={handleNewFileUploadFromEditor}
        clearInput={handleRemoveFile}
        openSelectFile={() => imageInputField.current.click()}
        imageType={imageType}
        title={avatarEditorTitle || 'Upload Image'}
      />
    </ImageUploadBlock>
  );
}
