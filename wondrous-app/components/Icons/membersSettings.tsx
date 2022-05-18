import React from 'react';

export default function MembersSettings({ circle = false, ...props }) {
  return (
    <svg width="73" height="73" viewBox="0 0 73 73" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      {circle ? <circle cx="36.1211" cy="36.4795" r="36" fill="url(#paint0_linear_4394_84634)" /> : null}
      <path
        d="M42.83 48.5598V45.875C42.83 44.4509 42.2642 43.0851 41.2572 42.0781C40.2502 41.0711 38.8845 40.5054 37.4604 40.5054H26.7212C25.2971 40.5054 23.9313 41.0711 22.9243 42.0781C21.9173 43.0851 21.3516 44.4509 21.3516 45.875V48.5598"
        stroke="#707070"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M32.0942 35.1367C35.0598 35.1367 37.4638 32.7326 37.4638 29.7671C37.4638 26.8015 35.0598 24.3975 32.0942 24.3975C29.1287 24.3975 26.7246 26.8015 26.7246 29.7671C26.7246 32.7326 29.1287 35.1367 32.0942 35.1367Z"
        stroke="#707070"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M50.8924 48.5615V45.8767C50.8915 44.687 50.4956 43.5312 49.7667 42.591C49.0377 41.6507 48.0172 40.9791 46.8652 40.6816"
        stroke="#707070"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M41.4785 24.5718C42.6335 24.8675 43.6573 25.5392 44.3884 26.4811C45.1194 27.4229 45.5162 28.5813 45.5162 29.7736C45.5162 30.9659 45.1194 32.1242 44.3884 33.0661C43.6573 34.0079 42.6335 34.6796 41.4785 34.9754"
        stroke="#707070"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <defs>
        <linearGradient
          id="paint0_linear_4394_84634"
          x1="36.1211"
          y1="0.479492"
          x2="36.1211"
          y2="72.4795"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#1E1E1E" />
          <stop offset="1" stopColor="#141414" />
        </linearGradient>
      </defs>
    </svg>
  );
}
