import { Value } from '@udecode/plate-core';
import { createStyles, StyledElementProps } from '@udecode/plate-styled-components';
import { css } from 'styled-components';

import { TLinkElement } from 'components/RichTextPlate/custom-components/CustomLink';

export const getLinkElementStyles = <V extends Value>(props: StyledElementProps<V, TLinkElement>) =>
  createStyles(
    { prefixClassNames: 'LinkElement', ...props },
    {
      root: css`
        color: #0078d4;
        text-decoration: initial;

        :hover,
        :visited:hover {
          color: #004578;
          text-decoration: underline;
        }

        :visited {
          color: #0078d4;
        }
      `,
    }
  );
