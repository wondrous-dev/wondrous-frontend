import { ComponentFieldWrapper, Error, FieldInput, FieldLabel, FieldWrapper } from 'components/OnboardingDao/styles';
import { useField } from 'formik';
import { DescriptionCharacterLength, FieldInputDao, InputWrapper } from './styles';

const DaoName = ({ label, ...props }) => {
  const [field, meta] = useField(props.name);
  return (
    <FieldWrapper>
      <FieldLabel>{label}</FieldLabel>
      <FieldInput {...field} {...props} />
      {meta.touched && meta.error && <Error>{meta.error}</Error>}
    </FieldWrapper>
  );
};

const Description = ({ label, maxLength, ...props }) => {
  const [field, meta, helpers] = useField(props.name);
  const fieldValueLength = field.value?.length ?? 0;
  return (
    <FieldWrapper>
      <FieldLabel>{label}</FieldLabel>
      <InputWrapper>
        <FieldInputDao
          {...field}
          {...props}
          onChange={(e) => {
            const value = e.target.value;
            value.length <= maxLength && helpers.setValue(value);
          }}
        />
        <DescriptionCharacterLength>
          {fieldValueLength}/{maxLength} characters
        </DescriptionCharacterLength>
      </InputWrapper>
      {meta.touched && meta.error && <Error>{meta.error}</Error>}
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
