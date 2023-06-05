import React, { SVGProps } from 'react';

import palette from 'theme/palette';

export const ShortTextIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    focusable="false"
    role="img"
    fill={palette.grey250}
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect width={24} height={24} fill="none" />
    <path d="M4 9h16v2H4V9zm0 4h10v2H4v-2z" />
  </svg>
);
