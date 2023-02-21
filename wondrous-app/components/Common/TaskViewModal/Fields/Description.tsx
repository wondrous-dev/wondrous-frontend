import React from 'react';
import debounce from 'lodash/debounce';

import EditIcon from 'components/Icons/editIcon';
import palette from 'theme/palette';
import { ErrorText } from 'components/Common';

import { filterOrgUsersForAutocomplete } from 'components/CreateEntity/CreatePodModal';
import { PlateRichEditor, deserializeRichText } from 'components/PlateRichEditor';
import { RichTextWrapper } from 'components/CreateGrant/styles';
import { TaskDescriptionTextWrapper } from 'components/Common/TaskViewModal/helpers';
import { useGetOrgUsers } from 'components/CreateEntity/CreateEntityModal/Helpers';
import { TaskFieldEditableContent } from './Shared';
import { FIELDS } from './hooks/constants';
import { DescriptionIconWrapper, DescriptionWrapper, TitleIconWrapper } from './styles';
import { useSubmit } from './hooks/useSubmit';

const EditContent = ({ description, orgId }) => {
  const { data: orgUsersData } = useGetOrgUsers(orgId);
  const { submit, error } = useSubmit({ field: FIELDS.DESCRIPTION });

  const handleChange = async (value) => await submit(JSON.stringify(value));

  const handleSubmit = debounce(handleChange, 800);

  return (
    <>
      <RichTextWrapper
        style={{
          color: 'white',
        }}
      >
        <PlateRichEditor
          inputValue={deserializeRichText(description)}
          mentionables={filterOrgUsersForAutocomplete(orgUsersData)}
          onChange={handleSubmit}
          placeholder="Type ‘/’ for commands"
        />
      </RichTextWrapper>
      {error ? <ErrorText>{error}</ErrorText> : null}
    </>
  );
};

const ViewContent = ({ toggleEditMode, description, showFullByDefault, canEdit }) => {
  const wrapperProps = {
    ...(canEdit ? { onClick: toggleEditMode, $canEdit: canEdit } : null),
  };
  return (
    <DescriptionWrapper {...wrapperProps}>
      <DescriptionIconWrapper $canEdit={canEdit}>
        <TitleIconWrapper>
          <EditIcon stroke={palette.grey58} className="edit-icon-field" />
        </TitleIconWrapper>
      </DescriptionIconWrapper>

      <TaskDescriptionTextWrapper text={description} showFullByDefault={showFullByDefault} />
    </DescriptionWrapper>
  );
};
const Description = ({ description, orgId, canEdit, showFullByDefault = false, editGridStyle = {} }) => (
  <TaskFieldEditableContent
    editGridStyle={editGridStyle}
    editableContent={() => <EditContent description={description} orgId={orgId} />}
    viewContent={({ toggleEditMode }) => (
      <ViewContent
        showFullByDefault={showFullByDefault}
        toggleEditMode={toggleEditMode}
        description={description}
        canEdit={canEdit}
      />
    )}
  />
);

export default Description;
