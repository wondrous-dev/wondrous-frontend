import React, { useState } from 'react';

import FileUpload from '../../Common/FileUpload/FileUpload';
import { CreateFormMainBlockTitle } from '../styles';

import {
  CreateFormPickHeaderImage,
  CreateFormPickHeaderImageContainer,
  CreateFormPickHeaderImageSection,
  CreateFormPickHeaderImageTextBlock,
  CreateFormPickHeaderImageTextBlockSubTitle,
  CreateFormPickHeaderImageTextBlockTitle,
  CreateFormPickHeaderImageUploadBlock,
  CreateFormPickHeaderImageUploadBlockContainer,
  CreateFormPickHeaderImageUploadBlockIcon,
} from './styles';

const HeaderImage = () => {
  const [image, setImage] = useState('');

  return (
    <CreateFormPickHeaderImageSection>
      <CreateFormMainBlockTitle>Header Image</CreateFormMainBlockTitle>
      <CreateFormPickHeaderImageContainer>
        {image && <CreateFormPickHeaderImage src={URL.createObjectURL(image)} />}

        <CreateFormPickHeaderImageUploadBlock>
          <FileUpload updateFilesCb={setImage} />
          <CreateFormPickHeaderImageUploadBlockContainer>
            <CreateFormPickHeaderImageUploadBlockIcon />
            <CreateFormPickHeaderImageTextBlock>
              <CreateFormPickHeaderImageTextBlockTitle>
                <span>Upload an image</span> or drag n’ drop it here.
              </CreateFormPickHeaderImageTextBlockTitle>
              <CreateFormPickHeaderImageTextBlockSubTitle>
                Reccomended 1350 x 259px
              </CreateFormPickHeaderImageTextBlockSubTitle>
            </CreateFormPickHeaderImageTextBlock>
          </CreateFormPickHeaderImageUploadBlockContainer>
        </CreateFormPickHeaderImageUploadBlock>
      </CreateFormPickHeaderImageContainer>
    </CreateFormPickHeaderImageSection>
  );
};

export default HeaderImage;
