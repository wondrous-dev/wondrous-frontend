import AddAPhotoIcon from 'components/Icons/addAPhoto.svg';
import { ComponentFieldWrapper, FieldLabel, FieldWrapper } from 'components/OnboardingDao/styles';
import { ImageUpload } from 'components/Settings/imageUpload';
import { useField } from 'formik';
import { AddPhotoIconWrapper, HeaderText, HeaderWrapper, ImageWrapper, LogoUpload } from './styles';

const ProfilePicture = ({ ...props }) => {
  const [field, _, helpers] = useField(props.name);
  const withImage = Boolean(field.value);
  return (
    <FieldWrapper>
      <FieldLabel>Logo</FieldLabel>
      <ImageUpload
        updateFilesCb={(file) => helpers.setValue(file)}
        imageName={field.name}
        LabelComponent={(props) => (
          <LogoUpload {...props}>
            {withImage && (
              <ImageWrapper width="80px" height="80px" alt={props.label} src={URL?.createObjectURL(field.value)} />
            )}
            <AddPhotoIconWrapper withImage={withImage}>
              <AddAPhotoIcon />
            </AddPhotoIconWrapper>
          </LogoUpload>
        )}
      />
    </FieldWrapper>
  );
};

const HeaderPicture = ({ ...props }) => {
  const [field, _, helpers] = useField(props.name);
  const withImage = Boolean(field.value);
  return (
    <FieldWrapper>
      <FieldLabel>Header</FieldLabel>
      <ImageUpload
        updateFilesCb={(file) => helpers.setValue(file)}
        imageName={field.name}
        LabelComponent={(props) => (
          <HeaderWrapper {...props}>
            {withImage && (
              <ImageWrapper width="552px" height="80px" alt={props.label} src={URL?.createObjectURL(field.value)} />
            )}
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
  return (
    <ComponentFieldWrapper>
      <ProfilePicture {...props.fields.profilePicture} />
      <HeaderPicture {...props.fields.headerPicture} />
    </ComponentFieldWrapper>
  );
};

export default AddImages;
