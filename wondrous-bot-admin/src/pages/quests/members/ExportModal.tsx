import { Box, Grid } from "@mui/material";
import { Label } from "components/QuestsList/styles";
import Modal from "components/Shared/Modal";
import { SharedSecondaryButton } from "components/Shared/styles";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import { useContext, useState } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import GlobalContext from "utils/context/GlobalContext";
import { EXPORT_USER_ROLE_SUBMISSIONS } from "graphql/queries";
const arrayToCSV = (arr, delimiter = ",") =>
  arr.map((v) => v.map((x) => (isNaN(x) ? `"${x.replace(/"/g, '""')}"` : x)).join(delimiter)).join("\n");
const exportUserRolesSubmissionsToCsv = (userRolesData, timeValue) => {
  const headers = [
    "Name (Discord username)",
    "Team",
    "# of submissions",
    "# of accepted submissions",
    "# of rejected submissions",
    "Names of accepted submissions",
    "Names of rejected submissions",
  ];
  const rows = [[headers]];
  userRolesData.forEach((userRole) => {
    const totalSubmissions = Number(userRole?.acceptedSubmissions) + Number(userRole?.rejectedSubmissions);
    const row = [
      userRole?.discordUsername,
      userRole?.roles.join("; "),
      totalSubmissions,
      userRole?.acceptedSubmissions,
      userRole?.rejectedSubmissions,
      userRole?.questTitleAccepted.join("; "),
      userRole?.questTitleRejected.join("; "),
    ];
    rows.push(row);
  });
  let csvContent = "data:text/csv;charset=utf-8,";
  rows.forEach((rowArray) => {
    const row = rowArray.join(",");
    csvContent += `${row}\r\n`;
  });

  let encodedUri = encodeURI(csvContent);
  encodedUri = encodedUri.replace(/#/g, "%23");
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `wonderverse_${timeValue}_data.csv`);
  document.body.appendChild(link); // Required for FF
  link.click();
};

const getStartAndEndDateFromDate = (value) => {
  let startDate = new Date();
  const endDate = new Date();
  if (value === "today") {
    startDate.setHours(0, 0, 0, 0);
  } else if (value === "currentMonth") {
    startDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
  } else if (value === "last7days") {
    startDate.setDate(startDate.getDate() - 7);
  } else if (value === "last30days") {
    startDate.setDate(startDate.getDate() - 30);
  } else if (value === "all") {
    startDate = new Date(0);
  }
  return {
    startDate,
    endDate,
  };
};
const DATE_STEPS = [
  {
    label: "Today",
    value: "today",
  },
  {
    label: "Current Month",
    value: "currentMonth",
  },
  {
    label: "Last 7 days",
    value: "last7days",
  },
  {
    label: "Last 30 days",
    value: "last30days",
  },
  {
    label: "All",
    value: "all",
  },
];
const ExportModal = ({ isOpen, onClose }) => {
  const { activeOrg } = useContext(GlobalContext);
  const [value, setValue] = useState("all");
  const [exportUserRolesSubmissions] = useLazyQuery(EXPORT_USER_ROLE_SUBMISSIONS);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setValue((event.target as HTMLInputElement).value);
  };
  return (
    <>
      <Modal
        open={isOpen}
        onClose={onClose}
        title={"Export Members Activity Data"}
        maxWidth={700}
        footerRight={
          <Box justifyContent={"flex-end"} display="flex" width={"100%"}>
            <SharedSecondaryButton
              style={{
                radius: "6px",
                width: "fit-content",
                marginRight: "8px",
              }}
              $reverse
              onClick={() => {
                onClose();
              }}
            >
              Cancel
            </SharedSecondaryButton>
            <SharedSecondaryButton
              onClick={async () => {
                const { startDate, endDate } = getStartAndEndDateFromDate(value);
                const userRolesData = await exportUserRolesSubmissions({
                  variables: {
                    orgId: activeOrg?.id,
                    startDate,
                    endDate,
                  },
                });
                exportUserRolesSubmissionsToCsv(userRolesData?.data?.exportUserRolesSubmissions, value);
              }}
            >
              Download
            </SharedSecondaryButton>
          </Box>
        }
      >
        <Box display="flex" flexDirection={"column"}>
          <Label>Date Range</Label>
          <FormControl
            style={{
              marginTop: "8px",
            }}
          >
            <RadioGroup
              value={value}
              onChange={handleChange}
              aria-labelledby="demo-radio-buttons-group-label"
              name="radio-buttons-group"
            >
              {DATE_STEPS.map((step, index) => {
                return (
                  <FormControlLabel
                    key={index}
                    value={step.value}
                    control={
                      <Radio
                        sx={{
                          "& .MuiSvgIcon-root": {
                            color: "#2A8D5C",
                          },
                        }}
                      />
                    }
                    label={step.label}
                  />
                );
              })}
            </RadioGroup>
          </FormControl>
        </Box>
      </Modal>
    </>
  );
};

export default ExportModal;
