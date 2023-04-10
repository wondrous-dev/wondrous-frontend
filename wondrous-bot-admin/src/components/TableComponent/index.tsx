import { Twitter } from '@mui/icons-material';
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableBody,
  TableCell,
  Typography,
  Box,
} from '@mui/material';
import { ShapedHexagonWrapper, WhiteBgDiscord } from 'components/Icons/Discord';
import { Label } from 'components/QuestsList/styles';
import {
  IconWrapper,
  PaperComponent,
  StyledTableHeader,
  StyledTableHeaderCell,
  StyledTableRow,
} from './styles';

const TableComponent = () => {
  const data = [
    {
      id: 1,
      name: 'John Doe',
      level: 1,
      discord: 'JohnDoe#1234',
      twitter: '@JohnDoe',
      xp: 10,
    },
  ];
  return (
    <TableContainer component={PaperComponent}>
      <Table>
        <TableHead>
          <StyledTableHeader>
            <StyledTableHeaderCell>Name</StyledTableHeaderCell>
            <StyledTableHeaderCell>Level</StyledTableHeaderCell>
            <StyledTableHeaderCell>Discord</StyledTableHeaderCell>
            <StyledTableHeaderCell>Twitter</StyledTableHeaderCell>
            <StyledTableHeaderCell>XP</StyledTableHeaderCell>
          </StyledTableHeader>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <StyledTableRow key={row.id} id={row.id}>
              <TableCell>
                <Label fontSize='14px' lineHeight='14px'>
                  {row.name}
                </Label>
              </TableCell>
              <TableCell>
                <Box position='relative' width='fit-content'>
                  <ShapedHexagonWrapper />
                  <Typography
                    fontFamily='Space Grotesk'
                    fontWeight={700}
                    fontSize='13px'
                    lineHeight='17px'
                    position='absolute'
                    top='20%'
                    left='38%'
                    color='white'
                  >
                    {row.level}
                  </Typography>
                </Box>
              </TableCell>
              <TableCell>
                <IconWrapper>
                  <WhiteBgDiscord />
                </IconWrapper>
              </TableCell>
              <TableCell>
                <IconWrapper>
                  <Twitter
                    sx={{
                      color: 'white',
                      fontSize: '15px',
                    }}
                  />
                </IconWrapper>
              </TableCell>
              <TableCell>

                <Label fontWeight={500} fontSize="14px" lineHeight="14px">{row.xp}</Label>
              </TableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableComponent;
