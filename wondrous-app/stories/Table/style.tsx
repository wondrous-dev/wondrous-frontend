import styled from 'styled-components';
import Table from "@material-ui/core/Table";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import {Modal} from "@material-ui/core";

export const StyledTable = styled(Table)`
  && {
    width: 100%;
    margin: 25px 0;
    border-collapse: separate;
  }
`;

export const StyledTableCell = styled(TableCell)`
  &.clickable {
    cursor: pointer;
  }

  svg {
    width: 28px;
    height: 28px;
  }
`;

export const StyledTableContainer = styled(TableContainer)`
  && {
    width: 100%;
    overflow-x: visible;
    background: linear-gradient(180deg, #1e1e1e 0%, #141414 100%);
    border-radius: 4px;
  }
`;

export const StyledTableHead = styled(TableHead)`
  & .MuiTableCell-head {
    color: #ccbbff;
    border: none;
    font-family: 'Space Grotesk';
    font-size: 14px;
    font-style: normal;
    font-weight: 700;
    letter-spacing: 0em;
    border-radius: 4px;
    border: 1px solid #363636;
  }
`;

export const StyledTableRow = styled(TableRow)`
  //cursor: pointer;

  & .MuiTableCell-body {
    border: 1px solid #363636;
    padding: 14px;
  }

  // & .MuiTableCell-root {
  // 	vertical-align: top;
  // }
`;

export const LoadMore = styled.div`
  height: 50px;
  display: ${(props) => (props.hasMore ? 'block' : 'none')};
`;

export const CreateModalOverlay = styled(Modal)`
  position: absolute;
  width: 100%;
  overflow-y: scroll;
  height: 95vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-top: 50px;
  &::-webkit-scrollbar {
    display: none;
    width: 0;
    height: 0;
  }

  /* Hide scrollbar for IE, Edge and Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  scrollbar-width: none; /* Firefox */
`;