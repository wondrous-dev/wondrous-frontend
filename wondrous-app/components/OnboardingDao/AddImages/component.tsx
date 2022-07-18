import AddAPhotoIcon from 'components/Icons/addAPhoto.svg';
import { ComponentFieldWrapper, FieldLabel, FieldWrapper } from 'components/OnboardingDao/styles';
import { ImageUpload } from 'components/Settings/imageUpload';
import { useField, useFormikContext } from 'formik';
import { AddPhotoIconWrapper, HeaderText, HeaderWrapper, ImageWrapper, LogoUpload } from './styles';

const ProfilePicture = (props) => {
  const [field] = useField(props.name);
  const { setFieldValue } = useFormikContext();
  const withImage = Boolean(field.value);
  return (
    <FieldWrapper>
      <FieldLabel>Logo</FieldLabel>
      <ImageUpload
        updateFilesCb={(file) => setFieldValue(props.name, file)}
        LabelComponent={(props) => (
          <LogoUpload {...props}>
            <ImageWrapper withImage={withImage} src={URL?.createObjectURL(field.value)} />
            <AddPhotoIconWrapper withImage={withImage}>
              <AddAPhotoIcon />
            </AddPhotoIconWrapper>
          </LogoUpload>
        )}
      />
    </FieldWrapper>
  );
};

const AddImages = (props) => {
  return (
    <ComponentFieldWrapper>
      <ProfilePicture {...props.fields.profilePicture} />
      <FieldWrapper>
        <FieldLabel>Header</FieldLabel>
        <HeaderWrapper>
          <AddPhotoIconWrapper>
            <AddAPhotoIcon />
          </AddPhotoIconWrapper>
        </HeaderWrapper>
        <HeaderText>Optimum size: 1358px x 160px</HeaderText>
      </FieldWrapper>
    </ComponentFieldWrapper>
  );
};

export default AddImages;
