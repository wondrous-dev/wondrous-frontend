import { Grid } from '@mui/material';
import { useCreateLabel, useGetOrgLabels } from 'components/CreateEntity/CreateEntityModal/Helpers';
import EditIcon from 'components/Icons/editIcon';
import Tags from 'components/Tags';
import { useMemo } from 'react';
import palette from 'theme/palette';
import { TaskSectionLabel } from '../helpers';
import { TaskSectionDisplayDiv, TaskSectionInfoText, ViewFieldHoverWrapper } from '../styles';
import { FIELDS } from './hooks/constants';
import { useSubmit } from './hooks/useSubmit';
import { TaskFieldEditableContent } from './Shared';
import { InlineFieldWrapper } from './styles';

const ViewContent = ({ toggleEditMode, labels, canEdit }) => (
  <ViewFieldHoverWrapper $canEdit={canEdit} onClick={toggleEditMode}>
    <Grid display="flex" gap="8px" flexWrap="wrap">
      {labels?.map(({ name = null }) => (
        <InlineFieldWrapper>
          <Grid display="flex" gap="6px" alignItems="center" justifyContent="space-between" width="100%">
            <TaskSectionInfoText>{name}</TaskSectionInfoText>
          </Grid>
        </InlineFieldWrapper>
      ))}
    </Grid>
    <Grid item container display="flex" gap="6px" alignItems="center" justifyContent="end" width="fit-content">
      <EditIcon stroke={palette.grey58} className="edit-icon-field" />
    </Grid>
  </ViewFieldHoverWrapper>
);

interface Props {
  labels: any;
  toggleEditMode: () => void;
  orgId: string;
}

const EditableContent = ({ labels, toggleEditMode, orgId }: Props) => {
  const orgLabelsData = useGetOrgLabels(orgId);
  const { submit, error } = useSubmit({ field: FIELDS.TAGS });

  const ids = useMemo(() => labels.map((label) => label.id), [labels]);
  const handleCreateLabel = useCreateLabel(orgId, async (newLabelId) => {
    const newLabels = [...ids, newLabelId];
    await submit(newLabels);
  });

  const handleChange = async (labels) => {
    await submit(labels);
  };

  return (
    <Tags
      autoFocus
      options={orgLabelsData || []}
      ids={ids}
      disablePortal
      onChange={handleChange}
      onCreate={handleCreateLabel}
      limit={4}
    />
  );
};

const TagsField = ({ canEdit, labels = [], orgId, shouldDisplay }) =>
  shouldDisplay ? (
    <TaskSectionDisplayDiv>
      <TaskSectionLabel>Tags</TaskSectionLabel>
      <TaskFieldEditableContent
        viewContent={({ toggleEditMode }) => (
          <ViewContent toggleEditMode={toggleEditMode} canEdit={canEdit} labels={labels} />
        )}
        addContent={({ toggleAddMode }) => (
          <EditableContent toggleEditMode={toggleAddMode} labels={labels} orgId={orgId} />
        )}
        canAddItem={canEdit && !labels?.length}
        editableContent={({ toggleEditMode }) => (
          <EditableContent labels={labels} toggleEditMode={toggleEditMode} orgId={orgId} />
        )}
      />
    </TaskSectionDisplayDiv>
  ) : null;

export default TagsField;
