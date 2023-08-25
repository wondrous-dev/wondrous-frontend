import { useLazyQuery } from "@apollo/client";
import PageSpinner from "components/PageSpinner";
import QuestSteps from "components/QuestSteps";
import PageWrapper from "components/Shared/PageWrapper";
import { GET_QUEST_BY_ID, USER_CAN_START_QUEST } from "graphql/queries";
import { useEffect, useLayoutEffect, useMemo, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import { BG_TYPES } from "utils/constants";

export interface ITelegramUser {
  id: number;
  first_name: string;
  last_name: string;
  username: string;
  language_code: string;
}

export interface IWebApp {
  initData: string;
  initDataUnsafe: {
    query_id: string;
    user: ITelegramUser;
    auth_date: string;
    hash: string;
  };
  version: string;
  platform: string;
  colorScheme: string;
  themeParams: {
    link_color: string;
    button_color: string;
    button_text_color: string;
    secondary_bg_color: string;
    hint_color: string;
    bg_color: string;
    text_color: string;
  };
  isExpanded: boolean;
  viewportHeight: number;
  viewportStableHeight: number;
  isClosingConfirmationEnabled: boolean;
  headerColor: string;
  backgroundColor: string;
  BackButton: {
    isVisible: boolean;
  };
  MainButton: {
    text: string;
    color: string;
    textColor: string;
    isVisible: boolean;
    isProgressVisible: boolean;
    isActive: boolean;
  };
  HapticFeedback: any;
}

export const TelegramStartQuest = () => {
  let { id, ...rest } = useParams();

  const webApp = (window as any)?.Telegram?.WebApp;
  const [getQuestById, { data, loading, refetch }] = useLazyQuery(GET_QUEST_BY_ID, {
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      document.title = data?.getQuestById?.title;
    },
  });

  const [canUserStartQuest, { data: canStartData, error: canStartError }] = useLazyQuery(USER_CAN_START_QUEST, {
    fetchPolicy: "network-only",
  });

  const value = {
    webApp,
    unsafeData: webApp?.initDataUnsafe,
    user: webApp?.initDataUnsafe.user,
  };

  const handleStart = async () => {
    const { data } = await canUserStartQuest({
      variables: {
        questId: id,
        telegramUserId: webApp?.initDataUnsafe?.user?.id?.toString(),
        telegramUsername: webApp?.initDataUnsafe?.user?.username,
      },
    });
    if (data?.userCanStartQuest?.canStart) {
      getQuestById({
        variables: {
          questId: id,
        },
      });
    }
  };

  useEffect(() => {
    if (!webApp?.initDataUnsafe?.user?.id) {
      return;
    }
    handleStart();
  }, [webApp?.initDataUnsafe?.user?.id, webApp?.initDataUnsafe?.user?.username]);

  const { user, unsafeData } = value;

  return (
    <PageWrapper
      containerProps={{
        direction: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        padding: {
          xs: "14px 14px 120px 14px",
          sm: "24px 56px 150px 24px",
        },
      }}
      bgType={BG_TYPES.QUESTS}
    >
      {data?.getQuestById ? <QuestSteps quest={data?.getQuestById} /> : <PageSpinner />}
    </PageWrapper>
  );
};

export default TelegramStartQuest;
