function InfoIcon(props) {
  const { strokeColor = '#CCBBFF', fillColor = 'none' } = props;

  return (
    <svg width="17" height="16" viewBox="0 0 17 16" fill={fillColor} xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M8.21875 15.1055C12.0847 15.1055 15.2188 11.9715 15.2188 8.10547C15.2188 4.23948 12.0847 1.10547 8.21875 1.10547C4.35276 1.10547 1.21875 4.23948 1.21875 8.10547C1.21875 11.9715 4.35276 15.1055 8.21875 15.1055Z"
        stroke={strokeColor}
        strokeWidth="1.65"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.21875 5.30664V8.10664"
        stroke={strokeColor}
        strokeWidth="1.65"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.21875 10.9043H8.22575"
        stroke={strokeColor}
        strokeWidth="1.65"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
export default InfoIcon;
