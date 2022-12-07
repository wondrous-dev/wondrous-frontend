import ButtonBase from '@mui/material/ButtonBase';
import Grid from '@mui/material/Grid';
import PlusIcon from 'components/Icons/plus';
import Tooltip from 'components/Tooltip';
import isEmpty from 'lodash/isEmpty';
import { useRouter } from 'next/router';
import styled from 'styled-components';
import palette from 'theme/palette';
import typography from 'theme/typography';
import { useCheckOrgPermission } from 'utils/hooks';

import CreateButton from './CreateButton';
import HeaderTitle from './HeaderTitle';
import { DATA_LIMIT } from './helpers';
import ListItem from './ListItem';
import { ListWrapperProps } from './types';

const MainWrapper = styled(Grid)``;

const AddButtonWrapper = styled(ButtonBase)`
  && {
    background: ${palette.grey87};
    align-items: center;
    justify-content: center;
    height: 36px;
    width: 36px;
    border-radius: 36px;
    cursor: pointer;
    display: flex;
    visibility: hidden;
    & svg {
      path {
        fill: ${palette.white};
      }
    }
    &:hover {
      background: ${palette.grey78};
    }
    ${MainWrapper}:hover & {
      visibility: visible;
    }
  }
`;

const EmptyComponent = ({ backgroundImageUrl, CreateButtonProps }) => (
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

const AddButton = ({ onClick, text }) => {
  const hasPermission = useCheckOrgPermission();
  if (!onClick || !hasPermission) return null;
  return (
    <Tooltip title={`Create new ${text.toLowerCase()}`} placement="top">
      <AddButtonWrapper onClick={onClick}>
        <PlusIcon />
      </AddButtonWrapper>
    </Tooltip>
  );
};

const ListWrapper = ({
  backgroundImageUrl,
  CreateButtonProps,
  HeaderTitleProps,
  showAllUrl,
  data,
  ListItemProps,
}: ListWrapperProps) => {
  const router = useRouter();
  const handleShowAllOnClick = () => router.push(`/organization/${router.query.username}/${showAllUrl}`);
  const entityContent = isEmpty(data) ? (
    <EmptyComponent backgroundImageUrl={backgroundImageUrl} CreateButtonProps={CreateButtonProps} />
  ) : (
    data.slice(0, DATA_LIMIT).map((i) => <ListItem key={i?.id} {...ListItemProps} data={i} />)
  );
  return (
    <MainWrapper
      container
      item
      flexDirection="column"
      justifyContent="space-between"
      height="390px"
      bgcolor={palette.grey900}
      borderRadius="6px"
    >
      <Grid container item flexDirection="column" flexGrow="1" padding="14px" gap="14px">
        <Grid container item alignItems="center" justifyContent="space-between">
          <HeaderTitle {...HeaderTitleProps} />
          <AddButton {...CreateButtonProps} {...HeaderTitleProps} />
        </Grid>
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
          fontFamily: typography.fontFamily,
          fontWeight: 500,
          '&:hover': {
            background: palette.grey88,
          },
        }}
        disableRipple
      >
        Show all
      </ButtonBase>
    </MainWrapper>
  );
};

export default ListWrapper;
