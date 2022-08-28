import { useField } from 'formik';

import {
  Error,
  FieldLabel,
  FieldWrapper,
  DescriptionCharacterLength,
  FieldInput,
  InputWrapper,
  FieldLabelContainer,
} from './styles';

type Props = {
  label: string;
  maxLength?: number;
  name: string;
  labelWidth: string | number;
  labelType: 'default' | 'highlighted' | string;
};

function TextField({ label, maxLength, labelType = 'default', labelWidth, ...props }: Props) {
  const [field, meta, helpers] = useField(props.name);

  const fieldValueLength = field.value?.length ?? 0;

  const handleOnChange = (e) => {
    const { value } = e.target;

    if (maxLength) {
      if (value.length > maxLength) {
        return;
      }
    }

    helpers.setValue(value);
  };

  return (
    <FieldWrapper labelType={labelType}>
      <FieldLabelContainer labelWidth={labelWidth}>
        <FieldLabel>{label}</FieldLabel>
      </FieldLabelContainer>
      <InputWrapper>
        <FieldInput {...field} {...props} onChange={handleOnChange} />
        {meta.touched && meta.error && <Error>{meta.error}</Error>}
        {maxLength ? (
          <DescriptionCharacterLength>
            {fieldValueLength}/{maxLength} characters
          </DescriptionCharacterLength>
        ) : null}
      </InputWrapper>
    </FieldWrapper>
  );
}

export default TextField;
