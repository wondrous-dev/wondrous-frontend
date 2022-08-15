import React from 'react';

export default function UserCheckIcon({ circle = false, ...props }) {
  return (
    <svg width="32" height="26" viewBox="0 0 32 26" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      {circle && <circle cx="30.1832" cy="30.817" r="30.1832" fill="#141414" />}
      <path
        d="M20.8736 24.9315V22.2929C20.8736 20.8932 20.3176 19.551 19.3279 18.5613C18.3382 17.5716 16.996 17.0156 15.5964 17.0156H6.36121C4.9616 17.0156 3.61932 17.5716 2.62965 18.5613C1.63998 19.551 1.08398 20.8932 1.08398 22.2929V24.9315"
        stroke="#7A7A7A"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.9784 11.7385C13.8929 11.7385 16.2556 9.37584 16.2556 6.46131C16.2556 3.54678 13.8929 1.18408 10.9784 1.18408C8.06387 1.18408 5.70117 3.54678 5.70117 6.46131C5.70117 9.37584 8.06387 11.7385 10.9784 11.7385Z"
        stroke="#7A7A7A"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M22.1934 11.7387L24.832 14.3773L30.1092 9.1001"
        stroke="#7A7A7A"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
