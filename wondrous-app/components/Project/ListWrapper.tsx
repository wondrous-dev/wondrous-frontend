import ButtonBase from '@mui/material/ButtonBase';
import Grid from '@mui/material/Grid';
import isEmpty from 'lodash/isEmpty';
import { useRouter } from 'next/router';
import palette from 'theme/palette';

import CreateButton from './CreateButton';
import HeaderTitle from './HeaderTitle';
import ListItem from './ListItem';
import { ListWrapperProps } from './types';

const emptyComponent = ({ backgroundImageUrl, CreateButtonProps }) => (
  <Grid
    container
    width="auto"
    alignItems="center"
    justifyContent="center"
    flexGrow="1"
    bgcolor={palette.grey950}
    borderRadius="6px"
    sx={{
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'center',
      backgroundImage: `url(${backgroundImageUrl})`,
    }}
  >
    <CreateButton {...CreateButtonProps} />
  </Grid>
);

const ListWrapper = ({
  backgroundImageUrl,
  CreateButtonProps,
  HeaderTitleProps,
  showAllUrl,
  data,
  ListItemProps,
}: ListWrapperProps) => {
  const router = useRouter();
  const handleShowAllOnClick = () => {
    if (typeof showAllUrl === 'string') {
      router.push(`/organization/${router.query.username}/${showAllUrl}`);
      return;
    }
    showAllUrl.onClick();
    router.push(`/organization/${router.query.username}/${showAllUrl.url}`);
  };
  const entityContent = isEmpty(data)
    ? emptyComponent({ backgroundImageUrl, CreateButtonProps })
    : data.map((i) => <ListItem {...ListItemProps} data={i} />);
  return (
    <Grid
      container
      flexDirection="column"
      justifyContent="space-between"
      height="390px"
      bgcolor="#1d1d1d"
      borderRadius="6px"
    >
      <Grid container item flexDirection="column" flexGrow="1" padding="14px" gap="14px">
        <HeaderTitle {...HeaderTitleProps} />
        <Grid item container flexDirection="column" gap="10px" flexGrow="1">
          {entityContent}
        </Grid>
      </Grid>
      <ButtonBase
        onClick={handleShowAllOnClick}
        sx={{
          width: '100%',
          height: '40px',
          background: palette.grey87,
          borderRadius: '0 0 6px 6px',
          color: palette.white,
          fontFamily: 'Space Grotesk',
          fontWeight: 500,
          '&:hover': {
            background: palette.grey88,
          },
        }}
        disableRipple
      >
        Show all
      </ButtonBase>
    </Grid>
  );
};

export default ListWrapper;
