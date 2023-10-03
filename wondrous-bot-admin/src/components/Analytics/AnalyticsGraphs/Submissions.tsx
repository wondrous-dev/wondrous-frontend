import { useQuery } from "@apollo/client";
import { Grid } from "@mui/material";
import { GET_QUESTS_FOR_ORG } from "graphql/queries";
import { useContext, useMemo } from "react";
import GlobalContext from "utils/context/GlobalContext";
import FiltersComponent from "../Filters";
import LineBarChart from "../GraphsComponent/LineBarChart";
import getSubmissionsData from "../utils/getSubmissionsData";
import { useCommonFilters } from "../utils/useCommonFilters";

const SubmissionsGraph = ({ data, refetch, loading }) => {
  const { activeOrg } = useContext(GlobalContext);
  const { data: quests } = useQuery(GET_QUESTS_FOR_ORG, {
    variables: {
      input: {
        orgId: activeOrg?.id,
        limit: 500,
      },
    },
  });

  const { config, handleChange, activeFilters } = useCommonFilters({ refetch, quests });

  const submissionsData = useMemo(() => {
    if (loading || !data) return null;

    return getSubmissionsData(data, activeFilters?.timestamp);
  }, [data, activeFilters?.timestamp, loading]);

  return (
    <LineBarChart
      title="Quest Submissions"
      data={submissionsData}
      renderComponents={() => (
        <Grid display="flex" gap="12px" alignItems="flex-start" width="100%">
          {config.map((item, key) => {
            if (item.component) {
              return item.display ? item.component() : null;
            }
            return (
              <FiltersComponent
                key={key + "filter"}
                options={item.options}
                activeFilter={activeFilters?.[item.key]}
                defaultLabel={item.defaultLabel}
                onChange={(value) => handleChange(value, item.key)}
              />
            );
          })}
        </Grid>
      )}
    />
  );
};

export default SubmissionsGraph;
