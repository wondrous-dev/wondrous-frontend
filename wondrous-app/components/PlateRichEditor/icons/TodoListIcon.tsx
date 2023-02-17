import palette from 'theme/palette';

function TodoListIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M10 13.75H18.75V15H10V13.75ZM10 5H18.75V6.25H10V5Z" fill={palette.grey250} />
      <path
        d="M6.35306 4L4.41959 5.79714L3.64694 5.07889L3 5.68032L4.41959 7H4.42L7 4.60143L6.35306 4Z"
        fill={palette.grey250}
      />
      <path
        d="M6.35306 13L4.41959 14.7971L3.64694 14.0789L3 14.6803L4.41959 16H4.42L7 13.6014L6.35306 13Z"
        fill={palette.grey250}
      />
    </svg>
  );
}

export default TodoListIcon;
