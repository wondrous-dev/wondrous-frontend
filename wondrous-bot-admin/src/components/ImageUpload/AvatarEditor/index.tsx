import { useEffect, useRef, useState } from 'react';

import max from 'lodash/max';
import DefaultAvatarEditor from 'react-avatar-editor';

import { AvatarEditorTypes } from 'types/assets';
import {
  ButtonIconWrapper,
  SharedSecondaryButton,
} from 'components/Shared/styles';
import Modal from 'components/Shared/Modal';
import { Box, Grid } from '@mui/material';
import { pinkColors } from 'utils/theme/colors';
import ReplaceIcon from 'components/Icons/ReplaceIcon';
import DeleteIcon from 'components/Icons/Delete';
import { Label } from 'components/CreateTemplate/styles';
import { ZoomIn, ZoomOut } from '@mui/icons-material';

type Props = {
  originalImage: string | File;
  open: boolean;
  onCancel: () => any;
  onSave: (file: any) => void;
  openSelectFile: () => void;
  clearInput: () => void;
  imageType: AvatarEditorTypes;
  title: string;
  recommendationText: string;
};

interface ImageViewerObjectProps {
  width: number;
  height: number;
  borderRadius: number;
}

const AvatarEditor = ({
  originalImage,
  open,
  onCancel,
  onSave,
  imageType,
  openSelectFile,
  clearInput,
  title,
  recommendationText,
}: Props) => {
  const [image, setImage] = useState<string | File>(originalImage); // image can be URL or File.
  const [scale, setScale] = useState(1.0);
  const [angle, setAngle] = useState(0);
  const editorRef = useRef(null);

  const imageViewerSize: Record<Props['imageType'], ImageViewerObjectProps> = {
    HEADER_IMAGE: {
      width: 550,
      height: 78,
      borderRadius: 0,
    },
    ICON_IMAGE: {
      width: 250,
      height: 250,
      borderRadius: 250,
    },
  };

  useEffect(() => {
    setScale(1.0);
    setAngle(0);
  }, [image]);

  useEffect(() => {
    if (originalImage instanceof Blob) {
      setImage(window.URL.createObjectURL(originalImage));
    } else {
      setImage(originalImage);
    }
  }, [originalImage, open]);

  const defaultRotateAngle = 10;
  const defaultZoomScale = 0.1;
  const maxZoomOut = 1.0;

  // Event handlers
  const onAction = (action) => {
    switch (action) {
      case 'zoom_in':
        setScale(scale + defaultZoomScale);
        break;

      case 'zoom_out':
        setScale(max([scale - defaultZoomScale, maxZoomOut]) || maxZoomOut);
        break;

      case 'rotate_right':
        setAngle(angle + defaultRotateAngle);
        break;

      case 'rotate_left':
        setAngle(angle - defaultRotateAngle);
        break;

      case 'crop':
        break;

      default:
        throw new Error('Unknown action');
    }
  };

  const onClearInput = () => {
    setImage(null);
    clearInput();
  };

  const handleSave = () => {
    if (!image) {
      onSave(null);
      return;
    }
    const canvas = editorRef.current?.getImage().toDataURL();

    fetch(canvas)
      .then((res) => res.blob())
      .then((blob) => {
        const file = new File([blob], `profile-pic.${blob.type.substring(6)}`, {
          type: blob.type,
        });
        onSave([file]);
      });
  };

  return (
    <Modal
      open={open}
      title='Upload image'
      onClose={onCancel}
      maxWidth={600}
      footerLeft={
        <SharedSecondaryButton reverse onClick={onCancel}>
          Cancel
        </SharedSecondaryButton>
      }
      footerRight={
        <SharedSecondaryButton onClick={handleSave}>
          Confirm image
        </SharedSecondaryButton>
      }
    >
      <Grid container direction='column' alignItems='center' gap='20px'>
        <Box display='flex' justifyContent='center' alignItems='center'>
          <DefaultAvatarEditor
            styles={{ borderRadius: 6 }}
            ref={editorRef}
            image={image}
            width={imageViewerSize[imageType].width}
            height={imageViewerSize[imageType].height}
            borderRadius={imageViewerSize[imageType].borderRadius}
            scale={scale}
            rotate={angle}
            border={[0, 20]}
          />
        </Box>
        <Grid
          display='flex'
          width='100%'
          alignItems='center'
          justifyContent='space-between'
          gap='8px'
        >
          <Box display='flex' gap='8px'>
            <SharedSecondaryButton
              borderRadius='6px'
              onClick={openSelectFile}
              background={pinkColors.pink50}
            >
              <ReplaceIcon />
              Replace image
            </SharedSecondaryButton>
            <SharedSecondaryButton
              borderRadius='6px'
              onClick={onClearInput}
              background={pinkColors.pink50}
            >
              <DeleteIcon />
              Delete image
            </SharedSecondaryButton>
          </Box>
          <Box display='flex' gap='8px'>
            <ButtonIconWrapper onClick={() => onAction('zoom_in')}>
              <ZoomIn
                sx={{
                  color: 'black',
                }}
              />
            </ButtonIconWrapper>
            <ButtonIconWrapper onClick={() => onAction('zoom_out')}>
              <ZoomOut
                sx={{
                  color: 'black',
                }}
              />
            </ButtonIconWrapper>
          </Box>
        </Grid>
        <Box width='100%'>
          <Label>Recommended: 800 x 800px</Label>
        </Box>
      </Grid>
    </Modal>
  );
};

export const AVATAR_EDITOR_TYPES: Record<AvatarEditorTypes, AvatarEditorTypes> =
  {
    HEADER_IMAGE: 'HEADER_IMAGE',
    ICON_IMAGE: 'ICON_IMAGE',
  };

export default AvatarEditor;
