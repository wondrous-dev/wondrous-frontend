import React from 'react';

export default function CreateBtnIcon(props) {
  return (
    <svg
      width={props?.width || '33'}
      height={props?.height || '35'}
      viewBox="0 1 35 35"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={props?.style}
    >
      <circle cx="17.7748" cy="17.8338" r="16.89" fill="url(#paint0_linear_509_1401)" />
      <path d="M23.6348 17.8188H17.7271H11.8848" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M17.7598 11.9438V17.8188V23.6938" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
      <defs>
        <linearGradient
          id="paint0_linear_509_1401"
          x1="0.884766"
          y1="17.9438"
          x2="34.3848"
          y2="17.9438"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#05B5FF" />
          <stop offset="0.509929" stopColor="#722BFF" />
          <stop offset="1" stopColor="#C4ADFF" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export const CreateIconOutlined = (props) => {
  return (
    <svg width="41" height="41" viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle
        cx="20.1484"
        cy="20.291"
        r="19.3333"
        fill="#0F0F0F"
        stroke="url(#paint0_linear_10646_243532)"
        strokeWidth="1.33333"
      />
      <path d="M26.5312 20.1543H19.9672L13.4757 20.1543" stroke="white" strokeLinecap="round" />
      <path d="M20.0078 13.627V20.1547V26.6825" stroke="white" strokeLinecap="round" />
      <defs>
        <linearGradient
          id="paint0_linear_10646_243532"
          x1="55.2458"
          y1="-42.2449"
          x2="3.65569"
          y2="38.6426"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#FF6DD7" />
          <stop offset="0.21875" stopColor="#B820FF" />
          <stop offset="0.401042" stopColor="#F93701" />
          <stop offset="0.588542" stopColor="#FFD653" />
          <stop offset="0.78125" stopColor="#00BAFF" />
          <stop offset="0.953125" stopColor="#06FFA5" />
        </linearGradient>
      </defs>
    </svg>
  );
};
