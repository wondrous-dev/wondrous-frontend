function RightArrowCaret(props) {
  return (
    <svg
      width={props?.width || '6'}
      height={props?.height || '9'}
      viewBox="0 0 6 9"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={props?.style}
    >
      <path
        d="M5.66768 3.83194L2.21628 0.747125C1.73068 0.313357 0.90625 0.623572 0.90625 1.24045L0.90625 7.84963C0.90625 8.46606 1.73068 8.77672 2.21628 8.34251L5.66768 5.25769C6.10699 4.86481 6.10699 4.22438 5.66768 3.83194Z"
        fill={props?.fill || 'white'}
      />
    </svg>
  );
}

export default RightArrowCaret;
