import Grid from '@mui/material/Grid';
import PodIconName from 'components/Common/PodIconName';
import MembersIcon from 'components/Icons/members';
import Link from 'next/link';
import palette from 'theme/palette';

interface PodCardProps {
  id: string;
  name: string;
  color?: string;
  contributorCount?: number;
}

const PodCard = ({ name, id, color = '#282828', contributorCount = 0 }: PodCardProps) => (
  <Grid
    container
    item
    bgcolor="#212121"
    maxWidth="200px"
    flexGrow="1"
    height="76px"
    borderRadius="4px"
    flexDirection="column"
    justifyContent="space-between"
    padding="4px"
    flexShrink="1"
    sx={{
      cursor: 'pointer',
      '& a': {
        textDecoration: 'none',
      },
    }}
  >
    <Link href={`/pod/${id}/boards`} passHref>
      <PodIconName
        color={color}
        name={name}
        IconComponentProps={{
          style: {
            width: '22px',
            height: '22px',
          },
        }}
      />
      <Grid
        container
        item
        width="fit-content"
        height="28px"
        bgcolor="#282828"
        borderRadius="4px"
        color="#CCBBFF"
        fontFamily="Space Grotesk"
        fontWeight="600"
        padding="0 6px"
        alignItems="center"
        fontSize="15px"
        gap="6px"
        marginTop="12px"
        sx={{
          '& svg': {
            path: { stroke: palette.blue20 },
          },
        }}
      >
        <MembersIcon /> {contributorCount}
      </Grid>
    </Link>
  </Grid>
);

export default PodCard;
