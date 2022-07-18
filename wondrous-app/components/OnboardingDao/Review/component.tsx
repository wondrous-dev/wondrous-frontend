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
  return (
    <Wrapper>
      <Item label="DAO Name">
        <Text>Sample DAO</Text>
      </Item>
      <Item label="DAO Logo">Sample DAO</Item>
      <Item label="DAO username">
        <Text>@sampleDAO</Text>
      </Item>
      <Item label="Description">
        <Text>SampleDAO empowers anyone to create the best web2/web3s creative samples.</Text>
      </Item>
      <Item label="Goals">Sample DAO</Item>
      <Item label="Task import file">Sample DAO</Item>
      <Item label="Community import file">Sample DAO</Item>
    </Wrapper>
  );
};

export default Review;
