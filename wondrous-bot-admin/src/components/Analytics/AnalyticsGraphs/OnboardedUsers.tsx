import { ButtonBase, Grid, Typography } from "@mui/material";
import { CustomTextField } from "components/AddFormEntity/components/styles";
import DateRangePicker from "components/Shared/DatePicker";
import { SharedSecondaryButton } from "components/Shared/styles";
import moment from "moment";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { filterToDates } from "utils/common";
import { MONTH_DAY_FULL_YEAR } from "utils/constants";
import FiltersComponent from "../Filters";
import { LineChart } from "../GraphsComponent";
import getMembersAndOnboardedMembers from "../utils/getMembersAndOnboardedMembers";

const OnboardedUsers = ({ data, refetch, loading, error }) => {
  const [activeFilter, setActiveFilter] = useState("last_week");

  const onboardedUsersData = useMemo(() => {
    if (loading || !data) return null;

    return getMembersAndOnboardedMembers(data, activeFilter);
  }, [data, activeFilter, loading]);

  const missingOnboardingQuest = error?.graphQLErrors?.[0]?.extensions?.message === "no_onboarding_quest";

  const [customDates, setCustomDates] = useState({
    startAt: null,
    endAt: null,
  });

  const handleChange = (value) => {
    setActiveFilter(value);
    if (value === "custom") {
      return;
    }
    const { startDate, endDate } = filterToDates(value);
    refetch({
      startDate,
      endDate,
    });
  };

  const handleConfirm = (value) => {
    setCustomDates(value);
    refetch({
      startDate: value.startAt.utcOffset(0).startOf("day").toISOString(),
      endDate: value.endAt.utcOffset(0).endOf("day").toISOString(),
    });
  };

  if (missingOnboardingQuest) {
    return (
      <Grid
        bgcolor="white"
        borderRadius="16px"
        border={`1px solid #000212`}
        padding="24px"
        width="100%"
        justifyContent="center"
        display="flex"
        flexDirection={"column"}
        gap="24px"
        alignItems="center"
      >
        <Typography
          width="100%"
          align="center"
          fontFamily="Poppins"
          fontWeight={600}
          fontSize="16px"
          lineHeight="16px"
          color="black"
        >
          You don't have an onboarding quest set up
        </Typography>
        <Link to="/quests">
          <SharedSecondaryButton>Visit Quests</SharedSecondaryButton>
        </Link>
      </Grid>
    );
  }
  return (
    <LineChart
      title="Onboarded"
      data={onboardedUsersData}
      renderComponents={() => (
        <Grid display="flex" gap="12px" alignItems="flex-start" width="100%">
          <FiltersComponent onChange={handleChange} activeFilter={activeFilter} />
          {activeFilter === "custom" ? (
            <DateRangePicker
              onConfirm={handleConfirm}
              blockPastDates={false}
              ButtonComponent={(props) => (
                <ButtonBase {...props}>
                  <CustomTextField
                    disabled
                    placeholder="Select Date Range"
                    value={
                      customDates.startAt && customDates.endAt
                        ? `${customDates.startAt?.format(MONTH_DAY_FULL_YEAR)} - ${customDates.endAt?.format(
                            MONTH_DAY_FULL_YEAR
                          )}`
                        : null
                    }
                  />
                </ButtonBase>
              )}
            />
          ) : null}
        </Grid>
      )}
    />
  );
};

export default OnboardedUsers;
