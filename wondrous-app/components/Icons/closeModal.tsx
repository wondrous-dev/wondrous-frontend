import React from 'react';

export default function CloseModalIcon(props) {
  const { strokeColor = 'white', strokeWidth = '1.4' } = props;

  return (
    <svg width="17" height="18" viewBox="0 0 17 18" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M12.7368 4.80713L8.55949 8.98446L4.42831 13.1156"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      <path
        d="M4.42822 4.80713L8.58248 8.96138L12.7367 13.1156"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
    </svg>
  );
}
