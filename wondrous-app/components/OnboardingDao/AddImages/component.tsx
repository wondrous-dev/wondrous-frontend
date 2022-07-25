import { makeUniqueId } from '@apollo/client/utilities';
import AddAPhotoIcon from 'components/Icons/addAPhoto.svg';
import { ComponentFieldWrapper, FieldLabel, FieldWrapper } from 'components/OnboardingDao/styles';
import { ImageUpload } from 'components/Settings/imageUpload';
import { useField } from 'formik';
import { handleImageFile, uploadMedia } from 'utils/media';
import { useOnboardingCreateDaoContext } from '../context';
import { AddPhotoIconWrapper, HeaderText, HeaderWrapper, ImageWrapper, LogoUpload } from './styles';

const useHandleImageChange = ({ setValue, name }) => {
  const { setTempState, tempState } = useOnboardingCreateDaoContext();
  const file = tempState[name];
  const withImage = Boolean(file);
  const handleChange = async (file) => {
    setTempState({ key: name, value: file });
    const imageFile = handleImageFile({ file, id: makeUniqueId('temp') });
    setValue(imageFile.filename);
    await uploadMedia(imageFile);
  };
  return { handleChange, file, withImage };
};

const ProfilePicture = ({ ...props }) => {
  const name = props.name;
  const [field, _, { setValue }] = useField(name);
  const { handleChange, file, withImage } = useHandleImageChange({ name, setValue });
  return (
    <FieldWrapper>
      <FieldLabel>Logo</FieldLabel>
      <ImageUpload
        updateFilesCb={handleChange}
        imageName={field.name}
        LabelComponent={(props) => (
          <LogoUpload {...props}>
            {withImage && (
              <ImageWrapper width="80px" height="80px" alt={props.label} src={URL?.createObjectURL(file)} />
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
  const name = props.name;
  const [field, _, { setValue }] = useField(name);
  const { handleChange, file, withImage } = useHandleImageChange({ name, setValue });
  return (
    <FieldWrapper>
      <FieldLabel>Header</FieldLabel>
      <ImageUpload
        updateFilesCb={handleChange}
        imageName={field.name}
        LabelComponent={(props) => (
          <HeaderWrapper {...props}>
            {withImage && (
              <ImageWrapper width="552px" height="80px" alt={props.label} src={URL?.createObjectURL(file)} />
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
