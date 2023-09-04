export const useKeyboardEffect = () => {
  const WebApp = (window as any).Telegram;
  const platform = WebApp?.WebView?.initParams?.tgWebAppPlatform;
  const isMobilePlatform = platform === "ios" || platform === "android";

  const handleInputFocus = (type) => {
    if (!isMobilePlatform) return;
    const panel = document.querySelector(".quest-step-panel");
    if (panel instanceof HTMLElement) {
      const container = panel?.parentElement;
      if(!container) return;
      if (type === "in") {
        container.style.paddingTop = '50%';
        panel.style.transform = "translateY(-20%)";
      } else {
        container.style.paddingTop = '0';
        panel.style.transform = "translateY(0)";
      }
    }
  };

  return {
    handleInputFocus,
    onBlur: (e) => handleInputFocus("out"),
    onFocus: (e) => handleInputFocus("in"),
  };
};
