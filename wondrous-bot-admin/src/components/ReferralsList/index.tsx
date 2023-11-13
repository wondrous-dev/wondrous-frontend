import { ArrowUpward } from "@mui/icons-material";
import { Box, ButtonBase } from "@mui/material";
import { StyledCheckbox } from "components/PaymentLedger/styles";
import CheckboxOption from "components/QuestSteps/Checkbox";
import PageWrapper from "components/Shared/PageWrapper";
import Switch from "components/Shared/Switch";
import TableComponent from "components/TableComponent";
import { StyledTableHeader, StyledTableHeaderCell } from "components/TableComponent/styles";
import { useMemo, useState } from "react";
import { BG_TYPES } from "utils/constants";

const ReferralsList = () => {
  const [sortOrder, setSortOrder] = useState({
    sortKey: "submissions",
    order: "desc",
  });

  const [selectedCampaignIds, setSelectedCampaignIds] = useState([]);

  const headers = useMemo(() => {
    return [
      {
        label: null,
        labelComponent: () => (
          // <CheckboxOption
          //   option={false}
          //   value={false}
          //   handleCheckboxChange={(e) => {}}
          //   // handleCheckboxChange={(e) => handleCheckboxChange(option.text)}
          //   checkboxProps={{
          //     checked: false,
          //   }}
          // />
          <StyledCheckbox
            bgcolor={"#2A8D5C"}
            height="28px"
            width="28px"
            onClick={() => {}}
            disabled={false}
            onChange={() => {}}
            // {...checkboxProps}
          />
        ),
      },
      {
        label: "Off / On",
      },
      {
        label: "Campaign Name",
        sortKey: "name",
      },
      {
        label: "Referrals",
      },
      {
        label: "Results",
        sortKey: "results",
      },
      {
        label: "Budget",
        sortKey: "budget",
      },
      {
        label: "Pending Approvals",
        sortKey: "approvals",
      },
    ];
  }, []);

  const data = [
    {
      refId: {
        component: "custom",
        customComponent: () => (
          <Box width="100%" display="flex" justifyContent="center">
            <StyledCheckbox
              bgcolor={"#2A8D5C"}
              height="28px"
              width="28px"
              onClick={() => {}}
              disabled={false}
              onChange={() => {}}
            />
          </Box>
        ),
      },
      status: {
        component: "custom",
        customComponent: () => (
          <Box display="flex" justifyContent="center" alignItems="center" width="100%">
            <Switch value={true} onChange={() => {}} />
          </Box>
        ),
      },
      name: {
        component: "label",
        value: "Campaign Name",
      },
      referrals: {
        component: "label",
        value: 40,
      },
      results: {
        component: "label",
        value: 20,
      },
      budget: {
        component: "label",
        value: `20,000 Points`,
      },
      pendingApprovals: {
        component: "label",
        value: 20,
      },
    },
  ];
  const onSortOrderChange = ({}) => {};
  return (
    <PageWrapper
      bgType={BG_TYPES.QUESTS}
      containerProps={{
        minHeight: "100vh",
        flexDirection: "column",
        gap: "42px",
        padding: {
          xs: "14px 14px 120px 14px",
          sm: "24px 56px",
        },
      }}
    >
      <TableComponent
        data={data}
        headerComponent={() => {
          return (
            <StyledTableHeader>
              {headers?.map((header) => (
                <StyledTableHeaderCell
                  sortKey={header}
                  sx={
                    {
                      // background: "white",
                    }
                  }
                >
                  <Box display="flex" alignItems="center" gap="6px" justifyContent="center">
                    {header.label ? header.label : header.labelComponent?.()}
                    {header.sortKey ? (
                      <ButtonBase type="button" onClick={() => onSortOrderChange({ header })}>
                        <ArrowUpward
                          sx={{
                            fontSize: "14px",
                            color: sortOrder.sortKey === header.sortKey ? "red" : "#949494",
                            transform:
                              sortOrder.sortKey === header.sortKey && sortOrder.order === "desc"
                                ? "rotate(180deg)"
                                : "rotate(0deg)",
                          }}
                        />
                      </ButtonBase>
                    ) : null}
                  </Box>
                </StyledTableHeaderCell>
              ))}
            </StyledTableHeader>
          );
        }}
        title="Referrals"
      />
    </PageWrapper>
  );
};

export default ReferralsList;
