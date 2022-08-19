export const CalendarViewIcon = (props) => {
  return (
    <svg width="19" height="19" viewBox="0 0 19 19" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M14.6415 3.10449H2.74193C1.80308 3.10449 1.04199 3.86558 1.04199 4.80443V16.704C1.04199 17.6429 1.80308 18.4039 2.74193 18.4039H14.6415C15.5804 18.4039 16.3414 17.6429 16.3414 16.704V4.80443C16.3414 3.86558 15.5804 3.10449 14.6415 3.10449Z"
        stroke={props.color ?? '#fff'}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M12.0928 1.40381V4.80369" stroke="#CCBBFF" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5.29053 1.40381V4.80369" stroke="#CCBBFF" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M1.04199 8.20605H16.3414" stroke="#CCBBFF" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
};
