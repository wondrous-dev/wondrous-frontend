import { ClickAwayListener } from '@mui/material';
import EditIcon from 'components/Icons/edit.svg';
import { FormikValues, useField, useFormikContext } from 'formik';
import { useState } from 'react';
import {
  Category,
  ChildrenWrapper,
  DaoNameWrapper,
  EditButton,
  EditButtonText,
  EditInput,
  EditInputWrapper,
  ItemWrapper,
  LabelText,
  LabelWrapper,
  Logo,
  Text,
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

const EditDaoName = ({ name, setIsEditing }) => {
  const [value, setValue] = useState(name);
  const [_, __, helpers] = useField('name');
  return (
    <ClickAwayListener
      onClickAway={() => {
        setIsEditing(false);
        setValue(name);
      }}
    >
      <EditInputWrapper>
        <EditInput value={value} onChange={(e) => setValue(e.target.value)} />
        <Edit
          onClick={() => {
            setIsEditing(false);
            helpers.setValue(value);
          }}
        />
      </EditInputWrapper>
    </ClickAwayListener>
  );
};

const DaoName = ({ name }) => {
  const [isEditing, setIsEditing] = useState(false);
  return (
    <Item label="DAO Name">
      <DaoNameWrapper>
        {isEditing ? (
          <EditDaoName name={name} setIsEditing={setIsEditing} />
        ) : (
          <Text onClick={() => setIsEditing(true)}>{name}</Text>
        )}
      </DaoNameWrapper>
    </Item>
  );
};

const Review = () => {
  const { values } = useFormikContext();
  const { name, description, profilePicture, category }: FormikValues = values;
  return (
    <Wrapper>
      <DaoName name={name} />
      <Item label="DAO Logo">
        {profilePicture && <Logo alt="Profile" width="26px" height="26px" src={URL?.createObjectURL(profilePicture)} />}
      </Item>
      <Item label="Description">
        <Text>{description}</Text>
      </Item>
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
