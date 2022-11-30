import Grid from '@mui/material/Grid';
import { NextRouter, useRouter } from 'next/router';
import palette from 'theme/palette';
import styled from 'styled-components';

const Wrapper = styled(Grid)``;

const LeftComponentWrapper = styled(Grid)`
  && {
    align-items: center;
    width: fit-content;
    position: relative;
    flex: 1;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    &:after {
      content: '';
      background: linear-gradient(90deg, transparent 80%, #212121 100%);
      display: block;
      inset-block-end: 0;
      position: absolute;
      width: 100%;
      height: 100%;
      ${Wrapper}:hover & {
        background: linear-gradient(90deg, transparent 80%, ${palette.grey920} 100%);
      }
    }
  }
`;

interface IEntityItem {
  LeftComponent: React.ElementType;
  RightComponent?: React.ElementType;
  data?: object;
  onClick?: (router: NextRouter, data?) => void;
}

const ListItem = ({ LeftComponent, RightComponent = () => null, onClick, data }: IEntityItem) => {
  const router = useRouter();
  return (
    <Wrapper
      container
      justifyContent="space-between"
      padding="4px"
      alignItems="center"
      bgcolor="#212121"
      height="36px"
      borderRadius="4px"
      onClick={() => onClick?.(router, data)}
      sx={{
        '&:hover': {
          cursor: 'pointer',
          background: palette.grey920,
        },
      }}
    >
      <LeftComponentWrapper container item>
        <LeftComponent {...data} />
      </LeftComponentWrapper>
      <Grid container item alignItems="center" justifySelf="flex-end" width="fit-content">
        <RightComponent {...data} />
      </Grid>
    </Wrapper>
  );
};

export default ListItem;
