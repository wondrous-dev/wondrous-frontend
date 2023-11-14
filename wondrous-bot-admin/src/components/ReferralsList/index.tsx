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

  const headers = useMemo(() => {
    return [
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
        label: "Approved",
        sortKey: "results",
      },
      {
        label: "Referrer Points",
        sortKey: "referrerPointReward",
      },
      {
        label: "Referred Points",
        sortKey: "referredPointReward",
      },
    ];
  }, []);

  const data = [
    {
      status: {
        component: "custom",
        customComponent: () => (
          <Box display="flex" justifyContent="center !important" alignItems="center" width="100%">
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
      referredPoints: {
        component: "label",
        value: 100,
      },
      referrerPoints: {
        component: "label",
        value: 42,
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
                <StyledTableHeaderCell sortKey={header}>
                  <Box display="flex" alignItems="center" gap="6px" justifyContent="center">
                    {header.label}
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
