import { HeaderButton } from 'components/organization/wrapper/styles';
import palette from 'theme/palette';
import { Grid } from '@mui/material';
import Button from 'components/Button';

const FooterButtons = ({ onClose, action, title }) => (
  <Grid display="flex" gap="12px">
    <Button
      onClick={onClose}
      buttonTheme={{
        background: palette.grey75,
        borderColor: 'transparent',
        fontSize: '14px',
        fontWeight: 500,
        paddingX: 24,
        paddingY: 8,
        maxHeight: '35px',
        hover: {
          background: palette.grey76,
        },
      }}
    >
      Cancel
    </Button>
    {title ? (
      <HeaderButton reversed onClick={action}>
        {title}
      </HeaderButton>
    ) : null}
  </Grid>
);

export default FooterButtons;
