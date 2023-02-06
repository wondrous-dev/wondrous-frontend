import { TaskFieldEditableContent } from 'components/Common/TaskViewModal/Fields/Shared';
import { TaskSectionLabel } from 'components/Common/TaskViewModal/helpers';
import { ViewFieldWrapper } from 'components/Common/TaskViewModal/styles';
import { privacyOptions } from 'components/CreateEntity/CreateEntityModal/Helpers';
import {
  CreateEntityHeaderWrapper,
  CreateEntityPrivacySelect,
  CreateEntityPrivacySelectRender,
  CreateEntityPrivacySelectRenderLabel,
  CreateEntitySelectArrowIcon,
  CreateEntityPrivacySelectOption,
  CreateEntityPrivacyIconWrapper,
  CreateEntityPrivacyLabel,
} from 'components/CreateEntity/CreateEntityModal/styles';
import ApplyPolicy, { APPLY_POLICY_FIELDS } from 'components/CreateGrant/Fields/ApplyPolicy';
import Tooltip from 'components/Tooltip';
import { PRIVACY_LABELS } from 'utils/constants';
import { DataDisplay } from '../Fields';

const ViewContent = ({ toggleEditMode, privacyLevel, canEdit }) => (
  <>
    <ViewFieldWrapper canEdit={canEdit} onClick={toggleEditMode}>
      <DataDisplay label={PRIVACY_LABELS[privacyLevel] || 'Private'} />
    </ViewFieldWrapper>
  </>
);

const EditContent = ({ toggleEditMode, privacyLevel }) => (
  <CreateEntityHeaderWrapper>
    <CreateEntityPrivacySelect
      name="privacyLevel"
      value={privacyLevel}
      onChange={(value) => {
        // form.setFieldValue('privacyLevel', value);
        console.log('on change visibility', value);
      }}
      renderValue={(value) => (
        <Tooltip placement="top">
          <CreateEntityPrivacySelectRender>
            <CreateEntityPrivacySelectRenderLabel>{value?.label}</CreateEntityPrivacySelectRenderLabel>
            <CreateEntitySelectArrowIcon />
          </CreateEntityPrivacySelectRender>
        </Tooltip>
      )}
    >
      {Object.keys(privacyOptions).map((i) => {
        const { label, value, Icon } = privacyOptions[i];
        return (
          <CreateEntityPrivacySelectOption key={value} value={value}>
            <CreateEntityPrivacyIconWrapper>{Icon && <Icon />}</CreateEntityPrivacyIconWrapper>
            <CreateEntityPrivacyLabel>{label}</CreateEntityPrivacyLabel>
          </CreateEntityPrivacySelectOption>
        );
      })}
    </CreateEntityPrivacySelect>
  </CreateEntityHeaderWrapper>
);
const Visibility = ({ privacyLevel, canEdit }) => (
  <TaskFieldEditableContent
    ViewContent={({ toggleEditMode }) => (
      <ViewContent canEdit={canEdit} toggleEditMode={toggleEditMode} privacyLevel={privacyLevel} />
    )}
    canAddItem={canEdit && !privacyLevel}
    addContent={({ toggleAddMode }) => <EditContent privacyLevel={null} toggleEditMode={toggleAddMode} />}
    editableContent={({ toggleEditMode }) => (
      <EditContent privacyLevel={privacyLevel} toggleEditMode={toggleEditMode} />
    )}
  />
);

export default Visibility;
