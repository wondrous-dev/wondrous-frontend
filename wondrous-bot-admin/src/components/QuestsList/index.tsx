import { Box, ButtonBase, Grid } from "@mui/material";
import { RoundedSecondaryButton } from "components/Shared/styles";
import { useContext, useMemo, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { CardHoverWrapper, CardWrapper, Label } from "./styles";
import { useNavigate } from "react-router-dom";
import PageWrapper from "components/Shared/PageWrapper";
import { BG_TYPES, QUEST_STATUSES } from "utils/constants";
import { useMutation, useQuery } from "@apollo/client";
import { GET_ORG_QUESTS_LEVELS, GET_ORG_QUEST_STATS } from "graphql/queries";
import GlobalContext from "utils/context/GlobalContext";
import { LEVELS_DEFAULT_NAMES } from "utils/levels/constants";
import useLevels from "utils/levels/hooks";
import QuestCardMenu from "components/QuestCardMenu";
import { usePaywall, useSubscriptionPaywall } from "utils/hooks";
import { PricingOptionsTitle } from "components/Pricing/PricingOptionsListItem";
import { useTour } from "@reactour/tour";
import { CSS } from "@dnd-kit/utilities";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, TouchSensor } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { UPDATE_QUEST_ORDER } from "graphql/mutations";
import { BoxWrapper } from "components/QuestCardMenu/styles";

const SortableItem = ({ item, idx, isOpen, status }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: item.id,
    disabled: status !== QUEST_STATUSES.OPEN,
  });

  const navigate = useNavigate();
  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || undefined,
  };

  const handleDropdownClick = (e) => {
    e.stopPropagation();
    const newAnchorEl = anchorEl ? null : e.currentTarget;
    setAnchorEl(newAnchorEl);
  };

  return (
    <>
      <QuestCardMenu quest={item} anchorEl={anchorEl} setAnchorEl={setAnchorEl} />
      <CardHoverWrapper
        width="100%"
        id={item.id}
        ref={setNodeRef}
        style={style}
        onClick={() => navigate(`/quests/${item.id}`)}
        flex={1}
        data-tour={idx === 0 ? "tutorial-quest-card" : ""}
        key={item.id}
        flexBasis={{
          xs: "48%",
          sm: "30%",
          md: "24%",
        }}
        maxWidth={{
          xs: "50%",
          sm: "33%",
          md: "24%",
        }}
        {...attributes}
        {...listeners}
      >
        <CardWrapper item disableHover={isOpen}>
          <Box
            height="40px"
            width="auto"
            minWidth="40px"
            bgcolor="#84bcff"
            borderRadius="35px"
            display="flex"
            padding="4px"
            justifyContent="center"
            alignItems="center"
            flexDirection="column"
          >
            <Label fontSize="16px" lineHeight={"16px"}>
              {item.pointReward}
            </Label>
            <Label fontSize="12px" lineHeight="13px" fontWeight={400}>
              PTS
            </Label>
          </Box>
          <Label
            fontSize="15px"
            style={{
              textAlign: "center",
              overflowWrap: "anywhere",
            }}
          >
            {item.label}
          </Label>
          <Box display="flex" justifyContent="center" alignItems="center">
            <Box
              bgcolor="#C1B6F6"
              padding="8px"
              display="flex"
              justifyContent="center"
              alignItems="center"
              borderRadius="6px"
            >
              <Label fontSize="14px" lineHeight="14px">
                {item.completions} {item.completions === 1 ? "Completion" : "Completions"}
              </Label>
            </Box>
            {item.inReview > 0 && (
              <Box
                bgcolor="#F8AFDB"
                padding="8px"
                display="flex"
                justifyContent="center"
                alignItems="center"
                borderRadius="6px"
                marginLeft="8px"
              >
                <Label fontSize="14px" lineHeight="14px">
                  {item?.inReview} To review
                </Label>
              </Box>
            )}
          </Box>
          <BoxWrapper>
            <ButtonBase
              onClick={handleDropdownClick}
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                borderRadius: "100%",
                padding: "4px",
                transition: "background 0.1s ease-in-out",
                ":hover": {
                  background: "white",
                },
              }}
            >
              <MoreVertIcon
                sx={{
                  color: "black",
                }}
              />
            </ButtonBase>
          </BoxWrapper>
        </CardWrapper>
      </CardHoverWrapper>
    </>
  );
};

const QuestItemCard = ({ level, formattedData, isOpen, totalQuests, plan, status }) => {
  const navigate = useNavigate();
  const [updateQuestOrder] = useMutation(UPDATE_QUEST_ORDER, {
    refetchQueries: ["getQuestsForOrg"],
  });
  const { setPaywall, setPaywallMessage } = usePaywall();

  // the reason for separate state is to hide the New Quest card when dragging
  const [isDragging, setIsDragging] = useState(false);

  const toggleIsDragging = () => setIsDragging((prev) => !prev);

  const handleDragEnd = async (event) => {
    toggleIsDragging();

    const { active: current, over: destination } = event;
    const questId = current.id;
    const currentOrder = current?.data?.current?.sortable?.index;
    const destinationOrder = destination?.data?.current?.sortable?.index;
    if (currentOrder > destinationOrder || currentOrder < destinationOrder) {
      await updateQuestOrder({
        variables: {
          questId,
          order: destinationOrder + 1,
        },
      });
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  return (
    <Grid
      display="flex"
      key={level}
      width="100%"
      flexDirection="column"
      gap="28px"
      justifyContent="flex-start"
      alignItems="flex-start"
    >
      <Label>{formattedData[level].label}</Label>
      <Grid container gap="30px 14px">
        <DndContext
          onDragEnd={handleDragEnd}
          onDragStart={toggleIsDragging}
          sensors={sensors}
          collisionDetection={closestCenter}
        >
          <SortableContext items={formattedData[level].items || []} strategy={rectSortingStrategy}>
            {formattedData[level].items.map((item, idx) => (
              <SortableItem key={item.id} item={item} isOpen={isOpen} idx={idx} status={status} />
            ))}
            {isDragging ? null : (
              <CardHoverWrapper
                flexBasis={{
                  xs: "48%",
                  sm: "30%",
                  md: "24%",
                }}
                maxWidth={{
                  xs: "50%",
                  sm: "33%",
                  md: "24%",
                }}
              >
                <CardWrapper
                  onClick={() => {
                    if (plan === PricingOptionsTitle.Basic && totalQuests >= 100) {
                      setPaywall(true);
                      setPaywallMessage("You have reached the limit of quests for your current plan.");
                    } else {
                      navigate("/quests/create");
                    }
                  }}
                  sx={{
                    minHeight: "155px",
                  }}
                >
                  <RoundedSecondaryButton background="#F8642D">
                    <AddIcon
                      sx={{
                        color: "white",
                      }}
                    />
                  </RoundedSecondaryButton>
                  <Label fontSize="15px">New Quest</Label>
                </CardWrapper>
              </CardHoverWrapper>
            )}
          </SortableContext>
        </DndContext>
      </Grid>
    </Grid>
  );
};

const formatQuestsData = (LEVELS, data) => {
  const result = {};
  data.forEach((quest) => {
    const questLevel = quest.level || 1;
    if (!result[questLevel]) {
      result[questLevel] = {
        label: LEVELS[questLevel],
        items: [],
      };
    }

    result[questLevel].items.push({
      pointReward: quest.pointReward,
      label: quest.title,
      id: quest.id,
      completions: quest.submissionsCount?.approved || 0,
      inReview: quest.submissionsCount?.inReview,
      status: quest.status,
      order: quest.order,
    });
  });

  return result;
};

const QuestsList = ({ data, status }) => {
  const { activeOrg } = useContext(GlobalContext);
  const { isOpen } = useTour();

  const { data: getOrgQuestStatsData } = useQuery(GET_ORG_QUEST_STATS, {
    notifyOnNetworkStatusChange: true,
    variables: {
      orgId: activeOrg?.id,
    },
    skip: !activeOrg?.id,
  });

  const { plan } = useSubscriptionPaywall();
  const { totalQuests } = getOrgQuestStatsData?.getOrgQuestStats || {};

  const { data: levelsData } = useQuery(GET_ORG_QUESTS_LEVELS, {
    fetchPolicy: "cache-first",
    notifyOnNetworkStatusChange: true,
    nextFetchPolicy: "cache-first",
    variables: {
      orgId: activeOrg?.id,
    },
    skip: !activeOrg?.id,
  });

  const formattedData = useMemo(() => {
    const levels = { ...LEVELS_DEFAULT_NAMES };

    levelsData?.getOrgQuestsLevels.forEach((item) => {
      const key = item.key;
      const value = item.value;
      if (key in levels) {
        levels[key] = value;
      }
    });

    if (!data) {
      return [];
    }

    return formatQuestsData(levels, data);
  }, [data]);

  return (
    <PageWrapper
      bgType={BG_TYPES.QUESTS}
      containerProps={{
        minHeight: "100vh",
        flexDirection: "column",
        overflow: "hidden",
        gap: "42px",
        padding: {
          xs: "14px 14px 120px 14px",
          sm: "24px 56px",
        },
      }}
    >
      {Object.keys(LEVELS_DEFAULT_NAMES).map((level, idx) => {
        if (!formattedData[level]) {
          return null;
        }
        return (
          <QuestItemCard
            status={status}
            level={level}
            formattedData={formattedData}
            isOpen={isOpen}
            totalQuests={totalQuests}
            plan={plan}
            key={idx}
          />
        );
      })}
    </PageWrapper>
  );
};

export default QuestsList;
