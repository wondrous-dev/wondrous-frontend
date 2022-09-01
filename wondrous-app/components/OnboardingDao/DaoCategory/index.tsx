import { Radio, useRadioGroup } from '@mui/material';
import { ComponentFieldWrapper, Error, FieldInput, FieldLabel, FieldWrapper } from 'components/OnboardingDao/styles';
import { useField } from 'formik';
import { map } from 'lodash';
import { DAO_CATEGORIES } from 'utils/constants';
import { CategoriesWrapper, Divider, Label } from './styles';

function CategoryItem(props) {
  const { value } = props;
  const radioGroup = useRadioGroup();
  return <Label checked={radioGroup?.value === value} {...props} />;
}

function CategoryItemOther(props) {
  const { value } = useRadioGroup();
  return <Label checked={!DAO_CATEGORIES[value]} {...props} />;
}

function DaoCategories(props) {
  const { name } = props;
  const [field] = useField(name);
  return (
    <CategoriesWrapper {...field} {...props}>
      {map(DAO_CATEGORIES, (value, key) => (
        <CategoryItem control={<Radio />} key={key} label={value} value={key} />
      ))}
      {/* NOTE: hide for now <CategoryItemOther control={<Radio />} label={'👀 Something else? Tell us.'} value={''} /> */}
    </CategoriesWrapper>
  );
}

function OtherField({ label, ...props }) {
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
}

function DaoCategory(props) {
  const {
    fields: { category },
  } = props;
  return (
    <ComponentFieldWrapper>
      <DaoCategories {...category} />
      {/* NOTE: hide for now <OtherField {...props.fields.category} /> */}
    </ComponentFieldWrapper>
  );
}

export default DaoCategory;
