import { FormikValues, useFormikContext } from 'formik';
import { Category, ChildrenWrapper, ItemWrapper, LabelText, LabelWrapper, Logo, Text, Wrapper } from './styles';

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

const Review = () => {
  const { values }: FormikValues = useFormikContext();
  const { name, description, profilePicture, category } = values;
  return (
    <Wrapper>
      <Item label="DAO Name">
        <Text>{name}</Text>
      </Item>
      {profilePicture && (
        <Item label="DAO Logo">
          <Logo alt="Profile" width="26px" height="26px" src={URL?.createObjectURL(profilePicture)} />
        </Item>
      )}
      <Item label="Description">
        <Text>{description}</Text>
      </Item>
      <Item label="Goals">
        <Category>
          <Text>{category}</Text>
        </Category>
      </Item>
      <Item label="Task import file">Sample DAO</Item>
      <Item label="Community import file">Sample DAO</Item>
    </Wrapper>
  );
};

export default Review;
