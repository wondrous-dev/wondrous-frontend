import { ErrorText } from 'components/Common';
import { filterOrgUsersForAutocomplete } from 'components/CreateEntity/CreatePodModal';
import { EditorToolbar, EditorPlaceholder } from 'components/CreateEntity/styles';
import search from 'components/Icons/search';
import { useState } from 'react';
import { Transforms, Editor } from 'slate';
import { deserializeRichText, extractMentions, RichTextEditor, useEditor } from 'components/RichText';
import { ReactEditor } from 'slate-react';
import { useGetOrgUsers } from 'components/CreateEntity/CreateEntityModal/Helpers';
import { useSubmit } from './hooks/useSubmit';
import { FIELDS } from './hooks/constants';
import {RichTextWrapper} from 'components/CreateGrant/styles'
import { TaskDescriptionTextWrapper } from '../helpers';
import { TaskFieldEditableContent } from './Shared';
import { EditorContainer } from 'components/CreateEntity/CreateEntityModal/styles';
import { debounce } from 'lodash';

const EditContent = ({ description, orgId }) => {
  const [editorToolbarNode, setEditorToolbarNode] = useState<HTMLDivElement>();
  const { data: orgUsersData, search, hasMoreOrgUsers, fetchMoreOrgUsers } = useGetOrgUsers(orgId);
  const { submit, error } = useSubmit({ field: FIELDS.DESCRIPTION });
  const editor = useEditor();

  const handleChange = async (value) => await submit(JSON.stringify(value))

  const handleSubmit = debounce(handleChange, 200);

  return (
    <>
      <EditorToolbar ref={setEditorToolbarNode} />
      <RichTextWrapper style={{
        color: 'white'
      }}>

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

const ViewContent = ({toggleEditMode, description}) => {
    const wrapperProps = {
        ...(toggleEditMode ? { onClick: toggleEditMode } : null),
    }
    return (
        <div {...wrapperProps}>
        <TaskDescriptionTextWrapper text={description} />
    </div>

    )
}
const Description = ({description, orgId, canEdit}) => (
    <TaskFieldEditableContent 
        editableContent={() => <EditContent description={description} orgId={orgId} />}
        ViewContent={({toggleEditMode}) => <ViewContent toggleEditMode={canEdit ? toggleEditMode : null} description={description} />}
    />
);

export default Description;
