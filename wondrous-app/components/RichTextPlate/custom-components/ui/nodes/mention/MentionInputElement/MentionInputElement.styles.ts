import { Value } from '@udecode/plate-core';
import { createStyles } from '@udecode/plate-styled-components';
import { MentionInputElementStyleProps } from './MentionInputElement.types';

export const getMentionInputElementStyles = <V extends Value>(props: MentionInputElementStyleProps<V>) =>
  createStyles(
    { prefixClassNames: 'MentionInputElement', ...props },
    {
      root: [props.selected && props.focused],
    }
  );
