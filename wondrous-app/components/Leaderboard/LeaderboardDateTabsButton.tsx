import Typography from '@mui/material/Typography';
import Button from 'components/Button';
import palette from 'theme/palette';

const LeaderBoardDateTabsButton = ({ children, selected = false, ...props }) => (
  <Button
    color="grey"
    borderRadius={6}
    textColor={palette.white}
    height={34}
    buttonTheme={{
      fontWeight: '500',
      fontSize: '13px',
      borderColor: selected ? palette.highlightPurple : palette.grey87,
      paddingX: 22,
      hover: {
        background: !selected && palette.grey87,
        textColor: palette.blue20,
      },
      ...(selected && { background: 'linear-gradient(45deg, rgba(29,29,29,1) 40%, rgba(79,0,222,1) 100%)' }),
    }}
    {...props}
  >
    {children}
  </Button>
);

export default LeaderBoardDateTabsButton;
