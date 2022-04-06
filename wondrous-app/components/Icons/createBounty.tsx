const BountyIcon = ({ circle = false }) => (
  <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
    {circle && <circle cx="15" cy="15" r="15" fill="#141414" />}
    <path
      d="m15.117 7.17 2.399 5.11 5.364.825-3.881 3.975.916 5.615-4.797-2.653-4.797 2.653.915-5.615-3.88-3.975 5.363-.825 2.399-5.11Z"
      stroke="#CCBBFF"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default BountyIcon;
