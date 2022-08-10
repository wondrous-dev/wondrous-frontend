export function RightCaret(props) {
  const { style } = props;

  return (
    <svg
      style={style}
      width={style?.width || '6'}
      height={style?.width || '10'}
      viewBox="0 0 6 10"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M1.26904 9.2915L5.26904 5.2915L1.26904 1.2915"
        stroke="#707070"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
