import { Radio } from '@mui/material';
import { useRadioGroup } from '@mui/material/RadioGroup';
import { ComponentFieldWrapper } from 'components/OnboardingDao/styles';
import { useField } from 'formik';
import { map } from 'lodash';
import { DAO_CATEGORIES } from 'utils/constants';
import { CategoriesWrapper, Label } from './styles';

function CategoryItem(props) {
  const { value } = props;
  const radioGroup = useRadioGroup();
  return <Label checked={radioGroup?.value === value} {...props} />;
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
