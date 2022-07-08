import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

import styles from './styles';

interface RoleLabelProps {
  onClick?: any;
  role: string;
}

const RoleLabel = ({ onClick, role }: RoleLabelProps) => (
  <Box sx={styles.root}>
    <Typography sx={styles.whiteText}>Your role:</Typography>
    <Button onClick={onClick} sx={styles.role}>
      {role}
    </Button>
  </Box>
);

export default RoleLabel;
