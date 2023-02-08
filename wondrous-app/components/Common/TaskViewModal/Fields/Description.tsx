import { ErrorText } from 'components/Common';
import { useGetOrgUsers } from 'components/CreateEntity/CreateEntityModal/Helpers';
import { EditorContainer } from 'components/CreateEntity/CreateEntityModal/styles';
import { filterOrgUsersForAutocomplete } from 'components/CreateEntity/CreatePodModal';
import { EditorPlaceholder, EditorToolbar } from 'components/CreateEntity/styles';
import { RichTextWrapper } from 'components/CreateGrant/styles';
import { deserializeRichText, RichTextEditor, useEditor } from 'components/RichText';
import { debounce } from 'lodash';
import { useState } from 'react';
import { Editor, Transforms } from 'slate';
import { ReactEditor } from 'slate-react';
import { TaskDescriptionTextWrapper } from 'components/Common/TaskViewModal/helpers';
import { FIELDS } from './hooks/constants';
import { useSubmit } from './hooks/useSubmit';
import { TaskFieldEditableContent } from './Shared';

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

const ViewContent = ({ toggleEditMode, description, showFullByDefault }) => {
  const wrapperProps = {
    ...(toggleEditMode ? { onClick: toggleEditMode } : null),
  };
  return (
    <div {...wrapperProps}>
      <TaskDescriptionTextWrapper text={description} showFullByDefault={showFullByDefault} />
    </div>
  );
};
const Description = ({ description, orgId, canEdit, showFullByDefault = false }) => (
  <TaskFieldEditableContent
    editableContent={() => <EditContent description={description} orgId={orgId} />}
    ViewContent={({ toggleEditMode }) => (
      <ViewContent
        showFullByDefault={showFullByDefault}
        toggleEditMode={canEdit ? toggleEditMode : null}
        description={description}
      />
    )}
  />
);

export default Description;
