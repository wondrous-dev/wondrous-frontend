import { Twitter } from "@mui/icons-material";
import { TableContainer, Table, TableHead, TableBody, TableCell, Typography, Box, Grid } from "@mui/material";
import EditableText from "components/EditableText";
import { ShapedHexagonWrapper } from "components/Icons/Discord";
import { Label } from "components/QuestsList/styles";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import { StyledLinkButton, StyledViewQuestResults } from "components/ViewQuestResults/styles";
import {
  IconWrapper,
  PaperComponent,
  StyledTableHeader,
  StyledTableHeaderCell,
  StyledTableRow,
  TableBodyWrapper,
} from "./styles";
import { useState } from "react";
import EditSvg from "components/Icons/edit.svg";
import TextField from "components/Shared/TextField";
import { useMutation } from "@apollo/client";
import { UPDATE_ORG_CMTY_USER_POINTS, UPDATE_ORG_CMTY_USER_POINT_BALANCE } from "graphql/mutations";
import { useGlobalContext } from "utils/hooks";

const XPEditInput = ({ column, pointBalance = false, cmtyUser }) => {
  const { activeOrg } = useGlobalContext();
  const [updateOrgCmtyUserPoints] = useMutation(UPDATE_ORG_CMTY_USER_POINTS, {
    refetchQueries: ["getCmtyUsersForOrg", "searchCmtyUsersForOrg"],
  });
  const [updateOrgCmtyUserPointBalance] = useMutation(UPDATE_ORG_CMTY_USER_POINT_BALANCE, {
    refetchQueries: ["getCmtyUsersForOrg", "searchCmtyUsersForOrg"],
  });
  const [points, setPoints] = useState(column.value);
  const [editHover, setEditHover] = useState(false);
  const [edit, setEdit] = useState(false);

  if (edit) {
    return (
      <Box display="flex" alignItems="center" justifyContent={"center"}>
        <TextField
          type="text"
          inputmode="numeric"
          placeholder="New XP"
          value={points || ""}
          onChange={(value) => setPoints(value)}
          multiline={false}
          boxStyles={{
            maxWidth: "90px",
          }}
          onBlur={() => {
            if (pointBalance && points) {
              updateOrgCmtyUserPointBalance({
                variables: {
                  cmtyUserId: cmtyUser?.id,
                  orgId: activeOrg?.id,
                  xpPoints: Number(Math.round(points)),
                },
              });
            } else if (!pointBalance && points) {
              updateOrgCmtyUserPoints({
                variables: {
                  cmtyUserId: cmtyUser?.id,
                  orgId: activeOrg?.id,
                  xpPoints: Number(Math.round(points)),
                },
              });
            }
            setEdit(false);
            setEditHover(false);
          }}
        />
      </Box>
    );
  }
  if (editHover) {
    return (
      <div
        style={{
          textAlign: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        onMouseLeave={() => {
          setEditHover(false);
        }}
      >
        <img
          style={{
            cursor: "pointer",
            position: "absolute",
          }}
          src={EditSvg}
          onClick={() => setEdit(true)}
          onMouseLeave={() => {
            setEditHover(false);
          }}
        />
      </div>
    );
  }

  return (
    <Label
      onMouseEnter={() => {
        setEditHover(true);
        setTimeout(() => {
          setEditHover(false);
        }, 1000);
      }}
      onMouseLeave={() => {
        setEditHover(false);
      }}
      fontSize="14px"
      lineHeight="14px"
      textAlign={column.textAlign || "center"}
      width={column.width || "100%"}
      {...(column.componentProps || {})}
    >
      {column.value}
    </Label>
  );
};
const TableComponent = ({
  headers = null,
  data,
  title = "",
  headerComponent = null,
  footerComponent = null,
  paperComponent = null,
  tableRowStyle = null,
}) => {
  return (
    <TableContainer component={paperComponent || PaperComponent} key={title}>
      <Grid bgcolor="#2a8d5c" padding="24px 14px">
        <Typography color="#F7F7F7" fontFamily="Poppins" fontWeight={600} fontSize="16px" lineHeight="16px">
          {title}
        </Typography>
      </Grid>
      <TableBodyWrapper>
        <Table>
          <TableHead>
            {headerComponent ? (
              headerComponent()
            ) : (
              <StyledTableHeader>
                {headers?.map((header) => (
                  <StyledTableHeaderCell key={header}>{header}</StyledTableHeaderCell>
                ))}
              </StyledTableHeader>
            )}
          </TableHead>
          <TableBody>
            {data?.map((row, idx) => (
              <StyledTableRow key={row.id} id={row.id} style={tableRowStyle}>
                {Object.keys(row)?.map((key, rowIdx) => {
                  if (key === "id") return null;
                  const column = row[key];
                  const { tableStyle = {} } = column || {};
                  return (
                    <TableCell
                      key={key}
                      sx={{
                        borderRight: rowIdx === Object.keys(row).length - 1 ? "0px" : "1px solid #949494",
                        borderBottom: "0px",
                        ...tableStyle,
                      }}
                    >
                      {column.component === "label" ? (
                        <Label
                          fontSize="14px"
                          lineHeight="14px"
                          textAlign={column.textAlign || "center"}
                          width={column.width || "100%"}
                          {...(column.componentProps || {})}
                        >
                          {column.value}
                        </Label>
                      ) : null}
                      {column.component === "xp" ? (
                        <>
                          <XPEditInput column={column} pointBalance={false} cmtyUser={column.componentProps.cmtyUser} />
                        </>
                      ) : null}
                      {column.component === "xp_balance" ? (
                        <>
                          <XPEditInput column={column} pointBalance={true} cmtyUser={column.componentProps.cmtyUser} />
                        </>
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
                          <Label
                            fontSize="14px"
                            lineHeight="14px"
                            textAlign="center"
                            {...(column.componentProps || {})}
                          >
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
                        <Box width="100%" display="flex" justifyContent="center">
                          <a href={column.value} target="__blank">
                            <StyledLinkButton>
                              <AttachFileIcon
                                sx={{
                                  fontSize: "18px",
                                  color: "white",
                                }}
                              />
                            </StyledLinkButton>
                          </a>
                        </Box>
                      ) : null}
                    </TableCell>
                  );
                })}
              </StyledTableRow>
            ))}
          </TableBody>
          {footerComponent ? footerComponent() : null}
        </Table>
      </TableBodyWrapper>
    </TableContainer>
  );
};

export default TableComponent;
