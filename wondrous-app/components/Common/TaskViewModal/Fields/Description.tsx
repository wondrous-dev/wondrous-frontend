import { ErrorText } from 'components/Common';
import { useGetOrgUsers } from 'components/CreateEntity/CreateEntityModal/Helpers';
import { EditorContainer, EditorPlaceholder, EditorToolbar } from 'components/CreateEntity/CreateEntityModal/styles';
import { filterOrgUsersForAutocomplete } from 'components/CreateEntity/CreatePodModal';
import { RichTextWrapper } from 'components/CreateGrant/styles';
import { deserializeRichText, RichTextEditor, useEditor } from 'components/RichText';
import { debounce } from 'lodash';
import { useState } from 'react';
import { Editor, Transforms } from 'slate';
import { ReactEditor } from 'slate-react';
import { TaskDescriptionTextWrapper } from 'components/Common/TaskViewModal/helpers';
import EditIcon from 'components/Icons/editIcon';
import palette from 'theme/palette';
import { FIELDS } from './hooks/constants';
import { useSubmit } from './hooks/useSubmit';
import { TaskFieldEditableContent } from './Shared';
import { DescriptionIconWrapper, DescriptionWrapper, TitleIconWrapper } from './styles';

const EditContent = ({ description, orgId }) => {
  const [editorToolbarNode, setEditorToolbarNode] = useState<HTMLDivElement>();
  const { data: orgUsersData, search, hasMoreOrgUsers, fetchMoreOrgUsers } = useGetOrgUsers(orgId);
  const { submit, error } = useSubmit({ field: FIELDS.DESCRIPTION });
  const editor = useEditor();

  const handleChange = async (value) => await submit(JSON.stringify(value));

  const handleSubmit = debounce(handleChange, 800);

  return (
    <>
      <EditorToolbar ref={setEditorToolbarNode} />
      <RichTextWrapper
        style={{
          color: 'white',
        }}
      >
        <EditorContainer
          onClick={() => {
            // since editor will collapse to 1 row on input, we need to emulate min-height somehow
            // to achive it, we wrap it with EditorContainer and make it switch focus to editor on click
            ReactEditor.focus(editor);
            // also we need to move cursor to the last position in the editor
            Transforms.select(editor, {
              anchor: Editor.end(editor, []),
              focus: Editor.end(editor, []),
            });
          }}
        >
          <RichTextEditor
            editor={editor}
            onMentionChange={search}
            initialValue={deserializeRichText(description)}
            mentionables={filterOrgUsersForAutocomplete(orgUsersData)}
            placeholder={<EditorPlaceholder>Enter a description</EditorPlaceholder>}
            toolbarNode={editorToolbarNode}
            onChange={handleSubmit}
            editorContainerNode={document.querySelector('#modal-scrolling-container')}
            onClick={(e) => {
              // we need to stop click event propagation,
              // since EditorContainer moves cursor to the last position in the editor on click
              e.stopPropagation();
            }}
          />
        </EditorContainer>
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
    ViewContent={({ toggleEditMode }) => (
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
