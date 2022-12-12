import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { SafeImage } from 'components/Common/Image';
import { DAOEmptyIcon } from 'components/Icons/dao';
import { TokenEmptyLogo } from 'components/organization/wrapper/styles';
import Link from 'next/link';
import { OrgContainer, OrgName, Separator, SeparatorDiv, SmallSeparator } from './styles';

export const SharedOrgHeaderCard = (props) => {
  const { collab, blurChild, blurParent } = props;
  return (
    <Grid
      container
      direction="row"
      wrap="nowrap"
      gap="8px"
      sx={{ width: 'auto' }}
      style={{
        alignItems: 'center',
      }}
    >
      <OrgContainer
        style={
          blurChild && {
            opacity: '0.2',
          }
        }
      >
        <SafeImage
          src={collab?.childOrgProfilePicture}
          placeholderComp={
            <TokenEmptyLogo
              style={{
                width: '24px',
                height: '24px',
              }}
            >
              <DAOEmptyIcon />
            </TokenEmptyLogo>
          }
          width={24}
          height={24}
          useNextImage
          style={{
            borderRadius: '6px',
          }}
          alt="Organization logo"
        />
        <OrgName>{collab?.childOrgName}</OrgName>
      </OrgContainer>
      <SeparatorDiv>
        <SmallSeparator>X</SmallSeparator>
      </SeparatorDiv>
      <OrgContainer
        style={
          blurParent && {
            opacity: '0.2',
          }
        }
      >
        <SafeImage
          src={collab?.parentOrgProfilePicture}
          placeholderComp={
            <TokenEmptyLogo
              style={{
                width: '24px',
                height: '24px',
              }}
            >
              <DAOEmptyIcon />
            </TokenEmptyLogo>
          }
          width={24}
          height={24}
          useNextImage
          style={{
            borderRadius: '6px',
          }}
          alt="Organization logo"
        />
        <OrgName>{collab?.parentOrgName}</OrgName>
      </OrgContainer>
    </Grid>
  );
};

const SharedOrgHeader = ({ parentOrgs }) => (
  <Grid container direction="row" wrap="nowrap" gap="18px" sx={{ width: 'auto' }}>
    {parentOrgs?.map((org, idx) => (
      <>
        <Link href={`/organization/${org?.username}/boards`}>
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
              alt="Organization logo"
            />
          </Box>
        </Link>
        {idx < parentOrgs.length - 1 && <Separator>X</Separator>}
      </>
    ))}
  </Grid>
);

export default SharedOrgHeader;
