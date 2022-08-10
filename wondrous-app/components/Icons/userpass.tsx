import { SvgIcon } from '@mui/material';
import React from 'react';
import palette from 'theme/palette';

export function EmailIcon(props) {
  return (
    <svg viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M18.1 9.237c0 3.025-1.47 4.898-3.864 4.898-1.239 0-2.123-.538-2.383-1.45h-.182c-.394.97-1.144 1.46-2.25 1.46-1.998 0-3.324-1.614-3.324-4.053 0-2.334 1.278-3.909 3.18-3.909 1.039 0 1.856.5 2.24 1.364h.183V6.414h2.21v4.879c0 .682.307 1.085.826 1.085.846 0 1.384-1.123 1.384-2.91 0-3.477-2.277-5.705-5.823-5.705-3.7 0-6.217 2.594-6.217 6.368 0 3.822 2.536 6.214 6.611 6.214.884 0 1.797-.116 2.297-.269v1.71c-.692.18-1.595.286-2.509.286-5.025 0-8.38-3.198-8.38-7.99 0-4.735 3.364-8.01 8.227-8.01 4.632 0 7.774 2.9 7.774 7.165Zm-9.476.922c0 1.248.52 1.997 1.394 1.997.884 0 1.422-.759 1.422-1.997 0-1.239-.548-1.998-1.422-1.998-.874 0-1.394.749-1.394 1.998Z"
        fill="#7427ff"
      />
    </svg>
  );
}

export function LockIcon(props) {
  return (
    <svg viewBox="0 0 21 21" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M10.102 1.405a4.677 4.677 0 0 0-4.667 4.667v1.333H4.102c-.737 0-1.334.597-1.334 1.334v8c0 .736.597 1.333 1.334 1.333h12c.736 0 1.333-.597 1.333-1.333v-8c0-.737-.597-1.334-1.333-1.334h-1.334V6.072c0-2.486-1.975-4.488-4.43-4.618a.666.666 0 0 0-.236-.049Zm0 1.334a3.323 3.323 0 0 1 3.333 3.333v1.333H6.768V6.072a3.323 3.323 0 0 1 3.334-3.333Z"
        fill="#7427ff"
      />
    </svg>
  );
}

export function LockedIconOutline(props) {
  return (
    <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M3.86523 3.70947C3.86523 2.05262 5.20838 0.709473 6.86523 0.709473V0.709473C8.52209 0.709473 9.86523 2.05262 9.86523 3.70947V5.70947H3.86523V3.70947Z"
        stroke="#F93701"
        strokeLinecap="round"
      />
      <path d="M8.99023 8.70947L4.86523 11.7095" stroke="#F93701" strokeLinecap="round" />
      <path d="M4.86523 8.70947L8.99023 11.7095" stroke="#F93701" strokeLinecap="round" />
      <rect x="0.865234" y="5.70947" width="12" height="9" rx="2" stroke="#F93701" strokeLinecap="round" />
    </svg>
  );
}
export function LockIconOutline(props) {
  return (
    <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M4.33594 5.65723V3.43625C4.33518 2.74777 4.61369 2.0836 5.11738 1.57266C5.62107 1.06172 6.31402 0.740479 7.0617 0.671288C7.80938 0.602097 8.55845 0.789897 9.1635 1.19823C9.76854 1.60656 10.1864 2.20629 10.3359 2.881"
        stroke="#06FFA5"
        strokeLinecap="round"
      />
      <path
        d="M9.33594 8.65723L6.95451 11.2551C6.75635 11.4713 6.41553 11.4713 6.21736 11.2551L5.33594 10.2936"
        stroke="#06FFA5"
        strokeLinecap="round"
      />
      <rect x="1.33594" y="5.65723" width="12" height="9" rx="2" stroke="#06FFA5" strokeLinecap="round" />
    </svg>
  );
}

export function PublicEyeIcon(props) {
  return (
    <svg width="16" height="13" viewBox="0 0 16 13" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M0.5 6.22083C0.5 6.22083 3.22727 0.720825 8 0.720825C12.7727 0.720825 15.5 6.22083 15.5 6.22083C15.5 6.22083 12.7727 11.7208 8 11.7208C3.22727 11.7208 0.5 6.22083 0.5 6.22083Z"
        stroke="#CCBBFF"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.00639 8.28333C9.13607 8.28333 10.0518 7.35991 10.0518 6.22083C10.0518 5.08174 9.13607 4.15833 8.00639 4.15833C6.87672 4.15833 5.96094 5.08174 5.96094 6.22083C5.96094 7.35991 6.87672 8.28333 8.00639 8.28333Z"
        stroke="#CCBBFF"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
export function PrivateEyeIcon(props) {
  return (
    <svg width="22" height="18" viewBox="0 0 26 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g filter="url(#filter0_d_9081_245173)">
        <path
          d="M12.0442 3.9503C12.6253 3.81429 13.2202 3.7463 13.817 3.7477C19.7261 3.7477 23.1027 10.5009 23.1027 10.5009C22.5903 11.4596 21.9792 12.3621 21.2793 13.1938M15.6066 12.2906C15.3747 12.5394 15.0951 12.7389 14.7845 12.8774C14.4738 13.0158 14.1385 13.0902 13.7985 13.0962C13.4584 13.1022 13.1207 13.0396 12.8053 12.9123C12.49 12.7849 12.2035 12.5953 11.9631 12.3548C11.7226 12.1144 11.533 11.8279 11.4056 11.5126C11.2783 11.1972 11.2157 10.8595 11.2217 10.5194C11.2277 10.1794 11.3021 9.84407 11.4406 9.53342C11.579 9.22277 11.7785 8.94318 12.0274 8.71134M18.8312 15.5152C17.3882 16.6152 15.6311 17.2245 13.817 17.2542C7.90787 17.2542 4.53125 10.5009 4.53125 10.5009C5.58129 8.54411 7.03766 6.83445 8.80268 5.48666L18.8312 15.5152Z"
          stroke="#CCBBFF"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <path d="M4.53125 1.21545L23.1027 19.7869" stroke="#CCBBFF" strokeLinecap="round" strokeLinejoin="round" />
      <defs>
        <filter
          id="filter0_d_9081_245173"
          x="0.03125"
          y="3.24768"
          width="27.5703"
          height="22.5066"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="4" />
          <feGaussianBlur stdDeviation="2" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_9081_245173" />
          <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_9081_245173" result="shape" />
        </filter>
      </defs>
    </svg>
  );
}
