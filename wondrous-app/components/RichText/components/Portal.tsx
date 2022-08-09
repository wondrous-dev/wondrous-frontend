import ReactDOM from 'react-dom';

const Portal: React.FC<{ node: Element }> = ({ node, children }) =>
  node ? ReactDOM.createPortal(children, node) : null;

export default Portal;
