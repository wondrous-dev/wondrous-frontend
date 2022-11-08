import { TaskDescriptionTextWrapper } from 'components/Common/TaskViewModal/helpers';
import { useGetOrgUsers } from 'components/CreateEntity/CreateEntityModal/Helpers';
import { filterOrgUsersForAutocomplete } from 'components/CreateEntity/CreatePodModal';
import { EditorToolbar, EditorContainer, EditorPlaceholder } from 'components/CreateEntity/styles';
import search from 'components/Icons/search';
import { deserializeRichText, RichTextEditor, useEditor } from 'components/RichText';
import { useRef, useState } from 'react';
import { Transforms, Editor } from 'slate';
import { ReactEditor } from 'slate-react';
import { useOutsideAlerter } from 'utils/hooks';
import { useEditMode } from '../hooks';

const Description = ({ orgId, description, onChange }) => {
  const { toggleEditMode, isEditMode, closeEditMode } = useEditMode();

  const [editorToolbarNode, setEditorToolbarNode] = useState<HTMLDivElement>();
  const editor = useEditor();

  const ref = useRef();

  useOutsideAlerter(ref, closeEditMode);

  const { data: orgUsersData, search, hasMoreOrgUsers, fetchMoreOrgUsers } = useGetOrgUsers(orgId);

  return (
    <div ref={ref}>
      {isEditMode && (
        <>
          <EditorToolbar ref={setEditorToolbarNode} />
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
              onChange={(value) => {
                onChange(value);
              }}
              editorContainerNode={document.querySelector('#modal-scrolling-container')}
              onClick={(e) => {
                // we need to stop click event propagation,
                // since EditorContainer moves cursor to the last position in the editor on click
                e.stopPropagation();
              }}
            />
          </EditorContainer>
        </>
      )}
      {!isEditMode && (
        <div onClick={toggleEditMode}>
          <TaskDescriptionTextWrapper text={description} />
        </div>
      )}
    </div>
  );
};

export default Description;
