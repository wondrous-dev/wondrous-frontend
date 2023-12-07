import { GET_REFERRAL_CAMPAIGN_FOR_ORG } from "graphql/queries/referral";

/*
    updates the cache so that we don't rely on another network request

*/

interface IUpdateArgs {
  cache: any;
  data: any;
  dataKey: string;
  variablesInput: any;
  action: "update" | "create" | "delete";
  fieldsToUpdate: [string];
}

export const updateReferralCampaignCache = (
  cache,
  data,
  dataKey,
  variablesInput,
  action = "update",
  fieldsToUpdate = []
) => {
  const dataToUpdate = data[dataKey];

  cache.updateQuery(
    {
      query: GET_REFERRAL_CAMPAIGN_FOR_ORG,
      variables: {
        input: variablesInput,
      },
    },
    () => {
      const fields = fieldsToUpdate.reduce((acc, key) => {
        acc[key] = dataToUpdate[key];
        return acc;
      }, {});

      const existingReferralCampaigns = cache.readQuery({
        query: GET_REFERRAL_CAMPAIGN_FOR_ORG,
        variables: {
          input: variablesInput,
        },
      });
      let updatedItems = existingReferralCampaigns?.getReferralCampaignForOrg?.items;

      if(!updatedItems) return;
      if (action === "update") {
        updatedItems = updatedItems?.map((campaign) => {
          if (campaign.id === dataToUpdate.id) {
            return { ...campaign, ...fields };
          }
          return campaign;
        });
      }
      if (action === "create") {
        updatedItems = [
          {
            __typename: "ReferralCampaign",
            ...fields,
          },
          ...updatedItems,
        ];
      }
      return {
        getReferralCampaignForOrg: {
          items: updatedItems,
          total:
            action === "create"
              ? existingReferralCampaigns?.getReferralCampaignForOrg?.total + 1
              : existingReferralCampaigns?.getReferralCampaignForOrg?.total,
        },
      };
    }
  );
};
