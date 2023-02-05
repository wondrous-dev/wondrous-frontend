import { TaskFieldEditableContent } from 'components/Common/TaskViewModal/Fields/Shared';
import { TaskSectionLabel } from 'components/Common/TaskViewModal/helpers';
import { ViewFieldWrapper } from 'components/Common/TaskViewModal/styles';
import ApplyPolicy, { APPLY_POLICY_FIELDS } from 'components/CreateGrant/Fields/ApplyPolicy';
import { DataDisplay } from '../Fields';

const Label = () => <div>
  <TaskSectionLabel>Eligibility</TaskSectionLabel>
</div>;

const ViewContent = ({ toggleEditMode, applyPolicy, canEdit }) => (
  <>
    <Label />
    <ViewFieldWrapper canEdit={canEdit} onClick={toggleEditMode}>
      <DataDisplay label={APPLY_POLICY_FIELDS.find((policy) => policy.value === applyPolicy)?.name} />
    </ViewFieldWrapper>
  </>
);

const EditContent = ({ toggleEditMode, applyPolicy }) => (
  <ApplyPolicy onChange={(value) => console.log(value)} value={applyPolicy} />
);
const Eligibility = ({ applyPolicy, canEdit }) => (
  <TaskFieldEditableContent
    addItemLabel={Label}
    ViewContent={({ toggleEditMode }) => (
      <ViewContent canEdit={canEdit} toggleEditMode={toggleEditMode} applyPolicy={applyPolicy} />
    )}
    editableContent={({ toggleEditMode }) => <EditContent applyPolicy={applyPolicy} toggleEditMode={toggleEditMode} />}
  />
);

export default Eligibility;
