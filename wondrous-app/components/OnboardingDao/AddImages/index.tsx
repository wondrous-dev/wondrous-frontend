import { makeUniqueId } from '@apollo/client/utilities';
import { ComponentFieldWrapper, FieldWrapper } from 'components/OnboardingDao/styles';
import ImageUpload from 'components/Settings/imageUpload';
import { AVATAR_EDITOR_TYPES } from 'constants/avatarEditor';
import { useField } from 'formik';
import { handleImageFile, uploadMedia } from 'utils/media';

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
  const { name, tempState, setTempState, label } = props;
  const file = tempState[name];
  const [field, _, { setValue }] = useField(name);
  const { handleChange } = useHandleImageChange({ setValue, tempState, setTempState, name });
  const withImage = Boolean(file ?? field.value);

  return (
    <FieldWrapper>
      <ImageUpload updateFilesCb={handleChange} title={label} imageType={AVATAR_EDITOR_TYPES.ICON_IMAGE} />
    </FieldWrapper>
  );
};

function HeaderPicture(props) {
  const { name, tempState, setTempState, label } = props;
  const file = tempState[name];
  const [field, _, { setValue }] = useField(name);
  const { handleChange } = useHandleImageChange({ setValue, tempState, setTempState, name });
  const withImage = Boolean(file ?? field.value);
  return (
    <FieldWrapper>
      <ImageUpload updateFilesCb={handleChange} title={label} imageType={AVATAR_EDITOR_TYPES.HEADER_IMAGE} />
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
