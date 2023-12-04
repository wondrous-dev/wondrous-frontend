const CheckIcon = ({ fill = "#fff", ...rest }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={9} height={7} fill="none" {...rest}>
    <path
      fill={fill}
      d="m3.051 6.418-2.8-2.8a.35.35 0 0 1 0-.495l.495-.495a.35.35 0 0 1 .495 0l2.058 2.058L7.106.878a.35.35 0 0 1 .495 0l.495.495a.35.35 0 0 1 0 .495l-4.55 4.55a.35.35 0 0 1-.495 0Z"
    />
  </svg>
);

export const LargeCheckIcon = () => (
  <svg width="13" height="10" viewBox="0 0 13 10" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M12.1364 0.539062L4.13636 8.53906L0.5 4.9027"
      stroke="#2A8D5C"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);
export default CheckIcon;
