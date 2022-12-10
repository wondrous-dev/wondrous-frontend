import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import useMediaQuery from 'hooks/useMediaQuery';
import styled from 'styled-components';
import palette from 'theme/palette';
import { getFilterSchema } from 'utils/board';

const getStatus = ({ type, orgId, status }) => {
  const entityTypeFilters = getFilterSchema(type, orgId);
  const statuses = entityTypeFilters?.find(({ name }) => name === 'statuses')?.items;
  const taskStatus = statuses?.find(({ id }) => id === status);
  return taskStatus;
};

export const IconWrapper = styled.div`
  height: 24px;
  width: 24px;
  svg {
    width: 24px !important;
    height: 24px !important;
  }
`;

interface TaskCardStatusProps {
  type: string;
  orgId: string;
  status: string;
  style?: object;
}

const TaskCardStatus = ({ type, orgId, status, style = {} }: TaskCardStatusProps) => {
  const { isLaptopScreen } = useMediaQuery();
  const { icon, label } = getStatus({ type, orgId, status });
  return (
    <Grid
      container
      bgcolor={palette.grey99}
      padding={isLaptopScreen ? `2px` : `2px 10px 2px 2px`}
      borderRadius="300px"
      fontSize="14px"
      fontWeight="500"
      gap="6px"
      height="28px"
      width="fit-content"
      color="#fff"
      style={{ ...style }}
    >
      <Box
        height="24px"
        width="24px"
        sx={[
          {
            '& svg': {
              width: `24px !important`,
              height: `24px !important`,
            },
          },
        ]}
      >
        {icon}
      </Box>
      {isLaptopScreen ? null : label}
    </Grid>
  );
};

export default TaskCardStatus;
