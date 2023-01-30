import { Value } from '@udecode/plate-core';
import { createStyles } from '@udecode/plate-styled-components';
import { css } from 'styled-components';
import { MentionElementStyleProps } from './MentionElement.types';

export const getMentionElementStyles = <V extends Value>(props: MentionElementStyleProps<V>) =>
  createStyles(
    { prefixClassNames: 'MentionElement', ...props },
    {
      root: [
        props.selected && props.focused,
        css`
          padding: 3px 3px 2px;
          border-radius: 4px;
        `,
      ],
    }
  );
