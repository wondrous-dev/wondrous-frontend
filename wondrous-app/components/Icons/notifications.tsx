import React from 'react';

export const StatusLiked = () => {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="7.97949" cy="8.0791" r="7.15137" fill="#7547FF" />
      <path
        d="M10.9578 5.55096C10.7857 5.37877 10.5813 5.24217 10.3564 5.14898C10.1315 5.05578 9.89039 5.00781 9.64692 5.00781C9.40346 5.00781 9.16238 5.05578 8.93747 5.14898C8.71255 5.24217 8.50819 5.37877 8.33608 5.55096L7.97888 5.90816L7.62169 5.55096C7.27403 5.2033 6.80251 5.00799 6.31084 5.00799C5.81918 5.00799 5.34766 5.2033 5 5.55096C4.65234 5.89862 4.45703 6.37014 4.45703 6.86181C4.45703 7.35347 4.65234 7.82499 5 8.17265L5.3572 8.52985L7.97888 11.1515L10.6006 8.52985L10.9578 8.17265C11.13 8.00054 11.2666 7.79618 11.3598 7.57126C11.4529 7.34634 11.5009 7.10527 11.5009 6.86181C11.5009 6.61834 11.4529 6.37727 11.3598 6.15235C11.2666 5.92743 11.13 5.72308 10.9578 5.55096Z"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const StatusAssigned = () => {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="7.97949" cy="8.0791" r="7.15137" fill="url(#paint0_linear_1310_59461)" />
      <circle cx="7.97888" cy="8.07849" r="3.63513" stroke="white" strokeLinecap="round" strokeDasharray="2.23 2.23" />
      <defs>
        <linearGradient
          id="paint0_linear_1310_59461"
          x1="14.3832"
          y1="-8.36138"
          x2="7.23183"
          y2="15.388"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="1" stopColor="#F93701" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export const StatusArchived = () => {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="7.97949" cy="8.0791" r="7.15137" fill="#30799E" />
      <path d="M10.7244 6.85742V10.8281H5.22656V6.85742" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M11.3367 5.33008H4.61719V6.85725H11.3367V5.33008Z"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M7.36719 9.07812H8.58892" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};

export const StatusFlag = () => {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <circle cx="7.97949" cy="8.0791" r="7.15137" fill="#FBAB50" />
      <path d="M5.84375 12.1461V9.81178V4.01172" stroke="white" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M12.1118 6.59827C10.0224 6.216 7.93314 9.53634 5.84375 9.1551V4.01172C7.93314 6.10811 10.0224 4.50167 12.1118 6.59827Z"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export const NotificationOutlineSettings = (props) => {
  const { width, height } = props;
  return (
    <svg
      width={width || '16'}
      height={height || '18'}
      viewBox="0 0 16 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9.41903 18.3347C9.28401 18.5675 9.0902 18.7607 8.85702 18.895C8.62384 19.0293 8.35947 19.1 8.09038 19.1C7.82128 19.1 7.55691 19.0293 7.32373 18.895C7.09055 18.7607 6.89674 18.5675 6.76172 18.3347"
        stroke="#7A7A7A"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12.6998 8.35049C12.6998 7.12836 12.2143 5.95628 11.3502 5.0921C10.486 4.22792 9.31391 3.74243 8.09178 3.74243C6.86964 3.74243 5.69757 4.22792 4.83339 5.0921C3.96921 5.95628 3.48372 7.12836 3.48372 8.35049C3.48372 13.7266 1.17969 15.2626 1.17969 15.2626H15.0039C15.0039 15.2626 12.6998 13.7266 12.6998 8.35049Z"
        stroke="#7A7A7A"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="8.38597" cy="3.13402" r="2.05003" fill="#7A7A7A" stroke="#0F0F0F" strokeWidth="2" />
    </svg>
  );
};
export default function NotificationsIcon(props) {
  const { width, height } = props;
  return (
    <svg
      width={width || '16'}
      height={height || '18'}
      viewBox="0 0 16 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.55998 0C6.76545 0 6.11998 0.645467 6.11998 1.44C6.11998 2.23452 6.76545 2.87999 7.55998 2.87999C8.3545 2.87999 8.99997 2.23452 8.99997 1.44C8.99997 0.645467 8.3545 0 7.55998 0ZM5.53498 2.19374C3.88967 2.89827 2.87999 4.48452 2.87999 6.47998C2.87999 10.44 1.51171 11.4342 0.697498 12.0262C0.336093 12.2878 0 12.5311 0 12.96C0 14.4745 2.26124 15.12 7.55998 15.12C12.8587 15.12 15.12 14.4745 15.12 12.96C15.12 12.5311 14.7839 12.2878 14.4225 12.0262C13.6082 11.4342 12.24 10.44 12.24 6.47998C12.24 4.47889 11.2317 2.89687 9.58497 2.19374C9.277 3.01218 8.48388 3.59999 7.55998 3.59999C6.63607 3.59999 5.84295 3.01077 5.53498 2.19374ZM5.39998 15.7949C5.39998 15.809 5.39998 15.8259 5.39998 15.8399C5.39998 17.031 6.36889 17.9999 7.55998 17.9999C8.75107 17.9999 9.71997 17.031 9.71997 15.8399C9.71997 15.8259 9.71997 15.809 9.71997 15.7949C9.04216 15.8231 8.32216 15.8399 7.55998 15.8399C6.79779 15.8399 6.07779 15.8231 5.39998 15.7949Z"
        fill="#707070"
      />
    </svg>
  );
}
