import { createPortal } from 'react-dom';
import { Box, Grid, Typography } from '@mui/material';
import { SafeImage } from 'components/Common/Image';
import GradientHeading from 'components/GradientHeading';
import { DAOEmptyIcon } from 'components/Icons/dao';
import { LargeDao2DaoIcon } from 'components/Icons/Dao2Dao';
import { TokenEmptyLogo } from 'components/organization/wrapper/styles';
import { Button } from 'components/Button';
import palette from 'theme/palette';

const SentRequestSuccess = ({ orgs, footerRef, onClose }) => (
  <div>
    <GradientHeading
      fontSize={24}
      mb="20px"
      style={{ width: '100%', alignItems: 'center', justifyContent: 'center', display: 'flex' }}
    >
      Docking Request Sent!
    </GradientHeading>
    <Grid
      mb="20px"
      container
      direction="row"
      display="flex"
      justifyContent="center"
      alignItems="center"
      wrap="nowrap"
      gap="18px"
      sx={{ width: 'auto' }}
    >
      {Object.keys(orgs)?.map((key, idx) => (
        <>
          <Box sx={{ minWidth: '60px' }} key={idx}>
            <SafeImage
              src={orgs[key]?.profilePicture}
              placeholderComp={
                <TokenEmptyLogo>
                  <DAOEmptyIcon />
                </TokenEmptyLogo>
              }
              width="60px"
              height="60px"
              useNextImage
              style={{
                borderRadius: '6px',
              }}
            />
          </Box>
          {idx < Object.keys(orgs)?.length - 1 && <LargeDao2DaoIcon />}
        </>
      ))}
    </Grid>
    <Typography sx={{ fontSize: '14px', width: '100%', textAlign: 'center' }} color={palette.grey250}>
      The other project will now receive an invitation. Once they accept, the workspace will be activated and both
      parties can add members to this shared workspace.
    </Typography>
    {footerRef.current
      ? createPortal(
          <Grid container gap="18px">
            <Button color="grey" onClick={onClose}>
              Close
            </Button>
          </Grid>,
          footerRef.current
        )
      : null}
  </div>
);

export default SentRequestSuccess;
