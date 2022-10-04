import React from 'react';
import palette from 'theme/palette';

export const SmallDao2DaoIcon = ({ stroke = '#7A7A7A', ...rest }) => (
  <svg width="16" height="13" viewBox="0 0 16 13" fill="none" xmlns="http://www.w3.org/2000/svg" {...rest}>
    <path
      d="M5.71303 0.912109L10.5592 3.71003V9.30588L5.71303 12.1038L0.866889 9.30588V3.71003L5.71303 0.912109Z"
      stroke={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.2208 0.912109L15.067 3.71003V9.30588L10.2208 12.1038L5.3747 9.30588V3.71003L10.2208 0.912109Z"
      stroke={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
const Dao2DaoIcon = ({ stroke = '#7A7A7A', ...rest }) => (
  <svg width={23} height={18} fill="none" xmlns="http://www.w3.org/2000/svg" {...rest}>
    <path
      d="m8.476 1.398 6.927 4v8l-6.927 3.999-6.928-4V5.398l6.928-4Z"
      stroke={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="m14.921 1.398 6.928 4v8l-6.928 3.999-6.927-4V5.398l6.927-4Z"
      stroke={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const LargeDao2DaoIcon = () => (
  <svg width="89" height="89" viewBox="0 0 89 89" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M36.5402 23.377L54.6634 33.8404L54.6634 54.7673L36.5402 65.2307L18.417 54.7673L18.417 33.8404L36.5402 23.377Z"
      stroke="#00BAFF"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M53.3995 23.377L71.5227 33.8404V54.7673L53.3995 65.2307L35.2763 54.7673L35.2763 33.8404L53.3995 23.377Z"
      stroke="#00BAFF"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default Dao2DaoIcon;
