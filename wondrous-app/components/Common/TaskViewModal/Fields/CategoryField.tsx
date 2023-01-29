import { Grid } from '@mui/material';
import { filterCategoryValues, useGetCategories } from 'components/CreateEntity/CreateEntityModal/Helpers';
import DropdownSearch from 'components/DropdownSearch';
import EditIcon from 'components/Icons/editIcon';
import { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import palette from 'theme/palette';
import { CATEGORY_LABELS } from 'utils/constants';
import { TaskSectionLabel } from '../helpers';
import { ReviewerWrapper, TaskSectionDisplayDiv, TaskSectionInfoText, ViewFieldWrapper } from '../styles';
import { TaskFieldEditableContent } from './Shared';

const ViewContent = ({ toggleEditMode, labels, canEdit }) => (
  <ReviewerWrapper showFullWidth>
    {labels.map(({ name = null }) => (
      <Grid width="100%">
        <ViewFieldWrapper canEdit={canEdit} onClick={toggleEditMode}>
          <Grid display="flex" gap="6px" alignItems="center" justifyContent="space-between" width="100%">
            <TaskSectionInfoText>{name}</TaskSectionInfoText>
            <EditIcon stroke={palette.grey58} className="edit-icon-field" />
          </Grid>
        </ViewFieldWrapper>
      </Grid>
    ))}
  </ReviewerWrapper>
);

const labelsToValue = (labels) => {
  const labelValues = labels?.map((label) => label?.name);
  return Object.keys(CATEGORY_LABELS).filter((key) => labelValues?.includes(CATEGORY_LABELS[key]));
};

const EditableContent = forwardRef(({ toggleEditMode, labels }: any, ref: any) => {
  const categoriesData = useGetCategories();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    setCategories(labelsToValue(labels));
  }, [labels]);

  const handleChange = (values) => {
    const newCategories = [...categories, ...values];
    setCategories(values);
    ref.current = newCategories;
  };

  return (
    <DropdownSearch
      autoFocus
      label="Select Category"
      searchPlaceholder="Search categories"
      options={categoriesData}
      value={filterCategoryValues(categories)}
      onChange={handleChange}
      disabled={false}
      onClose={toggleEditMode}
    />
  );
});

const CategoryField = ({ labels, canEdit }) => {
  const ref = useRef();

  const onClose = () => {
    console.log('CALL API');
    console.log(ref.current, 'REF CURRENT');
  };

  return (
    <TaskSectionDisplayDiv>
      <TaskSectionLabel>Category</TaskSectionLabel>
      <TaskFieldEditableContent
        onClose={onClose}
        ViewContent={({ toggleEditMode }) => (
          <ViewContent toggleEditMode={toggleEditMode} canEdit={canEdit} labels={labels} />
        )}
        EditableContent={({ toggleEditMode }) => (
          <EditableContent ref={ref} labels={labels} toggleEditMode={toggleEditMode} />
        )}
      />
    </TaskSectionDisplayDiv>
  );
};

export default CategoryField;
