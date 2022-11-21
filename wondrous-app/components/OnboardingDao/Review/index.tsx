import EditIcon from 'components/Icons/edit.svg';
import { Error } from 'components/OnboardingDao/styles';
import { FormikValues, useField, useFormikContext } from 'formik';
import { useState } from 'react';
import { DAO_CATEGORIES } from 'utils/constants';
import {
  Category,
  ChildrenWrapper,
  EditButton,
  EditButtonText,
  EditInput,
  EditInputMulti,
  EditInputWrapper,
  InputErrorWrapper,
  ItemWrapper,
  LabelText,
  LabelWrapper,
  Logo,
  Text,
  TextAndInputWrapper,
  Wrapper,
} from './styles';

const Item = ({ label, children }) => (
  <ItemWrapper>
    <LabelWrapper>
      <LabelText>{label}</LabelText>
    </LabelWrapper>
    <ChildrenWrapper>{children}</ChildrenWrapper>
  </ItemWrapper>
);

const ItemWithEdit = ({ value, field, EditComponent }) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleOnClick = () => setIsEditing(true);

  return (
    <Item label={field.label}>
      <TextAndInputWrapper>
        {isEditing ? (
          <EditComponent setIsEditing={setIsEditing} {...field} />
        ) : (
          <Text onClick={handleOnClick}>{value}</Text>
        )}
      </TextAndInputWrapper>
    </Item>
  );
};

export const Edit = ({ onClick }) => (
  <EditButton onClick={onClick}>
    <EditIcon /> <EditButtonText>Edit</EditButtonText>
  </EditButton>
);

const EditName = ({ setIsEditing, ...props }) => {
  const [field, meta, helpers] = useField(props.name);

  const handleOnClick = () => {
    if (!meta.error) setIsEditing(false);
  };

  return (
    <InputErrorWrapper>
      <EditInputWrapper>
        <EditInput {...field} {...props} value={field.value} onChange={(e) => helpers.setValue(e.target.value)} />
        <Edit onClick={handleOnClick} />
      </EditInputWrapper>
      {meta.touched && meta.error && <Error>{meta.error}</Error>}
    </InputErrorWrapper>
  );
};

const EditDescription = ({ setIsEditing, ...props }) => {
  const [field, meta, helpers] = useField(props.name);

  const handleOnClick = () => {
    if (!meta.error) setIsEditing(false);
  };

  return (
    <InputErrorWrapper>
      <EditInputWrapper>
        <EditInputMulti
          {...field}
          {...props}
          value={field.value}
          onChange={(e) => {
            const { value } = e.target;
            value.length <= props.maxLength && helpers.setValue(value);
          }}
        />
        <Edit onClick={handleOnClick} />
      </EditInputWrapper>
      {meta.touched && meta.error && <Error>{meta.error}</Error>}
    </InputErrorWrapper>
  );
};

const Review = ({ fields }) => {
  const { values } = useFormikContext();
  const { name, username, profilePicture, description, category }: FormikValues = values;

  return (
    <Wrapper>
      <ItemWithEdit value={name} field={fields.name} EditComponent={EditName} />
      <ItemWithEdit value={username} field={fields.username} EditComponent={EditName} />
      {profilePicture && (
        <Item label="DAO Logo">
          <Logo alt="Profile" width={26} height={26} useNextImage src={profilePicture} />
        </Item>
      )}
      <ItemWithEdit value={description} field={fields.description} EditComponent={EditDescription} />
      <Item label="Goals">
        <Category>
          <Text>{DAO_CATEGORIES[category]}</Text>
        </Category>
      </Item>
      {/* NOTE: Not in use yet 
      <Item label="Task import file">Sample DAO</Item>
      <Item label="Community import file">Sample DAO</Item>
      */}
    </Wrapper>
  );
};

export default Review;
