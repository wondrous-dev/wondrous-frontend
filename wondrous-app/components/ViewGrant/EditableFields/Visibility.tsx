import { FIELDS } from 'components/Common/TaskViewModal/Fields/hooks/constants';
import { useSubmit } from 'components/Common/TaskViewModal/Fields/hooks/useSubmit';
import { TaskFieldEditableContent } from 'components/Common/TaskViewModal/Fields/Shared';
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
import EditIcon from 'components/Icons/editIcon';
import Tooltip from 'components/Tooltip';
import palette from 'theme/palette';
import { PRIVACY_LABELS } from 'utils/constants';
import { DataDisplay } from '../Fields';

const ViewContent = ({ toggleEditMode, privacyLevel, canEdit }) => (
  <>
    <ViewFieldWrapper canEdit={canEdit} onClick={toggleEditMode}>
      <DataDisplay label={PRIVACY_LABELS[privacyLevel] || 'Private'} />
      <EditIcon stroke={palette.grey58} className="edit-icon-field" />
    </ViewFieldWrapper>
  </>
);

const EditContent = ({ toggleEditMode, privacyLevel }) => {
  const { submit, error } = useSubmit({ field: FIELDS.PRIVACY_LEVEL });

  const handleSubmit = async (value) => submit(value);

  return (
    <CreateEntityHeaderWrapper>
      <CreateEntityPrivacySelect
        name="privacyLevel"
        value={privacyLevel}
        onChange={handleSubmit}
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
};
const Visibility = ({ privacyLevel, canEdit }) => (
  <TaskFieldEditableContent
    ViewContent={({ toggleEditMode }) => (
      <ViewContent canEdit={canEdit} toggleEditMode={toggleEditMode} privacyLevel={privacyLevel} />
    )}
    canAddItem={canEdit && privacyLevel === null}
    addContent={({ toggleAddMode }) => <EditContent privacyLevel={null} toggleEditMode={toggleAddMode} />}
    editableContent={({ toggleEditMode }) => (
      <EditContent privacyLevel={privacyLevel} toggleEditMode={toggleEditMode} />
    )}
  />
);

export default Visibility;
