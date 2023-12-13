const ImageUploadIcon = ({ withWrapper = true, ...rest }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={121} height={121} viewBox="0 0 121 121" fill="none" {...rest}>
    {withWrapper ? <rect x={0.427734} y={0.296875} width={120} height={120} rx={14.4} fill="#E8E8E8" /> : null}
    <circle opacity={0.4} cx={60.4274} cy={60.2946} r={24.0836} fill="#1D1D1D" />
    <path
      d="M59.2375 53.875C58.6977 53.875 58.1966 54.1627 57.9248 54.629L57.1826 55.9015H55.8692C54.6628 55.9015 53.6738 56.8905 53.6738 58.0969V64.5142C53.6738 65.7207 54.6628 66.7096 55.8692 66.7096H64.9886C66.195 66.7096 67.184 65.7207 67.184 64.5142V58.0969C67.184 56.8905 66.195 55.9015 64.9886 55.9015H63.6752L62.933 54.629C62.6612 54.1627 62.1601 53.875 61.6203 53.875H59.2375ZM59.2375 54.8883H61.6203C61.8012 54.8883 61.9667 54.9837 62.0576 55.1396L62.9469 56.6634C62.9915 56.7399 63.0553 56.8033 63.1321 56.8474C63.2088 56.8915 63.2957 56.9147 63.3842 56.9148H64.9886C65.6472 56.9148 66.1707 57.4383 66.1707 58.0969V64.5142C66.1707 65.1729 65.6472 65.6964 64.9886 65.6964H55.8692C55.2106 65.6964 54.6871 65.1729 54.6871 64.5142V58.0969C54.6871 57.4383 55.2106 56.9148 55.8692 56.9148H57.4736C57.5621 56.9147 57.649 56.8915 57.7257 56.8474C57.8025 56.8033 57.8663 56.7399 57.9109 56.6634L58.8002 55.1396C58.891 54.9837 59.0566 54.8883 59.2375 54.8883ZM60.421 57.9208C60.2867 57.9229 60.1588 57.9782 60.0653 58.0745C59.9718 58.1709 59.9203 58.3004 59.9223 58.4347V60.4612H57.8957C57.8286 60.4602 57.762 60.4726 57.6997 60.4977C57.6374 60.5227 57.5807 60.5599 57.5328 60.607C57.485 60.6542 57.4471 60.7103 57.4212 60.7723C57.3952 60.8342 57.3819 60.9007 57.3819 60.9678C57.3819 61.035 57.3952 61.1014 57.4212 61.1634C57.4471 61.2253 57.485 61.2815 57.5328 61.3286C57.5807 61.3758 57.6374 61.4129 57.6997 61.438C57.762 61.463 57.8286 61.4754 57.8957 61.4745H59.9223V63.501C59.9213 63.5681 59.9337 63.6348 59.9588 63.6971C59.9838 63.7594 60.021 63.8161 60.0681 63.8639C60.1152 63.9117 60.1714 63.9496 60.2333 63.9756C60.2953 64.0015 60.3618 64.0148 60.4289 64.0148C60.496 64.0148 60.5625 64.0015 60.6244 63.9756C60.6864 63.9496 60.7426 63.9117 60.7897 63.8639C60.8368 63.8161 60.874 63.7594 60.899 63.6971C60.9241 63.6348 60.9365 63.5681 60.9355 63.501V61.4745H62.962C63.0292 61.4754 63.0958 61.463 63.1581 61.438C63.2204 61.4129 63.2771 61.3758 63.3249 61.3286C63.3728 61.2815 63.4107 61.2253 63.4366 61.1634C63.4625 61.1014 63.4759 61.035 63.4759 60.9678C63.4759 60.9007 63.4625 60.8342 63.4366 60.7723C63.4107 60.7103 63.3728 60.6542 63.3249 60.607C63.2771 60.5599 63.2204 60.5227 63.1581 60.4977C63.0958 60.4726 63.0292 60.4602 62.962 60.4612H60.9355V58.4347C60.9365 58.3669 60.9239 58.2995 60.8983 58.2367C60.8728 58.1739 60.8349 58.1168 60.7869 58.0689C60.739 58.021 60.6818 57.9832 60.619 57.9577C60.5561 57.9323 60.4888 57.9197 60.421 57.9208Z"
      fill="white"
    />
  </svg>
);
export default ImageUploadIcon;
