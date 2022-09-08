import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { SafeImage } from 'components/Common/Image';
import { DAOEmptyIcon } from 'components/Icons/dao';
import { TokenEmptyLogo } from 'components/organization/wrapper/styles';
import { Separator } from './styles';

const SharedOrgHeader = ({ parentOrgs }) => (
  <Grid container direction="row" wrap="nowrap" gap="18px" sx={{ width: 'auto' }}>
    {parentOrgs?.map((org, idx) => (
      <>
        <Box sx={{ minWidth: '60px' }} key={idx}>
          <SafeImage
            src={org?.profilePicture}
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
        {idx < parentOrgs.length - 1 && <Separator>X</Separator>}
      </>
    ))}
  </Grid>
);

export default SharedOrgHeader;
