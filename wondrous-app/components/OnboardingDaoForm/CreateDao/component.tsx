import { FieldInput, FieldInputDao, FieldLabel, FieldWrapper, Wrapper } from './styles';

const CreateDao = () => {
  return (
    <Wrapper>
      <FieldWrapper>
        <FieldLabel>Enter DAO name</FieldLabel>
        <FieldInput placeholder="What is the org's title?" />
      </FieldWrapper>
      <FieldWrapper>
        <FieldLabel>Enter DAO description</FieldLabel>
        <FieldInputDao placeholder="What is your DAOs aims?" multiline={true} />
      </FieldWrapper>
    </Wrapper>
  );
};

export default CreateDao;
