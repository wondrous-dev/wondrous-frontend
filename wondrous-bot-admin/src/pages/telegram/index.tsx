import React, { useEffect } from "react";

const TelegramPage = () => {
  let tg = (window as any).Telegram.WebApp;

  useEffect(() => {
    // Define the onTelegramAuth function on the global scope
    (window as any).onTelegramAuth = (user) => {
      console.log(user, 'UUUUSER')
      alert(
        "Logged in as " +
          user.first_name +
          " " +
          user.last_name +
          " (" +
          user.id +
          (user.username ? ", @" + user.username : "") +
          ")"
      );
    };

    // Create and append the script tag
    const script = document.createElement("script");
    script.async = true;
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.setAttribute("data-telegram-login", "communities_test_bot");
    script.setAttribute("data-size", "large");
    script.setAttribute("data-onauth", "onTelegramAuth(user)");
    script.setAttribute("data-request-access", "write");
    document.body.appendChild(script);

    // Cleanup: remove script when component unmounts
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  tg.expand();

  return (
    <div>
      <h1 style={{ color: "black" }}>{JSON.stringify(tg)}</h1>
    </div>
  );
};

export default TelegramPage;
