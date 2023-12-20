export const DAOIcon = ({ style = {}, encircled = true, stroke = "#7A7A7A" }) => (
  <svg width="23" height="26" viewBox="0 0 23 26" fill="none" xmlns="http://www.w3.org/2000/svg" {...style}>
    <path
      d="M11.6992 0.517578L22.0915 6.51758V18.5176L11.6992 24.5176L1.30691 18.5176V6.51758L11.6992 0.517578Z"
      stroke="#7A7A7A"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const WorkspaceDAOIcon = (props) => {
  console.log(props, 'props')
  return   <svg width={31} height={31} viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
  <rect x={0.5} y={0.25} width={30} height={30} rx={6} fill="#E3E3E3" />
  <path
    d="M15.25 6.09746C15.4047 6.00815 15.5953 6.00815 15.75 6.09746L23.2979 10.4553C23.4526 10.5446 23.5479 10.7097 23.5479 10.8883V19.6039C23.5479 19.7825 23.4526 19.9476 23.2979 20.0369L15.75 24.3947C15.5953 24.484 15.4047 24.484 15.25 24.3947L7.70205 20.0369C7.54735 19.9476 7.45205 19.7825 7.45205 19.6039V10.8883C7.45205 10.7097 7.54735 10.5446 7.70205 10.4553L15.25 6.09746Z"
    stroke="#6F6F6F"
    strokeLinecap="round"
    strokeLinejoin="round"
  />
</svg>

}