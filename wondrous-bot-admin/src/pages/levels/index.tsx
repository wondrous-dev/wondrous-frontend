import { useMutation, useQuery } from "@apollo/client";
import { Box, useMediaQuery } from "@mui/material";
import LevelsReward from "components/LevelsReward";
import PageHeader from "components/PageHeader";
import { PricingOptionsTitle } from "components/Pricing/PricingOptionsListItem";
import PageWrapper from "components/Shared/PageWrapper";
import { StyledInformationTooltip } from "components/Shared/Tooltip";
import TableComponent from "components/TableComponent";
import { StyledTableHeader, StyledTableHeaderCell } from "components/TableComponent/styles";
import { UPDATE_QUEST_LABEL } from "graphql/mutations";
import { GET_ORG_LEVEL_REWARDS } from "graphql/queries";
import { useContext, useMemo, useState } from "react";
import { getPlan } from "utils/common";
import { BG_TYPES } from "utils/constants";
import GlobalContext from "utils/context/GlobalContext";
import { useDiscordRoles } from "utils/discord";
import { usePaywall, useSubscription, useSubscriptionPaywall } from "utils/hooks";
import { LEVELS_XP } from "utils/levels";
import useLevels from "utils/levels/hooks";
import InformationTooltip from "components/Icons/information.svg";
import LevelsTutorial from "components/TutorialComponent/Tutorials/LevelsTutorial";
import { useTour } from "@reactour/tour";

const LevelsPage = () => {
  const { activeOrg } = useContext(GlobalContext);
  const { levels } = useLevels({
    orgId: activeOrg?.id,
  });
  const subscription = useSubscription();
  const plan = getPlan(subscription?.tier);
  const { setPaywall, setPaywallMessage, setOnCancel, setCanBeClosed } = useSubscriptionPaywall();
  //TODO we probably don't need this state. We can just use the data from the query, change later
  const [rewards, setRewards] = useState({});
  const { data: rewardsData, refetch: refetchLevelRewards } = useQuery(GET_ORG_LEVEL_REWARDS, {
    variables: {
      orgId: activeOrg?.id,
    },
    onCompleted: ({ getOrgLevelsRewards }) => {
      const formattedRewards = {};
      for (const reward of getOrgLevelsRewards) {
        if (reward.level in formattedRewards) {
          formattedRewards[reward.level].push(reward);
        } else {
          formattedRewards[reward.level] = [reward];
        }
      }
      setRewards(formattedRewards);
    },
    skip: !activeOrg?.id,
  });

  const [updateQuestLevel] = useMutation(UPDATE_QUEST_LABEL, {
    refetchQueries: ["getOrgQuestsLevels"],
  });

  const updateLevel = (key, value) => {
    return updateQuestLevel({
      variables: {
        orgId: activeOrg?.id,
        level: key,
        name: value,
      },
    });
  };

  const discordRoles = useDiscordRoles({
    orgId: activeOrg?.id,
  });
  const data = useMemo(() => {
    return Object.keys(levels).map((key, idx) => {
      return {
        id: key,
        level: {
          component: "hexagon",

          value: key,
          label: levels[key],
          labelProps: {
            canEdit: true,
            onEdit: (value) => {
              if (plan === PricingOptionsTitle.Basic) {
                setPaywall(true);
                return setPaywallMessage("You need to upgrade from a basic plan to edit level names");
              } else {
                updateLevel(key, value);
              }
            },
          },
        },
        xp: {
          component: "label",
          value: LEVELS_XP[key],
          componentProps: {
            fontWeight: 500,
          },
        },
        reward: {
          component: "custom",
          value: rewards[key] || {},
          customComponent: ({ value }) => (
            <LevelsReward
              refetchLevelRewards={refetchLevelRewards}
              rewards={value}
              discordRoles={discordRoles}
              level={key}
            />
          ),
        },
      };
    });
  }, [levels, rewards, discordRoles]);

  const headers = [
    {
      title: "Level",
      key: "level",
      justify: "flex-start",
    },
    {
      title: "Point Requirement",
      key: "xp",
      info: true,
      infoText: "Points required to reach this level. Points are earned by completing quests.",
    },
    {
      title: "Reward",
      key: "reward",
    },
  ];
  const { isOpen } = useTour();
  const headerComponent = () => {
    return (
      <StyledTableHeader>
        {headers?.map((header) => (
          <StyledTableHeaderCell key={header?.key}>
            <Box display="flex" alignItems={"center"} justifyContent={header?.justify || "center"}>
              {header?.title}
              {header?.infoText ? (
                <StyledInformationTooltip placement="right" title={header?.infoText}>
                  <img
                    src={InformationTooltip}
                    alt="information"
                    style={{ width: "16px", height: "16px", marginLeft: "8px" }}
                  />
                </StyledInformationTooltip>
              ) : null}
            </Box>
          </StyledTableHeaderCell>
        ))}
      </StyledTableHeader>
    );
  };
  const isMobile = useMediaQuery((theme: any) => theme.breakpoints.down("md"));

  return (
    <>
      {!!data && !!rewardsData && <LevelsTutorial />}
      <PageHeader title="Levels" withBackButton={false} />
      <PageWrapper
        bgType={BG_TYPES.LEVELS}
        containerProps={{
          minHeight: "100vh",
          direction: "column",
          gap: "42px",
          padding: {
            xs: "14px 14px 120px 14px",
            sm: "24px 56px",
          },
        }}
      >
        <TableComponent
          data={data}
          headerComponent={headerComponent}
          title="Levels"
          tableTitleProps={{
            "data-tour": "tutorial-levels-table-title",
          }}
          tableProps={{
            "data-tour": "tutorial-levels-table",
            sx: {
              marginTop: isMobile && isOpen ? "30vh" : "0px",
              width: isOpen && !isMobile ? "50%" : "100%",
            },
          }}
        />
      </PageWrapper>
    </>
  );
};

export default LevelsPage;
