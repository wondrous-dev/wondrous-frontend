import { Box, ButtonBase, Grid, Typography } from "@mui/material";
import Modal from "components/Shared/Modal";
import { OrgProfilePicture } from "components/Shared/ProjectProfilePicture";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { GET_LOGGED_IN_USER_FULL_ACCESS_ORGS } from "graphql/queries";
import GlobalContext from "utils/context/GlobalContext";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { UPDATE_ORG } from "graphql/mutations";
import { SharedSecondaryButton } from "components/Shared/styles";
import { Label } from "components/CreateTemplate/styles";

const ChooseOrg = ({ handleClick, userOrgs, shouldBeVisible }) =>
  shouldBeVisible ? (
    <Grid display="flex" gap="10px" alignItems="center" flexWrap="wrap">
      {userOrgs?.map((org, idx) => (
        <ButtonBase onClick={(e) => handleClick(e, org)}>
          <Grid
            key={idx}
            display="flex"
            padding="10px"
            flex="1 1 30%"
            height="100px"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            sx={{
              cursor: "pointer",
              "&:hover": {
                border: "1px solid black",
                borderRadius: "10px",
              },
            }}
          >
            <OrgProfilePicture
              profilePicture={org?.profilePicture}
              style={{
                width: "100px",
                height: "100px",
              }}
            />

            <Typography
              fontFamily="Poppins"
              fontWeight={600}
              fontSize="14px"
              color="#06040A"
            >
              {org?.name}
            </Typography>
          </Grid>
        </ButtonBase>
      ))}
    </Grid>
  ) : null;

const EnableConnect = ({
  cmtyOrgToEnable,
  setCmtyOrgToEnable,
  handleClickOnCmtyEnable,
  shouldBeVisible,
  handleGoBack,
}) =>
  shouldBeVisible ? (
    <Grid display="flex" flexDirection="column" gap="10px" width="10)%">
      <Typography
        fontFamily="Poppins"
        fontWeight={600}
        fontSize="14px"
        color="#06040A"
      >
        Enable community bot for {cmtyOrgToEnable?.name}
      </Typography>
      <Box display="flex" gap="10px" alignItems="center" width="100%">
        <SharedSecondaryButton
          sx={{
            flex: 1,
          }}
          $reverse
          onClick={handleGoBack}
        >
          Go back
        </SharedSecondaryButton>
        <SharedSecondaryButton
          sx={{
            flex: 1,
          }}
          onClick={handleClickOnCmtyEnable}
        >
          Enable
        </SharedSecondaryButton>
      </Box>
    </Grid>
  ) : null;

// const PickGuild = ({ guilds, shouldBeVisible, setSelectedGuildId }) => {
//   return (
//     <>
//       {shouldBeVisible ? (
//         <Grid display='flex' flexDirection='column' gap='10px' width='10)%'>
//           <Typography
//             fontFamily='Poppins'
//             fontWeight={600}
//             fontSize='14px'
//             color='#06040A'
//           >
//             Choose guild
//           </Typography>
//           <Grid display='flex' flexWrap='wrap' gap='6px'>
//             {guilds?.map((guild, idx) => (
//               <ButtonBase
//                 key={guild?.guildInfo?.guildName}
//                 onClick={() => {
//                   setSelectedGuildId(guild?.guildId);
//                 }}
//                 sx={{
//                   cursor: 'pointer',
//                   background: 'white',
//                   display: 'flex',
//                   gap: '6px',
//                   alignItems: 'center',
//                   padding: '8px',
//                   borderRadius: '6px',
//                   '&:hover': {
//                     background: '#F8AFDB',
//                   },
//                 }}
//               >
//                 <img
//                   src='/images/discord-official-logo.png'
//                   height='18px'
//                   width='18px'
//                   style={{
//                     borderRadius: '300px',
//                   }}
//                 />

//                 <Label color='black'>{guild?.guildInfo?.guildName}</Label>
//               </ButtonBase>
//             ))}
//           </Grid>
//         </Grid>
//       ) : null}
//     </>
//   );
// };

const OnboardingPage = () => {
  // userOrgs are orgs with cmty_enabled
  const { userOrgs, setActiveOrg } = useContext(GlobalContext);

  const [cmtyOrgToEnable, setCmtyOrgToEnable] = useState(null);
  const [allOrgs, setAllOrgs] = useState(null);
  const navigate = useNavigate();

  const hasCmtyOrgs = userOrgs?.length > 0;

  const handleOrgSelect = async (e, org) => {
    if (org.cmtyEnabled) {
      return navigate("/");
    }
    setCmtyOrgToEnable(org);
  };

  const [updateOrg] = useMutation(UPDATE_ORG, {});
  const [getLoggedInUserFullAccessOrgs] = useLazyQuery(
    GET_LOGGED_IN_USER_FULL_ACCESS_ORGS,
    {
      onCompleted: (data) => {
        console.log(data?.getLoggedInUserFullAccessOrgs);
        setAllOrgs(data?.getLoggedInUserFullAccessOrgs);
      },
    }
  );

  useEffect(() => {
    if (userOrgs && userOrgs.length === 0) {
      getLoggedInUserFullAccessOrgs({
        variables: {
          excludeSharedOrgs: true,
        },
      });
    }
  }, [userOrgs]);

  useEffect(() => {
    if (hasCmtyOrgs) {
      handleOrgSelect(null, userOrgs[0]);
    }
  }, [hasCmtyOrgs]);

  const handleClickOnCmtyEnable = async (e) => {
    updateOrg({
      variables: {
        orgId: cmtyOrgToEnable?.id,
        input: {
          cmtyEnabled: true,
        }
      },
    }).then((res) => {
      setActiveOrg(cmtyOrgToEnable);
      navigate("/");
    });
  };

  const handleGoBack = () => {
    return setCmtyOrgToEnable(null);
  };

  return (
    <Modal
      open
      onClose={() => navigate("/")}
      title={`${
        cmtyOrgToEnable
          ? `Enable ${cmtyOrgToEnable?.name}`
          : "Select Community!"
      }`}
    >
      <ChooseOrg
        shouldBeVisible={!cmtyOrgToEnable && !hasCmtyOrgs}
        handleClick={handleOrgSelect}
        userOrgs={allOrgs}
      />
      <EnableConnect
        cmtyOrgToEnable={cmtyOrgToEnable}
        setCmtyOrgToEnable={setCmtyOrgToEnable}
        handleClickOnCmtyEnable={handleClickOnCmtyEnable}
        shouldBeVisible={cmtyOrgToEnable}
        handleGoBack={handleGoBack}
      />
    </Modal>
  );
};

export default OnboardingPage;
