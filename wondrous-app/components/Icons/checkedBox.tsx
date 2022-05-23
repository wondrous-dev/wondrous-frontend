export const CheckedBoxIcon = ({
  stroke = '#707070',
  fill = 'none',
  pathFill = '#0F0F0F',
  displayBackground = true,
}) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill={fill} viewBox="0 0 25 25">
      {displayBackground && (
        <path fill={pathFill} d="M.192 4.6a4 4 0 014-4h16a4 4 0 014 4v16a4 4 0 01-4 4h-16a4 4 0 01-4-4v-16z"></path>
      )}
      <path
        stroke={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M9.292 12.616l1.922 1.922 3.874-3.874"
      ></path>
      <rect
        width="11.998"
        height="11.998"
        x="6.194"
        y="6.602"
        stroke={stroke}
        strokeLinecap="round"
        strokeLinejoin="round"
        rx="2"
      ></rect>
    </svg>
  );
};
