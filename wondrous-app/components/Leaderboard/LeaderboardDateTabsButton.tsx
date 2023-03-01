import Button from 'components/Button';
import useMediaQuery from 'hooks/useMediaQuery';
import palette from 'theme/palette';

const LeaderboardDateTabsButton = ({ children, selected = false, ...props }) => {
  const { isTabletScreen } = useMediaQuery();
  return (
    <Button
      fullWidth={isTabletScreen}
      color="grey"
      borderRadius={6}
      textColor={palette.white}
      height={34}
      buttonTheme={{
        fontWeight: '500',
        fontSize: '13px',
        borderColor: selected ? palette.highlightPurple : palette.grey87,
        paddingX: isTabletScreen ? 0 : 20,
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
};

export default LeaderboardDateTabsButton;
