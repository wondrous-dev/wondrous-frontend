import React from 'react';
import ReactDOM from 'react-dom';

const Portal = ({ node, children }: { node: any; children: any }) =>
  node ? ReactDOM.createPortal(children, node) : null;

export default Portal;
