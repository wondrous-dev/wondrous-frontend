import { Text } from 'slate';
import { Strikethrough } from '../styles';

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

  if (leaf.headingOne) {
    children = <h1>{children}</h1>;
  }

  if (leaf.headingTwo) {
    children = <h2>{children}</h2>;
  }

  if (leaf.headingThree) {
    children = <h3>{children}</h3>;
  }

  if (leaf.code) {
    children = <code>{children}</code>;
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
