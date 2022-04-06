import React from 'react';

export default function CreateMilestoneIcon({ circle = false }) {
  return (
    <svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
      {circle && <circle cx="12.7178" cy="12.0771" r="12" fill="#141414" />}
      <path d="M8.71777 17.2456V14.2792V6.90869" stroke="#CCBBFF" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M16.6829 10.1956C14.0278 9.7098 11.3729 13.9292 8.71777 13.4447V6.90869C11.3729 9.5727 14.0278 7.53131 16.6829 10.1956Z"
        stroke="#CCBBFF"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
