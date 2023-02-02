import { Text } from 'slate';
import { Strikethrough } from './styles';

const Leaf: React.FC<{
  children: any;
  leaf: Text;
  text?: Text;
  attributes?: {
    'data-slate-leaf': true;
  };
}> = ({ attributes = {}, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  if (leaf.strikethrough) {
    children = <Strikethrough>{children}</Strikethrough>;
  }

  return <span {...attributes}>{children}</span>;
};

export default Leaf;
