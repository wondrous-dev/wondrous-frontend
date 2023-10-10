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
import { GeneralInfo } from "components/MembersAnalytics";
import DiscordAnalytics from "components/MembersAnalytics/DiscordAnalytics";
import OnboardingSubmissions from "components/MembersAnalytics/OnboardingSubmissions";
import Submissions from "components/MembersAnalytics/Submissions";
import Modal from "components/Shared/Modal";

const TableComponent = ({ headers = null, data, title = "", headerComponent = null, footerComponent = null }) => {
  const [activeCmtyUser, setActiveCmtyUser] = useState(null);
  const username =
    activeCmtyUser?.username || activeCmtyUser?.discordUsername || activeCmtyUser?.telegramUsername || "N/A";
  const handleClose = () => {
    return setActiveCmtyUser(null);
  };
  const CONFIG = [
    {
      id: "general-info",
      component: () => <GeneralInfo user={activeCmtyUser} />,
    },
    {
      id: "messages-reactions",

      component: () => <DiscordAnalytics user={activeCmtyUser} />,
    },
    {
      id: "onboarding",
      component: () => <OnboardingSubmissions user={activeCmtyUser} />,
    },
    {
      id: "submissions",
      component: () => <Submissions user={activeCmtyUser} />,
    },
  ];
  return (
    <TableContainer component={PaperComponent}>
      <Modal open={!!activeCmtyUser} onClose={handleClose} title={`${username}`} maxWidth={740}>
        <Grid display="flex" gap="32px" flexDirection="column">
          {activeCmtyUser
            ? CONFIG.map((config, idx) => {
                return <config.component key={config.id} />;
              })
            : null}
        </Grid>
      </Modal>
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
              <StyledTableRow key={row.id} id={row.id}>
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
                      {column.component === "custom"
                        ? column.customComponent({
                            value: column.value,
                            setValue: () => setActiveCmtyUser(column.value),
                          })
                        : null}
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
