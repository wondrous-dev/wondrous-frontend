import { Grid, Typography } from '@mui/material';
import { StyledLink } from 'components/Common/text';
import Divider from 'components/Divider';
import Button from 'components/Button';
import { LinkIcon } from 'components/Icons/taskModalIcons';
import { HeaderButton } from 'components/organization/wrapper/styles';
import Image from 'next/image';
import palette from 'theme/palette';
import typography from 'theme/typography';

const ActionButton = ({ isActive, type }) => {
  if (!isActive) {
    return (
      <HeaderButton
        reversed
        onClick={() => {}}
        style={{
          height: '28px',
        }}
      >
        Setup
      </HeaderButton>
    );
  }
  return (
    <Button
      onClick={() => {}}
      buttonTheme={{
        background: palette.grey75,
        borderColor: 'transparent',
        fontSize: '14px',
        fontWeight: 500,
        paddingX: 24,
        paddingY: 8,
        maxHeight: '28px',
        hover: {
          background: palette.grey76,
        },
      }}
    >
      Edit
    </Button>
  );
};

const ActiveField = ({ isActive }) => (
  <Grid bgcolor={palette.grey920} borderRadius="6px" padding="4px" maxHeight="24px">
    <Typography
      fontFamily={typography.fontFamily}
      fontWeight="400"
      fontSize="13px"
      lineHeight="16px"
      color={isActive ? palette.green30 : palette.grey250}
    >
      {isActive ? 'Active' : 'Not connected'}
    </Typography>
  </Grid>
);

const IntegrationsCard = ({ integration }) => (
  <Grid
    maxWidth="33%"
    flex="1 0 32%"
    gap="12px"
    display="flex"
    direction="column"
    alignItems="flex-start"
    borderRadius="6px"
    padding="14px"
    bgcolor={palette.grey900}
  >
    <Grid display="flex" gap="14px">
      <Image
        src={integration?.logo}
        alt={`${integration.title} logo`}
        width={45}
        height={45}
        style={{
          borderRadius: '6px',
        }}
      />
      <Grid display="flex" direction="column" gap="4px">
        <Typography
          color={palette.white}
          fontSize="16px"
          fontWeight={700}
          fontFamily={typography.fontFamily}
          lineHeight="20px"
        >
          {integration.title}
        </Typography>
        <Grid display="flex" gap="6px" alignItems="center">
          <LinkIcon />
          <StyledLink target="__blank" href={integration.url}>
            {integration.linkTitle}
          </StyledLink>
        </Grid>
      </Grid>
    </Grid>
    <Typography
      color={palette.grey250}
      lineHeight="24px"
      fontSize="15px"
      minHeight="4rem"
      fontWeight="400"
      fontFamily={typography.fontFamily}
    >
      {integration.text}
    </Typography>
    <Divider />
    <Grid display="flex" justifyContent="space-between" width="100%">
      {/* footer */}
      <ActiveField isActive />
      <ActionButton type={integration.type} isActive />
    </Grid>
  </Grid>
);

export default IntegrationsCard;
