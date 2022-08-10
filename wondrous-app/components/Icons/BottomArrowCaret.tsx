function BottomArrowCaret(props) {
  return (
    <svg
      width={props?.width || '8'}
      height={props?.height || '6'}
      viewBox="0 0 8 6"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={props?.style}
    >
      <path
        d="M4.71298 4.76143L7.7978 1.31003C8.23156 0.824435 7.92135 0 7.30447 0L0.695292 0C0.0788617 0 -0.231797 0.824435 0.202415 1.31003L3.28723 4.76143C3.68011 5.20074 4.32054 5.20074 4.71298 4.76143Z"
        fill={props?.fill || 'white'}
      />
    </svg>
  );
}

export default BottomArrowCaret;
