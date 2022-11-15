import { Grid } from '@mui/material';
import MembersIcon from 'components/Icons/members';
import Link from 'next/link';
import palette from 'theme/palette';

interface PodCardProps {
  pod: {
    id: string;
    name: string;
    color?: string;
    contributorCount?: number;
  };
}

const PodCard = ({ pod }: PodCardProps) => {
  const { name, id, color = '#282828', contributorCount = 0 } = pod;
  return (
    <Link href={`/pod/${id}/boards`} passHref>
      <Grid
        container
        item
        bgcolor="#212121"
        width="168px"
        height="76px"
        borderRadius="4px"
        flexDirection="column"
        justifyContent="space-between"
        padding="4px"
        sx={{
          cursor: 'pointer',
        }}
      >
        <Grid item height="26px" width="fit-content" bgcolor={color}>
          {name}
        </Grid>
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
          sx={[
            {
              '& svg': {
                path: { stroke: palette.blue20 },
              },
            },
          ]}
        >
          <MembersIcon /> {contributorCount}
        </Grid>
      </Grid>
    </Link>
  );
};

export default PodCard;
