import { Radio, useRadioGroup } from '@mui/material';
import { ComponentFieldWrapper, FieldInput, FieldLabel, FieldWrapper } from 'components/OnboardingDao/styles';
import { useField } from 'formik';
import { CategoriesWrapper, Divider, Label } from './styles';

const CATEGORIES = [
  '🌎 Social good',
  '🎬 Media & content',
  '🐒 NFT collective',
  '‍‍💰️ Investments',
  '‍💸 Defi',
  '🤝 Social',
  '🔨 Service DAO',
  '‍🤔 Think tank',
  '💀 Fun and memeable',
  '‍🏗️ Building products',
];

const isInCategories = (value) => CATEGORIES.includes(value);

const CategoryItem = (props) => {
  const radioGroup = useRadioGroup();
  return <Label checked={radioGroup?.value === props.value} {...props} />;
};

const CategoryItemOther = (props) => {
  const radioGroup = useRadioGroup();
  return <Label checked={!isInCategories(radioGroup?.value)} {...props} />;
};

const DaoCategories = (props) => {
  const [field, meta] = useField(props.name);
  return (
    <CategoriesWrapper {...field} {...props}>
      {CATEGORIES.map((category) => (
        <CategoryItem control={<Radio />} key={category} label={category} value={category} />
      ))}
      <CategoryItemOther control={<Radio />} label={'👀 Something else? Tell us.'} value={''} />
    </CategoriesWrapper>
  );
};

const OtherField = ({ label, ...props }) => {
  const [field, meta] = useField(props.name);
  if (isInCategories(field.value)) return null;
  return (
    <>
      <Divider />
      <FieldWrapper>
        <FieldLabel>{label}</FieldLabel>
        <FieldInput {...field} {...props} />
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
