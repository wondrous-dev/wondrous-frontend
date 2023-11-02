import { useMutation } from "@apollo/client";
import { Box, Button, Grid, Typography } from "@mui/material";
import { Label } from "components/CreateTemplate/styles";
import Hexagon from "components/Icons/Hexagon";
import Modal from "components/Shared/Modal";
import Spinner from "components/Shared/Spinner";
import { SharedSecondaryButton } from "components/Shared/styles";
import { UPDATE_ORG_MODULES } from "graphql/mutations";
import { useGlobalContext } from "utils/hooks";

const StoreModule = ({ onCancel, onSuccess }) => {
  const { activeOrg } = useGlobalContext();
  const [updateOrgModules, { loading }] = useMutation(UPDATE_ORG_MODULES, {
    refetchQueries: ["getLoggedInUserFullAccessOrgs"],
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      if (data?.updateOrgModules?.success) {
        onSuccess?.()
      }
    },
  });
  const onClose = () => {};

  const handleEnableStore = async () => {
    await updateOrgModules({
      variables: {
        orgId: activeOrg?.id,
        input: {
          cmtyStore: true,
        },
      },
    });
  };

  const STEPS_CONFIG = [
    {
      label: "Set-up products",
    },
    {
      label: "Preview store",
    },
    {
      label: "Launch to community",
    },
  ];

  return (
    <Modal open onClose={onClose} title={null} maxWidth={792} noHeader>
      <Grid
        display="flex"
        gap="24px"
        sx={{
          flexDirection: {
            xs: "column-reverse",
            sm: "row",
          },
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" flexDirection="column" gap="24px">
          <Box display="flex" flexDirection="column" gap="14px" height="100%" justifyContent="center">
            <Typography
              color="#2A8D5C"
              fontWeight={700}
              fontFamily="Poppins"
              fontSize={{
                xs: "20px",
                sm: "24px",
              }}
              lineHeight="33px"
            >
              Enable your <br /> community store?
            </Typography>
            <Typography
              color="#5E5E5E"
              fontFamily="Poppins"
              fontSize={{
                xs: "12px",
                sm: "15px",
              }}
              lineHeight="24px"
              fontWeight={500}
            >
              Enabling your community store allows you to sell products or let members earn them via the{" "}
              <span
                style={{
                  color: "#F8642D",
                  fontWeight: 700,
                }}
              >
                /store
              </span>{" "}
              feature. You can disable the store in the settings menu.
            </Typography>
            <Box display="flex" flexDirection="column" gap="8px">
              <Label
                fontSize={{
                  xs: "12px",
                  sm: "15px",
                }}
                fontWeight={600}
              >
                How to set-up your store:
              </Label>
              {STEPS_CONFIG.map((step, index) => (
                <Grid display="flex" alignItems="center" gap="8px" key={`step-${index}`}>
                  <Grid
                    container
                    item
                    position="relative"
                    justifyContent="center"
                    alignItems="center"
                    width="fit-content"
                    height="fit-content"
                    lineHeight="0"
                  >
                    <Typography
                      position="absolute"
                      top="50%"
                      color="white"
                      zIndex="10"
                      fontSize="13px"
                      lineHeight="0"
                      fontFamily="Poppins"
                      fontWeight="500"
                    >
                      {index + 1}
                    </Typography>
                    <Box position="relative">
                      <Hexagon color="#2A8D5C" />
                    </Box>
                  </Grid>
                  <Label
                    fontSize={{
                      xs: "12px",
                      sm: "15px",
                    }}
                    fontWeight={500}
                  >
                    {step.label}
                  </Label>
                </Grid>
              ))}
            </Box>
          </Box>
          <Box display="flex" gap="24px" alignItems="center" justifyContent="flex-start" width="100%">
            <SharedSecondaryButton onClick={handleEnableStore} disabled={loading}>
              {loading ? <Spinner /> : "Enable Store"}
            </SharedSecondaryButton>
            <Button
              disableRipple
              onClick={onCancel}
              disableFocusRipple
              sx={{
                height: "40px",
                width: "fit-content",
                borderRadius: "100px",
                textTransform: "none",
                color: "#6D6D6D",
                textAlign: "center",
                fontFamily: "Space Grotesk",
                fontSize: "16px",
                fontWeight: 700,
                textWrap: "nowrap",

                "&:hover": {
                  backgroundColor: "#fff",
                },
              }}
            >
              Not yet
            </Button>
          </Box>
        </Box>
        <img
          src={"/images/activate-store.png"}
          style={{
            maxWidth: "360px",
          }}
        />
      </Grid>
    </Modal>
  );
};

export default StoreModule;
