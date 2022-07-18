import { ComponentFieldWrapper, FieldInput, FieldLabel, FieldWrapper } from 'components/OnboardingDao/styles';
import { useField } from 'formik';
import { FieldInputDao } from './styles';

const DaoName = ({ label, ...props }) => {
  const [field, meta] = useField(props.name);
  return (
    <FieldWrapper>
      <FieldLabel>{label}</FieldLabel>
      <FieldInput {...field} {...props} />
    </FieldWrapper>
  );
};

const Description = ({ label, ...props }) => {
  const [field, meta] = useField(props.name);
  return (
    <FieldWrapper>
      <FieldLabel>{label}</FieldLabel>
      <FieldInputDao {...field} {...props} />
    </FieldWrapper>
  );
};

const CreateDao = (props) => {
  return (
    <ComponentFieldWrapper>
      <DaoName {...props.fields.name} />
      <Description {...props.fields.description} />
    </ComponentFieldWrapper>
  );
};

export default CreateDao;
