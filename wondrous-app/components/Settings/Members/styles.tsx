import { Button, Input, InputAdornment, Typography } from '@mui/material';
import styled from 'styled-components';
import palette from 'theme/palette';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Table from '@mui/material/Table';

import SearchIcon from 'components/Icons/search';
import { newDropdownStyles } from 'components/Common/DropdownSelect/styles';

export const InviteDiv = styled.div`
  display: flex;
  margin-top: 20px;

  ${newDropdownStyles}
`;

export const SearchMembers = styled(({ ...props }) => (
  <Input
    {...props}
    disableUnderline
    startAdornment={
      <InputAdornment position="start">
        <SearchIcon color={palette.blue20} />
      </InputAdornment>
    }
  />
))`
  && {
    height: 40px;
    background: ${palette.black101};
    color: ${palette.grey250};
    width: 100%;
    padding: 0 10px;
    margin: 10px 0 31px 0;
    border-radius: 6px;
    font-size: 15px;
  }
`;

export const MembersTable = styled.div`
  display: flex;
  flex-direction: column;
  gap: 25px;
  width: 100%;
  max-width: 770px;
`;

export const SeeMoreTextWrapper = styled.div`
  && {
    margin-top: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
`;

export const SeeMoreText = styled(Button)`
  && {
    color: ${palette.white};
    text-decoration: underline;
    cursor: pointer;
    font-size: 14px;
  }
`;

export const StyledTableBody = styled(TableBody)`
  background: linear-gradient(90deg, #1e1e1e -2.3%, #141414 101.76%);
`;

export const StyledTableHeaderCell = styled(TableCell)`
  && {
    font-weight: 400;
    padding: 16px;
    height: auto;
    border: none;
  }
`;

export const StyledTable = styled(Table)`
  && {
    width: 100%;
    margin: 25px 0;
    border-collapse: collapse;
    background: #0f0f0f;
  }
`;

export const PodsCount = styled.div`
  padding: 8px;
  font-weight: 700;
  font-size: 14px;
  background: #0f0f0f;
  border-radius: 6px;
  color: white;
  text-align: center;
  display: inline-block;
`;
