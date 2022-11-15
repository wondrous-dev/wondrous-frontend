import { makeUniqueId } from '@apollo/client/utilities';
import AddAPhotoIcon from 'components/Icons/addAPhoto.svg';
import { ComponentFieldWrapper, FieldLabel, FieldWrapper } from 'components/OnboardingDao/styles';
import { ImageUpload } from 'components/Settings/imageUpload';
import { useField } from 'formik';
import { handleImageFile, uploadMedia } from 'utils/media';
import { AddPhotoIconWrapper, HeaderText, HeaderWrapper, ImageWrapper, LogoUpload, SafeImageWrapper } from './styles';

const useHandleImageChange = ({ setValue, tempState, setTempState, name }) => {
  const handleChange = async (file) => {
    setTempState({ ...tempState, [name]: file });
    const imageFile = handleImageFile({ file, id: makeUniqueId('temp') });
    setValue(imageFile.filename);
    await uploadMedia(imageFile);
  };
  return { handleChange };
};

const ProfilePicture = (props) => {
  const { name, tempState, setTempState } = props;
  const file = tempState[name];
  const [field, _, { setValue }] = useField(name);
  const { handleChange } = useHandleImageChange({ setValue, tempState, setTempState, name });
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
                <ImageWrapper width={80} height={80} alt={props.label} src={URL?.createObjectURL(file)} />
              ) : (
                <SafeImageWrapper width={80} height={80} alt={props.label} useNextImage src={field.value} />
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

function HeaderPicture(props) {
  const { name, tempState, setTempState } = props;
  const file = tempState[name];
  const [field, _, { setValue }] = useField(name);
  const { handleChange } = useHandleImageChange({ setValue, tempState, setTempState, name });
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
                <ImageWrapper width={552} height={80} alt={props.label} src={URL?.createObjectURL(file)} />
              ) : (
                <SafeImageWrapper width={552} height={80} alt={props.label} src={field.value} />
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
}

const AddImages = (props) => {
  const { fields, ...rest } = props;
  const { profilePicture, headerPicture } = fields;
  return (
    <ComponentFieldWrapper>
      <ProfilePicture {...profilePicture} {...rest} />
      <HeaderPicture {...headerPicture} {...rest} />
    </ComponentFieldWrapper>
  );
};

export default AddImages;
