import { FIELDS } from 'components/Common/TaskViewModal/Fields/hooks/constants';
import { useSubmit } from 'components/Common/TaskViewModal/Fields/hooks/useSubmit';
import { TaskFieldEditableContent } from 'components/Common/TaskViewModal/Fields/Shared';
import { TaskSectionLabel } from 'components/Common/TaskViewModal/helpers';
import { ViewFieldWrapper } from 'components/Common/TaskViewModal/styles';
import ApplyPolicy, { APPLY_POLICY_FIELDS } from 'components/CreateGrant/Fields/ApplyPolicy';
import { DataDisplay } from '../Fields';

const ViewContent = ({ toggleEditMode, applyPolicy, canEdit }) => (
  <>
    <ViewFieldWrapper canEdit={canEdit} onClick={toggleEditMode}>
      <DataDisplay label={APPLY_POLICY_FIELDS.find((policy) => policy.value === applyPolicy)?.name} />
    </ViewFieldWrapper>
  </>
);

const EditContent = ({ toggleEditMode, applyPolicy }) => {
  const { submit, error } = useSubmit({ field: FIELDS.APPLY_POLICY });

  const handleSubmit = async (value) => await submit(value);

  return <ApplyPolicy label={null} onChange={handleSubmit} value={applyPolicy} />;
};
const Eligibility = ({ applyPolicy, canEdit }) => (
  <TaskFieldEditableContent
    ViewContent={({ toggleEditMode }) => (
      <ViewContent canEdit={canEdit} toggleEditMode={toggleEditMode} applyPolicy={applyPolicy} />
    )}
    editableContent={({ toggleEditMode }) => <EditContent applyPolicy={applyPolicy} toggleEditMode={toggleEditMode} />}
  />
);

export default Eligibility;
