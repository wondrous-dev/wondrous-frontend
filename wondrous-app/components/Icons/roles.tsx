import React from 'react';

export default function RolesIcon({ color = '#707070', ...props }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="-4 -4 24 24" {...props}>
      <path
        stroke={color}
        strokeLinecap="round"
        d="M11.537 13.712v-1.444a2.889 2.889 0 00-2.89-2.89H3.593a2.889 2.889 0 00-2.889 2.89v1.444M6.115 6.49a2.889 2.889 0 100-5.778 2.889 2.889 0 000 5.778zM14.43 4.323v4.334M16.591 6.49h-4.333"
      />
    </svg>
  );
}
