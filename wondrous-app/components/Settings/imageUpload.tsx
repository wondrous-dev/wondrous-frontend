import React, { useRef, useState } from 'react';
import { SafeImage } from 'components/Common/Image';
import DefaultUserImage from 'components/Common/Image/DefaultUserImage';
import { AspectRatio } from 'react-aspect-ratio';
import { HEADER_ASPECT_RATIO } from 'utils/constants';
import { CloseIcon } from 'components/Common/BoardFilters/styles';
import { AVATAR_EDITOR_TYPES } from 'constants/avatarEditor';
import { ImageKeyEnums } from 'types/common';
import { AvatarEditorTypes } from 'types/assets';
import {
  ImageUploadBlock,
  ImageUploadBlockActivitySection,
  ImageUploadBlockInput,
  ImageUploadBlockInputWrapper,
  LabelBlock,
  ImageUploadButton,
  ImageComponent,
  ImageUploadBlockActionIcons,
  ToolButton,
  ImageUploadButtonWrapper,
} from './styles';
import AvatarEditor from './AvatarEditor/AvatarEditor';

import AddPictureIcon from '../../public/images/icons/addPicture.svg';
import ReplaceIcon from '../../public/images/icons/replace.svg';
import RemoveIcon from '../../public/images/icons/remove.svg';

interface Props {
  image?: any;
  profileImage?: any;
  title: string;
  updateFilesCb: any;
  imageType: AvatarEditorTypes;
  avatarEditorTitle?: string;
  LabelComponent?: React.ReactNode;
  onDeleteImage?: (imageType: ImageKeyEnums) => void;
  onReplace?: (image: any) => void;
  multiple?: boolean;
}

export default function ImageUpload(props: Props) {
  const { image, title, updateFilesCb, imageType, avatarEditorTitle, onDeleteImage, onReplace, multiple } = props;

  const imageInputField = useRef(null);
  const [files, setFiles] = useState({ file: null });

  const [openAvatarEditor, setOpenAvatarEditor] = useState(false);
  const [imageToEdit, setImageToEdit] = useState(null);
  const [editedImage, setEditedImage] = useState(null);
  const imageInputId = `upload-${title?.toLowerCase()}-image`;
  const recommendationText =
    imageType === AVATAR_EDITOR_TYPES.ICON_IMAGE ? 'Recommended: 800 x 800px' : 'Recommended: 1600 x 188px';

  const addNewFiles = (newFiles) => {
    // eslint-disable-next-line no-restricted-syntax
    for (const file of newFiles) {
      // if (file.size <= maxFileSizeInBytes) {
      if (!multiple) {
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
    const imageTypeToDelete =
      imageType === AVATAR_EDITOR_TYPES.ICON_IMAGE ? ImageKeyEnums.profilePicture : ImageKeyEnums.headerPicture;
    onDeleteImage(imageTypeToDelete);
  };

  const onCancelEditing = () => {
    imageInputField.current.value = '';
    imageInputField.current.files = null;
    setFiles({ file: null });
    setEditedImage(null);
    setOpenAvatarEditor(false);
  };

  const handleReplaceImage = () => {
    onReplace?.(image);
    imageInputField.current.click();
  };

  const profilePictureStyle = {
    display: 'flex',
    width: '80px',
    height: '80px',
    borderRadius: '50%',
  };

  const renderEditedImage = () => {
    if (imageType === AVATAR_EDITOR_TYPES.HEADER_IMAGE) {
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
    if (imageType === AVATAR_EDITOR_TYPES.HEADER_IMAGE) {
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
        <ImageUploadBlockInputWrapper isIcon={imageType === AVATAR_EDITOR_TYPES.ICON_IMAGE}>
          <ImageUploadButtonWrapper>
            {imageType !== AVATAR_EDITOR_TYPES.ICON_IMAGE ||
            (imageType === AVATAR_EDITOR_TYPES.ICON_IMAGE && !image) ? (
              <ImageUploadButton onClick={() => imageInputField.current.click()}>
                <AddPictureIcon />
              </ImageUploadButton>
            ) : null}
            {imageType !== AVATAR_EDITOR_TYPES.ICON_IMAGE && image ? (
              <ImageUploadButton marginLeft="14px" onClick={handleRemoveFile}>
                <CloseIcon />
              </ImageUploadButton>
            ) : null}
          </ImageUploadButtonWrapper>
          {editedImage ? renderEditedImage() : renderImage()}
          <ImageUploadBlockInput
            accept="image/*"
            id={imageInputId}
            type="file"
            ref={imageInputField}
            onChange={handleNewFileUpload}
          />
        </ImageUploadBlockInputWrapper>
        {imageType === AVATAR_EDITOR_TYPES.ICON_IMAGE && image ? (
          <ImageUploadBlockActionIcons>
            <ToolButton onClick={handleReplaceImage}>
              <ReplaceIcon />
            </ToolButton>
            <ToolButton onClick={handleRemoveFile}>
              <RemoveIcon />
            </ToolButton>
          </ImageUploadBlockActionIcons>
        ) : null}
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
        recommendationText={recommendationText}
      />
    </ImageUploadBlock>
  );
}
