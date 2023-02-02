import React from 'react';
import { getHandler, Value } from '@udecode/plate-core';
import { getRootProps } from '@udecode/plate-styled-components';

import { MentionElementProps } from './MentionElement.types';

export const MentionElement = <V extends Value>(props: MentionElementProps<V>) => {
  const { attributes, children, nodeProps, element, prefix, onClick, renderLabel } = props;

  const rootProps = getRootProps(props);

  return (
    <span
      {...attributes}
      data-slate-value={element.value}
      contentEditable={false}
      onClick={getHandler(onClick, element)}
      {...rootProps}
      {...nodeProps}
    >
      {renderLabel ? renderLabel(element) : element.value}
      {children}
    </span>
  );
};
