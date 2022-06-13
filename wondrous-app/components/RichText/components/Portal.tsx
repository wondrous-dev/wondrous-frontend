import ReactDOM from 'react-dom';

const Portal: React.FC<{ node: Element }> = ({ node, children }) => {
  return node ? ReactDOM.createPortal(children, node) : null;
};

export default Portal;
