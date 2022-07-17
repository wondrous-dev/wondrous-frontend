import { ChildrenFieldWrapper, FieldInput, FieldLabel, FieldWrapper } from 'components/OnboardingDaoForm/styles';
import { FieldInputDao } from './styles';

const CreateDao = () => {
  return (
    <ChildrenFieldWrapper>
      <FieldWrapper>
        <FieldLabel>Enter DAO name</FieldLabel>
        <FieldInput placeholder="What is the org's title?" />
      </FieldWrapper>
      <FieldWrapper>
        <FieldLabel>Enter DAO description</FieldLabel>
        <FieldInputDao placeholder="What is your DAOs aims?" multiline={true} />
      </FieldWrapper>
    </ChildrenFieldWrapper>
  );
};

export default CreateDao;
