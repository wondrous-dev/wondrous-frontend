import React, { useState } from 'react';
import palette from 'theme/palette';

export function TaskMenuIcon(props) {
  const {
    fill = palette.background.default,
    fillOnHover = palette.grey400,
    stroke = palette.grey400,
    strokeOnHover = palette.white,
  } = props;

  const [colorFill, setColorFill] = useState(fill);
  const [strokeColor, setStrokeColor] = useState(stroke);

  const handlePointerEnter = (event) => {
    setColorFill(fillOnHover);
    setStrokeColor(strokeOnHover);
  };

  const handlePointerLeave = (event) => {
    setColorFill(fill);
    setStrokeColor(stroke);
  };

  return (
    <svg
      width="26"
      height="25"
      cursor="pointer"
      viewBox="0 0 26 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      <circle cx="13.1061" cy="12.7446" r="12.1562" fill={colorFill} />
      <path
        d="M13.1061 7.75787V7.765M13.1061 12.7451V12.7522M13.1061 17.7323V17.7395M13.1061 8.47034C12.9172 8.47034 12.736 8.39527 12.6024 8.26166C12.4687 8.12805 12.3937 7.94683 12.3937 7.75787C12.3937 7.56892 12.4687 7.3877 12.6024 7.25409C12.736 7.12047 12.9172 7.04541 13.1061 7.04541C13.2951 7.04541 13.4763 7.12047 13.6099 7.25409C13.7435 7.3877 13.8186 7.56892 13.8186 7.75787C13.8186 7.94683 13.7435 8.12805 13.6099 8.26166C13.4763 8.39527 13.2951 8.47034 13.1061 8.47034ZM13.1061 13.4576C12.9172 13.4576 12.736 13.3825 12.6024 13.2489C12.4687 13.1153 12.3937 12.9341 12.3937 12.7451C12.3937 12.5562 12.4687 12.3749 12.6024 12.2413C12.736 12.1077 12.9172 12.0326 13.1061 12.0326C13.2951 12.0326 13.4763 12.1077 13.6099 12.2413C13.7435 12.3749 13.8186 12.5562 13.8186 12.7451C13.8186 12.9341 13.7435 13.1153 13.6099 13.2489C13.4763 13.3825 13.2951 13.4576 13.1061 13.4576ZM13.1061 18.4448C12.9172 18.4448 12.736 18.3697 12.6024 18.2361C12.4687 18.1025 12.3937 17.9213 12.3937 17.7323C12.3937 17.5434 12.4687 17.3622 12.6024 17.2286C12.736 17.0949 12.9172 17.0199 13.1061 17.0199C13.2951 17.0199 13.4763 17.0949 13.6099 17.2286C13.7435 17.3622 13.8186 17.5434 13.8186 17.7323C13.8186 17.9213 13.7435 18.1025 13.6099 18.2361C13.4763 18.3697 13.2951 18.4448 13.1061 18.4448Z"
        stroke={strokeColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
