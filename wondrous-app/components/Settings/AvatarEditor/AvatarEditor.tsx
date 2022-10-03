import { useEffect, useRef, useState } from 'react';

import max from 'lodash/max';
import DefaultAvatarEditor from 'react-avatar-editor';

import CloseIcon from 'public/images/icons/close.svg';

import { Button } from 'components/Common/button';
import ZoomInIcon from 'public/images/icons/zoomIn.svg';
import ZoomOutIcon from 'public/images/icons/zoomOut.svg';
import ReplaceIcon from 'public/images/icons/replace.svg';
import RemoveIcon from 'public/images/icons/remove.svg';

import { AvatarEditorTypes } from 'types/assets';
import * as Styles from './AvatarEditorStyles';
import { ImageUploadRecommendText } from './AvatarEditorStyles';

type Props = {
  originalImage: string | File;
  open: boolean;
  onCancel: () => any;
  onSave: (file: any) => void;
  openSelectFile: () => void;
  clearInput: () => void;
  imageType: AvatarEditorTypes;
  title: string;
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
        const file = new File([blob], `profile-pic.${blob.type.substring(6)}`, { type: blob.type });
        onSave([file]);
      });
  };

  return (
    <Styles.Container open={open}>
      <Styles.Header>
        <Styles.Title>{title}</Styles.Title>
        <Styles.CloseButton onClick={onCancel}>
          <CloseIcon />
        </Styles.CloseButton>
      </Styles.Header>
      <Styles.Content>
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

        <Styles.ToolButtonsContainer>
          <Styles.LeftButtons>
            <Styles.ToolButton onClick={openSelectFile}>
              <ReplaceIcon />
              Replace Image
            </Styles.ToolButton>
            <Styles.ToolButton onClick={onClearInput}>
              <RemoveIcon />
              Delete Image
            </Styles.ToolButton>
          </Styles.LeftButtons>

          <Styles.RightButtons>
            <Styles.RightToolButton onClick={() => onAction('zoom_in')}>
              <ZoomInIcon />
            </Styles.RightToolButton>

            <Styles.RightToolButton onClick={() => onAction('zoom_out')}>
              <ZoomOutIcon />
            </Styles.RightToolButton>
          </Styles.RightButtons>
        </Styles.ToolButtonsContainer>
        <Styles.RecomendationContainer>
          {/* this shouldn't be hardcoded */}
          <ImageUploadRecommendText>Recommended: 1200 x 170px</ImageUploadRecommendText>
        </Styles.RecomendationContainer>
      </Styles.Content>

      <Styles.Footer>
        <Styles.CancelButton onClick={onCancel}>Cancel</Styles.CancelButton>

        <Button highlighted onClick={handleSave}>
          Confirm Image
        </Button>
      </Styles.Footer>
    </Styles.Container>
  );
};

export default AvatarEditor;
