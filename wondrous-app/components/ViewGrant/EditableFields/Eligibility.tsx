import { FIELDS } from 'components/Common/TaskViewModal/Fields/hooks/constants';
import { useSubmit } from 'components/Common/TaskViewModal/Fields/hooks/useSubmit';
import { TaskFieldEditableContent } from 'components/Common/TaskViewModal/Fields/Shared';
import { InlineFieldWrapper } from 'components/Common/TaskViewModal/Fields/styles';
import { ViewFieldWrapper } from 'components/Common/TaskViewModal/styles';
import ApplyPolicy, { APPLY_POLICY_FIELDS } from 'components/CreateGrant/Fields/ApplyPolicy';
import EditIcon from 'components/Icons/editIcon';
import palette from 'theme/palette';
import { DataDisplay } from '../Fields';

const ViewContent = ({ toggleEditMode, applyPolicy, canEdit }) => (
  <InlineFieldWrapper $canEdit={canEdit} onClick={toggleEditMode}>
    <DataDisplay label={APPLY_POLICY_FIELDS.find((policy) => policy.value === applyPolicy)?.name} />
    <EditIcon stroke={palette.grey58} className="edit-icon-field" />
  </InlineFieldWrapper>
);

const EditContent = ({ toggleEditMode, applyPolicy }) => {
  const { submit, error } = useSubmit({ field: FIELDS.APPLY_POLICY });

  const handleSubmit = async (value) => await submit(value);

  return <ApplyPolicy label={null} onChange={handleSubmit} value={applyPolicy} />;
};
const Eligibility = ({ applyPolicy, canEdit }) => (
  <TaskFieldEditableContent
    viewContent={({ toggleEditMode }) => (
      <ViewContent canEdit={canEdit} toggleEditMode={toggleEditMode} applyPolicy={applyPolicy} />
    )}
    editableContent={({ toggleEditMode }) => <EditContent applyPolicy={applyPolicy} toggleEditMode={toggleEditMode} />}
  />
);

export default Eligibility;
