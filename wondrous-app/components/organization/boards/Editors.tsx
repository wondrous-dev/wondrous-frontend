import React, { useEffect, useState } from 'react';
import Wrapper from 'components/Wrapper';

import { extractMentions, RichTextEditor, useEditor } from 'components/RichText';
import { Editor, Transforms } from 'slate';
import { ReactEditor } from 'slate-react';
import styled from 'styled-components';
import { useGetOrgUsers, filterOrgUsersForAutocomplete } from 'components/CreateEntity/CreateEntityModal/Helpers';

const editorPadding = 0;
const editorMinHeight = 100;
const EditorToolbar = styled.div`
  margin: 6px 0 18px;
`;
const EditorContainer = styled.div`
  padding: ${editorPadding}px;
  min-height: ${editorMinHeight}px;
  overflow: auto;
  cursor: text;
  background: #f4f4f4;
`;
const EditorPlaceholder = styled.div`
  min-height: ${editorMinHeight - editorPadding * 2}px;
`;

const BaseCardWrapper = styled.header.attrs({
  id: 'modal-scrolling-container', // this is needed for the modal to be able to attach floating elements inside it
})`
  display: flex;
  flex-direction: column;

  padding: 1px;
  background: rgb(35, 35, 35);
  background: linear-gradient(0deg, rgba(35, 35, 35, 1) 0%, rgba(75, 75, 75, 1) 100%);
  border-radius: 6px;
`;
type Props = {
  orgId?: string;
};

function OrgBoards(props: Props) {
  const [editorToolbarNode, setEditorToolbarNode] = useState<HTMLDivElement>();
  const editor = useEditor();
  const { data: orgUsersData, search } = useGetOrgUsers('51641043825721354');

  return (
    <Wrapper>
      <BaseCardWrapper>
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
            initialValue={[{ children: [{ text: 'Some bounty description' }], type: 'paragraph' }]}
            mentionables={filterOrgUsersForAutocomplete(orgUsersData)}
            placeholder={<EditorPlaceholder>Enter a description</EditorPlaceholder>}
            toolbarNode={editorToolbarNode}
            onChange={(value) => {
              console.log(value);
            }}
            editorContainerNode={document.querySelector('#modal-scrolling-container')}
            onClick={(e) => {
              // we need to stop click event propagation,
              // since EditorContainer moves cursor to the last position in the editor on click
              e.stopPropagation();
            }}
          />
        </EditorContainer>
      </BaseCardWrapper>
    </Wrapper>
  );
}

export default OrgBoards;
