import { CustomEditor } from 'components/RichText/types';

const withMentions = (editor: CustomEditor): CustomEditor => {
  const { isInline, isVoid } = editor;

  editor.isInline = (element) => (element.type === 'mention' ? true : isInline(element));

  editor.isVoid = (element) => (element.type === 'mention' ? true : isVoid(element));

  return editor;
};

export default withMentions;
