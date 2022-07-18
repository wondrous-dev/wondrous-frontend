import AddAPhotoIcon from 'components/Icons/addAPhoto.svg';
import { ComponentFieldWrapper, FieldLabel, FieldWrapper } from 'components/OnboardingDao/styles';
import { ImageUpload } from 'components/Settings/imageUpload';
import { useField, useFormikContext } from 'formik';
import { AddPhotoIconWrapper, HeaderText, HeaderWrapper, ImageWrapper, LogoUpload } from './styles';

const ProfilePicture = ({ setFieldValue, ...props }) => {
  const [field] = useField(props.name);
  const withImage = Boolean(field.value);
  return (
    <FieldWrapper>
      <FieldLabel>Logo</FieldLabel>
      <ImageUpload
        updateFilesCb={(file) => setFieldValue(field.name, file)}
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

const HeaderPicture = ({ setFieldValue, ...props }) => {
  const [field] = useField(props.name);
  const withImage = Boolean(field.value);
  return (
    <FieldWrapper>
      <FieldLabel>Header</FieldLabel>
      <ImageUpload
        updateFilesCb={(file) => setFieldValue(field.name, file)}
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
  const { setFieldValue } = useFormikContext();
  return (
    <ComponentFieldWrapper>
      <ProfilePicture {...props.fields.profilePicture} setFieldValue={setFieldValue} />
      <HeaderPicture {...props.fields.headerPicture} setFieldValue={setFieldValue} />
    </ComponentFieldWrapper>
  );
};

export default AddImages;
