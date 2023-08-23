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
  const [webApp, setWebApp] = useState<IWebApp | null>(null);
  let { id, ...rest } = useParams();

  const [getQuestById, { data, loading, refetch }] = useLazyQuery(GET_QUEST_BY_ID, {
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      document.title = data?.getQuestById?.title;
    },
  });

  const [canUserStartQuest, { data: canStartData, error: canStartError }] = useLazyQuery(USER_CAN_START_QUEST, {
    fetchPolicy: "network-only",
  });

  useLayoutEffect(() => {
    const script = document.createElement("script");
    script.src = "https://telegram.org/js/telegram-web-app.js";
    script.async = true;
    document.body.appendChild(script);
    const app = (window as any).Telegram?.WebApp;
    if (app) {
      app.ready();
      setWebApp(app);
    }
    return () => {
      document.body.removeChild(script);
    };
  }, []);

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
    handleStart();
    if (!webApp?.initDataUnsafe?.user?.id) {
      return;
    }
  }, [webApp?.initDataUnsafe?.user?.id, webApp?.initDataUnsafe?.user?.username]);

  const { user, unsafeData } = value;
  console.log(data, loading)
  return (
    <PageWrapper
      containerProps={{
        direction: "column",
        justifyContent: "flex-start",
        alignItems: "center",
        minHeight: "100vh",
        padding: {
          xs: "14px 14px 120px 14px",
          sm: "24px 56px 150px 24px",
        },
      }}
      bgType={BG_TYPES.QUESTS}
    >
      {data?.getQuestById ? <QuestSteps quest={data?.getQuestById}/> : <PageSpinner />}
    </PageWrapper>
    // <div
    //   style={{
    //     color: "black",
    //   }}
    // >
    //   {canStartData ? JSON.stringify(data?.getQuestById) : "NO DATA CAN START"}
    //   <strong>QUEST_ID = {id}</strong>
    //   {user ? (
    //     <div>
    //       <h1>Welcome {user?.username}</h1>
    //       User data:
    //       <pre>{JSON.stringify(user, null, 2)}</pre>
    //       Enter Web App data:
    //       <pre>{JSON.stringify(webApp, null, 2)}</pre>
    //       UNSAFE DATA
    //       <pre>{JSON.stringify(unsafeData)}</pre>
    //     </div>
    //   ) : (
    //     <div>Make sure web app is opened from telegram client</div>
    //   )}
    // </div>
  );
};

export default TelegramStartQuest;
