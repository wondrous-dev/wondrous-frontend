import { Grid, Divider, Box } from "@mui/material";
import InfoLabel from "components/CreateTemplate/InfoLabel";
import PanelComponent from "components/CreateTemplate/PanelComponent";
import { Label } from "components/CreateTemplate/styles";
import InfoIcon from "components/Icons/InfoIcon";
import MediaHandler from "./MediaHandler";

const ReferralMediaComponent = ({ referralItemData, setReferralItemData }) => {
  const handleChange = (newMedia) => setReferralItemData((prev) => ({ ...prev, media: newMedia }));

  return (
    <PanelComponent
      renderBody={() => (
        <>
          <Grid display="flex" flexDirection="column" gap="24px" width="100%">
            <Grid display="flex" flexDirection="column" gap="14px">
              <Box display="flex" gap="14px">
                <Label fontWeight={600} minWidth="50px">
                  Banner Image
                </Label>
                <InfoLabel
                  imgStyle={{
                    marginLeft: "0",
                  }}
                  title="Do you want your referral to be when someone completes a quest or completes a purchase of a store item? You can then select which specific quests or store items are eligible under this referral campaign."
                />
              </Box>
              <Label fontWeight={500} fontSize="13px" color="#4D4D4D" minWidth="50px">
                This image will be seen by members when they start the referral quest and share the link.
              </Label>
              <MediaHandler media={referralItemData?.media} onChange={handleChange} />
            </Grid>
          </Grid>
        </>
      )}
    />
  );
};

export default ReferralMediaComponent;
