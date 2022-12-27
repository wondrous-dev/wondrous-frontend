import React from 'react';

export default function MembersIcon({ circle = false, stroke = '#707070', ...props }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="-3 -5 24 24" {...props}>
      <path
        stroke={stroke}
        strokeLinecap="round"
        d="M12.258 13.711v-1.444a2.889 2.889 0 00-2.888-2.89H3.592a2.889 2.889 0 00-2.889 2.89v1.444M6.483 6.49a2.889 2.889 0 100-5.778 2.889 2.889 0 000 5.778zM16.596 13.712v-1.444a2.888 2.888 0 00-2.166-2.795M11.531.806a2.889 2.889 0 010 5.597"
      />
    </svg>
  );
}
