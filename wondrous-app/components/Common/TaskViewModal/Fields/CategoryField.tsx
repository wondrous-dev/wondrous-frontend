import { Grid } from '@mui/material';
import { filterCategoryValues, useGetCategories } from 'components/CreateEntity/CreateEntityModal/Helpers';
import DropdownSearch from 'components/DropdownSearch';
import EditIcon from 'components/Icons/editIcon';
import { forwardRef, useMemo, useRef } from 'react';
import palette from 'theme/palette';
import { CATEGORY_LABELS } from 'utils/constants';
import { TaskSectionLabel } from '../helpers';
import { ReviewerWrapper, TaskSectionDisplayDiv, TaskSectionInfoText, ViewFieldWrapper } from '../styles';
import { FIELDS, useSubmit } from './hooks/useSubmit';
import { TaskFieldEditableContent } from './Shared';

const ViewContent = ({ toggleEditMode, labels, canEdit }) => (
  <ReviewerWrapper showFullWidth>
    {labels?.map(({ name = null }) => (
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

const EditableContent = ({ toggleEditMode, labels }) => {
  const categoriesData = useGetCategories();
  const { submit, error } = useSubmit({ field: FIELDS.CATEGORIES });

  const handleChange = async (values) => {
    await submit(values.map((value) => value.id));
  };

  const filteredLabels = useMemo(() => filterCategoryValues(labelsToValue(labels)), [labels]);

  return (
    <DropdownSearch
      autoFocus
      label="Select Category"
      searchPlaceholder="Search categories"
      options={categoriesData}
      onChange={handleChange}
      disabled={false}
      value={filteredLabels}
      onClose={toggleEditMode}
    />
  );
};

const CategoryField = ({ labels = [], canEdit, shouldDisplay }) => {
  if (!shouldDisplay) return null;
  return (
    <TaskSectionDisplayDiv>
      <TaskSectionLabel>Category</TaskSectionLabel>
      <TaskFieldEditableContent
        canAddItem={canEdit}
        addContent={({ toggleAddMode }) => <EditableContent labels={labels} toggleEditMode={toggleAddMode} />}
        ViewContent={({ toggleEditMode }) => (
          <ViewContent toggleEditMode={toggleEditMode} canEdit={canEdit} labels={labels} />
        )}
        editableContent={({ toggleEditMode }) => <EditableContent labels={labels} toggleEditMode={toggleEditMode} />}
      />
    </TaskSectionDisplayDiv>
  );
};

export default CategoryField;
