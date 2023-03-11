import { Value } from '@udecode/plate-core';
import { TMentionElement } from '@udecode/plate-mention';
import { StyledElementProps } from '@udecode/plate-styled-components';

// renderElement props
export interface MentionElementProps<V extends Value> extends StyledElementProps<V, TMentionElement> {
  onClick?: (mentionNode: any) => void;
}
