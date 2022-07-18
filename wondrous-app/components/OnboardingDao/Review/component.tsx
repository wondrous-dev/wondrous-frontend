import { FormikValues, useFormikContext } from 'formik';
import Image from 'next/image';
import { ItemWrapper, LabelText, LabelWrapper, Text, Wrapper } from './styles';

const Item = ({ label, children }) => {
  return (
    <ItemWrapper>
      <LabelWrapper>
        <LabelText>{label}</LabelText>
      </LabelWrapper>
      <div>{children}</div>
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
      <Item label="DAO Logo">
        <Image alt="Profile" width="26px" height="26px" src={URL?.createObjectURL(profilePicture)} />
      </Item>
      <Item label="DAO username">
        <Text>@sampleDAO</Text>
      </Item>
      <Item label="Description">
        <Text>{description}</Text>
      </Item>
      <Item label="Goals">
        <Text>{category}</Text>
      </Item>
      <Item label="Task import file">Sample DAO</Item>
      <Item label="Community import file">Sample DAO</Item>
    </Wrapper>
  );
};

export default Review;
