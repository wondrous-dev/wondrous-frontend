import { ComponentFieldWrapper, Error, FieldInput, FieldLabel, FieldWrapper } from 'components/OnboardingDao/styles';
import { useField } from 'formik';
import { debounce } from 'lodash';
import { useMemo, useState } from 'react';
import { DescriptionCharacterLength, FieldInputDao, InputWrapper } from './styles';

const Name = ({ label, ...props }) => {
  const [value, setValue] = useState('');
  const [field, meta, helpers] = useField(props.name);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedHelpersSetValue = useMemo(() => debounce(helpers.setValue, 500), []);
  const handleOnChange = (e) => {
    const value = e.target.value;
    setValue(value);
    debouncedHelpersSetValue(value);
  };
  return (
    <FieldWrapper>
      <FieldLabel>{label}</FieldLabel>
      <FieldInput {...field} {...props} onChange={handleOnChange} value={value} />
      {meta.touched && meta.error && <Error>{meta.error}</Error>}
    </FieldWrapper>
  );
};

const Description = ({ label, maxLength, ...props }) => {
  const [field, meta, helpers] = useField(props.name);
  const fieldValueLength = field.value?.length ?? 0;
  const handleOnChange = (e) => {
    const value = e.target.value;
    value.length <= maxLength && helpers.setValue(value);
  };
  return (
    <FieldWrapper>
      <FieldLabel>{label}</FieldLabel>
      <InputWrapper>
        <FieldInputDao {...field} {...props} onChange={handleOnChange} />
        <DescriptionCharacterLength>
          {fieldValueLength}/{maxLength} characters
        </DescriptionCharacterLength>
      </InputWrapper>
      {meta.touched && meta.error && <Error>{meta.error}</Error>}
    </FieldWrapper>
  );
};

const CreateDao = (props) => {
  const { name, username, description } = props.fields;
  return (
    <ComponentFieldWrapper>
      <Name {...name} />
      <Name {...username} />
      <Description {...description} />
    </ComponentFieldWrapper>
  );
};

export default CreateDao;
