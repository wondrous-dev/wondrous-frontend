import React from 'react';

export default function DefaultUserImage(props) {
  // eslint-disable-next-line @next/next/no-img-element
  return (
    <svg
      width={props?.style?.width || '28'}
      height={props?.style?.height || '28'}
      viewBox="0 0 28 28"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M27.5 14C27.5 21.4554 21.4554 27.5 14 27.5C6.54464 27.5 0.5 21.4554 0.5 14C0.5 6.54464 6.54464 0.5 14 0.5C21.4554 0.5 27.5 6.54464 27.5 14Z"
        fill="#0F0F0F"
        stroke="#7A7A7A"
      />
      <path
        d="M14.003 17.0294C16.8545 17.0294 19.1662 14.7178 19.1662 11.8663C19.1662 9.01475 16.8545 6.70312 14.003 6.70312C11.1515 6.70312 8.83984 9.01475 8.83984 11.8663C8.83984 14.7178 11.1515 17.0294 14.003 17.0294Z"
        fill="#7A7A7A"
      />
      <path
        d="M13.9964 28.0004C17.233 28.0004 20.1838 26.8006 22.4497 24.8321C21.1648 21.407 17.87 18.9648 13.9964 18.9648C10.1227 18.9648 6.82795 21.407 5.54297 24.8321C7.80895 26.8006 10.7597 28.0004 13.9964 28.0004Z"
        fill="#7A7A7A"
      />
    </svg>
  );
}
