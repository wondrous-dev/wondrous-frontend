const SortIcon = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={31} height={30} fill="none" {...props}>
    <rect width={30} height={30} x={0.123} fill="#fff" rx={6} />
    <path
      stroke="#000"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M7.271 15h9.854M7.271 9.766h15.704M7.271 20.234h9.854"
    />
  </svg>
);
export default SortIcon;
