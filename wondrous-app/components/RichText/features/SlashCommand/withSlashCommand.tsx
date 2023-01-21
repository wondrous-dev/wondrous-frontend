import { CustomEditor } from 'components/RichText/types';

const withSlashCommand = (editor: CustomEditor): CustomEditor => {
  const { isInline, isVoid } = editor;

  editor.isInline = (element) => (element.type === 'slashCommand' ? true : isInline(element));

  editor.isVoid = (element) => (element.type === 'slashCommand' ? true : isVoid(element));

  return editor;
};

export default withSlashCommand;
