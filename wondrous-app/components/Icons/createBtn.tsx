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
