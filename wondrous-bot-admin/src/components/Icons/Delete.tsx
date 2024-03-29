const DeleteIcon = ({ stroke = "black", onClick = () => {}, ...props }) => (
  <svg
    width="13"
    height="17"
    viewBox="0 0 13 17"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    onClick={onClick}
    {...props}
  >
    <path
      d="M3.50293 3.80176L3.50293 2.30176C3.50293 1.90393 3.66097 1.5224 3.94227 1.2411C4.22357 0.959793 4.6051 0.801758 5.00293 0.801758L8.00293 0.801758C8.40075 0.801758 8.78229 0.959793 9.06359 1.2411C9.34489 1.5224 9.50293 1.90393 9.50293 2.30176V3.80176M11.7529 3.80176L11.7529 14.3018C11.7529 14.6996 11.5949 15.0811 11.3136 15.3624C11.0323 15.6437 10.6508 15.8018 10.2529 15.8018L2.75293 15.8018C2.3551 15.8018 1.97357 15.6437 1.69227 15.3624C1.41096 15.0811 1.25293 14.6996 1.25293 14.3018L1.25293 3.80176L11.7529 3.80176Z"
      stroke={stroke}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default DeleteIcon;
