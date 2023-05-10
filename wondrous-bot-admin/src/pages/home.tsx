import { useQuery } from "@apollo/client";
import { CircularProgress, Typography } from "@mui/material";
import Grid from "@mui/material/Grid";
import {
  LevelsIcon,
  OnboardedIcon,
  QuestIcon,
} from "components/Icons/HomePageIcons";
import Header from "components/Navbar";
import { OrgProfilePicture } from "components/Shared/ProjectProfilePicture";
import ConnectDiscordButton from "components/ConnectDiscord/ConnectDiscordButton";
import { GET_ORG_QUEST_STATS } from "graphql/queries";
import { useContext, useEffect } from "react";
import GlobalContext from "utils/context/GlobalContext";
import { pinkColors } from "utils/theme/colors";
import { GET_CMTY_ORG_DISCORD_CONFIG_MINIMAL } from "graphql/queries";
import { useLazyQuery, useMutation } from "@apollo/client";
import { useLocation, useNavigate } from "react-router-dom"
import styled from 'styled-components';

const typographyStyles = {
  fontFamily: "Poppins",
  fontWeight: 700,
  fontSize: "62px",
  color: "black",
};

export const HomeCardWrapper = styled(Grid)`
  && {
    cursor: pointer;
    transition: all 0.2s ease-in-out;
  }
`;
const CardsComponent = ({ cards }) => {
  const navigate = useNavigate();

  return(
  <Grid
    container
    gap="24px"
    justifyContent="center"
    alignItems="center"
    position="absolute"
    top="-40%"
    padding={{
      xs: "14px",
      sm: "42px",
    }}
    direction={{
      xs: "column",
      sm: "row",
    }}
  >
    {cards.map((card, idx) => (
      <HomeCardWrapper
        bgcolor={card.bgColor}
        display="flex"
        key={`card-${idx}`}
        border="2px solid #000212"
        borderRadius="16px"
        flexDirection="column"
        justifyContent="center"
        flex="1"
        width="100%"
        padding="10px"
        alignItems="center"
        onClick={() => navigate(card.path)}
      >
        <card.Icon />
        <Typography {...typographyStyles}>{card.count}</Typography>
        <Typography
          {...typographyStyles}
          letterSpacing="0.08em"
          fontSize="20px"
          fontWeight={600}
        >
          {card.title}
        </Typography>
      </HomeCardWrapper>
    ))}
  </Grid>
)};

const HomePage = () => {
  const { activeOrg } = useContext(GlobalContext);
  const { data: orgDiscordConfig, error: getDiscordConfigError } = useQuery(
    GET_CMTY_ORG_DISCORD_CONFIG_MINIMAL,
    {
      notifyOnNetworkStatusChange: true,
      variables: {
        orgId: activeOrg?.id,
      },
      skip: !activeOrg?.id,
    }
  );
    const discordNotConfigured = getDiscordConfigError?.graphQLErrors[0]?.message === "Not"; 
    console.log('getDiscordConfigError?.graphQLErrors[0]?.message', getDiscordConfigError?.graphQLErrors[0]?.message)
  const { data, loading } = useQuery(GET_ORG_QUEST_STATS, {
    notifyOnNetworkStatusChange: true,
    variables: {
      orgId: activeOrg?.id,
    },
    skip: !activeOrg?.id,
  });

  const { totalMembers, totalQuests, totalSubmissions } =
    data?.getOrgQuestStats || {};

  const CARDS_CONFIG = [
    {
      title: "Members Onboarded",
      count: totalMembers,
      Icon: OnboardedIcon,
      bgColor: "#F8642D",
      path: "/members",
    },
    {
      title: "Quests",
      count: totalQuests,
      Icon: QuestIcon,
      bgColor: "#F8AFDB",
      path: "/quests",
    },
    {
      title: "Levels",
      count: 10,
      Icon: LevelsIcon,
      bgColor: "#84BCFF",
      path: "/levels",
    },
  ];

  return (
    <Grid display="flex" flexDirection="column" height="100%" minHeight="100vh">
      <Grid
        flex="1"
        display="flex"
        justifyContent="center"
        alignItems="center"
        gap="8px"
        flexDirection="column"
      >
        <OrgProfilePicture
          profilePicture={activeOrg?.profilePicture}
          style={{
            width: "100px",
            height: "100px",
          }}
        />

        <Typography
          fontFamily="Poppins"
          fontWeight={600}
          fontSize="28px"
          color="#06040A"
        >
          {activeOrg?.name}
        </Typography>
        <Typography
          fontFamily='Poppins'
          fontWeight={600}
          fontSize="14px"
          lineHeight="14px"
          color="black"
        >
          {loading ? null : `${totalSubmissions} Submissions Received`}
        </Typography>
      </Grid>
      <Grid
        flex="1"
        sx={{
          backgroundImage: "url(/images/home-bg.png)",
          backgroundPosition: "bottom",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
        }}
        position="relative"
      >
        {getDiscordConfigError?.graphQLErrors[0]?.message && (
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            position="absolute"
            top="-40%"
          >
            <ConnectDiscordButton orgId={activeOrg?.id} />
          </Grid>
        )}
        {loading && (
          <Grid
            container
            justifyContent="center"
            alignItems="center"
            position="absolute"
          >
            <CircularProgress
              size={60}
              thickness={5}
              sx={{
                color: "#2A8D5C",
                animationDuration: "10000ms",
              }}
            />
          </Grid>
        )}
        {!loading && !getDiscordConfigError?.graphQLErrors[0]?.message && (
          <CardsComponent cards={CARDS_CONFIG} />
        )}
      </Grid>
    </Grid>
  );
};

export default HomePage;
