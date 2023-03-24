import { useState } from 'react';
import { FIELDS } from 'components/Common/TaskViewModal/Fields/hooks/constants';
import { useSubmit } from 'components/Common/TaskViewModal/Fields/hooks/useSubmit';
import { TaskFieldEditableContent } from 'components/Common/TaskViewModal/Fields/Shared';
import { ViewFieldHoverWrapper, ViewFieldWrapper } from 'components/Common/TaskViewModal/styles';
import { privacyOptions } from 'components/CreateEntity/CreateEntityModal/Helpers';
import { InlineFieldWrapper } from 'components/Common/TaskViewModal/Fields/styles';
import {
  CreateEntityHeaderWrapper,
  CreateEntityPrivacySelect,
  CreateEntityPrivacySelectRender,
  CreateEntityPrivacySelectRenderLabel,
  CreateEntitySelectArrowIcon,
  CreateEntityPrivacySelectOption,
  CreateEntityPrivacyIconWrapper,
  CreateEntityPrivacyLabel,
  EditEntityPrivacySelect,
} from 'components/CreateEntity/CreateEntityModal/styles';
import EditIcon from 'components/Icons/editIcon';
import Tooltip from 'components/Tooltip';
import palette from 'theme/palette';
import { PRIVACY_LABELS } from 'utils/constants';
import { DataDisplay } from '../Fields';

const ViewContent = ({ toggleEditMode, privacyLevel, canEdit }) => (
  <ViewFieldHoverWrapper $canEdit={canEdit} onClick={toggleEditMode}>
    <ViewFieldWrapper>
      <DataDisplay label={PRIVACY_LABELS[privacyLevel] || 'Private'} />
    </ViewFieldWrapper>
    <EditIcon stroke={palette.grey58} className="edit-icon-field" />
  </ViewFieldHoverWrapper>
);

const EditContent = ({ toggleEditMode, privacyLevel }) => {
  const { submit, error } = useSubmit({ field: FIELDS.PRIVACY_LEVEL });
  const [open, setOpen] = useState(true);
  const handleSubmit = async (value) => {
    submit(value);
    setOpen(false);
  };
  return (
    <CreateEntityHeaderWrapper
      style={{
        position: 'relative',
        width: '100%',
      }}
    >
      <EditEntityPrivacySelect
        width="inherit"
        open={open}
        onClick={() => setOpen(true)}
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
      </EditEntityPrivacySelect>
    </CreateEntityHeaderWrapper>
  );
};
const Visibility = ({ privacyLevel, canEdit }) => (
  <TaskFieldEditableContent
    viewContent={({ toggleEditMode }) => (
      <ViewContent canEdit={canEdit} toggleEditMode={toggleEditMode} privacyLevel={privacyLevel} />
    )}
    canAddItem={canEdit && privacyLevel === null}
    addContent={({ toggleAddMode }) => <EditContent privacyLevel={null} toggleEditMode={toggleAddMode} />}
    editableContent={({ toggleEditMode }) => (
      <EditContent privacyLevel={privacyLevel} toggleEditMode={toggleEditMode} />
    )}
    content
  />
);

export default Visibility;
