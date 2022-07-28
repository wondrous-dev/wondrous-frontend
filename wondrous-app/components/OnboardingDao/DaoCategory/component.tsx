import { Radio, useRadioGroup } from '@mui/material';
import { ComponentFieldWrapper, Error, FieldInput, FieldLabel, FieldWrapper } from 'components/OnboardingDao/styles';
import { useField } from 'formik';
import { map } from 'lodash';
import { DAO_CATEGORIES } from 'utils/constants';
import { CategoriesWrapper, Divider, Label } from './styles';

const CategoryItem = (props) => {
  const radioGroup = useRadioGroup();
  return <Label checked={radioGroup?.value === props.value} {...props} />;
};

const CategoryItemOther = (props) => {
  const { value } = useRadioGroup();
  return <Label checked={!DAO_CATEGORIES[value]} {...props} />;
};

const DaoCategories = (props) => {
  const [field] = useField(props.name);
  return (
    <CategoriesWrapper {...field} {...props}>
      {map(DAO_CATEGORIES, (value, key) => (
        <CategoryItem control={<Radio />} key={key} label={value} value={key} />
      ))}
      <CategoryItemOther control={<Radio />} label={'👀 Something else? Tell us.'} value={''} />
    </CategoriesWrapper>
  );
};

const OtherField = ({ label, ...props }) => {
  const [field, meta] = useField(props.name);
  if (DAO_CATEGORIES[field.value]) return null;
  return (
    <>
      <Divider />
      <FieldWrapper>
        <FieldLabel>{label}</FieldLabel>
        <FieldInput {...field} {...props} />
        {meta.touched && meta.error && <Error>{meta.error}</Error>}
      </FieldWrapper>
    </>
  );
};

const DaoCategory = (props) => {
  return (
    <ComponentFieldWrapper>
      <DaoCategories {...props.fields.category} />
      <OtherField {...props.fields.category} />
    </ComponentFieldWrapper>
  );
};

export default DaoCategory;
