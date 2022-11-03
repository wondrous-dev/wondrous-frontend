import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { SafeImage } from 'components/Common/Image';
import { DAOEmptyIcon } from 'components/Icons/dao';
import { TokenEmptyLogo } from 'components/organization/wrapper/styles';
import Link from 'next/link';
import { Separator } from './styles';

const SharedOrgHeader = ({ parentOrgs }) => (
  <Grid container direction="row" wrap="nowrap" gap="18px" sx={{ width: 'auto' }}>
    {parentOrgs?.map((org, idx) => (
      <>
        <Link href={`/organization/${org?.username}/boards`} legacyBehavior>
          <Box sx={{ minWidth: '60px', cursor: 'pointer' }} key={idx}>
            <SafeImage
              src={org?.profilePicture}
              placeholderComp={
                <TokenEmptyLogo>
                  <DAOEmptyIcon />
                </TokenEmptyLogo>
              }
              width={60}
              height={60}
              useNextImage
              style={{
                borderRadius: '6px',
              }}
            />
          </Box>
        </Link>
        {idx < parentOrgs.length - 1 && <Separator>X</Separator>}
      </>
    ))}
  </Grid>
);

export default SharedOrgHeader;
