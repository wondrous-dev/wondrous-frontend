import { Typography } from '@mui/material';
import { DropDown, DropDownItem } from 'components/Common/dropdown';
import styled from 'styled-components';
import palette from 'theme/palette';
import DefaultUserImage from '../../Common/Image/DefaultUserImage';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Table from '@mui/material/Table';

import { newDropdownStyles } from 'components/Common/DropdownSelect/styles';

export const InviteDiv = styled.div`
  display: flex;
  margin-top: 20px;

  ${newDropdownStyles}
`;

const ProfilePictureStyles = {
  marginRight: '16px',
  width: '32px',
  height: '32px',
  borderRadius: '16px',
};

export const DefaultProfilePicture = (props) => {
  return <DefaultUserImage style={ProfilePictureStyles} />;
};

export const UsernameText = styled(Typography)`
  && {
    color: #c4c4c4;
    font-size: 14px;
    line-height: 22px;
  }
`;

export const SeeMoreText = styled(Typography)`
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

export const MemberDropdown = styled(DropDown)``;

export const MemberDropdownItem = styled(DropDownItem)``;
