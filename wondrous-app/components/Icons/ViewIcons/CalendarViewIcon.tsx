import * as React from 'react';

type Props = {
  color?: string;
};

const CalendarViewIcon = ({ color = '#CBF', ...props }: Props) => (
  <svg width={17} height={18} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path
      d="M14.717 2.201h-11.9a1.7 1.7 0 0 0-1.7 1.7v11.9a1.7 1.7 0 0 0 1.7 1.7h11.9a1.7 1.7 0 0 0 1.7-1.7V3.9a1.7 1.7 0 0 0-1.7-1.7ZM12.168.5v3.4M5.366.5v3.4M1.117 7.303h15.3"
      stroke={color}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default CalendarViewIcon;
