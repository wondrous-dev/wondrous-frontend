import { Typography } from '@material-ui/core';
import styled from 'styled-components';
import { White } from '../../../theme/colors';
import { SafeImage } from '../../Common/Image';
import DefaultUserImage from '../../Common/Image/DefaultUserImage';
import TableCell from '@material-ui/core/TableCell';
import TableBody from '@material-ui/core/TableBody';
import Table from '@material-ui/core/Table';

import DropdownSelect from '../../Common/DropdownSelect/dropdownSelect';
import { newDropdownStyles } from 'components/Common/DropdownSelect/styles';

// export const UserInfoDiv = styled.div`
//   display: flex;
//   align-items: center;
// `;

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

// export const UserProfilePicture = (props) => {
//   return <SafeImage src={props?.src} style={ProfilePictureStyles} />;
// };

export const DefaultProfilePicture = (props) => {
  return <DefaultUserImage style={ProfilePictureStyles} />;
};
//
// export const UsernameText = styled(Typography)`
//   && {
//     color: #c4c4c4;
//     font-size: 14px;
//     font-height: 22px;
//   }
// `;

export const SeeMoreText = styled(Typography)`
  && {
    color: ${White};
    text-decoration: underline;
    cursor: pointer;
    font-size: 14px;
  }
`;

export const StyledTableBody = styled(TableBody)`
  //border: 1px solid #353535;
  //border-radius: 6px;
  background: linear-gradient(90deg, #1e1e1e -2.3%, #141414 101.76%);
  //
  //tr:first-child td:first-child {
  //  border-top-left-radius: 6px;
  //}
  //
  // tr:first-child td:last-child {
  //  border-top-right-radius: 6px;
  //}
  //
  //tr:last-child td:first-child {
  //  border-bottom-left-radius: 6px;
  //}
  //
  //tr:last-child td:last-child {
  //  border-bottom-right-radius: 6px;
  //}
`;

export const StyledTableHeaderCell = styled(TableCell)`
  && {
    font-weight: 400;
    padding: 16px;
    height: auto;
    border: none;
    //background: #0f0f0f;
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
