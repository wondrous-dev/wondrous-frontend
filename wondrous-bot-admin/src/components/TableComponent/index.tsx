import { Twitter } from "@mui/icons-material";
import { TableContainer, Table, TableHead, TableBody, TableCell, Typography, Box } from "@mui/material";
import EditableText from "components/EditableText";
import { ShapedHexagonWrapper, WhiteBgDiscord } from "components/Icons/Discord";
import { Label } from "components/QuestsList/styles";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { StyledLinkButton, StyledViewQuestResults } from "components/ViewQuestResults/styles";
import { IconWrapper, PaperComponent, StyledTableHeader, StyledTableHeaderCell, StyledTableRow } from "./styles";
import LinkIcon from "components/Icons/LinkIcon";

const TableComponent = ({ headers, data }) => {
  return (
    <TableContainer component={PaperComponent}>
      <Table>
        <TableHead>
          <StyledTableHeader>
            {headers?.map((header) => (
              <StyledTableHeaderCell key={header}>{header}</StyledTableHeaderCell>
            ))}
          </StyledTableHeader>
        </TableHead>
        <TableBody>
          {data?.map((row, idx) => (
            <StyledTableRow key={row.id} id={row.id}>
              {Object.keys(row)?.map((key) => {
                if (key === "id") return null;
                const column = row[key];
                const { tableStyle = {} } = column || {};
                return (
                  <TableCell
                    key={key}
                    sx={{
                      borderRight: "2px solid #f2f2f2",
                      borderBottom: "0px",
                      ...tableStyle,
                    }}
                  >
                    {column.component === "label" ? (
                      <Label
                        fontSize="14px"
                        lineHeight="14px"
                        textAlign="center"
                        width="100%"
                        {...(column.componentProps || {})}
                      >
                        {column.value}
                      </Label>
                    ) : null}
                    {column.component === "hexagon" ? (
                      <Box
                        display="flex"
                        gap="10px"
                        alignItems="center"
                        position="relative"
                        justifyContent="center"
                        sx={{
                          "&:hover #display-edit-icon": {
                            visibility: "visible",
                          },
                        }}
                      >
                        <Box
                          position="relative"
                          width="fit-content"
                          display="flex"
                          justifyContent="center"
                          alignItems="center"
                        >
                          <ShapedHexagonWrapper />
                          <Typography
                            fontFamily="Poppins"
                            fontWeight={700}
                            fontSize="13px"
                            lineHeight="17px"
                            position="absolute"
                            color="white"
                          >
                            {column.value === "index" ? idx + 1 : column.value}
                          </Typography>
                        </Box>
                        {column.label ? <EditableText value={column.label} {...column.labelProps} /> : null}
                      </Box>
                    ) : null}
                    {column.component === "discord" ? (
                      <Box display="flex" justifyContent="center" alignItems="center">
                        <Label fontSize="14px" lineHeight="14px" textAlign="center" {...(column.componentProps || {})}>
                          {column?.value}
                        </Label>
                      </Box>
                    ) : null}
                    {column.component === "twitter" ? (
                      <Box display="flex" justifyContent="center" alignItems="center">
                        {!(column?.value && !column?.value?.includes("undefined")) ? (
                          <Label fontSize="14px" lineHeight="14px" textAlign="center" width="100%">
                            None
                          </Label>
                        ) : (
                          <IconWrapper onClick={() => window.open(column.value)}>
                            <Twitter
                              sx={{
                                color: "white",
                                fontSize: "15px",
                              }}
                            />
                          </IconWrapper>
                        )}
                      </Box>
                    ) : null}
                    {column.component === "reward" ? (
                      <StyledViewQuestResults $isReward>{column.value}</StyledViewQuestResults>
                    ) : null}
                    {column.component === "custom" ? column.customComponent({ value: column.value }) : null}
                    {column.component === "link" ? (
                      <a href={column.value} target="__blank">
                        <Box width="100%" display="flex" justifyContent="left" alignItems="center">
                          <LinkIcon />
                          <Label
                            marginLeft="8px"
                            fontSize="14px"
                            lineHeight="14px"
                            textAlign="center"
                            {...(column.componentProps || {})}
                          >
                            {column.text}
                          </Label>
                        </Box>
                      </a>
                    ) : null}
                  </TableCell>
                );
              })}
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableComponent;
