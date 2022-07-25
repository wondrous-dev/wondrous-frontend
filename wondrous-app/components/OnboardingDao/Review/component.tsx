import EditIcon from 'components/Icons/edit.svg';
import { Error } from 'components/OnboardingDao/styles';
import { FormikValues, useField, useFormikContext } from 'formik';
import { useState } from 'react';
import { useOnboardingCreateDaoContext } from '../context';
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

const Item = ({ label, children }) => {
  return (
    <ItemWrapper>
      <LabelWrapper>
        <LabelText>{label}</LabelText>
      </LabelWrapper>
      <ChildrenWrapper>{children}</ChildrenWrapper>
    </ItemWrapper>
  );
};

const Edit = ({ onClick }) => {
  return (
    <EditButton onClick={onClick}>
      <EditIcon /> <EditButtonText>Edit</EditButtonText>
    </EditButton>
  );
};

const EditDaoName = ({ setIsEditing, ...props }) => {
  const [field, meta, helpers] = useField(props.name);
  return (
    <InputErrorWrapper>
      <EditInputWrapper>
        <EditInput {...field} {...props} value={field.value} onChange={(e) => helpers.setValue(e.target.value)} />
        <Edit
          onClick={() => {
            if (!meta.error) setIsEditing(false);
          }}
        />
      </EditInputWrapper>
      {meta.touched && meta.error && <Error>{meta.error}</Error>}
    </InputErrorWrapper>
  );
};

const DaoName = ({ name, field }) => {
  const [isEditing, setIsEditing] = useState(false);
  return (
    <Item label="DAO Name">
      <TextAndInputWrapper>
        {isEditing ? (
          <EditDaoName setIsEditing={setIsEditing} {...field} />
        ) : (
          <Text onClick={() => setIsEditing(true)}>{name}</Text>
        )}
      </TextAndInputWrapper>
    </Item>
  );
};

const EditDescription = ({ setIsEditing, ...props }) => {
  const [field, meta, helpers] = useField(props.name);
  return (
    <InputErrorWrapper>
      <EditInputWrapper>
        <EditInputMulti
          {...field}
          {...props}
          value={field.value}
          onChange={(e) => {
            const value = e.target.value;
            value.length <= props.maxLength && helpers.setValue(value);
          }}
        />
        <Edit
          onClick={() => {
            if (!meta.error) setIsEditing(false);
          }}
        />
      </EditInputWrapper>
      {meta.touched && meta.error && <Error>{meta.error}</Error>}
    </InputErrorWrapper>
  );
};

const Description = ({ description, field }) => {
  const [isEditing, setIsEditing] = useState(false);
  return (
    <Item label="Description">
      <TextAndInputWrapper>
        {isEditing ? (
          <EditDescription setIsEditing={setIsEditing} {...field} />
        ) : (
          <Text onClick={() => setIsEditing(true)}>{description}</Text>
        )}
      </TextAndInputWrapper>
    </Item>
  );
};

const Review = ({ fields }) => {
  const { values } = useFormikContext();
  const { name, description, category }: FormikValues = values;
  const { tempState } = useOnboardingCreateDaoContext();
  return (
    <Wrapper>
      <DaoName name={name} field={fields.name} />
      FIX STATE
      <Item label="DAO Logo">
        {tempState.profilePicture && (
          <Logo alt="Profile" width="26px" height="26px" src={URL?.createObjectURL(tempState.profilePicture)} />
        )}
      </Item>
      <Description description={description} field={fields.description} />
      <Item label="Goals">
        {category && (
          <Category>
            <Text>{category}</Text>
          </Category>
        )}
      </Item>
      <Item label="Task import file">Sample DAO</Item>
      <Item label="Community import file">Sample DAO</Item>
    </Wrapper>
  );
};

export default Review;
