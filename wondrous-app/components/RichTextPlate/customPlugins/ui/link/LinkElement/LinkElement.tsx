import React from 'react';
import { Value } from '@udecode/plate-core';
import { StyledElementProps } from '@udecode/plate-styled-components';

import { Link, TLinkElement } from 'components/RichTextPlate/customPlugins/CustomLink';
import { getLinkElementStyles } from './LinkElement.styles';

export const LinkElement = (props: StyledElementProps<Value, TLinkElement>) => {
  const { as, ...rootProps } = props;

  const { root } = getLinkElementStyles(props);

  // @ts-ignore
  return <Link.Root {...rootProps} css={root.css} />;
};
