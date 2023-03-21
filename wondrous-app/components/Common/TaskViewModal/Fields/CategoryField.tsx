import { Grid } from '@mui/material';
import { useSubmit } from 'components/Common/TaskViewModal/Fields/hooks/useSubmit';
import { TaskFieldEditableContent } from 'components/Common/TaskViewModal/Fields/Shared';
import {
  TaskSectionDisplayDiv,
  TaskSectionInfoText,
  ViewFieldHoverWrapper,
} from 'components/Common/TaskViewModal/styles';
import { getInterestDisplay } from 'components/Common/UserInterestModal';
import { filterCategoryValues, useGetCategories } from 'components/CreateEntity/CreateEntityModal/Helpers';
import DropdownSearch from 'components/DropdownSearch';
import EditIcon from 'components/Icons/editIcon';
import { Fragment, useMemo } from 'react';
import palette from 'theme/palette';
import { CATEGORY_LABELS } from 'utils/constants';
import { TaskSectionLabel } from '../helpers';
import { FIELDS } from './hooks/constants';
import { InlineFieldWrapper } from './styles';

const ViewContent = ({ toggleEditMode, labels, canEdit }) => (
  <ViewFieldHoverWrapper $canEdit={canEdit} onClick={toggleEditMode}>
    <Grid container gap="8px" alignItems="center" width="100%" flexWrap="wrap">
      {labels?.map((label) => (
        <InlineFieldWrapper>
          <Grid container alignItems="center" justifyContent="flex-end" width="100%">
            <TaskSectionInfoText>{label?.name || getInterestDisplay(label)}</TaskSectionInfoText>
          </Grid>
        </InlineFieldWrapper>
      ))}
    </Grid>
    <Grid container item display="flex" gap="6px" alignItems="center" justifyContent="end" width="fit-content">
      <EditIcon stroke={palette.grey58} className="edit-icon-field" />
    </Grid>
  </ViewFieldHoverWrapper>
);

const labelsToValue = (labels) => {
  const labelValues = labels?.map((label) => label?.name || label);
  return Object.keys(CATEGORY_LABELS).filter(
    (key) => labelValues?.includes(CATEGORY_LABELS[key]) || labelValues?.includes(key)
  );
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

const CategoryField = ({ labels = [], canEdit, shouldDisplay = true, hideLabel = false }) => {
  if (!shouldDisplay) return null;

  const Wrapper = hideLabel ? Fragment : TaskSectionDisplayDiv;

  return (
    <Wrapper>
      {hideLabel ? null : <TaskSectionLabel>Category</TaskSectionLabel>}
      <TaskFieldEditableContent
        canAddItem={canEdit && !labels?.length}
        content={labels?.length}
        addContent={({ toggleAddMode }) => <EditableContent labels={labels} toggleEditMode={toggleAddMode} />}
        viewContent={({ toggleEditMode }) => (
          <ViewContent toggleEditMode={toggleEditMode} canEdit={canEdit} labels={labels} />
        )}
        editableContent={({ toggleEditMode }) => <EditableContent labels={labels} toggleEditMode={toggleEditMode} />}
      />
    </Wrapper>
  );
};

export default CategoryField;
