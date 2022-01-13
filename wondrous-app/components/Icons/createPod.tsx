import React from 'react'

export default function CreatePodIcon({
  circle = false,
  ellipseColor = '#7A7A7A',
  ...props
}) {
  const { style } = props
  return (
    <svg
      style={style}
      width={style?.width || '25'}
      height={style?.width || '25'}
      viewBox="0 0 25 25"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {circle && <circle cx="12.7178" cy="12.0771" r="12" fill="#141414" />}
      <ellipse
        cx="12.718"
        cy="16.3319"
        rx="6.58079"
        ry="1.11219"
        stroke={ellipseColor}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <ellipse
        cx="12.718"
        cy="12.0775"
        rx="6.58079"
        ry="1.11219"
        stroke={ellipseColor}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <ellipse
        cx="12.718"
        cy="7.82215"
        rx="6.58079"
        ry="1.11219"
        stroke={ellipseColor}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
