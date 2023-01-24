import ButtonBase from '@mui/material/ButtonBase';
import { useRouter } from 'next/router';
import palette from 'theme/palette';
import typography from 'theme/typography';
import { useBoards } from 'utils/hooks';

const SectionShowAllButton = ({ showAllUrl }) => {
  const router = useRouter();
  const { orgBoard } = useBoards();
  const orgUrl = `/organization/${router.query.username}/${showAllUrl}`;
  const podUrl = `/pod/${router.query.podId}/${showAllUrl}`;
  const url = orgBoard ? orgUrl : podUrl;
  const handleShowAllOnClick = () => router.push(url);
  return (
    <ButtonBase
      onClick={handleShowAllOnClick}
      sx={{
        width: '100%',
        height: '40px',
        background: palette.grey87,
        borderRadius: '0 0 6px 6px',
        color: palette.white,
        fontFamily: typography.fontFamily,
        fontWeight: 500,
        '&:hover': {
          background: palette.grey88,
        },
      }}
      disableRipple
    >
      Show all
    </ButtonBase>
  );
};

export default SectionShowAllButton;
