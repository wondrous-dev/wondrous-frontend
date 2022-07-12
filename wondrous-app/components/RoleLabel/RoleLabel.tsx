import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import styles from './styles';

interface RoleLabelProps {
  onClick?: any;
  role: string;
}

const CODED_ROLES = {
  OWNER: 'owner',
  CORE_TEAM: 'core team',
  CONTRIBUTOR: 'contributor',
};

const CODED_EMOJIS = {
  [CODED_ROLES.OWNER]: 0x1f511,
  [CODED_ROLES.CORE_TEAM]: 0x1f52e,
  [CODED_ROLES.CONTRIBUTOR]: 0x2728,
};

const RoleLabel = ({ onClick, role }: RoleLabelProps) => (
  <Box sx={styles.root}>
    <Typography sx={styles.whiteText}>Your role:</Typography>
    <Button
      onClick={onClick}
      sx={{
        ...styles.role,
        ...(role === CODED_ROLES.OWNER && styles.owner),
        ...(role === CODED_ROLES.CORE_TEAM && styles.coreTeam),
        ...(role === CODED_ROLES.CONTRIBUTOR && styles.contributor),
      }}
    >
      <Box component="span" mr={0.5}>
        {CODED_EMOJIS[role] && String.fromCodePoint(CODED_EMOJIS[role])}
      </Box>
      {role}
    </Button>
  </Box>
);

export default RoleLabel;
