import { Grid } from '@mui/material';
import { useCreateLabel, useGetOrgLabels } from 'components/CreateEntity/CreateEntityModal/Helpers';
import EditIcon from 'components/Icons/editIcon';
import Tags from 'components/Tags';
import { forwardRef, useEffect, useMemo, useRef, useState } from 'react';
import palette from 'theme/palette';
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

interface Props {
  labels: any;
  toggleEditMode: () => void;
  orgId: string;
}

const EditableContent = forwardRef(({ labels, toggleEditMode, orgId }: Props, ref: any) => {
  const orgLabelsData = useGetOrgLabels(orgId);
  const [values, setValues] = useState([]);
  const ids = useMemo(() => labels.map((label) => label.id), [labels]);
  const handleCreateLabel = useCreateLabel(orgId, (newLabelId) => {
    console.log(newLabelId, 'new label id');
  });

  useEffect(() => setValues(labels), [labels]);

  //   form.setFieldValue('labelIds', [...form.values.labelIds, newLabelId])
  // );

  // const categoriesData = useGetCategories();
  // const [categories, setCategories] = useState([]);

  // useEffect(() => {
  //   setCategories(labelsToValue(labels));
  // }, [labels]);

  const handleChange = (labels) => {
    const newLabels = [...values, ...labels];
    //   setValues(newLabels);
    //   ref.current = newLabels;
  };

  return (
    <Tags
      autoFocus
      options={orgLabelsData || []}
      ids={ids}
      onChange={handleChange}
      onCreate={handleCreateLabel}
      limit={4}
    />
  );
});
const TagsField = ({ canEdit, labels, orgId }) => {
  const ref = useRef();

  const onClose = () => {
    console.log('CALL API');
    console.log(ref.current, 'REF CURRENT');
  };

  return (
    <TaskSectionDisplayDiv>
      <TaskSectionLabel>Tags</TaskSectionLabel>
      <TaskFieldEditableContent
        onClose={onClose}
        ViewContent={({ toggleEditMode }) => (
          <ViewContent toggleEditMode={toggleEditMode} canEdit={canEdit} labels={labels} />
        )}
        EditableContent={({ toggleEditMode }) => (
          <EditableContent ref={ref} labels={labels} toggleEditMode={toggleEditMode} orgId={orgId} />
        )}
      />
    </TaskSectionDisplayDiv>
  );
};

export default TagsField;
