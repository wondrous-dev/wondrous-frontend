import React from 'react';

export default function CreateBtnIconDark(props) {
  return (
    <svg
      width={props?.width || '31'}
      height={props?.height || '31'}
      viewBox="0 0 31 31"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={props?.style}
      onClick={props?.onClick || null}
    >
      <circle cx="15.6816" cy="15.4521" r="15" fill="#1B1B1B" />
      <path d="M21.4316 15.3271H15.524L9.68164 15.3271" stroke="#CCBBFF" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M15.5566 9.45215V15.3271V21.2021" stroke="#CCBBFF" strokeWidth="1.4" strokeLinecap="round" />
      <defs>
        <linearGradient
          id="paint0_linear_9265_141384"
          x1="15.6818"
          y1="30.4521"
          x2="15.6818"
          y2="-35.5175"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#141414" />
          <stop offset="0.9999" stopColor="#474747" />
          <stop offset="1" stopColor="#141414" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}
