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
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 20 20" {...props}>
      <path
        stroke="#7A7A7A"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1"
        d="M15.294 6.74a5.4 5.4 0 00-10.798 0c0 6.298-2.7 8.098-2.7 8.098h16.198s-2.7-1.8-2.7-8.099zM11.45 18.438a1.8 1.8 0 01-3.114 0"
      ></path>
    </svg>
  );
};

{
  /* <svg width="43" height="43" viewBox="0 0 43 43" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="0.648438" y="0.791016" width="41" height="41" rx="20.5" fill="#151515" stroke="url(#paint0_linear_10643_247540)"/>
<path d="M26.6499 17.69C26.6499 16.2581 26.0811 14.8849 25.0686 13.8724C24.0561 12.8598 22.6828 12.291 21.2509 12.291C19.819 12.291 18.4457 12.8598 17.4332 13.8724C16.4207 14.8849 15.8519 16.2581 15.8519 17.69C15.8519 23.9889 13.1523 25.7886 13.1523 25.7886H29.3494C29.3494 25.7886 26.6499 23.9889 26.6499 17.69Z" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M22.8088 29.3887C22.6506 29.6614 22.4235 29.8878 22.1503 30.0451C21.8771 30.2025 21.5673 30.2853 21.252 30.2853C20.9367 30.2853 20.627 30.2025 20.3538 30.0451C20.0806 29.8878 19.8535 29.6614 19.6953 29.3887" stroke="white" stroke-linecap="round" stroke-linejoin="round"/>
<defs>
<linearGradient id="paint0_linear_10643_247540" x1="21.1484" y1="1.29102" x2="21.1484" y2="41.291" gradientUnits="userSpaceOnUse">
<stop stop-color="#F93701"/>
<stop offset="1" stop-color="white"/>
</linearGradient>
</defs>
</svg> */
}

{
  /* <svg width="43" height="43" viewBox="0 0 43 43" fill="none" xmlns="http://www.w3.org/2000/svg">
<rect x="0.648438" y="0.791016" width="41" height="41" rx="20.5" fill="#282828" stroke="url(#paint0_linear_10643_247860)"/>
<path d="M27.0991 17.69C27.0991 16.2581 26.5303 14.8849 25.5178 13.8724C24.5053 12.8598 23.132 12.291 21.7001 12.291C20.2682 12.291 18.8949 12.8598 17.8824 13.8724C16.8699 14.8849 16.3011 16.2581 16.3011 17.69C16.3011 23.9889 13.6016 25.7886 13.6016 25.7886H29.7987C29.7987 25.7886 27.0991 23.9889 27.0991 17.69Z" stroke="#CCBBFF" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M23.258 29.3887C23.0998 29.6614 22.8727 29.8878 22.5995 30.0451C22.3263 30.2025 22.0165 30.2853 21.7013 30.2853C21.386 30.2853 21.0762 30.2025 20.803 30.0451C20.5298 29.8878 20.3027 29.6614 20.1445 29.3887" stroke="#CCBBFF" stroke-linecap="round" stroke-linejoin="round"/>
<defs>
<linearGradient id="paint0_linear_10643_247860" x1="21.1484" y1="1.29102" x2="21.1484" y2="41.291" gradientUnits="userSpaceOnUse">
<stop stop-color="#CCBBFF"/>
<stop offset="1" stop-color="#7A7A7A"/>
</linearGradient>
</defs>
</svg> */
}

export default function NotificationsIcon(props) {
  return (
    <svg width="41" height="41" viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="0.148438" y="0.291016" width="40" height="40" rx="20" fill="#0F0F0F" stroke="none" />
      <path
        d="M25.6499 16.69C25.6499 15.2581 25.0811 13.8849 24.0686 12.8724C23.0561 11.8598 21.6828 11.291 20.2509 11.291C18.819 11.291 17.4457 11.8598 16.4332 12.8724C15.4207 13.8849 14.8519 15.2581 14.8519 16.69C14.8519 22.9889 12.1523 24.7886 12.1523 24.7886H28.3494C28.3494 24.7886 25.6499 22.9889 25.6499 16.69Z"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M21.8088 28.3887C21.6506 28.6614 21.4235 28.8878 21.1503 29.0451C20.8771 29.2025 20.5673 29.2853 20.252 29.2853C19.9367 29.2853 19.627 29.2025 19.3538 29.0451C19.0806 28.8878 18.8535 28.6614 18.6953 28.3887"
        stroke="white"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="21.5938" cy="10.5801" r="3.5" fill="#F93701" stroke="#0F0F0F" strokeWidth="2" />

      <defs>
        <linearGradient
          id="open-notif-gradient"
          x1="21.1484"
          y1="1.29102"
          x2="21.1484"
          y2="41.291"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#CCBBFF" />
          <stop offset="1" stopColor="#7A7A7A" />
        </linearGradient>
      </defs>

      <defs>
        <linearGradient
          id="outline-hover-color"
          x1="21.1484"
          y1="1.29102"
          x2="21.1484"
          y2="41.291"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#F93701" />
          <stop offset="1" stopColor="white" />
        </linearGradient>
        <linearGradient
          id="circle-hover"
          x1="23.8324"
          y1="5.83276"
          x2="21.3324"
          y2="14.1351"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="white" />
          <stop offset="1" stopColor="#F93701" />
        </linearGradient>
      </defs>
    </svg>
  );
}
