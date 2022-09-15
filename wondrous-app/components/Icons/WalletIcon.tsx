const WalletIcon = (props) => {
  const { strokeColor = '#CBF' } = props;
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="19" height="16" fill="none" viewBox="0 0 19 16">
      <path
        stroke={strokeColor}
        strokeLinecap="round"
        d="M16.606 1H2.561C1.699 1 1 1.77 1 2.722v10.33c0 .952.699 1.723 1.56 1.723h14.046c.862 0 1.56-.771 1.56-1.722V2.722c0-.951-.698-1.722-1.56-1.722zM1 6.164h17.167"
      />
    </svg>
  );
};

export default WalletIcon;
