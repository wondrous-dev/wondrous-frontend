import { Button, ButtonBase, Grid } from '@mui/material';
import isEmpty from 'lodash/isEmpty';
import palette from 'theme/palette';
import CreateButton, { ICreateButtonProps } from './CreateButton';
import HeaderTitle, { IHeaderTitleProps } from './HeaderTitle';

interface EntityContainerProps {
  backgroundImageUrl: string;
  CreateButtonProps: ICreateButtonProps;
  HeaderTitleProps: IHeaderTitleProps;
  showAllOnClick: (e) => void;
  data?: object[];
  ListItemComponent: React.ElementType;
}

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
  showAllOnClick,
  data,
  ListItemComponent,
}: EntityContainerProps) => {
  const entityContent = isEmpty(data)
    ? emptyComponent({ backgroundImageUrl, CreateButtonProps })
    : data.map((i) => <ListItemComponent {...i} />);
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
        onClick={showAllOnClick}
        sx={{
          width: '100%',
          height: '40px',
          background: palette.grey87,
          borderRadius: '0 0 6px 6px',
          color: palette.white,
          fontFamily: 'Space Grotesk',
          fontWeight: 500,
        }}
      >
        Show all
      </ButtonBase>
    </Grid>
  );
};

export default ListWrapper;
