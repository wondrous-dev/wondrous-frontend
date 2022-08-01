import { makeUniqueId } from '@apollo/client/utilities';
import AddAPhotoIcon from 'components/Icons/addAPhoto.svg';
import { ComponentFieldWrapper, FieldLabel, FieldWrapper } from 'components/OnboardingDao/styles';
import { ImageUpload } from 'components/Settings/imageUpload';
import { useField } from 'formik';
import { useState } from 'react';
import { handleImageFile, uploadMedia } from 'utils/media';
import { AddPhotoIconWrapper, HeaderText, HeaderWrapper, ImageWrapper, LogoUpload, SafeImageWrapper } from './styles';

const useHandleImageChange = ({ setValue }) => {
  const [file, setFile] = useState(null);
  const handleChange = async (file) => {
    setFile(file);
    const imageFile = handleImageFile({ file, id: makeUniqueId('temp') });
    setValue(imageFile.filename);
    await uploadMedia(imageFile);
  };
  return { handleChange, file };
};

const ProfilePicture = (props) => {
  const { name } = props;
  const [field, _, { setValue }] = useField(name);
  const { handleChange, file } = useHandleImageChange({ setValue });
  const withImage = Boolean(file ?? field.value);
  return (
    <FieldWrapper>
      <FieldLabel>Logo</FieldLabel>
      <ImageUpload
        updateFilesCb={handleChange}
        imageName={field.name}
        LabelComponent={(props) => (
          <LogoUpload {...props}>
            {withImage &&
              (file ? (
                <ImageWrapper width="80px" height="80px" alt={props.label} src={URL?.createObjectURL(file)} />
              ) : (
                <SafeImageWrapper width="80px" height="80px" alt={props.label} useNextImage={true} src={field.value} />
              ))}
            <AddPhotoIconWrapper withImage={withImage}>
              <AddAPhotoIcon />
            </AddPhotoIconWrapper>
          </LogoUpload>
        )}
      />
    </FieldWrapper>
  );
};

const HeaderPicture = (props) => {
  const { name } = props;
  const [field, _, { setValue }] = useField(name);
  const { handleChange, file } = useHandleImageChange({ setValue });
  const withImage = Boolean(file ?? field.value);
  return (
    <FieldWrapper>
      <FieldLabel>Header</FieldLabel>
      <ImageUpload
        updateFilesCb={handleChange}
        imageName={field.name}
        LabelComponent={(props) => (
          <HeaderWrapper {...props}>
            {withImage &&
              (file ? (
                <ImageWrapper width="552px" height="80px" alt={props.label} src={URL?.createObjectURL(file)} />
              ) : (
                <SafeImageWrapper width="552px" height="80px" alt={props.label} src={field.value} />
              ))}
            <AddPhotoIconWrapper withImage={withImage}>
              <AddAPhotoIcon />
            </AddPhotoIconWrapper>
          </HeaderWrapper>
        )}
      />
      <HeaderText>Optimum size: 1358px x 160px</HeaderText>
    </FieldWrapper>
  );
};

const AddImages = (props) => {
  const { fields } = props;
  return (
    <ComponentFieldWrapper>
      <ProfilePicture {...fields.profilePicture} />
      <HeaderPicture {...fields.headerPicture} />
    </ComponentFieldWrapper>
  );
};

export default AddImages;
