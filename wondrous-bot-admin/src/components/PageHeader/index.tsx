import { ButtonBase, Grid, Typography } from '@mui/material';
import WestIcon from '@mui/icons-material/West';
import { Box } from '@mui/system';
import { useNavigate } from 'react-router-dom';
const PageHeader = ({
  title = 'New Quest',
  withBackButton = true,
  renderActions = null,
}) => {
  const navigate = useNavigate();

  const handleBackButton = () => navigate(-1);
  return (
    <Grid
      display='flex'
      alignItems='center'
      justifyContent='space-between'
      width='100%'
      paddingTop='46px'
      paddingBottom='34px'
      paddingLeft='56px'
      paddingRight='56px'
    >
      <Grid display='flex' alignItems='center' gap='14px'>
        {withBackButton ? (
          <ButtonBase onClick={handleBackButton}>
            <Box
              height='40px'
              width='40px'
              display='flex'
              justifyContent='center'
              alignItems='center'
              bgcolor='#2A8D5C'
              borderRadius='35px'
            >
              <WestIcon
                sx={{
                  color: 'white',
                }}
              />
            </Box>
          </ButtonBase>
        ) : null}
        <Typography
          fontFamily='Poppins'
          fontWeight={600}
          fontSize='28px'
          lineHeight='32px'
          color='black'
          whiteSpace='nowrap'
        >
          {title}
        </Typography>
      </Grid>
      {renderActions ? (
        <Grid display='flex' gap='14px' alignItems='center'>
          {renderActions()}
        </Grid>
      ) : null}
    </Grid>
  );
};

export default PageHeader;
