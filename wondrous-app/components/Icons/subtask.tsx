export function SubtaskLightIcon({
  stroke = '#C4C4C4',
  fill = '#353535',
  width = '25',
  height = '25',
  viewBox = '0 0 25 25',
}) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} fill="none" viewBox={viewBox}>
      <path fill={fill} d="M.354 4.756a4 4 0 014-4h16a4 4 0 014 4v16a4 4 0 01-4 4h-16a4 4 0 01-4-4v-16z" />
      <path stroke={stroke} strokeLinecap="round" strokeLinejoin="round" d="M12.912 14.527l1.133 1.134 2.287-2.287" />
      <rect
        width="8"
        height="8"
        x="10.626"
        y="10.518"
        stroke={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
        rx="2"
      />
      <path stroke={stroke} strokeLinecap="round" strokeLinejoin="round" d="M10.286 14.755H8.594a1 1 0 01-1-1v-3.237" />
      <circle cx="7.594" cy="8.503" r="1.508" stroke={stroke} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function SubtaskDarkIcon({ fill = '#0F0F0F', width = '25', height = '25' }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} height={height} fill="none" viewBox="0 0 25 25">
      <path fill={fill} d="M.06 4.6a4 4 0 014-4h16a4 4 0 014 4v16a4 4 0 01-4 4h-16a4 4 0 01-4-4v-16z" />
      <path stroke="#707070" strokeLinecap="round" strokeLinejoin="round" d="M12.619 14.37l1.133 1.135 2.287-2.287" />
      <rect
        width="8"
        height="8"
        x="10.333"
        y="10.361"
        stroke="#707070"
        strokeLinecap="round"
        strokeLinejoin="round"
        rx="2"
      />
      <path stroke="#707070" strokeLinecap="round" strokeLinejoin="round" d="M9.993 14.6H8.301a1 1 0 01-1-1V10.36" />
      <circle cx="7.301" cy="8.347" r="1.508" stroke="#707070" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
